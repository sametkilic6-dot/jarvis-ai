```javascript
"use strict";

const Memory = {

    key: "jarvis_memory_v3",

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

            const saved =
                localStorage.getItem(this.key);

            if (saved) {

                const parsed =
                    JSON.parse(saved);

                if (parsed) {

                    this.data =
                        Array.isArray(parsed.data)
                            ? parsed.data
                            : [];

                    const oldProfile =
                        parsed.profile || {};

                    this.profile = {

                        name:
                            oldProfile.name || null,

                        preferences:
                            oldProfile.preferences || {},

                        facts:
                            oldProfile.facts || {},

                        personal:
                            oldProfile.personal || {},

                        goals:
                            oldProfile.goals || {}

                    };

                }

            }

            this.cleanCorruptedMemory();

            this.save();

        } catch (error) {

            console.error(
                "JARVIS Memory yükleme hatası:",
                error
            );

        }

    },


    cleanCorruptedMemory() {

        const preferences =
            this.profile.preferences;

        if (
            preferences &&
            typeof preferences.favorite_game === "string"
        ) {

            const value =
                preferences.favorite_game
                    .trim()
                    .toLocaleLowerCase("tr-TR");

            const invalidValues = [

                "ne",
                "ne.",
                "nedir",
                "nedir?",
                "nedir.",
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
                invalidValues.includes(value)
            ) {

                delete preferences.favorite_game;

            }

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

        } catch (error) {

            console.error(
                "JARVIS Memory kayıt hatası:",
                error
            );

        }

    },


    add(role, text) {

        if (
            !text ||
            !String(text).trim()
        ) {

            return;

        }

        this.data.push({

            role: role,

            text:
                String(text).trim(),

            timestamp:
                new Date().toISOString()

        });

        if (
            this.data.length > 1000
        ) {

            this.data =
                this.data.slice(-1000);

        }

        this.save();

    },


    setName(name) {

        if (!name) {
            return;
        }

        this.profile.name =
            String(name).trim();

        this.save();

    },


    getName() {

        return this.profile.name;

    },


    addPersonal(key, value) {

        if (
            !key ||
            !value
        ) {
            return;
        }

        this.profile.personal[key] =
            String(value).trim();

        this.save();

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


    removePersonal(key) {

        if (!key) {
            return;
        }

        delete this.profile.personal[key];

        this.save();

    },


    allPersonal() {

        return {
            ...this.profile.personal
        };

    },


    addFact(key, value) {

        if (
            !key ||
            !value
        ) {
            return;
        }

        this.profile.facts[key] =
            String(value).trim();

        this.save();

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


    removeFact(key) {

        if (!key) {
            return;
        }

        delete this.profile.facts[key];

        this.save();

    },


    allFacts() {

        return {
            ...this.profile.facts
        };

    },


    addPreference(key, value) {

        if (
            !key ||
            !value
        ) {
            return false;
        }

        const cleanValue =
            String(value).trim();

        if (!cleanValue) {
            return false;
        }


        if (
            key === "favorite_game"
        ) {

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

            if (
                invalidValues.includes(normalized)
            ) {

                console.warn(
                    "JARVIS: Geçersiz favori oyun kaydı engellendi."
                );

                return false;

            }

        }


        this.profile.preferences[key] =
            cleanValue;

        this.save();


        const savedValue =
            this.profile.preferences[key];

        return (
            savedValue === cleanValue
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


    removePreference(key) {

        if (!key) {
            return;
        }

        delete this.profile.preferences[key];

        this.save();

    },


    allPreferences() {

        return {
            ...this.profile.preferences
        };

    },


    addGoal(key, value) {

        if (
            !key ||
            !value
        ) {
            return;
        }

        this.profile.goals[key] =
            String(value).trim();

        this.save();

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


    removeGoal(key) {

        if (!key) {
            return;
        }

        delete this.profile.goals[key];

        this.save();

    },


    allGoals() {

        return {
            ...this.profile.goals
        };

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


    clearConversation() {

        this.data = [];

        this.save();

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

        this.save();

    },


    count() {

        return this.data.length;

    }

};


Memory.init();


console.log(
    "🧠 JARVIS Memory v5 aktif."
);
```
