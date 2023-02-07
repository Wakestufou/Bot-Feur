export type guildData = {
    Guild: {
        id: string;
        modules: {
            quoi: boolean;
            je_suis: boolean;
            ffxiv: boolean;
            connemara: boolean;
        };
        user_blacklist: string[];
    };
};

export type moduleData = {
    get: [string];
    response: [string];
};

export type personsData = [
    {
        id: string;
        response: [string];
        active: boolean;
    }
];
