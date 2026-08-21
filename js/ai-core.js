"use strict";

const AI_CORE = {

    async think(text) {

        const message =
            String(text || "").trim();

        if (!message) {

            return {
                response: ""
            };

        }


        /*
         * ==========================================
         * NORMALİZASYON
         * ==========================================
         */

        const normalized =
            message
                .toLocaleLowerCase("tr-TR")
                .replace(/\s+/g, " ")
                .trim();


        /*
         * ==========================================
         * 1. İSİM
         * ==========================================
         */

        const nameMatch =
            message.match(
                /^(?:benim adım|adım)\s+(.+?)[.!?]?$/iu
            );

        if (nameMatch) {

            const name =
                nameMatch[1].trim();

            if (
                typeof Memory !== "undefined" &&
                typeof Memory.setName === "function"
            ) {

                const saved =
                    Memory.setName(name);

                if (saved) {

                    return {
                        response:
                            `Tamam. Adını ${name} olarak hafızama kaydettim.`
                    };

                }

            }

            return {
                response:
                    "Adını kaydetmeye çalıştım fakat hafıza kaydı başarısız oldu."
            };

        }


        /*
         * ==========================================
         * 2. İSİM SORGUSU
         * ==========================================
         */

        if (
            normalized === "benim adım ne" ||
            normalized === "adım ne" ||
            normalized === "ismim ne"
        ) {

            const name =
                typeof Memory !== "undefined" &&
                typeof Memory.getName === "function"
                    ? Memory.getName()
                    : null;

            if (name) {

                return {
                    response:
                        `Adının ${name} olduğunu hatırlıyorum.`
                };

            }

            return {
                response:
                    "Adını hafızamda bulamıyorum."
            };

        }


        /*
         * ==========================================
         * 3. FAVORİ OYUN KAYDI
         * ==========================================
         */

        const favoriteGameMatch =
            message.match(
                /^(?:favori oyunum|en sevdiğim oyun)\s+(?:artık|şimdi|ise)\s+(.+?)[.!?]?$/iu
            );

        if (favoriteGameMatch) {

            const game =
                favoriteGameMatch[1].trim();

            if (!game) {

                return {
                    response:
                        "Hangi oyunun favorin olduğunu belirtmelisin."
                };

            }

            if (
                typeof Memory !== "undefined" &&
                typeof Memory.addPreference === "function"
            ) {

                const saved =
                    Memory.addPreference(
                        "favorite_game",
                        game
                    );

                if (saved) {

                    return {
                        response:
                            `Tamam. Favori oyununu ${game} olarak hafızama kaydettim.`
                    };

                }

            }

            return {
                response:
                    "Favori oyununu kaydetmeye çalıştım fakat hafıza kaydı başarısız oldu."
            };

        }


        /*
         * ==========================================
         * 4. FAVORİ OYUN SORGUSU
         * ==========================================
         */

        if (
            normalized === "favori oyunum ne" ||
            normalized === "favori oyunum nedir" ||
            normalized === "en sevdiğim oyun ne" ||
            normalized === "en sevdiğim oyun nedir"
        ) {

            const game =
                typeof Memory !== "undefined" &&
                typeof Memory.getPreference === "function"
                    ? Memory.getPreference("favorite_game")
                    : null;

            if (game) {

                return {
                    response:
                        `Favori oyununun ${game} olduğunu hatırlıyorum.`
                };

            }

            return {
                response:
                    "Favori oyununu henüz hafızamda bulamıyorum."
            };

        }


        /*
         * ==========================================
         * 5. YAŞADIĞI YER KAYDI
         * ==========================================
         */

        const locationMatch =
            message.match(
                /^(?:ben|benim)\s+(.+?)['’]?(?:de|da)\s+yaşıyorum[.!?]?$/iu
            );

        if (locationMatch) {

            const location =
                locationMatch[1].trim();

            if (!location) {

                return {
                    response:
                        "Yaşadığın yeri anlayamadım."
                };

            }

            if (
                typeof Memory !== "undefined" &&
                typeof Memory.addFact === "function"
            ) {

                const saved =
                    Memory.addFact(
                        "location",
                        location
                    );

                if (saved) {

                    return {
                        response:
                            `Tamam. ${location} bölgesinde yaşadığını hafızama kaydettim.`
                    };

                }

            }

            return {
                response:
                    "Yaşadığın yeri kaydetmeye çalıştım fakat hafıza kaydı başarısız oldu."
            };

        }


        /*
         * ==========================================
         * 6. YAŞADIĞI YER SORGUSU
         * ==========================================
         */

        if (
            normalized === "ben nerede yaşıyorum" ||
            normalized === "nerede yaşıyorum" ||
            normalized === "yaşadığım yer neresi"
        ) {

            const location =
                typeof Memory !== "undefined" &&
                typeof Memory.getFact === "function"
                    ? Memory.getFact("location")
                    : null;

            if (location) {

                return {
                    response:
                        `${location} bölgesinde yaşadığını hatırlıyorum.`
                };

            }

            return {
                response:
                    "Yaşadığın yeri hafızamda bulamıyorum."
            };

        }


        /*
         * ==========================================
         * 7. DOĞUM YERİ
         * ==========================================
         */

        const birthplaceMatch =
            message.match(
                /^(?:doğum yerim|doğduğum yer)\s*[:\-]?\s*(.+?)[.!?]?$/iu
            );

        if (birthplaceMatch) {

            const birthplace =
                birthplaceMatch[1].trim();

            if (
                typeof Memory !== "undefined" &&
                typeof Memory.addFact === "function"
            ) {

                const saved =
                    Memory.addFact(
                        "birthplace",
                        birthplace
                    );

                if (saved) {

                    return {
                        response:
                            `Tamam. Doğum yerini ${birthplace} olarak hafızama kaydettim.`
                    };

                }

            }

            return {
                response:
                    "Doğum yerini kaydetmeye çalıştım fakat hafıza kaydı başarısız oldu."
            };

        }


        /*
         * ==========================================
         * 8. DOĞUM YERİ SORGUSU
         * ==========================================
         */

        if (
            normalized === "doğum yerim ne" ||
            normalized === "doğum yerim neresi" ||
            normalized === "nerede doğdum"
        ) {

            const birthplace =
                typeof Memory !== "undefined" &&
                typeof Memory.getFact === "function"
                    ? Memory.getFact("birthplace")
                    : null;

            if (birthplace) {

                return {
                    response:
                        `Doğum yerinin ${birthplace} olduğunu hatırlıyorum.`
                };

            }

            return {
                response:
                    "Doğum yerini hafızamda bulamıyorum."
            };

        }


        /*
         * ==========================================
         * 9. GENEL HAFIZA SORGUSU
         * ==========================================
         */

        if (
            normalized === "benim hakkımda ne biliyorsun" ||
            normalized === "benim hakkımda ne hatırlıyorsun"
        ) {

            if (
                typeof Memory === "undefined"
            ) {

                return {
                    response:
                        "Hafıza sistemi kullanılamıyor."
                };

            }

            const name =
                typeof Memory.getName === "function"
                    ? Memory.getName()
                    : null;

            const facts =
                typeof Memory.allFacts === "function"
                    ? Memory.allFacts()
                    : {};

            const preferences =
                typeof Memory.allPreferences === "function"
                    ? Memory.allPreferences()
                    : {};

            const goals =
                typeof Memory.allGoals === "function"
                    ? Memory.allGoals()
                    : {};

            const lines = [];

            if (name) {

                lines.push(
                    `Adın: ${name}`
                );

            }

            Object.entries(facts)
                .forEach(
                    ([key, value]) => {

                        lines.push(
                            `${key}: ${value}`
                        );

                    }
                );

            Object.entries(preferences)
                .forEach(
                    ([key, value]) => {

                        lines.push(
                            `${key}: ${value}`
                        );

                    }
                );

            Object.entries(goals)
                .forEach(
                    ([key, value]) => {

                        lines.push(
                            `${key}: ${value}`
                        );

                    }
                );

            if (!lines.length) {

                return {
                    response:
                        "Hakkında hafızamda kayıtlı bilgi bulamıyorum."
                };

            }

            return {
                response:
                    "Senin hakkında hatırladıklarım:\n• " +
                    lines.join("\n• ")
            };

        }


        /*
         * ==========================================
         * 10. HAFIZA İSTATİSTİĞİ
         * ==========================================
         */

        if (
            normalized === "hafızanda kaç kayıt var" ||
            normalized === "kaç hafızan var"
        ) {

            if (
                typeof Memory !== "undefined" &&
                typeof Memory.getStats === "function"
            ) {

                const stats =
                    Memory.getStats();

                return {
                    response:
                        `Hafızamda ${stats.memories} mesaj ve ${stats.profileItems} profil bilgisi bulunuyor.`
                };

            }

            return {
                response:
                    "Hafıza istatistiklerine şu anda erişemiyorum."
            };

        }


        /*
         * ==========================================
         * 11. GENEL CEVAP
         * ==========================================
         */

        return {
            response:
                `Komutunu aldım: ${message}`
        };

    }

};


/*
 * ==========================================
 * GLOBAL ERİŞİM
 * ==========================================
 */

window.AI_CORE = AI_CORE;


console.log(
    "🤖 JARVIS AI Core aktif."
);
