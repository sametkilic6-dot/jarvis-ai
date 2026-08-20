"use strict";

const AI_CORE = {

    name: "JARVIS",

    version: "4.0",


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
         * İSİM
         * =========================
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
         * =========================
         * İSİM SORGUSU
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
         * FAVORİ RENK
         * =========================
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
         * =========================
         * FAVORİ RENK SORGUSU
         * =========================
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
         * =========================
         * İŞLETME
         * =========================
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
         * =========================
         * İŞLETMEYİ HATIRLAMA
         * =========================
         */

        if (
            lower.includes("işletmem hakkında ne biliyorsun") ||
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
         * =========================
         * GENEL HAFIZA
         * =========================
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
                    "Tamam. Bunu hafızamda tutacağım."
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
    "🤖 JARVIS AI Core v4.0 aktif."
);
