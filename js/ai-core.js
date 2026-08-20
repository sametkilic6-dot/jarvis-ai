"use strict";

/*
 * JARVIS AI CORE
 *
 * Görevi:
 * - Komutu analiz etmek
 * - Hafıza ile iletişim kurmak
 * - Araçları çağırmak
 * - Güvenlik katmanını kullanmak
 * - İleride gerçek yerel AI modeline bağlanmak
 */

const AI_CORE = {

    name: "JARVIS AI Core",

    version: "0.1.0",

    status: "ready",


    async think(input) {

        if (
            typeof input !== "string" ||
            !input.trim()
        ) {

            return {

                success: false,

                response:
                    "Komut algılanamadı."

            };

        }


        const command =
            input.trim();


        /*
         * Önce özel komutları kontrol et.
         */

        const special =
            await this.handleSpecialCommand(
                command
            );


        if (special) {

            return {

                success: true,

                response: special

            };

        }


        /*
         * Araç kontrolü.
         */

        const tool =
            this.detectTool(command);


        if (tool) {

            const result =
                await executeTool(
                    tool
                );


            if (
                result.requiresApproval
            ) {

                return {

                    success: false,

                    requiresApproval: true,

                    response:
                        "Bu işlem için Samet'in onayı gerekiyor.",

                    approval:
                        result.approval

                };

            }


            if (result.success) {

                return {

                    success: true,

                    response:
                        result.result

                };

            }

        }


        /*
         * Şimdilik yerel temel cevap motoru.
         *
         * Gerçek yerel AI modeli sonraki
         * aşamada buraya bağlanacak.
         */

        return {

            success: true,

            response:
                this.basicReasoning(
                    command
                )

        };

    },


    async handleSpecialCommand(
        command
    ) {

        const text =
            command.toLocaleLowerCase(
                "tr-TR"
            );


        if (
            text.includes("merhaba") ||
            text.includes("selam")
        ) {

            return (
                "Merhaba Samet. " +
                "Sistemler çevrimiçi."
            );

        }


        if (
            text.includes("kimsin")
        ) {

            return (
                "Ben JARVIS. " +
                "Samet için geliştirilen " +
                "kişisel yapay zekâ asistanıyım."
            );

        }


        if (
            text.includes("durumun ne") ||
            text.includes("sistem durumu")
        ) {

            return (
                "AI Core çevrimiçi. " +
                "Güvenli mod aktif."
            );

        }


        if (
            text.includes("ne yapabiliyorsun")
        ) {

            return (
                "Şu anda temel konuşma, " +
                "hafıza, ses ve araç altyapım hazır. " +
                "Gerçek yerel AI modeli henüz bağlanmadı."
            );

        }


        return null;

    },


    detectTool(command) {

        const text =
            command.toLocaleLowerCase(
                "tr-TR"
            );


        if (
            text.includes("saat kaç") ||
            text === "saat"
        ) {

            return "saat";

        }


        if (
            text.includes("bugün tarih") ||
            text === "tarih" ||
            text.includes("tarih ne")
        ) {

            return "tarih";

        }


        return null;

    },


    basicReasoning(command) {

        return (
            `"${command}" komutunu aldım. ` +
            "Temel AI Core çalışıyor. " +
            "Bir sonraki aşamada gerçek yerel " +
            "AI modeli bağlanacak."
        );

    }

};
