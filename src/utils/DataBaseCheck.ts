import fs from 'fs';
import { Guild } from 'discord.js';
import Logger from '../utils/Logger';

class DataBaseCheck {
    checkDataBase(guild: Guild) {
        Logger.info(`Check database for ${guild.id}`, 'DATABASE');
        try {
            if (!fs.existsSync(`${__dirname}/../../db/guilds`)) {
                Logger.info(`Guilds Folder doesn't exist !`, 'DATABASE');

                fs.mkdirSync(__dirname + '/../../db/guilds/');
            } else {
                Logger.info(`Guilds Folder exist !`, 'DATABASE');
            }

            if (
                !fs.existsSync(
                    __dirname + '/../../db/guilds/' + guild.id + '.json'
                )
            ) {
                Logger.info(
                    `Guilds data base file doesn't exist !`,
                    'DATABASE'
                );
                //create Json file for guild
                const guildData = {
                    Guild: {
                        id: guild.id,
                        modules: {
                            quoi: true,
                            je_suis: true,
                        },
                    },
                };

                fs.writeFileSync(
                    `${__dirname}/../../db/guilds/${guild.id}.json`,
                    JSON.stringify(guildData)
                );
            } else {
                Logger.info(`Guilds data base file exist !`, 'DATABASE');
            }
        } catch (e) {
            Logger.error(
                `Error when creating database for ${guild.id}`,
                e as Error
            );
        }
    }
}

export default new DataBaseCheck();
