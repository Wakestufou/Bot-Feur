import fs from 'fs';
import { guildData, moduleData } from '../types/dataBase';
import { Event } from '../structures/Event';
import { ChannelType, Message } from 'discord.js';
import Logger from '../utils/Logger';

export default new Event('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.channel.type === ChannelType.DM) return;

    fs.readFile(
        `${__dirname}/../../db/guilds/${message.guild?.id}.json`,
        'utf-8',
        (err, data) => {
            if (err) {
                Logger.error("Error while reading guild's file : ", err);
                return;
            }

            const guildData: guildData = JSON.parse(data);

            // eslint-disable-next-line no-prototype-builtins
            if (guildData.Guild.modules.hasOwnProperty('connemara') === false) {
                guildData.Guild.modules.connemara = true;
            }

            if (!guildData.Guild.modules.connemara) return;

            let contains = false;

            const connemaraJson = JSON.parse(
                fs.readFileSync(
                    `${__dirname}/../../db/modules/connemara.json`,
                    'utf-8'
                )
            ) as moduleData;

            const messageContent = message.content.toLowerCase().split(' ');

            for (let i = 0; i < connemaraJson.response.length; i++) {
                if (messageContent.includes(connemaraJson.response[i])) {
                    contains = true;
                    break;
                }
            }

            if (!contains) return;

            message.channel.messages
                .fetch({ limit: 3 })
                .then((messages) => {
                    const messagesOfMember = [] as Message[];
                    const messageOfBot = [] as Message[];

                    messages.forEach((msg) => {
                        if (msg.author.id === message.author.id) {
                            messagesOfMember.push(msg);
                        }

                        if (msg.author.id === message.client.user?.id) {
                            messageOfBot.push(msg);
                        }
                    });

                    if (messagesOfMember.length < 1) return;

                    const index = connemaraJson.response.findIndex(
                        (response, index) => {
                            if (messageOfBot.length > 0) {
                                return (
                                    response === messagesOfMember[0].content &&
                                    messageOfBot[0].content ===
                                        connemaraJson.response[index - 1]
                                );
                            }

                            return response === messagesOfMember[0].content;
                        }
                    );

                    if (index === -1) return;

                    message
                        .reply(
                            connemaraJson.response[
                                index + 1 > connemaraJson.response.length - 1
                                    ? 0
                                    : index + 1
                            ]
                        )
                        .catch((err) => {
                            Logger.error('Error : ', err);
                        });
                })
                .catch(console.error);
        }
    );
});
