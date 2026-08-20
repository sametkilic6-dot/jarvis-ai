"use strict";

const AI_CORE = {

    async think(input) {

        const text =
            input.toLowerCase();

        if (
            text.includes("merhaba") ||
            text.includes("selam")
        ) {

            return {
                success: true,
                response:
                    "Merhaba Samet. Ben JARVIS. Sistemler çevrimiçi."
            };

        }

        if (
            text.includes("kimsin")
        ) {

            return {
                success: true,
                response:
                    "Ben JARVIS. Samet için geliştirilen kişisel yapay zekâ asistanıyım."
            };

        }

        return {
            success: true,
            response:
                "Komutunu aldım: " + input
        };

    }

};

console.log("JARVIS BASIC CORE AKTİF");
