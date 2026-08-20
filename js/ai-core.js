"use strict";

const AI_CORE = {

    name: "JARVIS",

    version: "2.0",


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


        /*
         * Hafızadan ilgili bilgileri bul.
         */

        let memories = [];

        if (typeof Memory !== "undefined") {

            memories =
                Memory.search(text)
                    .slice(-5);

        }


        /*
         * İsim
         */

        if (
            lower.includes("benim adım") ||
            lower.includes("ismim")
        ) {

            const name =
                text
                    .replace(
                        /benim adım/i,
                        ""
                    )
                    .replace(
                        /ismim/i,
                        ""
                    )
                    .trim();

            if (name) {

                return {
                    response:
                        `${name} olduğunu hatırlayacağım.`
                };

            }

        }


        /*
         * "Hatırla" komutu
         */

        if (
            lower.includes("hatırla") ||
            lower.includes("unutma")
        ) {

            return {
                response:
                    "Tamam. Bunu hafızama kaydettim."
            };

        }


        /*
         * Basit hafıza sorguları
         */

        if (
            lower.includes("en sevdiğim renk") ||
            lower.includes("sevdiğim renk")
        ) {

            const colorMemory =
                findMemoryByKeywords([
                    "renk",
                    "mavi",
                    "kırmızı",
                    "yeşil",
                    "sarı",
                    "siyah",
                    "beyaz",
                    "mor",
                    "turuncu",
                    "pembe"
                ]);

            if (colorMemory) {

                return {
                    response:
                        `Hatırladığım kadarıyla: ${colorMemory}`
                };

            }

        }


        /*
         * Hafızada arama
         */

        if (
            lower.includes("hatırlıyor musun") ||
            lower.includes("ne demiştim") ||
            lower.includes("biliyor musun") ||
            lower.includes("hatırladığın")
        ) {

            if (memories.length > 0) {

                const result =
                    memories
                        .map(item =>
                            `${item.role}: ${item.text}`
                        )
                        .join("\n");

                return {
                    response:
                        `Hafızamda bunlar var:\n${result}`
                };

            }

            return {
                response:
                    "Bu konuyla ilgili hafızamda kayıt bulamadım."
            };

        }


        /*
         * Temel sistem cevapları
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


        if (
            lower.includes("nasılsın") ||
            lower.includes("nasıl gidiyor")
        ) {

            return {
                response:
                    "Sistemlerim stabil. Hazırım."
            };

        }


        if (
            lower.includes("kimsin")
        ) {

            return {
                response:
                    "Ben JARVIS. Yerel çalışan Türkçe yapay zekâ çekirdeğinim."
            };

        }


        /*
         * Hafızada doğrudan eşleşme varsa
         */

        if (memories.length > 0) {

            const last =
                memories[memories.length - 1];

            if (last.role === "user") {

                return {
                    response:
                        `Bunu daha önce konuşmuştuk: "${last.text}"`
                };

            }

        }


        /*
         * Genel cevap
         */

        return {
            response:
                `Komutunu aldım: ${text}`
        };

    }

};


/*
 * Hafızadan anahtar kelimelere göre
 * en anlamlı kaydı bulur.
 */

function findMemoryByKeywords(
    keywords
) {

    if (
        typeof Memory === "undefined"
    ) {

        return null;

    }


    const all =
        Memory.recent(100);


    for (
        let i = all.length - 1;
        i >= 0;
        i--
    ) {

        const item =
            all[i];


        const content =
            item.text.toLowerCase();


        for (
            const keyword of keywords
        ) {

            if (
                content.includes(
                    keyword.toLowerCase()
                )
            ) {

                return item.text;

            }

        }

    }


    return null;

}


console.log(
    "🤖 JARVIS AI Core v2.0 aktif."
);
