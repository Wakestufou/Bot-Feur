import { Command } from '../structures/Command';
import fs from 'fs';
import { guildData } from '../types/dataBase';
import Logger from '../utils/Logger';

export default new Command({
    name: 'blacklist',
    description: 'Command to stop being pinged !',
    options: [
        {
            type: 3,
            name: 'active',
            description: 'add or remove yourself from the blacklist',
            choices: [
                {
                    name: 'on',
                    value: 'on',
                },
                {
                    name: 'off',
                    value: 'off',
                },
            ],
            required: true,
        },
    ],
    run: async ({ interaction, args }) => {
        const active = args.getString('active', true);

        const db = JSON.parse(
            fs.readFileSync(
                `${__dirname}/../../db/guilds/${interaction.guild?.id}.json`,
                'utf-8'
            )
        ) as guildData;

        // eslint-disable-next-line no-prototype-builtins
        if (db.Guild.hasOwnProperty('user_blacklist') === false) {
            db.Guild.user_blacklist = [];
        }

        if (active === 'on') {
            if (!db.Guild.user_blacklist.includes(interaction.user.id))
                db.Guild.user_blacklist.push(interaction.user.id);
        } else {
            db.Guild.user_blacklist = db.Guild.user_blacklist.filter(
                (id) => id !== interaction.user.id
            );
        }

        fs.writeFile(
            `${__dirname}/../../db/guilds/${interaction.guild?.id}.json`,
            JSON.stringify(db),
            (err) => {
                if (err) {
                    Logger.warn('Error when setter database : ' + err.message);
                } else {
                    let message = `You are now `;
                    if (active === 'on') {
                        message += 'blacklisted';
                    } else {
                        message += 'not blacklisted';
                    }

                    interaction
                        .reply({
                            content: message,
                        })
                        .catch((err) => {
                            Logger.warn(
                                'Error when setter database : ' + err.message
                            );
                        });
                }
            }
        );
    },
});
