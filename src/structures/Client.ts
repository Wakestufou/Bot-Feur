import {
    ApplicationCommandDataResolvable,
    Client,
    ClientEvents,
    Collection,
    REST,
    Routes,
} from 'discord.js';
import Logger from '../utils/Logger';
import { CommandType } from '../types/Command';
import glob from 'glob';
import { promisify } from 'util';
import { RegisterCommandsOptions } from '../types/client';
import { Event } from './Event';

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
    private _rest: REST;
    private _clientId: string;
    private _token: string;
    private _commands: Collection<string, CommandType> = new Collection();
    private slashCommands: ApplicationCommandDataResolvable[] = [];

    constructor() {
        super({ intents: 65535 });

        if (process.argv.includes('--DEV')) {
            this._rest = new REST({ version: '10' }).setToken(
                process.env.DISCORD_TOKEN_DEV as string
            );

            this._clientId = process.env.DISCORD_APP_ID_DEV as string;

            this._token = process.env.DISCORD_TOKEN_DEV as string;
        } else {
            this._rest = new REST({ version: '10' }).setToken(
                process.env.DISCORD_TOKEN as string
            );

            this._clientId = process.env.DISCORD_APP_ID as string;

            this._token = process.env.DISCORD_TOKEN as string;
        }
    }

    start() {
        this._loadEvents();

        this.login(this._token).then(() => {
            if (process.argv.includes('--CLEAR')) {
                this._deleteAllCommands();
            }
            this._loadCommands();
        });
    }

    getClientId() {
        return this._clientId;
    }

    getSlashCommand() {
        return this.slashCommands;
    }

    getCommands() {
        return this._commands;
    }

    private async _loadCommands() {
        const commandFiles = await globPromise(
            `${__dirname}\\..\\commands\\*{.ts,.js}`.replace(/\\/g, '/')
        );

        Promise.all(
            commandFiles.map(async (filePath) => {
                const command: CommandType = await this._importFile(filePath);
                if (!command.name) return;

                Logger.info(
                    `Loading (/) commands : ${command.name}...`,
                    'START'
                );

                this._commands.set(command.name, command);
                this.slashCommands.push(command);
            })
        )
            .then(() => {
                if (process.argv.includes('--DEV')) {
                    this._registerCommands({
                        commands: this.slashCommands,
                        guildID: process.env.DISCORD_GUILD_ID_DEV as string,
                    });
                } else {
                    this._registerCommands({ commands: this.slashCommands });
                }
            })
            .catch((error) => {
                Logger.fatal(`Error while loading (/) commands`, error, 500);
            });
    }

    private async _registerCommands({
        commands,
        guildID,
    }: RegisterCommandsOptions) {
        if (guildID) {
            Logger.info(
                `Registering (/) commands for guild : ${guildID}`,
                'START'
            );

            await this._rest.put(
                Routes.applicationGuildCommands(this._clientId, guildID),
                {
                    body: commands,
                }
            );
        } else {
            Logger.info(`Registering global (/) commands`, 'START');

            this.guilds.cache.forEach(async (guild) => {
                Logger.info(
                    `Started refreshing application (/) commands for guild : ${guild.name}...`,
                    'START'
                );

                await this._rest.put(
                    Routes.applicationGuildCommands(this._clientId, guild.id),
                    {
                        body: commands,
                    }
                );

                Logger.info(
                    `Successfully reloaded application (/) commands for guild : ${guild.name} !`,
                    'START'
                );
            });
        }
    }

    private async _loadEvents() {
        Logger.info('Loading events...', 'START');

        const eventsFiles = await globPromise(
            `${__dirname}\\..\\events\\*{.ts,.js}`.replace(/\\/g, '/')
        );

        Promise.all(
            eventsFiles.map(async (filePath) => {
                const event: Event<keyof ClientEvents> = await this._importFile(
                    filePath
                );

                this.on(event.event, event.run);
                Logger.info(`Events ${event.event} loaded !`, 'START');
            })
        )
            .then(() => {
                Logger.info('All events loaded !', 'START');
            })
            .catch((error) => {
                Logger.fatal(`Error while loading events`, error, 500);
            });
    }

    private _deleteAllCommands() {
        // for guild-based commands
        this.guilds.cache.forEach((guild) => {
            this._rest
                .put(
                    Routes.applicationGuildCommands(this._clientId, guild.id),
                    {
                        body: [],
                    }
                )
                .then(() =>
                    Logger.info('Successfully deleted all guild commands.')
                )
                .catch((e) => Logger.error('Error', e));
        });

        // for global commands
        this._rest
            .put(Routes.applicationCommands(this._clientId), { body: [] })
            .then(() =>
                Logger.info('Successfully deleted all application commands.')
            )
            .catch((e) => Logger.error('Error', e));
    }

    private async _importFile(filePath: string) {
        return (await import(filePath))?.default;
    }
}
