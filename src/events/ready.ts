import { Color } from '../utils/Colors';
import { Event } from '../structures/Event';
import Logger from '../utils/Logger';
import DataBaseCheck from '../utils/DataBaseCheck';

export default new Event('ready', (client) => {
    Logger.info('Bot is online ! ' + client.user?.tag, 'READY', Color.FgGreen);
    client.guilds.cache.forEach((element) => {
        DataBaseCheck.checkDataBase(element);
    });
});
