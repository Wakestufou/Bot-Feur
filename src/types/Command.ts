import {
    ChatInputApplicationCommandData,
    CommandInteraction,
    CommandInteractionOptionResolver,
    GuildMember,
    Message,
} from 'discord.js';
import { ExtendedClient } from '../structures/Client';

export interface ExtendedInteraction extends CommandInteraction {
    member: GuildMember;
}

interface RunOptions {
    client: ExtendedClient;
    interaction?: ExtendedInteraction;
    args?: CommandInteractionOptionResolver;
    message?: Message;
}

type RunFunction = (options: RunOptions) => void;

export type CommandType = {
    default_member_permissions?: string;
    run: RunFunction;
} & ChatInputApplicationCommandData;
