import { Command } from '../structures/Command';
import { PermissionFlagsBits } from 'discord.js';
import fs from 'fs';
import Logger from '../utils/Logger';

export default new Command({
    name: 'admin',
    description: 'Admin Command !',
    default_member_permissions: String(PermissionFlagsBits.Administrator),
    options: [
        {
            type: 2,
            name: 'db',
            description: 'Database',
            options: [
                {
                    type: 1,
                    name: 'get',
                    description: 'Get data from database',
                },
                {
                    type: 1,
                    name: 'set',
                    description: 'Change data in database for module',
                    options: [
                        {
                            type: 3,
                            name: 'module',
                            description: 'Module',
                            required: true,
                            choices: [
                                {
                                    name: 'quoi',
                                    value: 'quoi',
                                },
                                {
                                    name: 'je suis',
                                    value: 'je_suis',
                                },
                                {
                                    name: 'FF XIV',
                                    value: 'ffxiv',
                                },
                            ],
                        },
                        {
                            type: 5,
                            name: 'active',
                            description: 'Active module ?',
                            required: true,
                        },
                    ],
                },
            ],
        },
    ],
    run: async ({ interaction, args }) => {
        if (!interaction.isCommand()) return;

        const subCommand = args.getSubcommand();

        if (subCommand === 'get') {
            const db = JSON.parse(
                fs.readFileSync(
                    `${__dirname}/../../db/guilds/${interaction.guild?.id}.json`,
                    'utf-8'
                )
            );

            interaction
                .reply({ content: JSON.stringify(db), ephemeral: true })
                .catch((err) => {
                    Logger.warn('Error when getter database : ', err);
                });
        } else if (subCommand === 'set') {
            const module = args.getString('module', true);

            const db = JSON.parse(
                fs.readFileSync(
                    `${__dirname}/../../db/guilds/${interaction.guild?.id}.json`,
                    'utf-8'
                )
            );

            // eslint-disable-next-line no-prototype-builtins
            if (db.Guild.modules.hasOwnProperty(module) === false) {
                db.Guild.modules[module] = true;
            }

            db.Guild.modules[module] = args.getBoolean('active', true);

            fs.writeFile(
                `${__dirname}/../../db/guilds/${interaction.guild?.id}.json`,
                JSON.stringify(db),
                (err) => {
                    if (err) {
                        Logger.warn(
                            'Error when setter database : ' + err.message
                        );
                    } else {
                        const message = `Module ${module} set to ${db.Guild.modules[module]}`;
                        interaction
                            .reply({
                                content: message,
                            })
                            .catch((err) => {
                                Logger.warn(
                                    'Error when setter database : ' +
                                        err.message
                                );
                            });
                    }
                }
            );
        }
    },
});
