import { Routes } from 'discord.js';
import { client } from '..';
import Logger from '../utils/Logger';
import { Event } from './../structures/Event';
import DataBaseCheck from '../utils/DataBaseCheck';

export default new Event('guildCreate', async (guild) => {
    Logger.info('New Guild : ' + guild.name, 'MESSAGE');

    try {
        Logger.info(
            `Started refreshing application (/) commands for guild : ${guild.name}...`,
            'START'
        );

        await guild.client.rest.put(
            Routes.applicationGuildCommands(client.getClientId(), guild.id),
            {
                body: client.getSlashCommand(),
            }
        );
        Logger.info(
            `Successfully reloaded application (/) commands for guild : ${guild.id} !`,
            'START'
        );
    } catch (e) {
        Logger.error(
            `Error when registering (/) commands for ${guild.id}`,
            e as Error
        );
    }

    DataBaseCheck.checkDataBase(guild);
});
