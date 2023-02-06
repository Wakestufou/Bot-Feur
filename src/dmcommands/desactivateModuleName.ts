import { Command } from '../structures/Command';
import fs from 'fs';
import { personsData } from '../types/dataBase';
import Logger from '../utils/Logger';

export default new Command({
    name: 'desactiveme',
    description: 'Desactive your personnal module',
    run: async ({ message }) => {
        if (!message) return;
        if (!message.author) return;

        fs.readFile(
            `${__dirname}/../../db/persons.json`,
            'utf-8',
            (err, data) => {
                if (err) {
                    Logger.error("Error while reading isaie's file : ", err);
                    return;
                }

                const personsData: personsData = JSON.parse(data);

                const person = personsData.filter((element) => {
                    if (element.id === message.author.id) {
                        return element;
                    }
                });

                if (!person) return;

                if (person.length === 0) {
                    message.reply(
                        "You're not in the database, please contact the bot's owner"
                    );
                    return;
                }

                if (person.length > 1 || person.length < 0) {
                    Logger.warn(
                        `Error while reading person's file : person.length = ${person.length}`
                    );
                    return;
                }

                if (!person[0].active) {
                    message.reply("You're already desactivated");
                    return;
                }

                person[0].active = false;

                fs.writeFile(
                    `${__dirname}/../../db/persons.json`,
                    JSON.stringify(personsData),
                    (err) => {
                        if (err) {
                            Logger.error(
                                "Error while writing isaie's file : ",
                                err
                            );
                            return;
                        }

                        message.reply('You are now desactivated');
                    }
                );
            }
        );
    },
});
