import fs from 'fs';
import { guildData } from '../types/dataBase';
import { Event } from '../structures/Event';
import { ChannelType } from 'discord.js';
import Logger from '../utils/Logger';

export default new Event('messageUpdate', async (oldMessage, newMessage) => {
    if (!newMessage) return;
    if (!newMessage.content) return;
    if (!newMessage.author) return;
    if (newMessage.author.bot) return;
    if (newMessage.channel.type === ChannelType.DM) return;

    fs.readFile(
        `${__dirname}/../../db/guilds/${newMessage.guild?.id}.json`,
        'utf-8',
        (err, data) => {
            if (err) {
                Logger.error("Error while reading guild's file : ", err);
                return;
            }

            const guildData: guildData = JSON.parse(data);

            if (!guildData.Guild.modules.quoi) return;

            let contains = false;

            const quoiJson = JSON.parse(
                fs.readFileSync(
                    `${__dirname}/../../db/modules/quoi.json`,
                    'utf-8'
                )
            );

            if (newMessage.content === null) return;

            const messageContent = newMessage.content.toLowerCase().split(' ');

            for (let i = 0; i < quoiJson.get.length; i++) {
                if (messageContent.includes(quoiJson.get[i])) {
                    contains = true;
                    break;
                }
            }

            if (!contains) return;

            newMessage
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
