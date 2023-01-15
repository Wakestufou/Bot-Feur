import { Command } from '../structures/Command';
import { PermissionFlagsBits } from 'discord.js';

export default new Command({
    name: 'ping',
    description: 'Replies with Pong !',
    default_member_permissions: String(PermissionFlagsBits.Administrator),
    run: async ({ interaction }) => {
        await interaction.deferReply();

        await interaction.followUp({ content: 'Pong !' });
    },
});
