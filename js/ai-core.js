"use strict";

const AI_CORE = {

    name: "JARVIS",

    version: "6.0",


    async think(input) {

        const text =
            String(input || "").trim();

        if (!text) {

            return {
                response:
                    "Dinliyorum Samet."
            };

        }


        const lower =
            text.toLowerCase();


        const memoryAvailable =
            typeof Memory !== "undefined";


        /*
         * =========================
         * İSİM KAYDET
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
         * FAVORİ RENK KAYDET
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
         * FAVORİ RENK SORGULA
         * =========================
         */

        if (
            lower.includes("en sevdiğim renk") ||
            lower.includes("sevdiğim renk ne") ||
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


        /*
         * =========================
         * İZMİR / YAŞAM YERİ
         * =========================
         */

        const locationMatch =
            text.match(
                /(?:ben\s+)?(.+?)['’]?(?:de|da|te|ta)\s+yaşıyorum/i
            );


        if (
            locationMatch
        ) {

            const location =
                locationMatch[1]
                    .trim();


            if (
                location &&
                location.length < 100 &&
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
         * İŞLETME SORGULA
         * =========================
         */

        if (
            lower.includes("işletmem hakkında") ||
            lower.includes("salonum hakkında")
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
         * YAŞADIĞI YERİ SOR
         * =========================
         */

        if (
            lower.includes("nerede yaşıyorum") ||
            lower.includes("hangi şehirde yaşıyorum") ||
            lower.includes("yaşadığım yer neresi")
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
                    "Yaşadığın yeri henüz hafızamda bulamıyorum."
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

            if (memoryAvailable) {

                Memory.addFact(
                    "user_note_" +
                    Date.now(),
                    text
                );

            }


            return {
                response:
                    "Tamam. Bunu hafızama kaydettim."
            };

        }


        /*
         * =========================
         * GENEL HAFIZA
         * =========================
         */

        if (
            lower.includes("hafızanda ne var") ||
            lower.includes("hafızamda ne var") ||
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

                const location =
                    Memory.getFact(
                        "location"
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
                    "Henüz senin hakkında yeterli kayıt yok."
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
    "🤖 JARVIS AI Core v6.0 aktif."
);
