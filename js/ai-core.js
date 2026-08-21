"use strict";

const AI_CORE = {

    name: "JARVIS",
    version: "6.0",

    async think(input) {

        const text =
            String(input || "").trim();

        if (!text) {
            return {
                response: "Dinliyorum Samet."
            };
        }

        const lower =
            text.toLocaleLowerCase("tr-TR");

        const memoryAvailable =
            typeof Memory !== "undefined";


        /*
         * ==================================================
         * 1. FAVORİ OYUN SORUSU
         * ==================================================
         *
         * BU KISIM KAYIT YAPMAZ.
         */

        if (
            lower === "favori oyunum ne" ||
            lower === "favori oyunum ne?" ||
            lower === "favori oyunum nedir" ||
            lower === "favori oyunum nedir?" ||
            lower === "en sevdiğim oyun ne" ||
            lower === "en sevdiğim oyun ne?"
        ) {

            if (memoryAvailable) {

                const game =
                    Memory.getPreference(
                        "favorite_game"
                    );

                if (game) {

                    return {
                        response:
                            `Favori oyunun ${game}. Bunu hatırlıyorum.`
                    };

                }

            }

            return {
                response:
                    "Favori oyununu henüz hafızamda bulamıyorum."
            };

        }


        /*
         * ==================================================
         * 2. FAVORİ OYUN KAYDI
         * ==================================================
         *
         * SADECE KULLANICI GERÇEKTEN BİR OYUN SÖYLÜYORSA
         * KAYIT YAP.
         */

        const gameSaveMatch =
            text.match(
                /^favori oyunum(?: artık|:)?\s+(.+?)[.!]?$/iu
            );


        if (
            gameSaveMatch &&
            !lower.includes("ne?")
        ) {

            let game =
                gameSaveMatch[1].trim();


            /*
             * Soru kelimelerini hiçbir zaman
             * oyun adı olarak kabul etme.
             */

            const invalid =
                [
                    "ne",
                    "ne.",
                    "nedir",
                    "nedir.",
                    "hangi",
                    "hangi."
                ];


            if (
                !invalid.includes(
                    game.toLocaleLowerCase("tr-TR")
                )
            ) {

                if (memoryAvailable) {

                    Memory.addPreference(
                        "favorite_game",
                        game
                    );

                }

                return {
                    response:
                        `Tamam. Favori oyununu ${game} olarak hafızama kaydettim.`
                };

            }

        }


        /*
         * ==================================================
         * 3. FAVORİ RENK SORUSU
         * ==================================================
         */

        if (
            lower === "en sevdiğim renk ne" ||
            lower === "en sevdiğim renk ne?" ||
            lower === "sevdiğim renk ne" ||
            lower === "sevdiğim renk ne?"
        ) {

            if (memoryAvailable) {

                const color =
                    Memory.getPreference(
                        "favorite_color"
                    );

                if (color) {

                    return {
                        response:
                            `En sevdiğin renk ${color}. Bunu hatırlıyorum.`
                    };

                }

            }

            return {
                response:
                    "En sevdiğin rengi henüz hafızamda bulamıyorum."
            };

        }


        /*
         * ==================================================
         * 4. FAVORİ RENK KAYDI
         * ==================================================
         */

        const colors = [
            "mavi",
            "kırmızı",
            "yeşil",
            "sarı",
            "siyah",
            "beyaz",
            "mor",
            "turuncu",
            "pembe"
        ];


        if (
            lower.includes("en sevdiğim renk")
        ) {

            const color =
                colors.find(
                    c =>
                        lower.includes(c)
                );


            if (color && memoryAvailable) {

                Memory.addPreference(
                    "favorite_color",
                    color
                );

                return {
                    response:
                        `Tamam. En sevdiğin rengin ${color} olduğunu hafızama kaydettim.`
                };

            }

        }


        /*
         * ==================================================
         * 5. İSİM SORUSU
         * ==================================================
         */

        if (
            lower === "benim adım ne" ||
            lower === "benim adım ne?" ||
            lower === "ismim ne" ||
            lower === "ismim ne?"
        ) {

            if (memoryAvailable) {

                const name =
                    Memory.getName();

                if (name) {

                    return {
                        response:
                            `Senin adın ${name}. Bunu hatırlıyorum.`
                    };

                }

            }

            return {
                response:
                    "Adını henüz hafızamda bulamıyorum."
            };

        }


        /*
         * ==================================================
         * 6. İSİM KAYDI
         * ==================================================
         */

        if (
            lower.startsWith("benim adım ") ||
            lower.startsWith("ismim ")
        ) {

            const name =
                text
                    .replace(/^benim adım\s+/iu, "")
                    .replace(/^ismim\s+/iu, "")
                    .trim();


            if (name) {

                if (memoryAvailable) {

                    Memory.setName(
                        name
                    );

                    Memory.addFact(
                        "name",
                        name
                    );

                }

                return {
                    response:
                        `Tamam. Adının ${name} olduğunu hafızama kaydettim.`
                };

            }

        }


        /*
         * ==================================================
         * 7. YAŞADIĞI YER SORUSU
         * ==================================================
         */

        if (
            lower === "nerede yaşıyorum" ||
            lower === "nerede yaşıyorum?" ||
            lower === "hangi şehirde yaşıyorum" ||
            lower === "hangi şehirde yaşıyorum?"
        ) {

            if (memoryAvailable) {

                const location =
                    Memory.getFact(
                        "location"
                    );

                if (location) {

                    return {
                        response:
                            `${location} bölgesinde yaşadığını hatırlıyorum.`
                    };

                }

            }

            return {
                response:
                    "Yaşadığın yeri hafızamda bulamıyorum."
            };

        }


        /*
         * ==================================================
         * 8. YAŞADIĞI YER KAYDI
         * ==================================================
         */

        const locationMatch =
            text.match(
                /^ben\s+(.+?)['’]?(?:de|da)\s+yaşıyorum[.!]?$/iu
            );


        if (locationMatch) {

            const location =
                locationMatch[1].trim();


            if (
                location &&
                memoryAvailable
            ) {

                Memory.addFact(
                    "location",
                    location
                );

                return {
                    response:
                        `Tamam. ${location} bölgesinde yaşadığını hafızama kaydettim.`
                };

            }

        }


        /*
         * ==================================================
         * 9. GENEL HAFIZA
         * ==================================================
         */

        if (
            lower.includes("benim hakkımda ne biliyorsun") ||
            lower.includes("hafızanda ne var") ||
            lower.includes("hafızamda ne var")
        ) {

            if (memoryAvailable) {

                const facts = [];


                const name =
                    Memory.getName();

                const color =
                    Memory.getPreference(
                        "favorite_color"
                    );

                const game =
                    Memory.getPreference(
                        "favorite_game"
                    );

                const location =
                    Memory.getFact(
                        "location"
                    );


                if (name) {
                    facts.push(
                        `Adın: ${name}`
                    );
                }

                if (color) {
                    facts.push(
                        `En sevdiğin renk: ${color}`
                    );
                }

                if (game) {
                    facts.push(
                        `Favori oyunun: ${game}`
                    );
                }

                if (location) {
                    facts.push(
                        `Yaşadığın yer: ${location}`
                    );
                }


                if (facts.length) {

                    return {
                        response:
                            "Senin hakkında hatırladıklarım:\n\n" +
                            facts
                                .map(
                                    item =>
                                        "• " + item
                                )
                                .join("\n")
                    };

                }

            }

            return {
                response:
                    "Hafızamda senin hakkında kayıtlı bilgi bulunmuyor."
            };

        }


        /*
         * ==================================================
         * 10. SELAM
         * ==================================================
         */

        if (
            lower === "merhaba" ||
            lower === "selam"
        ) {

            return {
                response:
                    "Merhaba Samet. Sistemler çevrimiçi. Seni dinliyorum."
            };

        }


        /*
         * ==================================================
         * 11. NASILSIN
         * ==================================================
         */

        if (
            lower.includes("nasılsın")
        ) {

            return {
                response:
                    "Sistemlerim stabil. Hazırım."
            };

        }


        /*
         * ==================================================
         * 12. KİMSİN
         * ==================================================
         */

        if (
            lower.includes("kimsin")
        ) {

            return {
                response:
                    "Ben JARVIS. Türkçe çalışan kişisel yapay zekâ asistanınım."
            };

        }


        /*
         * ==================================================
         * 13. GENEL CEVAP
         * ==================================================
         */

        return {
            response:
                `Komutunu aldım: ${text}`
        };

    }

};


console.log(
    "🤖 JARVIS AI Core v6.0 aktif."
);
