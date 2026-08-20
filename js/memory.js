"use strict";

/*
 * JARVIS MEMORY CORE
 *
 * Hafıza:
 * - Profil bilgileri
 * - Konuşmalar
 * - Önemli anılar
 * - Tercihler
 *
 * Depolama: localStorage
 */

const MEMORY_KEY =
    "jarvis_memory_v1";


const Memory = {

    data: {

        profile: {},

        memories: [],

        preferences: {},

        conversations: []

    },


    init() {

        this.load();

    },


    load() {

        try {

            const saved =
                localStorage.getItem(
                    MEMORY_KEY
                );


            if (!saved) {

                this.save();

                return;

            }


            const parsed =
                JSON.parse(saved);


            this.data = {

                ...this.data,

                ...parsed

            };


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
                MEMORY_KEY,
                JSON.stringify(
                    this.data
                )
            );

        } catch (error) {

            console.error(
                "JARVIS hafıza kaydetme hatası:",
                error
            );

        }

    },


    remember(
        key,
        value
    ) {

        if (!key) {
            return false;
        }


        this.data.profile[key] =
            value;


        this.save();


        return true;

    },


    recall(key) {

        if (!key) {
            return null;
        }


        return (
            this.data.profile[key] ??
            null
        );

    },


    addMemory(
        text,
        importance = 1
    ) {

        if (!text) {
            return false;
        }


        this.data.memories.push({

            id:
                this.createId(),

            text,

            importance,

            createdAt:
                new Date().toISOString()

        });


        /*
         * Hafızanın sonsuza kadar büyümesini
         * önlemek için maksimum 500 kayıt.
         */

        if (
            this.data.memories.length >
            500
        ) {

            this.data.memories =
                this.data.memories.slice(
                    -500
                );

        }


        this.save();


        return true;

    },


    getMemories() {

        return [
            ...this.data.memories
        ].sort(
            (
                first,
                second
            ) =>
                second.importance -
                first.importance
        );

    },


    addConversation(
        role,
        text
    ) {

        if (
            !role ||
            !text
        ) {

            return false;

        }


        this.data.conversations.push({

            id:
                this.createId(),

            role,

            text,

            timestamp:
                new Date().toISOString()

        });


        /*
         * Son 300 mesajı tut.
         */

        if (
            this.data.conversations.length >
            300
        ) {

            this.data.conversations =
                this.data.conversations.slice(
                    -300
                );

        }


        this.save();


        return true;

    },


    getRecentConversations(
        count = 20
    ) {

        return this.data
            .conversations
            .slice(-count);

    },


    setPreference(
        key,
        value
    ) {

        if (!key) {
            return false;
        }


        this.data.preferences[key] =
            value;


        this.save();


        return true;

    },


    getPreference(key) {

        return (
            this.data.preferences[key] ??
            null
        );

    },


    clearConversations() {

        this.data.conversations = [];

        this.save();

    },


    clearMemories() {

        this.data.memories = [];

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

    },


    getStats() {

        return {

            memories:
                this.data.memories.length,

            conversations:
                this.data.conversations.length,

            profileItems:
                Object.keys(
                    this.data.profile
                ).length,

            preferences:
                Object.keys(
                    this.data.preferences
                ).length

        };

    },


    createId() {

        if (
            typeof crypto !== "undefined" &&
            typeof crypto.randomUUID ===
                "function"
        ) {

            return crypto.randomUUID();

        }


        return (
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2)
        );

    }

};


/*
 * Hafızayı başlat.
 */

Memory.init();
