"use strict";

const AI_CORE = {

    name: "JARVIS",
    version: "5.0",

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
         * =====================================
         * İSİM KAYDET
         * =====================================
         */

        if (
            lower.startsWith("benim adım") ||
            lower.startsWith("ismim")
        ) {

            const name =
                text
                    .replace(/^benim adım/i, "")
                    .replace(/^ismim/i, "")
                    .trim();

            if (name) {

                if (memoryAvailable) {

                    Memory.setName(name);

                    Memory.addFact(
                        "name",
                        name
                    );

                }

                return {
                    response:
                        `Tamam Samet. Adının ${name} olduğunu hafızama kaydettim.`
                };

            }

        }


        /*
         * =====================================
         * İSİM SORGULA
         * =====================================
         */

        if (
            lower.includes("benim adım ne") ||
            lower.includes("ismim ne")
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
                    "Adını henüz hafızamda bulamadım."
            };

        }


        /*
         * =====================================
         * FAVORİ OYUN KAYDET
         * =====================================
         */

        if (
            lower.includes("favori oyunum artık") ||
            lower.includes("favori oyunum") &&
            (
                lower.includes("gta") ||
                lower.includes("fc") ||
                lower.includes("fifa") ||
                lower.includes("pes")
            )
        ) {

            let game = null;

            const knownGames = [
                "gta 6",
                "gta vi",
                "fc 26",
                "fc 27",
                "fifa 26",
                "fifa 27",
                "pes 2021",
                "pes21"
            ];

            game =
                knownGames.find(
                    item =>
                        lower.includes(item)
                );


            if (!game) {

                const match =
                    text.match(
                        /favori oyunum(?: artık|:)?\s*(.+)/i
                    );

                if (match) {
                    game =
                        match[1].trim();
                }

            }


            if (game && memoryAvailable) {

                Memory.addPreference(
                    "favorite_game",
                    game
                );

                return {
                    response:
                        `Tamam. Favori oyununu ${game} olarak hafızama kaydettim.`
                };

            }

        }


        /*
         * =====================================
         * FAVORİ OYUN SORGULA
         * =====================================
         */

        if (
            lower.includes("favori oyunum ne") ||
            lower.includes("en sevdiğim oyun ne") ||
            lower.includes("favori oyunum nedir")
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
         * =====================================
         * FAVORİ RENK KAYDET
         * =====================================
         */

        if (
            lower.includes("en sevdiğim renk") &&
            (
                lower.includes("mavi") ||
                lower.includes("kırmızı") ||
                lower.includes("yeşil") ||
                lower.includes("sarı") ||
                lower.includes("siyah") ||
                lower.includes("beyaz") ||
                lower.includes("mor") ||
                lower.includes("turuncu") ||
                lower.includes("pembe")
            )
        ) {

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

            const color =
                colors.find(
                    c => lower.includes(c)
                );


            if (memoryAvailable) {

                Memory.addPreference(
                    "favorite_color",
                    color
                );

            }

            return {
                response:
                    `Tamam. En sevdiğin rengin ${color} olduğunu hafızama kaydettim.`
            };

        }


        /*
         * =====================================
         * FAVORİ RENK SORGULA
         * =====================================
         */

        if (
            lower.includes("en sevdiğim renk") ||
            lower.includes("sevdiğim renk ne")
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
                    "En sevdiğin rengi henüz bilmiyorum."
            };

        }


        /*
         * =====================================
         * YAŞADIĞI YERİ KAYDET
         * =====================================
         */

        if (
            lower.includes("izmir'de yaşıyorum") ||
            lower.includes("izmirde yaşıyorum") ||
            lower.includes("istanbul'da yaşıyorum") ||
            lower.includes("istanbulda yaşıyorum") ||
            lower.includes("ankara'da yaşıyorum") ||
            lower.includes("ankarada yaşıyorum")
        ) {

            let location = null;

            if (
                lower.includes("izmir")
            ) {
                location = "İzmir";
            }

            if (
                lower.includes("istanbul")
            ) {
                location = "İstanbul";
            }

            if (
                lower.includes("ankara")
            ) {
                location = "Ankara";
            }


            if (location && memoryAvailable) {

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
         * =====================================
         * YAŞADIĞI YERİ SOR
         * =====================================
         */

        if (
            lower.includes("nerede yaşıyorum") ||
            lower.includes("hangi şehirde yaşıyorum")
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
         * =====================================
         * İŞLETME KAYDET
         * =====================================
         */

        if (
            lower.includes("playstation salonu işletiyorum") ||
            lower.includes("playstation salonum var") ||
            lower.includes("ps salonu işletiyorum")
        ) {

            if (memoryAvailable) {

                Memory.addFact(
                    "business",
                    "PlayStation salonu işletiyor."
                );

            }

            return {
                response:
                    "Tamam. PlayStation salonu işlettiğini hafızama kaydettim."
            };

        }


        /*
         * =====================================
         * İŞLETMEYİ SOR
         * =====================================
         */

        if (
            lower.includes("işletmem hakkında ne biliyorsun") ||
            lower.includes("salonum hakkında ne biliyorsun")
        ) {

            if (memoryAvailable) {

                const business =
                    Memory.getFact(
                        "business"
                    );

                if (business) {

                    return {
                        response:
                            `İşletmen hakkında hatırladığım: ${business}`
                    };

                }

            }

            return {
                response:
                    "İşletmen hakkında henüz kayıtlı bir bilgim yok."
            };

        }


        /*
         * =====================================
         * GENEL HAFIZA
         * =====================================
         */

        if (
            lower.includes("hafızanda ne var") ||
            lower.includes("benim hakkımda ne biliyorsun") ||
            lower.includes("beni ne kadar tanıyorsun")
        ) {

            if (memoryAvailable) {

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

                const business =
                    Memory.getFact(
                        "business"
                    );


                const facts = [];


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

                if (business) {
                    facts.push(
                        `İşletme: ${business}`
                    );
                }


                if (facts.length > 0) {

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
                    "Henüz senin hakkında yeterli kayıt yok."
            };

        }


        /*
         * =====================================
         * HATIRLA
         * =====================================
         */

        if (
            lower.includes("hatırla") ||
            lower.includes("unutma")
        ) {

            return {
                response:
                    "Tamam. Bunu hafızamda tutacağım."
            };

        }


        /*
         * =====================================
         * SELAM
         * =====================================
         */

        if (
            lower.includes("merhaba") ||
            lower.includes("selam")
        ) {

            return {
                response:
                    "Merhaba Samet. Sistemler çevrimiçi. Seni dinliyorum."
            };

        }


        /*
         * =====================================
         * NASILSIN
         * =====================================
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
         * =====================================
         * KİMSİN
         * =====================================
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
         * =====================================
         * GENEL CEVAP
         * =====================================
         */

        return {
            response:
                `Komutunu aldım: ${text}`
        };

    }

};


console.log(
    "🤖 JARVIS AI Core v5.0 aktif."
);
