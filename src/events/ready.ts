import { Color } from '../utils/Colors';
import { Event } from '../structures/Event';
import Logger from '../utils/Logger';
import DataBaseCheck from '../utils/DataBaseCheck';
import { ActivityType } from 'discord.js';

export default new Event('ready', (client) => {
    Logger.info('Bot is online ! ' + client.user?.tag, 'READY', Color.FgGreen);
    client.guilds.cache.forEach((element) => {
        Logger.info(`Check database for ${element.name}`, 'DATABASE');
        DataBaseCheck.checkDataBase(element);
    });

    // Set the client user's presence
    client.user.setPresence({
        activities: [
            {
                name: 'vous connaissez ffxiv ???',
                type: ActivityType.Streaming,
                url: 'https://www.youtube.com/watch?v=QH2-TGUlwu4',
            },
        ],
        status: 'online',
    });
});
