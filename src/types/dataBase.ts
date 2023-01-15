export type guildData = {
    Guild: {
        id: string;
        modules: {
            quoi: boolean;
            je_suis: boolean;
        };
    };
};

export type moduleData = {
    get: [string];
    response: [string];
};
