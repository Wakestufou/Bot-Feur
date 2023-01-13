import { Color } from '../utils/Colors';
import { Event } from '../structures/Event';
import Logger from '../utils/Logger';

export default new Event('ready', (client) => {
    Logger.info('Bot is online ! ' + client.user?.tag, 'READY', Color.FgGreen);
});
