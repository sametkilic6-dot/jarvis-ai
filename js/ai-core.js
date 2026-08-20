"use strict";

const AI_CORE = {

    name: "JARVIS",
    version: "10.0",

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
         * ==================================================
         * YARDIMCI FONKSİYONLAR
         * ==================================================
         */

        function savePersonal(key, value) {

            if (
                memoryAvailable &&
                value &&
                String(value).trim()
            ) {

                Memory.addPersonal(
                    key,
                    String(value).trim()
                );

                return true;
            }

            return false;
        }


        function savePreference(key, value) {

            if (
                memoryAvailable &&
                value &&
                String(value).trim()
            ) {

                Memory.addPreference(
                    key,
                    String(value).trim()
                );

                return true;
            }

            return false;
        }


        function saveFact(key, value) {

            if (
                memoryAvailable &&
                value &&
                String(value).trim()
            ) {

                Memory.addFact(
                    key,
                    String(value).trim()
                );

                return true;
            }

            return false;
        }


        function saveGoal(key, value) {

            if (
                memoryAvailable &&
                value &&
                String(value).trim()
            ) {

                Memory.addGoal(
                    key,
                    String(value).trim()
                );

                return true;
            }

            return false;
        }


        /*
         * ==================================================
         * SORU MU?
         * ==================================================
         */

        const isQuestion =
            lower.includes("?") ||
            /^(ne|nerede|nasıl|hangi|kim|kaç|neden|niçin)\b/i.test(
                lower
            );


        /*
         * ==================================================
         * SORGULAR
         * ==================================================
         */

        if (
            lower.includes("benim hakkımda ne biliyorsun") ||
            lower.includes("hafızanda ne var") ||
            lower.includes("hafızamda ne var")
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


                if (name) {

                    result.push(
                        `Adın: ${name}`
                    );

                }


                if (realBirthDate) {

                    result.push(
                        `Gerçek doğum tarihin: ${realBirthDate}`
                    );

                }


                if (idBirthDate) {

                    result.push(
                        `Kimlikte kayıtlı doğum tarihin: ${idBirthDate}`
                    );

                }


                if (birthPlace) {

                    result.push(
                        `Doğum yerin: ${birthPlace}`
                    );

                }


                if (job) {

                    result.push(
                        `Mesleğin: ${job}`
                    );

                }


                if (location) {

                    result.push(
                        `Yaşadığın yer: ${location}`
                    );

                }


                if (color) {

                    result.push(
                        `En sevdiğin renk: ${color}`
                    );

                }


                if (game) {

                    result.push(
                        `Favori oyunun: ${game}`
                    );

                }


                if (business) {

                    result.push(
                        `İşletme: ${business}`
                    );

                }


                if (goal) {

                    result.push(
                        `Hedefin: ${goal}`
                    );

                }

            }


            if (result.length > 0) {

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
                    "Henüz senin hakkında kayıtlı bilgi yok."
            };

        }


        /*
         * ==================================================
         * İSİM SORGULA
         * ==================================================
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
                    ? `Senin adın ${name}.`
                    : "Adını henüz bilmiyorum."
            };

        }


        /*
         * ==================================================
         * DOĞUM TARİHİ SORGULA
         * ==================================================
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
         * ==================================================
         * DOĞUM YERİ SORGULA
         * ==================================================
         */

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
         * ==================================================
         * FAVORİ OYUN SORGULA
         * ==================================================
         */

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
         * ==================================================
         * HEDEF SORGULA
         * ==================================================
         */

        if (
            lower.includes("hedefim ne") ||
            lower.includes("amacım ne")
        ) {

            const goal =
                memoryAvailable
                    ? Memory.getGoal(
                        "main_goal"
                    )
                    : null;

            return {
                response: goal
                    ? `Hedefin: ${goal}.`
                    : "Hedefini henüz bilmiyorum."
            };

        }


        /*
         * ==================================================
         * YAŞADIĞI YERİ SORGULA
         * ==================================================
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


        /*
         * ==================================================
         * ŞİMDİ KAYITLARI TOPLA
         * ==================================================
         */

        const savedItems = [];


        /*
         * ==================================================
         * İSİM
         * ==================================================
         */

        if (
            !isQuestion &&
            (
                lower.includes("benim adım") ||
                lower.includes("ismim")
            )
        ) {

            const match =
                text.match(
                    /(?:benim adım|ismim)\s+([A-Za-zÇĞİÖŞÜçğıöşü]+(?:\s+[A-Za-zÇĞİÖŞÜçğıöşü]+)*)/i
                );

            if (match) {

                const name =
                    match[1]
                        .trim()
                        .replace(/[.!?]+$/, "");

                if (name) {

                    if (memoryAvailable) {

                        Memory.setName(name);

                        savePersonal(
                            "name",
                            name
                        );

                    }

                    savedItems.push(
                        `Adın: ${name}`
                    );

                }

            }

        }


        /*
         * ==================================================
         * GERÇEK DOĞUM TARİHİ
         * ==================================================
         */

        const realBirth =
            text.match(
                /gerçek doğum tarihim\s*:?\s*(\d{1,2}[./]\d{1,2}[./]\d{4})/i
            );


        if (realBirth) {

            const date =
                realBirth[1];

            savePersonal(
                "real_birth_date",
                date
            );

            savedItems.push(
                `Gerçek doğum tarihin: ${date}`
            );

        }


        /*
         * ==================================================
         * KİMLİK DOĞUM TARİHİ
         * ==================================================
         */

        const idBirth =
            text.match(
                /kimlikte(?: kayıtlı)?\s+(?:olan\s+)?doğum tarihim\s*:?\s*(\d{1,2}[./]\d{1,2}[./]\d{4})/i
            );


        if (idBirth) {

            const date =
                idBirth[1];

            savePersonal(
                "id_birth_date",
                date
            );

            savedItems.push(
                `Kimlikte kayıtlı doğum tarihin: ${date}`
            );

        }


        /*
         * ==================================================
         * GENEL "DOĞUM TARİHİM"
         * ==================================================
         */

        if (
            !realBirth &&
            !idBirth
        ) {

            const generalBirth =
                text.match(
                    /(?:benim\s+)?doğum tarihim\s*:?\s*(\d{1,2}[./]\d{1,2}[./]\d{4})/i
                );


            if (generalBirth) {

                const date =
                    generalBirth[1];

                savePersonal(
                    "id_birth_date",
                    date
                );

                savedItems.push(
                    `Doğum tarihin: ${date}`
                );

            }

        }


        /*
         * ==================================================
         * DOĞUM YERİ
         * ==================================================
         */

        const birthPlace =
            text.match(
                /(?:benim\s+)?doğum yerim\s+([^.!?,]+?)(?=\s+(?:en sevdiğim|favori|hedefim|kimlikte|gerçek)|[.!?,]|$)/i
            );


        if (birthPlace) {

            const place =
                birthPlace[1]
                    .trim();

            if (place) {

                savePersonal(
                    "birth_place",
                    place
                );

                savedItems.push(
                    `Doğum yerin: ${place}`
                );

            }

        }


        /*
         * ==================================================
         * FAVORİ OYUN
         * ==================================================
         */

        const favoriteGame =
            text.match(
                /(?:en sevdiğim oyun|favori oyunum)\s*(?:ise|:)?\s*([^.!?,]+?)(?=\s+(?:hedefim|doğum|kimlikte|gerçek)|[.!?,]|$)/i
            );


        if (favoriteGame) {

            const game =
                favoriteGame[1]
                    .trim();

            if (game) {

                savePreference(
                    "favorite_game",
                    game
                );

                savedItems.push(
                    `Favori oyunun: ${game}`
                );

            }

        }


        /*
         * ==================================================
         * HEDEF
         * ==================================================
         */

        const goal =
            text.match(
                /(?:hedefim|amacım)\s*:?\s*([^.!?]+?)(?=\s+(?:gerçek doğum|kimlikte|doğum yerim|en sevdiğim|favori)|[.!?]|$)/i
            );


        if (goal) {

            const value =
                goal[1]
                    .trim();

            if (value) {

                saveGoal(
                    "main_goal",
                    value
                );

                savedItems.push(
                    `Hedefin: ${value}`
                );

            }

        }


        /*
         * ==================================================
         * FAVORİ RENK
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

                savedItems.push(
                    `En sevdiğin renk: ${color}`
                );

            }

        }


        /*
         * ==================================================
         * YAŞADIĞI YER
         * ==================================================
         */

        const location =
            text.match(
                /(?:ben\s+)?(.+?)['’]?(?:de|da|te|ta)\s+yaşıyorum(?:[.!])?$/i
            );


        if (
            !isQuestion &&
            location
        ) {

            const place =
                location[1]
                    .trim();

            if (place) {

                saveFact(
                    "location",
                    place
                );

                savedItems.push(
                    `Yaşadığın yer: ${place}`
                );

            }

        }


        /*
         * ==================================================
         * MESLEK
         * ==================================================
         */

        const job =
            text.match(
                /(?:mesleğim|mesleğim şu)\s*:?\s*([^.!?]+)/i
            );


        if (job) {

            const value =
                job[1]
                    .trim();

            if (value) {

                savePersonal(
                    "job",
                    value
                );

                savedItems.push(
                    `Mesleğin: ${value}`
                );

            }

        }


        /*
         * ==================================================
         * PLAYSTATION SALONU
         * ==================================================
         */

        if (
            lower.includes("playstation salonu işletiyorum") ||
            lower.includes("playstation salonum var") ||
            lower.includes("ps salonu işletiyorum")
        ) {

            saveFact(
                "business",
                "PlayStation salonu işletiyor."
            );

            savedItems.push(
                "PlayStation salonu işletiyorsun"
            );

        }


        /*
         * ==================================================
         * BİRDEN FAZLA BİLGİ KAYDEDİLDİ
         * ==================================================
         */

        if (savedItems.length > 0) {

            return {
                response:
                    "Tamam. Şunları hafızama kaydettim:\n\n" +
                    savedItems
                        .map(
                            item =>
                                "• " + item
                        )
                        .join("\n")
            };

        }


        /*
         * ==================================================
         * SELAM
         * ==================================================
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
         * ==================================================
         * NASILSIN
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
         * KİMSİN
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
         * GENEL CEVAP
         * ==================================================
         */

        return {
            response:
                `Komutunu aldım: ${text}`
        };

    }

};


console.log(
    "🤖 JARVIS AI Core v10.0 aktif."
);
