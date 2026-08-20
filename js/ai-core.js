"use strict";

const AI_CORE = {

    name: "JARVIS",
    version: "11.0",

    async think(input) {

        const text = String(input || "").trim();

        if (!text) {
            return {
                response: "Dinliyorum Samet."
            };
        }

        const lower = text.toLowerCase();

        const hasMemory =
            typeof Memory !== "undefined";


        /*
         * ==================================================
         * HAFIZA YARDIMCILARI
         * ==================================================
         */

        const remember = (type, key, value) => {

            if (!hasMemory || !value) {
                return;
            }

            if (type === "personal") {
                Memory.addPersonal(key, value);
            }

            if (type === "preference") {
                Memory.addPreference(key, value);
            }

            if (type === "fact") {
                Memory.addFact(key, value);
            }

            if (type === "goal") {
                Memory.addGoal(key, value);
            }
        };


        const forget = (type, key) => {

            if (!hasMemory) {
                return;
            }

            if (type === "personal") {
                Memory.removePersonal(key);
            }

            if (type === "preference") {
                Memory.removePreference(key);
            }

            if (type === "fact") {
                Memory.removeFact(key);
            }

            if (type === "goal") {
                Memory.removeGoal(key);
            }
        };


        /*
         * ==================================================
         * UNUT
         * ==================================================
         */

        if (
            lower.includes("gerçek doğum tarihimi unut") ||
            lower.includes("gerçek doğum tarihimi sil")
        ) {

            forget(
                "personal",
                "real_birth_date"
            );

            return {
                response:
                    "Tamam. Gerçek doğum tarihini hafızamdan sildim."
            };
        }


        if (
            lower.includes("kimlikte kayıtlı doğum tarihimi unut") ||
            lower.includes("kimlikte kayıtlı doğum tarihimi sil")
        ) {

            forget(
                "personal",
                "id_birth_date"
            );

            return {
                response:
                    "Tamam. Kimlikte kayıtlı doğum tarihini hafızamdan sildim."
            };
        }


        if (
            lower.includes("doğum yerimi unut") ||
            lower.includes("doğum yerimi sil")
        ) {

            forget(
                "personal",
                "birth_place"
            );

            return {
                response:
                    "Tamam. Doğum yerini hafızamdan sildim."
            };
        }


        if (
            lower.includes("favori oyunumu unut") ||
            lower.includes("en sevdiğim oyunu unut")
        ) {

            forget(
                "preference",
                "favorite_game"
            );

            return {
                response:
                    "Tamam. Favori oyununu hafızamdan sildim."
            };
        }


        if (
            lower.includes("favori rengimi unut") ||
            lower.includes("en sevdiğim rengi unut")
        ) {

            forget(
                "preference",
                "favorite_color"
            );

            return {
                response:
                    "Tamam. Favori rengini hafızamdan sildim."
            };
        }


        if (
            lower.includes("hedefimi unut") ||
            lower.includes("amacımı unut")
        ) {

            forget(
                "goal",
                "main_goal"
            );

            return {
                response:
                    "Tamam. Hedefini hafızamdan sildim."
            };
        }


        if (
            lower.includes("yaşadığım yeri unut") ||
            lower.includes("yaşadığım yeri sil")
        ) {

            forget(
                "fact",
                "location"
            );

            return {
                response:
                    "Tamam. Yaşadığın yeri hafızamdan sildim."
            };
        }


        /*
         * ==================================================
         * GÜNCELLEME
         * ==================================================
         */

        const gameUpdate =
            text.match(
                /(?:favori oyunum|en sevdiğim oyun)\s+(?:artık|şimdi)\s+(.+)/i
            );

        if (gameUpdate) {

            const game =
                gameUpdate[1]
                    .trim()
                    .replace(/[.!?]+$/, "");

            remember(
                "preference",
                "favorite_game",
                game
            );

            return {
                response:
                    `Tamam. Favori oyununu ${game} olarak güncelledim.`
            };
        }


        const colorUpdate =
            text.match(
                /(?:favori rengim|en sevdiğim renk)\s+(?:artık|şimdi)\s+(.+)/i
            );

        if (colorUpdate) {

            const color =
                colorUpdate[1]
                    .trim()
                    .replace(/[.!?]+$/, "");

            remember(
                "preference",
                "favorite_color",
                color
            );

            return {
                response:
                    `Tamam. Favori rengini ${color} olarak güncelledim.`
            };
        }


        const locationUpdate =
            text.match(
                /(?:artık|şimdi)\s+(.+?)['’]?(?:de|da|te|ta)\s+yaşıyorum/i
            );

        if (locationUpdate) {

            const location =
                locationUpdate[1]
                    .trim();

            remember(
                "fact",
                "location",
                location
            );

            return {
                response:
                    `Tamam. Yaşadığın yeri ${location} olarak güncelledim.`
            };
        }


        /*
         * ==================================================
         * TEK MESAJDA BİRDEN FAZLA BİLGİ KAYDET
         * ==================================================
         */

        const saved = [];


        /*
         * Gerçek doğum tarihi
         */

        const realBirth =
            text.match(
                /gerçek doğum tarihim\s*:?\s*(\d{1,2}[./]\d{1,2}[./]\d{4})/i
            );

        if (realBirth) {

            remember(
                "personal",
                "real_birth_date",
                realBirth[1]
            );

            saved.push(
                `Gerçek doğum tarihin: ${realBirth[1]}`
            );
        }


        /*
         * Kimlik doğum tarihi
         */

        const idBirth =
            text.match(
                /kimlikte\s+(?:kayıtlı\s+)?doğum tarihim\s*:?\s*(\d{1,2}[./]\d{1,2}[./]\d{4})/i
            );

        if (idBirth) {

            remember(
                "personal",
                "id_birth_date",
                idBirth[1]
            );

            saved.push(
                `Kimlikte kayıtlı doğum tarihin: ${idBirth[1]}`
            );
        }


        /*
         * Doğum yeri
         */

        const birthPlace =
            text.match(
                /doğum yerim\s+([^.!?]+?)(?=\s+en sevdiğim|\s+favori|\s+hedefim|[.!?]|$)/i
            );

        if (birthPlace) {

            const place =
                birthPlace[1]
                    .trim();

            remember(
                "personal",
                "birth_place",
                place
            );

            saved.push(
                `Doğum yerin: ${place}`
            );
        }


        /*
         * Favori oyun
         */

        const favoriteGame =
            text.match(
                /(?:en sevdiğim oyun|favori oyunum)\s+(?:ise|:)?\s*([^.!?]+?)(?=\s+hedefim|[.!?]|$)/i
            );

        if (favoriteGame) {

            const game =
                favoriteGame[1]
                    .trim();

            remember(
                "preference",
                "favorite_game",
                game
            );

            saved.push(
                `Favori oyunun: ${game}`
            );
        }


        /*
         * Hedef
         */

        const goal =
            text.match(
                /hedefim\s+([^.!?]+?)(?=\s+gerçek doğum|\s+kimlikte|\s+doğum yerim|\s+en sevdiğim|\s+favori|[.!?]|$)/i
            );

        if (goal) {

            const value =
                goal[1]
                    .trim();

            remember(
                "goal",
                "main_goal",
                value
            );

            saved.push(
                `Hedefin: ${value}`
            );
        }


        /*
         * ==================================================
         * SORGULAR
         * ==================================================
         */

        if (
            lower.includes("gerçek doğum tarihim ne")
        ) {

            const value =
                hasMemory
                    ? Memory.getPersonal(
                        "real_birth_date"
                    )
                    : null;

            return {
                response: value
                    ? `Gerçek doğum tarihin ${value}.`
                    : "Gerçek doğum tarihini bilmiyorum."
            };
        }


        if (
            lower.includes("kimlikte kayıtlı doğum tarihim ne") ||
            lower.includes("kimlikte doğum tarihim ne")
        ) {

            const value =
                hasMemory
                    ? Memory.getPersonal(
                        "id_birth_date"
                    )
                    : null;

            return {
                response: value
                    ? `Kimlikte kayıtlı doğum tarihin ${value}.`
                    : "Kimlikte kayıtlı doğum tarihini bilmiyorum."
            };
        }


        if (
            lower.includes("doğum yerim neresi") ||
            lower.includes("nerede doğdum")
        ) {

            const value =
                hasMemory
                    ? Memory.getPersonal(
                        "birth_place"
                    )
                    : null;

            return {
                response: value
                    ? `Doğum yerin ${value}.`
                    : "Doğum yerini bilmiyorum."
            };
        }


        if (
            lower.includes("en sevdiğim oyun ne") ||
            lower.includes("favori oyunum ne")
        ) {

            const value =
                hasMemory
                    ? Memory.getPreference(
                        "favorite_game"
                    )
                    : null;

            return {
                response: value
                    ? `Favori oyunun ${value}.`
                    : "Favori oyununu bilmiyorum."
            };
        }


        if (
            lower.includes("hedefim ne") ||
            lower.includes("amacım ne")
        ) {

            const value =
                hasMemory
                    ? Memory.getGoal(
                        "main_goal"
                    )
                    : null;

            return {
                response: value
                    ? `Hedefin ${value}.`
                    : "Hedefini bilmiyorum."
            };
        }


        /*
         * ==================================================
         * GENEL HAFIZA
         * ==================================================
         */

        if (
            lower.includes("benim hakkımda ne biliyorsun") ||
            lower.includes("hafızanda ne var") ||
            lower.includes("hafızamda ne var")
        ) {

            const result = [];

            if (hasMemory) {

                const realBirth =
                    Memory.getPersonal(
                        "real_birth_date"
                    );

                const idBirth =
                    Memory.getPersonal(
                        "id_birth_date"
                    );

                const birthPlace =
                    Memory.getPersonal(
                        "birth_place"
                    );

                const game =
                    Memory.getPreference(
                        "favorite_game"
                    );

                const color =
                    Memory.getPreference(
                        "favorite_color"
                    );

                const location =
                    Memory.getFact(
                        "location"
                    );

                const goal =
                    Memory.getGoal(
                        "main_goal"
                    );


                if (realBirth)
                    result.push(
                        `Gerçek doğum tarihin: ${realBirth}`
                    );

                if (idBirth)
                    result.push(
                        `Kimlikte kayıtlı doğum tarihin: ${idBirth}`
                    );

                if (birthPlace)
                    result.push(
                        `Doğum yerin: ${birthPlace}`
                    );

                if (game)
                    result.push(
                        `Favori oyunun: ${game}`
                    );

                if (color)
                    result.push(
                        `En sevdiğin renk: ${color}`
                    );

                if (location)
                    result.push(
                        `Yaşadığın yer: ${location}`
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
                                x => "• " + x
                            )
                            .join("\n")
                };
            }


            return {
                response:
                    "Hafızamda kayıtlı bilgi bulunmuyor."
            };
        }


        /*
         * ==================================================
         * KAYIT SONUCU
         * ==================================================
         */

        if (saved.length) {

            return {
                response:
                    "Tamam. Şunları hafızama kaydettim:\n\n" +
                    saved
                        .map(
                            x => "• " + x
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
         * GENEL
         * ==================================================
         */

        return {
            response:
                `Komutunu aldım: ${text}`
        };

    }

};


console.log(
    "🤖 JARVIS AI Core v11.0 aktif."
);
