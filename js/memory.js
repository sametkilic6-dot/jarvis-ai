"use strict";

const Memory = {

    key: "jarvis_memory_v4",

    data: [],

    profile: {
        name: null,
        preferences: {},
        facts: {},
        personal: {},
        goals: {}
    },

    init() {

        try {

            const saved = localStorage.getItem(this.key);

            if (saved) {

                const parsed = JSON.parse(saved);

                if (parsed && typeof parsed === "object") {

                    this.data =
                        Array.isArray(parsed.data)
                            ? parsed.data
                            : [];

                    const profile =
                        parsed.profile || {};

                    this.profile = {

                        name:
                            profile.name || null,

                        preferences:
                            profile.preferences || {},

                        facts:
                            profile.facts || {},

                        personal:
                            profile.personal || {},

                        goals:
                            profile.goals || {}

                    };

                }

            }

            this.cleanCorruptedMemory();

            this.save();

            console.log("🧠 JARVIS Memory v5 yüklendi.");

        } catch (error) {

            console.error(
                "JARVIS Memory başlatma hatası:",
                error
            );

        }

    },


    save() {

        try {

            localStorage.setItem(

                this.key,

                JSON.stringify({

                    data: this.data,

                    profile: this.profile

                })

            );

            return true;

        } catch (error) {

            console.error(
                "JARVIS Memory kayıt hatası:",
                error
            );

            return false;

        }

    },


    add(role, text) {

        if (!text || !String(text).trim()) {
            return false;
        }

        this.data.push({

            role: role,

            text: String(text).trim(),

            timestamp:
                new Date().toISOString()

        });

        if (this.data.length > 1000) {

            this.data =
                this.data.slice(-1000);

        }

        return this.save();

    },


    setName(name) {

        if (!name || !String(name).trim()) {
            return false;
        }

        this.profile.name =
            String(name).trim();

        return this.save();

    },


    getName() {

        return this.profile.name;

    },


    addFact(key, value) {

        if (
            !key ||
            value === null ||
            value === undefined ||
            !String(value).trim()
        ) {
            return false;
        }

        this.profile.facts[key] =
            String(value).trim();

        return this.save();

    },


    getFact(key) {

        if (!key) {
            return null;
        }

        return (
            this.profile.facts[key] ||
            null
        );

    },


    allFacts() {

        return {
            ...this.profile.facts
        };

    },


    removeFact(key) {

        if (!key) {
            return false;
        }

        delete this.profile.facts[key];

        return this.save();

    },


    addPreference(key, value) {

        if (
            !key ||
            value === null ||
            value === undefined
        ) {
            return false;
        }

        const cleanValue =
            String(value).trim();

        if (!cleanValue) {
            return false;
        }

        if (key === "favorite_game") {

            const normalized =
                cleanValue
                    .toLocaleLowerCase("tr-TR");

            const invalidValues = [

                "ne",
                "ne.",
                "ne?",
                "nedir",
                "nedir.",
                "nedir?",
                "hangi",
                "hangi.",
                "hangi?",
                "favori oyunum ne",
                "favori oyunum ne.",
                "favori oyunum ne?",
                "en sevdiğim oyun ne",
                "en sevdiğim oyun ne.",
                "en sevdiğim oyun ne?"

            ];

            if (invalidValues.includes(normalized)) {

                console.warn(
                    "JARVIS: Soru yanlışlıkla favori oyun olarak kaydedilmedi."
                );

                return false;

            }

        }

        this.profile.preferences[key] =
            cleanValue;

        const saved =
            this.save();

        if (!saved) {
            return false;
        }

        return (
            this.getPreference(key) ===
            cleanValue
        );

    },


    getPreference(key) {

        if (!key) {
            return null;
        }

        return (
            this.profile.preferences[key] ||
            null
        );

    },


    allPreferences() {

        return {
            ...this.profile.preferences
        };

    },


    removePreference(key) {

        if (!key) {
            return false;
        }

        delete this.profile.preferences[key];

        return this.save();

    },


    addPersonal(key, value) {

        if (
            !key ||
            value === null ||
            value === undefined ||
            !String(value).trim()
        ) {
            return false;
        }

        this.profile.personal[key] =
            String(value).trim();

        return this.save();

    },


    getPersonal(key) {

        if (!key) {
            return null;
        }

        return (
            this.profile.personal[key] ||
            null
        );

    },


    allPersonal() {

        return {
            ...this.profile.personal
        };

    },


    removePersonal(key) {

        if (!key) {
            return false;
        }

        delete this.profile.personal[key];

        return this.save();

    },


    addGoal(key, value) {

        if (
            !key ||
            value === null ||
            value === undefined ||
            !String(value).trim()
        ) {
            return false;
        }

        this.profile.goals[key] =
            String(value).trim();

        return this.save();

    },


    getGoal(key) {

        if (!key) {
            return null;
        }

        return (
            this.profile.goals[key] ||
            null
        );

    },


    allGoals() {

        return {
            ...this.profile.goals
        };

    },


    removeGoal(key) {

        if (!key) {
            return false;
        }

        delete this.profile.goals[key];

        return this.save();

    },


    recent(limit = 10) {

        return this.data.slice(-limit);

    },


    search(query) {

        if (!query) {
            return [];
        }

        const text =
            String(query)
                .toLocaleLowerCase("tr-TR");

        return this.data.filter(

            item =>
                String(item.text)
                    .toLocaleLowerCase("tr-TR")
                    .includes(text)

        );

    },


    count() {

        return this.data.length;

    },


    cleanCorruptedMemory() {

        const preferences =
            this.profile.preferences;

        if (
            preferences &&
            typeof preferences.favorite_game === "string"
        ) {

            const normalized =
                preferences.favorite_game
                    .trim()
                    .toLocaleLowerCase("tr-TR");

            const invalidValues = [

                "ne",
                "ne.",
                "ne?",
                "nedir",
                "nedir.",
                "nedir?",
                "hangi",
                "hangi.",
                "hangi?",
                "favori oyunum ne",
                "favori oyunum ne.",
                "favori oyunum ne?",
                "en sevdiğim oyun ne",
                "en sevdiğim oyun ne.",
                "en sevdiğim oyun ne?"

            ];

            if (
                invalidValues.includes(normalized)
            ) {

                delete preferences.favorite_game;

            }

        }

    },


    clearConversation() {

        this.data = [];

        return this.save();

    },


    clearAll() {

        this.data = [];

        this.profile = {

            name: null,

            preferences: {},

            facts: {},

            personal: {},

            goals: {}

        };

        return this.save();

    }

};


Memory.init();

console.log(
    "🧠 JARVIS Memory v5 aktif."
);
