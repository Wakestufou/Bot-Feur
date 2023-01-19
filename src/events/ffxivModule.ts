import { Event } from '../structures/Event';
import { setTimeout } from 'timers/promises';
import cron from 'node-cron';
import { ChannelType, TextChannel, User } from 'discord.js';
import fs from 'fs';
import { guildData } from '../types/dataBase';
import Logger from '../utils/Logger';

export default new Event('ready', async (client) => {
    cron.schedule('10 0 * * *', async () => {
        // Do something every day at 00:00:00
        const random = Math.floor(Math.random() * 86000) * 1000;

        Logger.info(`Wait ${random}ms`, 'FFXIV');

        await setTimeout(random);

        // Do something after random time
        const Guilds = client.guilds.cache.map((guild) => guild.id);

        Guilds.forEach(async (guildId) => {
            const db = JSON.parse(
                fs.readFileSync(
                    `${__dirname}/../../db/guilds/${guildId}.json`,
                    'utf-8'
                )
            ) as guildData;

            // eslint-disable-next-line no-prototype-builtins
            if (db.Guild.hasOwnProperty('user_blacklist') === false) {
                db.Guild.user_blacklist = [];
            }

            // eslint-disable-next-line no-prototype-builtins
            if (db.Guild.modules.hasOwnProperty('ffxiv') === false) {
                db.Guild.modules.ffxiv = true;
            }

            if (!db.Guild.modules.ffxiv) return;

            const guild = client.guilds.cache.get(guildId);
            const TextChannels: TextChannel[] = guild?.channels.cache
                .filter((channel) => channel.type === ChannelType.GuildText)
                .map((channel) => channel as TextChannel) as TextChannel[];
            const allUser: User[] = [];

            // Random channel
            const randomChannel =
                TextChannels[Math.floor(Math.random() * TextChannels.length)];

            // Get all user in the channel
            randomChannel.members.forEach((member) => {
                if (
                    !member.user.bot &&
                    !db.Guild.user_blacklist.includes(member.user.id)
                )
                    allUser.push(member.user);
            });

            if (allUser.length === 0) return;

            // Random user
            const randomUser =
                allUser[Math.floor(Math.random() * allUser.length)];

            const ffxivModule = JSON.parse(
                fs.readFileSync(
                    `${__dirname}/../../db/modules/ffxiv.json`,
                    'utf-8'
                )
            );

            let responseRandom =
                ffxivModule.response[
                    Math.floor(Math.random() * ffxivModule.response.length)
                ];

            responseRandom = responseRandom.replace(
                '<@{user}>',
                randomUser.toString()
            );

            // Send message
            randomChannel.send(responseRandom).catch((err) => {
                Logger.warn('Error : ', err);
            });
        });
    });
});
