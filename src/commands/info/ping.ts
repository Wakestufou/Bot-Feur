import { Command } from '../../structures/Command';

export default new Command({
    name: 'ping',
    description: 'Replies with Pong !',
    default_member_permissions: ['Administrator'],
    run: async ({ interaction }) => {
        await interaction.deferReply();

        await interaction.followUp({ content: 'Pong !' });
    },
});
