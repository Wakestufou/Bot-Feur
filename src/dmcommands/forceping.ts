import { Command } from '../structures/Command';
import fs from 'fs';
import { client } from '..';
import { setTimeout } from 'timers/promises';
import Logger from '../utils/Logger';
import { guildData } from '../types/dataBase';
import { ChannelType, TextChannel, User } from 'discord.js';

export default new Command({
    name: 'forceping',
    description: 'Force ping',
    run: async ({ message }) => {
        if (!message) return;
        if (!message.author) return;

        if (message.author.id !== '361428013230981121') {
            message.reply("You're not the bot's owner");
            return;
        }

        const args = message.content.split(' ');

        if (args.length !== 3) {
            message.reply(
                'Invalid arguments : !forceping <moduleName> <hours:minutes:seconds>'
            );
            return;
        }

        // check if module exist
        const moduleName = args[1];

        if (moduleName !== 'ffxiv') {
            message.reply('Invalid module name');
            return;
        }

        const time = args[2];

        // Change time for milliseconds
        const timeArray = time.split(':');
        let hours = parseInt(timeArray[0]);
        let minutes = parseInt(timeArray[1]);
        let seconds = parseInt(timeArray[2]);

        let milliseconds = hours * 3600000 + minutes * 60000 + seconds * 1000;

        //minus now time
        const now = new Date();

        milliseconds -= now.getHours() * 3600000;
        milliseconds -= now.getMinutes() * 60000;
        milliseconds -= now.getSeconds() * 1000;
        milliseconds -= now.getMilliseconds();

        const millisecondsFinal = milliseconds;

        //Update hours, minutes and seconds
        hours = Math.floor(milliseconds / 3600000);
        milliseconds -= hours * 3600000;
        minutes = Math.floor(milliseconds / 60000);
        milliseconds -= minutes * 60000;
        seconds = Math.floor(milliseconds / 1000);
        milliseconds -= seconds * 1000;

        message
            .reply(
                `Force ping for module ${moduleName} on ${hours} hours, ${minutes} minutes and ${seconds} seconds`
            )
            .catch((err) => {
                Logger.error("Can't send message", err);
            });

        await setTimeout(millisecondsFinal);

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
    },
});
