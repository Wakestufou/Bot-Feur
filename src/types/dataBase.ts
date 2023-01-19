export type guildData = {
    Guild: {
        id: string;
        modules: {
            quoi: boolean;
            je_suis: boolean;
            ffxiv: boolean;
        };
        user_blacklist: string[];
    };
};

export type moduleData = {
    get: [string];
    response: [string];
};
