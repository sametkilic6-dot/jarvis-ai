"use strict";

const AI_CORE = {

    name: "JARVIS",
    version: "9.0",

    async think(input) {

        const text = String(input || "").trim();

        if (!text) {
            return {
                response: "Dinliyorum Samet."
            };
        }

        const lower = text.toLowerCase();

        const memoryAvailable =
            typeof Memory !== "undefined";


        /*
         * =========================
         * YARDIMCI FONKSİYONLAR
         * =========================
         */

        const savePersonal = (key, value) => {

            if (
                memoryAvailable &&
                value
            ) {
                Memory.addPersonal(
                    key,
                    String(value).trim()
                );
            }

        };


        const savePreference = (key, value) => {

            if (
                memoryAvailable &&
                value
            ) {
                Memory.addPreference(
                    key,
                    String(value).trim()
                );
            }

        };


        const saveFact = (key, value) => {

            if (
                memoryAvailable &&
                value
            ) {
                Memory.addFact(
                    key,
                    String(value).trim()
                );
            }

        };


        const saveGoal = (key, value) => {

            if (
                memoryAvailable &&
                value
            ) {
                Memory.addGoal(
                    key,
                    String(value).trim()
                );
            }

        };


        /*
         * =========================
         * SORU KONTROLÜ
         * =========================
         */

        const isQuestion =
            lower.includes("?") ||
            /^(ne|nerede|nasıl|hangi|kim|kaç|neden|niçin)\b/i.test(
                lower
            );


        /*
         * =========================
         * İSİM SORGULA
         * =========================
         */

        if (
            lower.includes("benim adım ne") ||
            lower.includes("ismim ne")
        ) {

            const name =
                memoryAvailable
                    ? Memory.getName()
                    : null;

            return {
                response: name
                    ? `Senin adın ${name}. Bunu hatırlıyorum.`
                    : "Adını henüz hafızamda bulamadım."
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

            if (name) {

                if (memoryAvailable) {

                    Memory.setName(name);

                    savePersonal(
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
         * =========================
         * GERÇEK DOĞUM TARİHİ
         * =========================
         */

        const realBirthMatch =
            text.match(
                /(?:gerçek doğum tarihim|normal doğum tarihim)\s*:?\s*(\d{1,2}[./]\d{1,2}[./]\d{4})/i
            );

        if (realBirthMatch) {

            const date =
                realBirthMatch[1];

            savePersonal(
                "real_birth_date",
                date
            );

            return {
                response:
                    `Tamam. Gerçek doğum tarihini ${date} olarak kaydettim.`
            };

        }


        /*
         * =========================
         * KİMLİK DOĞUM TARİHİ
         * =========================
         */

        const idBirthMatch =
            text.match(
                /(?:kimlikte|kimlikte kayıtlı|resmî kayıtlarda|resmi kayıtlarda)\s*(?:doğum tarihim|tarih)\s*:?\s*(\d{1,2}[./]\d{1,2}[./]\d{4})/i
            );

        if (idBirthMatch) {

            const date =
                idBirthMatch[1];

            savePersonal(
                "id_birth_date",
                date
            );

            return {
                response:
                    `Tamam. Kimlikte kayıtlı doğum tarihini ${date} olarak kaydettim.`
            };

        }


        /*
         * =========================
         * DOĞUM TARİHİ SORGULARI
         * =========================
         */

        if (
            lower.includes("gerçek doğum tarihim ne") ||
            lower.includes("normal doğum tarihim ne")
        ) {

            const date =
                memoryAvailable
                    ? Memory.getPersonal(
                        "real_birth_date"
                    )
                    : null;

            return {
                response: date
                    ? `Gerçek doğum tarihin ${date}.`
                    : "Gerçek doğum tarihini henüz bilmiyorum."
            };

        }


        if (
            lower.includes("kimlikte doğum tarihim ne") ||
            lower.includes("kimlikte kayıtlı doğum tarihim ne")
        ) {

            const date =
                memoryAvailable
                    ? Memory.getPersonal(
                        "id_birth_date"
                    )
                    : null;

            return {
                response: date
                    ? `Kimlikte kayıtlı doğum tarihin ${date}.`
                    : "Kimlikte kayıtlı doğum tarihini henüz bilmiyorum."
            };

        }


        /*
         * =========================
         * GENEL DOĞUM TARİHİ
         * =========================
         */

        const birthDateMatch =
            text.match(
                /(?:benim doğum tarihim|doğum tarihim)\s*:?\s*(\d{1,2}[./]\d{1,2}[./]\d{4})/i
            );

        if (
            !isQuestion &&
            birthDateMatch
        ) {

            const date =
                birthDateMatch[1];

            savePersonal(
                "id_birth_date",
                date
            );

            return {
                response:
                    `Tamam. Doğum tarihini ${date} olarak hafızama kaydettim.`
            };

        }


        /*
         * =========================
         * DOĞUM YERİ
         * =========================
         */

        const birthPlaceMatch =
            text.match(
                /(?:benim\s+)?doğum yerim\s+([^.!?,]+)/i
            );

        if (
            !isQuestion &&
            birthPlaceMatch
        ) {

            const place =
                birthPlaceMatch[1]
                    .trim();

            savePersonal(
                "birth_place",
                place
            );

        }


        if (
            lower.includes("doğum yerim neresi") ||
            lower.includes("nerede doğdum")
        ) {

            const place =
                memoryAvailable
                    ? Memory.getPersonal(
                        "birth_place"
                    )
                    : null;

            return {
                response: place
                    ? `Doğum yerin ${place}.`
                    : "Doğum yerini henüz bilmiyorum."
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
            !isQuestion &&
            (
                lower.includes("en sevdiğim renk") ||
                lower.includes("favori rengim")
            )
        ) {

            const color =
                colors.find(
                    item =>
                        lower.includes(item)
                );

            if (color) {

                savePreference(
                    "favorite_color",
                    color
                );

            }

        }


        if (
            lower.includes("en sevdiğim renk ne") ||
            lower.includes("favori rengim ne")
        ) {

            const color =
                memoryAvailable
                    ? Memory.getPreference(
                        "favorite_color"
                    )
                    : null;

            return {
                response: color
                    ? `En sevdiğin renk ${color}.`
                    : "En sevdiğin rengi henüz bilmiyorum."
            };

        }


        /*
         * =========================
         * FAVORİ OYUN
         * =========================
         */

        const gameMatch =
            text.match(
                /(?:en sevdiğim oyun|favori oyunum)\s*(?:ise|:)?\s*([^.!?]+)/i
            );

        if (
            !isQuestion &&
            gameMatch &&
            !lower.includes("ne")
        ) {

            const game =
                gameMatch[1]
                    .trim();

            savePreference(
                "favorite_game",
                game
            );

        }


        if (
            lower.includes("en sevdiğim oyun ne") ||
            lower.includes("favori oyunum ne")
        ) {

            const game =
                memoryAvailable
                    ? Memory.getPreference(
                        "favorite_game"
                    )
                    : null;

            return {
                response: game
                    ? `Favori oyunun ${game}.`
                    : "Favori oyununu henüz bilmiyorum."
            };

        }


        /*
         * =========================
         * YAŞADIĞIN YER
         * =========================
         */

        if (
            lower.includes("nerede yaşıyorum") ||
            lower.includes("hangi şehirde yaşıyorum")
        ) {

            const location =
                memoryAvailable
                    ? Memory.getFact(
                        "location"
                    )
                    : null;

            return {
                response: location
                    ? `${location} bölgesinde yaşadığını hatırlıyorum.`
                    : "Yaşadığın yeri henüz bilmiyorum."
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

            saveFact(
                "location",
                location
            );

        }


        /*
         * =========================
         * MESLEK
         * =========================
         */

        const jobMatch =
            text.match(
                /(?:benim mesleğim|mesleğim)\s*:?\s*([^.!?]+)/i
            );

        if (
            !isQuestion &&
            jobMatch
        ) {

            const job =
                jobMatch[1]
                    .trim();

            savePersonal(
                "job",
                job
            );

        }


        /*
         * =========================
         * HEDEF
         * =========================
         */

        const goalMatch =
            text.match(
                /(?:hedefim|amacım)\s*:?\s*([^.!?]+)/i
            );

        if (
            !isQuestion &&
            goalMatch
        ) {

            const goal =
                goalMatch[1]
                    .trim();

            saveGoal(
                "main_goal",
                goal
            );

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

            saveFact(
                "business",
                "PlayStation salonu işletiyor."
            );

        }


        /*
         * =========================
         * GENEL HAFIZA
         * =========================
         */

        if (
            lower.includes("hafızanda ne var") ||
            lower.includes("hafızamda ne var") ||
            lower.includes("benim hakkımda ne biliyorsun")
        ) {

            const result = [];

            if (memoryAvailable) {

                const name =
                    Memory.getName();

                const realBirthDate =
                    Memory.getPersonal(
                        "real_birth_date"
                    );

                const idBirthDate =
                    Memory.getPersonal(
                        "id_birth_date"
                    );

                const birthPlace =
                    Memory.getPersonal(
                        "birth_place"
                    );

                const job =
                    Memory.getPersonal(
                        "job"
                    );

                const location =
                    Memory.getFact(
                        "location"
                    );

                const color =
                    Memory.getPreference(
                        "favorite_color"
                    );

                const game =
                    Memory.getPreference(
                        "favorite_game"
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

                if (realBirthDate)
                    result.push(
                        `Gerçek doğum tarihin: ${realBirthDate}`
                    );

                if (idBirthDate)
                    result.push(
                        `Kimlikte kayıtlı doğum tarihin: ${idBirthDate}`
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

            }


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

            return {
                response:
                    "Henüz senin hakkında kayıtlı yeterli bilgi yok."
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
         * GENEL CEVAP
         * =========================
         */

        return {
            response:
                `Komutunu aldım: ${text}`
        };

    }

};


console.log(
    "🤖 JARVIS AI Core v9.0 aktif."
);
