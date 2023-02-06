import { Event } from '../structures/Event';
import { ChannelType } from 'discord.js';
import Logger from '../utils/Logger';
import fs from 'fs';
import { personsData } from '../types/dataBase';

export default new Event('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.channel.type === ChannelType.DM) return;

    fs.readFile(`${__dirname}/../../db/persons.json`, 'utf-8', (err, data) => {
        if (err) {
            Logger.error("Error while reading persons' file : ", err);
            return;
        }

        const persons = JSON.parse(data) as personsData;

        const person = persons.filter(
            (element) => element.id === message.author.id
        );

        if (person.length === 0) return;
        if (person.length > 1 || person.length < 0) {
            Logger.warn(
                `Error while reading persons' file : ${person.length} persons with the same id`
            );
            return;
        }

        if (!person[0].active) return;

        const response =
            person[0].response[
                Math.floor(Math.random() * person[0].response.length)
            ];

        message.reply(response).catch((err) => {
            Logger.error('Error : ', err);
        });
    });
});
