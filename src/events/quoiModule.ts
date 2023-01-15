import fs from 'fs';
import { guildData } from '../types/dataBase';
import { Event } from '../structures/Event';
import { ChannelType } from 'discord.js';
import quoiJson from '../db/modules/quoi.json';
import Logger from '../utils/Logger';

export default new Event('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.channel.type === ChannelType.DM) return;

    fs.readFile(
        `${__dirname}/../db/guilds/${message.guild?.id}.json`,
        'utf-8',
        (err, data) => {
            if (err) {
                console.log(err);
                return;
            }

            const guildData: guildData = JSON.parse(data);

            if (!guildData.Guild.modules.quoi) return;

            let contains = false;

            for (let i = 0; i < quoiJson.get.length; i++) {
                if (message.content.toLowerCase().includes(quoiJson.get[i])) {
                    contains = true;
                    break;
                }
            }

            if (!contains) return;

            message
                .reply(
                    quoiJson.response[
                        Math.floor(Math.random() * quoiJson.response.length)
                    ]
                )
                .catch((err) => {
                    Logger.error('Error : ', err);
                });
        }
    );
});
