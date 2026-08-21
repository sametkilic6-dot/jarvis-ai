```javascript
"use strict";

const Memory = {

    /*
     * ==========================================
     * JARVIS MEMORY v4
     * ==========================================
     *
     * Aynı v3 anahtarını kullanıyoruz.
     * Böylece mevcut hafıza kaybolmaz.
     */

    key: "jarvis_memory_v3",

    data: [],

    profile: {

        name: null,

        preferences: {},

        facts: {},

        personal: {},

        goals: {}

    },


    /*
     * ==========================================
     * INIT
     * ==========================================
     */

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
                            parsed.profile?.name ||
                            null,

                        preferences:
                            parsed.profile?.preferences ||
                            {},

                        facts:
                            parsed.profile?.facts ||
                            {},

                        personal:
                            parsed.profile?.personal ||
                            {},

                        goals:
                            parsed.profile?.goals ||
                            {}

                    };

                }

            }


            /*
             * ==================================
             * BOZUK HAFIZA TEMİZLEME
             * ==================================
             *
             * Daha önce yanlışlıkla:
             *
             * favorite_game = "ne."
             *
             * gibi kayıtlar oluştuysa temizlenir.
             */

            this.cleanCorruptedMemory();


            /*
             * Hafızayı tekrar kaydet.
             */

            this.save();


        } catch (error) {

            console.error(
                "JARVIS Memory yükleme hatası:",
                error
            );

        }

    },


    /*
     * ==========================================
     * BOZUK HAFIZA TEMİZLE
     * ==========================================
     */

    cleanCorruptedMemory() {

        const preferences =
            this.profile.preferences;


        if (
            preferences &&
            typeof preferences.favorite_game ===
            "string"
        ) {

            const game =
                preferences.favorite_game
                    .trim()
                    .toLocaleLowerCase("tr-TR");


            /*
             * Soru kelimelerinin yanlışlıkla
             * favori oyun olarak kaydedilmesini engelle.
             */

            const invalidGames = [

                "ne",

                "ne.",

                "nedir",

                "nedir.",

                "hangi",

                "hangi.",

                "favori oyunum ne",

                "favori oyunum ne.",

                "en sevdiğim oyun ne",

                "en sevdiğim oyun ne."

            ];


            if (
                invalidGames.includes(game)
            ) {

                delete preferences.favorite_game;

            }

        }

    },


    /*
     * ==========================================
     * SAVE
     * ==========================================
     */

    save() {

        try {

            localStorage.setItem(

                this.key,

                JSON.stringify({

                    data:
                        this.data,

                    profile:
                        this.profile

                })

            );

        } catch (error) {

            console.error(
                "JARVIS Memory kayıt hatası:",
                error
            );

        }

    },


    /*
     * ==========================================
     * MESAJ EKLE
     * ==========================================
     */

    add(role, text) {

        if (
            !text ||
            !String(text).trim()
        ) {

            return;

        }


        this.data.push({

            role:
                role,

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


    /*
     * ==========================================
     * İSİM
     * ==========================================
     */

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


    /*
     * ==========================================
     * PERSONAL
     * ==========================================
     */

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


    /*
     * ==========================================
     * FACTS
     * ==========================================
     */

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


    /*
     * ==========================================
     * PREFERENCES
     * ==========================================
     */

    addPreference(key, value) {

        if (
            !key ||
            !value
        ) {

            return;

        }


        const cleanValue =
            String(value).trim();


        /*
         * FAVORİ OYUN KORUMASI
         */

        if (
            key === "favorite_game"
        ) {

            const invalidValues = [

                "ne",

                "ne.",

                "nedir",

                "nedir.",

                "hangi",

                "hangi.",

                "favori oyunum ne",

                "favori oyunum ne.",

                "en sevdiğim oyun ne",

                "en sevdiğim oyun ne."

            ];


            if (
                invalidValues.includes(
                    cleanValue
                        .toLocaleLowerCase("tr-TR")
                )
            ) {

                console.warn(
                    "JARVIS: Geçersiz favori oyun kaydı engellendi:",
                    cleanValue
                );

                return;

            }

        }


        this.profile.preferences[key] =
            cleanValue;


        this.save();

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


    /*
     * ==========================================
     * GOALS
     * ==========================================
     */

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


    /*
     * ==========================================
     * SON MESAJLAR
     * ==========================================
     */

    recent(limit = 10) {

        return this.data.slice(-limit);

    },


    /*
     * ==========================================
     * ARAMA
     * ==========================================
     */

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


    /*
     * ==========================================
     * TÜM HAFIZA
     * ==========================================
     */

    allFacts() {

        return {
            ...this.profile.facts
        };

    },


    /*
     * ==========================================
     * KONUŞMAYI TEMİZLE
     * ==========================================
     */

    clearConversation() {

        this.data = [];


        this.save();

    },


    /*
     * ==========================================
     * HER ŞEYİ TEMİZLE
     * ==========================================
     */

    clearAll() {

        this.data = [];


        this.profile = {

            name:
                null,

            preferences:
                {},

            facts:
                {},

            personal:
                {},

            goals:
                {}

        };


        this.save();

    },


    /*
     * ==========================================
     * SAYI
     * ==========================================
     */

    count() {

        return this.data.length;

    }

};


/*
 * ==========================================
 * BAŞLAT
 * ==========================================
 */

Memory.init();


console.log(
    "🧠 JARVIS Memory v4 aktif."
);
```
