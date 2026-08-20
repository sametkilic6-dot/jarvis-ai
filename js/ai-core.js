"use strict";

const AI_CORE = {

    name: "JARVIS",
    version: "8.0",

    async think(input) {

        const text =
            String(input || "").trim();

        if (!text) {

            return {
                response: "Dinliyorum Samet."
            };

        }

        const lower =
            text.toLowerCase();

        const memoryAvailable =
            typeof Memory !== "undefined";


        /*
         * =========================
         * SORU KONTROLÜ
         * =========================
         */

        const isQuestion =
            lower.includes("?") ||
            /^(ne|nerede|nasıl|hangi|kim|kaç|neden|niçin)\b/i.test(lower);


        /*
         * =========================
         * İSİM SORGULA
         * =========================
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
         * =========================
         * İSİM KAYDET
         * =========================
         */

        if (
            !isQuestion &&
            (
                lower.startsWith("benim adım") ||
                lower.startsWith("ismim")
            )
        ) {

            const name =
                text
                    .replace(/^benim adım/i, "")
                    .replace(/^ismim/i, "")
                    .trim();

            if (name && memoryAvailable) {

                Memory.setName(name);

                Memory.addPersonal(
                    "name",
                    name
                );

                return {
                    response:
                        `Tamam. Adının ${name} olduğunu hafızama kaydettim.`
                };

            }

        }


        /*
         * =========================
         * DOĞUM TARİHİ KAYDET
         * =========================
         */

        const birthDateMatch =
            text.match(
                /(?:doğum tarihim|doğum günüm)\s*(?:de|:)?\s*(\d{1,2}[./]\d{1,2}[./]\d{4})/i
            );

        if (
            !isQuestion &&
            birthDateMatch
        ) {

            const birthDate =
                birthDateMatch[1];

            if (memoryAvailable) {

                Memory.addPersonal(
                    "birth_date",
                    birthDate
                );

            }

            return {
                response:
                    `Tamam. Doğum tarihini ${birthDate} olarak hafızama kaydettim.`
            };

        }


        /*
         * =========================
         * DOĞUM TARİHİ SORGULA
         * =========================
         */

        if (
            lower.includes("doğum tarihim ne") ||
            lower.includes("doğum günüm ne")
        ) {

            if (memoryAvailable) {

                const birthDate =
                    Memory.getPersonal(
                        "birth_date"
                    );

                if (birthDate) {

                    return {
                        response:
                            `Doğum tarihin ${birthDate}. Bunu hatırlıyorum.`
                    };

                }

            }

            return {
                response:
                    "Doğum tarihini henüz bilmiyorum."
            };

        }


        /*
         * =========================
         * DOĞUM YERİ KAYDET
         * =========================
         */

        const birthPlaceMatch =
            text.match(
                /doğum yerim\s+(.+)/i
            );

        if (
            !isQuestion &&
            birthPlaceMatch
        ) {

            const birthPlace =
                birthPlaceMatch[1]
                    .trim()
                    .replace(/[.!]+$/, "");

            if (memoryAvailable) {

                Memory.addPersonal(
                    "birth_place",
                    birthPlace
                );

            }

            return {
                response:
                    `Tamam. Doğum yerini ${birthPlace} olarak hafızama kaydettim.`
            };

        }


        /*
         * =========================
         * DOĞUM YERİ SORGULA
         * =========================
         */

        if (
            lower.includes("doğum yerim neresi") ||
            lower.includes("nerede doğdum")
        ) {

            if (memoryAvailable) {

                const birthPlace =
                    Memory.getPersonal(
                        "birth_place"
                    );

                if (birthPlace) {

                    return {
                        response:
                            `Doğum yerin ${birthPlace}. Bunu hatırlıyorum.`
                    };

                }

            }

            return {
                response:
                    "Doğum yerini henüz bilmiyorum."
            };

        }


        /*
         * =========================
         * FAVORİ RENK
         * =========================
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
            lower.includes("en sevdiğim renk ne") ||
            lower.includes("favori rengim ne")
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


        if (
            !isQuestion &&
            (
                lower.includes("en sevdiğim renk") ||
                lower.includes("favori rengim")
            ) &&
            colors.some(
                color =>
                    lower.includes(color)
            )
        ) {

            const color =
                colors.find(
                    color =>
                        lower.includes(color)
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
         * =========================
         * YAŞAM YERİ
         * =========================
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
                    "Yaşadığın yeri henüz bilmiyorum."
            };

        }


        const locationMatch =
            text.match(
                /^(?:ben\s+)?(.+?)['’]?(?:de|da|te|ta)\s+yaşıyorum(?:[.!])?$/i
            );

        if (
            !isQuestion &&
            locationMatch
        ) {

            const location =
                locationMatch[1]
                    .trim();

            if (
                location &&
                memoryAvailable
            ) {

                Memory.addFact(
                    "location",
                    location
                );

            }

            return {
                response:
                    `Tamam. ${location} bölgesinde yaşadığını hafızama kaydettim.`
            };

        }


        /*
         * =========================
         * MESLEK
         * =========================
         */

        const jobMatch =
            text.match(
                /^(?:ben\s+)?(.+?)\s+(?:olarak\s+)?çalışıyorum[.!]?$/i
            );

        if (
            !isQuestion &&
            jobMatch
        ) {

            const job =
                jobMatch[1]
                    .trim();

            if (
                job &&
                memoryAvailable
            ) {

                Memory.addPersonal(
                    "job",
                    job
                );

            }

            return {
                response:
                    `Tamam. ${job} olarak çalıştığını hafızama kaydettim.`
            };

        }


        /*
         * =========================
         * FAVORİ OYUN
         * =========================
         */

        const gameMatch =
            text.match(
                /(?:en sevdiğim oyun|favori oyunum)\s+(?:ise\s+)?(.+)/i
            );

        if (
            !isQuestion &&
            gameMatch
        ) {

            const game =
                gameMatch[1]
                    .trim()
                    .replace(/[.!]+$/, "");

            if (memoryAvailable) {

                Memory.addPreference(
                    "favorite_game",
                    game
                );

            }

            return {
                response:
                    `Tamam. Favori oyununun ${game} olduğunu hafızama kaydettim.`
            };

        }


        /*
         * =========================
         * FAVORİ OYUN SORGULA
         * =========================
         */

        if (
            lower.includes("en sevdiğim oyun ne") ||
            lower.includes("favori oyunum ne")
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
                    "Favori oyununu henüz bilmiyorum."
            };

        }


        /*
         * =========================
         * HEDEF KAYDET
         * =========================
         */

        const goalMatch =
            text.match(
                /^(?:hedefim|hedefim şu|amacım)\s*:?\s*(.+)$/i
            );

        if (
            !isQuestion &&
            goalMatch
        ) {

            const goal =
                goalMatch[1]
                    .trim()
                    .replace(/[.!]+$/, "");

            if (memoryAvailable) {

                Memory.addGoal(
                    "main_goal",
                    goal
                );

            }

            return {
                response:
                    `Tamam. Hedefini hafızama kaydettim: ${goal}`
            };

        }


        /*
         * =========================
         * HEDEF SORGULA
         * =========================
         */

        if (
            lower.includes("hedefim ne") ||
            lower.includes("amacım ne")
        ) {

            if (memoryAvailable) {

                const goal =
                    Memory.getGoal(
                        "main_goal"
                    );

                if (goal) {

                    return {
                        response:
                            `Hedefin: ${goal}. Bunu hatırlıyorum.`
                    };

                }

            }

            return {
                response:
                    "Hedefini henüz bilmiyorum."
            };

        }


        /*
         * =========================
         * PLAYSTATION SALONU
         * =========================
         */

        if (
            !isQuestion &&
            (
                lower.includes("playstation salonu işletiyorum") ||
                lower.includes("playstation salonum var") ||
                lower.includes("ps salonu işletiyorum")
            )
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
         * =========================
         * HAFIZA SORGULA
         * =========================
         */

        if (
            lower.includes("hafızanda ne var") ||
            lower.includes("hafızamda ne var") ||
            lower.includes("benim hakkımda ne biliyorsun")
        ) {

            if (memoryAvailable) {

                const result = [];


                const name =
                    Memory.getName();

                const birthDate =
                    Memory.getPersonal(
                        "birth_date"
                    );

                const birthPlace =
                    Memory.getPersonal(
                        "birth_place"
                    );

                const job =
                    Memory.getPersonal(
                        "job"
                    );

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

                const goal =
                    Memory.getGoal(
                        "main_goal"
                    );


                if (name)
                    result.push(
                        `Adın: ${name}`
                    );

                if (birthDate)
                    result.push(
                        `Doğum tarihin: ${birthDate}`
                    );

                if (birthPlace)
                    result.push(
                        `Doğum yerin: ${birthPlace}`
                    );

                if (job)
                    result.push(
                        `Mesleğin: ${job}`
                    );

                if (location)
                    result.push(
                        `Yaşadığın yer: ${location}`
                    );

                if (color)
                    result.push(
                        `En sevdiğin renk: ${color}`
                    );

                if (game)
                    result.push(
                        `Favori oyunun: ${game}`
                    );

                if (business)
                    result.push(
                        `İşletme: ${business}`
                    );

                if (goal)
                    result.push(
                        `Hedefin: ${goal}`
                    );


                if (result.length) {

                    return {
                        response:
                            "Senin hakkında hatırladıklarım:\n\n" +
                            result
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
                    "Henüz senin hakkında kayıtlı yeterli bilgi yok."
            };

        }


        /*
         * =========================
         * HATIRLA
         * =========================
         */

        if (
            lower.includes("hatırla") ||
            lower.includes("unutma")
        ) {

            return {
                response:
                    "Bunu hangi bilgi olarak kaydetmemi istediğini açıkça söyle."
            };

        }


        /*
         * =========================
         * SELAM
         * =========================
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
         * =========================
         * NASILSIN
         * =========================
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
         * =========================
         * KİMSİN
         * =========================
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
         * =========================
         * GENEL
         * =========================
         */

        return {
            response:
                `Komutunu aldım: ${text}`
        };

    }

};


console.log(
    "🤖 JARVIS AI Core v8.0 aktif."
);
