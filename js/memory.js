const JARVIS_MEMORY_KEY = "jarvis_memory_v1";

const Memory = {

    data: {
        profile: {},
        memories: [],
        preferences: {},
        conversations: []
    },


    load() {

        try {

            const saved =
                localStorage.getItem(
                    JARVIS_MEMORY_KEY
                );

            if (saved) {

                const parsed =
                    JSON.parse(saved);

                this.data = {
                    ...this.data,
                    ...parsed
                };

            }

        } catch (error) {

            console.error(
                "JARVIS hafıza yükleme hatası:",
                error
            );

        }

    },


    save() {

        try {

            localStorage.setItem(
                JARVIS_MEMORY_KEY,
                JSON.stringify(this.data)
            );

        } catch (error) {

            console.error(
                "JARVIS hafıza kaydetme hatası:",
                error
            );

        }

    },


    remember(key, value) {

        this.data.profile[key] = value;

        this.save();

    },


    recall(key) {

        return this.data.profile[key] ?? null;

    },


    addMemory(text, importance = 1) {

        this.data.memories.push({

            id: crypto.randomUUID(),

            text,

            importance,

            createdAt:
                new Date().toISOString()

        });

        this.save();

    },


    getMemories() {

        return [
            ...this.data.memories
        ].sort(
            (a, b) =>
                b.importance - a.importance
        );

    },


    addConversation(
        role,
        text
    ) {

        this.data.conversations.push({

            role,

            text,

            timestamp:
                new Date().toISOString()

        });

        // Hafızanın sonsuza kadar şişmesini
        // önlemek için son 200 mesajı tutuyoruz.

        if (
            this.data.conversations.length >
            200
        ) {

            this.data.conversations =
                this.data.conversations.slice(-200);

        }

        this.save();

    },


    clearConversation() {

        this.data.conversations = [];

        this.save();

    },


    clearAll() {

        this.data = {

            profile: {},

            memories: [],

            preferences: {},

            conversations: []

        };

        this.save();

    }

};


Memory.load();
