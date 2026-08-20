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

                    this.profile = {

                        name:
                            parsed.profile?.name || null,

                        preferences:
                            parsed.profile?.preferences || {},

                        facts:
                            parsed.profile?.facts || {},

                        personal:
                            parsed.profile?.personal || {},

                        goals:
                            parsed.profile?.goals || {}

                    };

                }

            }

        } catch (error) {

            console.error(
                "JARVIS Memory yükleme hatası:",
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

        if (this.data.length > 1000) {

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

        if (!key || !value) {
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
            this.profile.personal[key]
            || null
        );

    },


    removePersonal(key) {

        if (!key) {
            return;
        }

        delete this.profile.personal[key];

        this.save();

    },


    addFact(key, value) {

        if (!key || !value) {
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
            this.profile.facts[key]
            || null
        );

    },


    removeFact(key) {

        if (!key) {
            return;
        }

        delete this.profile.facts[key];

        this.save();

    },


    addPreference(key, value) {

        if (!key || !value) {
            return;
        }

        this.profile.preferences[key] =
            String(value).trim();

        this.save();

    },


    getPreference(key) {

        if (!key) {
            return null;
        }

        return (
            this.profile.preferences[key]
            || null
        );

    },


    removePreference(key) {

        if (!key) {
            return;
        }

        delete this.profile.preferences[key];

        this.save();

    },


    addGoal(key, value) {

        if (!key || !value) {
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
            this.profile.goals[key]
            || null
        );

    },


    removeGoal(key) {

        if (!key) {
            return;
        }

        delete this.profile.goals[key];

        this.save();

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


    recent(limit = 10) {

        return this.data.slice(-limit);

    },


    search(query) {

        if (!query) {
            return [];
        }

        const text =
            String(query).toLowerCase();

        return this.data.filter(item =>

            item.text
                .toLowerCase()
                .includes(text)

        );

    },


    allFacts() {

        return {
            ...this.profile.facts
        };

    },


    allPreferences() {

        return {
            ...this.profile.preferences
        };

    },


    allPersonal() {

        return {
            ...this.profile.personal
        };

    },


    allGoals() {

        return {
            ...this.profile.goals
        };

    },


    count() {

        return this.data.length;

    }

};


Memory.init();


console.log(
    "🧠 JARVIS Memory v3 aktif."
);
