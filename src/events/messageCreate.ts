import { Event } from '../structures/Event';
import { ChannelType } from 'discord.js';
import Logger from '../utils/Logger';
import { client } from '..';

export default new Event('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.channel.type !== ChannelType.DM) return;

    const prefix = process.env.DISCORD_PREFIX;
    if (!prefix) return;

    const commandName = message.content.split(' ')[0].slice(prefix.length);

    const command = client.getDmCommands().get(commandName);

    if (!command)
        return message.reply(
            'You have used a non exitent DM command :\n!desactiveme : Desactive your personnal module\n!activeme : Active your personnal module'
        );

    try {
        command.run({
            client,
            message,
        });
    } catch (error) {
        Logger.error(
            `Error when executing the ${command.name} command`,
            error as Error
        );
    }
});
