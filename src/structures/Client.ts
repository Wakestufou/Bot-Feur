import {
    ApplicationCommandDataResolvable,
    Client,
    ClientEvents,
    Collection,
    REST,
    Routes,
} from 'discord.js';
import 'dotenv/config';
import Logger from '../utils/Logger';
import { CommandType } from '../types/Command';
import glob from 'glob';
import { promisify } from 'util';
import { RegisterCommandsOptions } from '../types/client';
import { Event } from './Event';

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();

    constructor() {
        super({ intents: 32767 });
    }

    start() {
        this._loadEvents();
        this._loadCommands();

        if (process.argv.includes('--DEV')) {
            this.login(process.env.DISCORD_TOKEN_DEV);
        } else {
            this.login(process.env.DISCORD_TOKEN);
        }
    }

    private async _loadCommands() {
        const slashCommands: ApplicationCommandDataResolvable[] = [];
        const commandFiles = await globPromise(
            `${__dirname}\\..\\commands\\*\\*{.ts,.js}`.replace(/\\/g, '/')
        );

        Promise.all(
            commandFiles.map(async (filePath) => {
                const command: CommandType = await this._importFile(filePath);
                if (!command.name) return;

                Logger.info(`Loading (/) commands : ${command.name}...`);

                this.commands.set(command.name, command);
                slashCommands.push(command);
            })
        )
            .then(() => {
                if (process.argv.includes('--DEV')) {
                    this._registerCommands({
                        commands: slashCommands,
                        guildID: process.env.DISCORD_GUILD_ID_DEV,
                    });
                } else {
                    this._registerCommands({ commands: slashCommands });
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
            const rest = new REST({ version: '10' }).setToken(
                process.env.DISCORD_TOKEN_DEV as string
            );

            Logger.info(`Registering (/) commands for guild : ${guildID}`);

            await rest.put(
                Routes.applicationGuildCommands(
                    process.env.DISCORD_APP_ID_DEV as string,
                    guildID
                ),
                {
                    body: commands,
                }
            );
        } else {
            const rest = new REST({ version: '10' }).setToken(
                process.env.DISCORD_TOKEN as string
            );

            Logger.info(`Registering global (/) commands`);
            await rest.put(
                Routes.applicationCommands(
                    process.env.DISCORD_APP_ID as string
                ),
                {
                    body: commands,
                }
            );
        }
    }

    private async _loadEvents() {
        Logger.info('Loading events...');

        const eventsFiles = await globPromise(
            `${__dirname}\\..\\events\\*{.ts,.js}`.replace(/\\/g, '/')
        );

        Promise.all(
            eventsFiles.map(async (filePath) => {
                const event: Event<keyof ClientEvents> = await this._importFile(
                    filePath
                );

                this.on(event.event, event.run);
                Logger.info(`Events ${event.event} loaded !`);
            })
        )
            .then(() => {
                Logger.info('All events loaded !');
            })
            .catch((error) => {
                Logger.fatal(`Error while loading events`, error, 500);
            });
    }

    private async _importFile(filePath: string) {
        return (await import(filePath))?.default;
    }
}
