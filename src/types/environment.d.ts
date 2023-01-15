declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DISCORD_TOKEN: string;
            DISCORD_TOKEN_DEV: string;
            DISCORD_APP_ID: string;
            DISCORD_APP_ID_DEV: string;
            DISCORD_GUILD_ID: string;
            DISCORD_GUILD_ID_DEV: string;
        }
    }
}

export {};
