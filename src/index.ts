import { ExtendedClient } from './structures/Client';
import Logger from './utils/Logger';
import 'dotenv/config';

Logger.info('Program starting...');

Logger.info('Creating the client...');
export const client = new ExtendedClient();

Logger.info('Client created !');

Logger.info('Bot starting...');
client.start();
