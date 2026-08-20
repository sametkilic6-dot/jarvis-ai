"use strict";

const AI_CORE = {

    name: "JARVIS",

    version: "3.0",


    async think(input) {

        const text = String(input || "").trim();

        if (!text) {
            return {
                response: "Dinliyorum Samet."
            };
        }


        const lower = text.toLowerCase();


        /*
         * =========================
         * HAFIZA KAYITLARI
         * =========================
         */

        const memoryAvailable =
            typeof Memory !== "undefined";


        /*
         * =========================
         * BİLGİ KAYDETME
         * =========================
         */

        if (
            lower.includes("benim en sevdiğim renk") &&
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
                colors.find(c =>
                    lower.includes(c)
                );


            if (memoryAvailable) {

                Memory.add(
                    "fact",
                    `Samet'in en sevdiği renk: ${color}`
                );

            }


            return {
                response:
                    `Tamam Samet. En sevdiğin rengin ${color} olduğunu hafızama kaydettim.`
            };

        }


        /*
         * =========================
         * RENK HAFIZA SORGUSU
         * =========================
         */

        if (
            lower.includes("en sevdiğim renk") ||
            lower.includes("sevdiğim renk ne")
        ) {

            if (memoryAvailable) {

                const memories =
                    Memory.recent(100);


                for (
                    let i = memories.length - 1;
                    i >= 0;
                    i--
                ) {

                    const item =
                        memories[i];


                    if (
                        item.role === "fact" &&
                        item.text
                            .toLowerCase()
                            .includes(
                                "en sevdiği renk"
                            )
                    ) {

                        const match =
                            item.text.match(
                                /renk:\s*(.+)$/i
                            );


                        if (match) {

                            return {
                                response:
                                    `En sevdiğin renk ${match[1]}. Bunu hatırlıyorum.`
                            };

                        }

                    }

                }

            }


            return {
                response:
                    "Bu bilgiyi henüz hafızamda bulamadım."
            };

        }


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
                    .replace(
                        /^benim adım/i,
                        ""
                    )
                    .replace(
                        /^ismim/i,
                        ""
                    )
                    .trim();


            if (name) {

                if (memoryAvailable) {

                    Memory.add(
                        "fact",
                        `Samet'in adı: ${name}`
                    );

                }


                return {
                    response:
                        `Tamam. Adının ${name} olduğunu hatırlayacağım.`
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

                const memories =
                    Memory.recent(100);


                for (
                    let i = memories.length - 1;
                    i >= 0;
                    i--
                ) {

                    if (
                        memories[i].role === "fact" &&
                        memories[i].text
                            .includes("adı:")
                    ) {

                        const name =
                            memories[i].text
                                .split("adı:")
                                [1]
                                .trim();


                        return {
                            response:
                                `Senin adın ${name}. Bunu hatırlıyorum.`
                        };

                    }

                }

            }


            return {
                response:
                    "Adını henüz hafızamda bulamadım."
            };

        }


        /*
         * =========================
         * HATIRLA KOMUTU
         * =========================
         */

        if (
            lower.includes("hatırla") ||
            lower.includes("unutma")
        ) {

            return {
                response:
                    "Tamam. Bu bilgiyi hafızamda tutacağım."
            };

        }


        /*
         * =========================
         * GENEL HAFIZA SORGUSU
         * =========================
         */

        if (
            lower.includes("hatırlıyor musun") ||
            lower.includes("ne demiştim") ||
            lower.includes("hafızanda ne var")
        ) {

            if (memoryAvailable) {

                const memories =
                    Memory.recent(10);


                const useful =
                    memories.filter(item =>
                        item.role === "fact"
                    );


                if (useful.length > 0) {

                    return {
                        response:
                            "Hafızamda kayıtlı bilgiler:\n\n" +
                            useful
                                .map(item =>
                                    "• " + item.text
                                )
                                .join("\n")
                    };

                }

            }


            return {
                response:
                    "Henüz önemli bir bilgi kaydetmedim."
            };

        }


        /*
         * =========================
         * TEMEL JARVIS CEVAPLARI
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


        if (
            lower.includes("nasılsın")
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
    "🤖 JARVIS AI Core v3.0 aktif."
);
