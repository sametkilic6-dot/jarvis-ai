"use strict";

const AI_CORE = {

    async think(input) {

        if (!input || !input.trim()) {

            return {
                success: false,
                response: "Komut algılanamadı."
            };

        }

        const text = input.toLowerCase().trim();

        let response = "";


        if (
            text.includes("merhaba") ||
            text.includes("selam")
        ) {

            response =
                "Merhaba Samet. JARVIS sistemleri çevrimiçi. Nasıl yardımcı olabilirim?";

        }

        else if (
            text.includes("kimsin") ||
            text.includes("sen kimsin")
        ) {

            response =
                "Ben JARVIS. Samet için geliştirilen kişisel yapay zekâ asistanıyım.";

        }

        else if (
            text.includes("nasılsın") ||
            text.includes("nasılsın jarvis")
        ) {

            response =
                "Sistemlerim normal çalışıyor. Hazırım Samet.";

        }

        else if (
            text.includes("saat")
        ) {

            response =
                "Şu anki cihaz saatini doğrudan kontrol edebilirim. Saat aracını da JARVIS araç sistemine ekleyebiliriz.";

        }

        else {

            response =
                `"${input}" komutunu aldım. Temel JARVIS Core çalışıyor. Gerçek AI motoru sonraki aşamada bu çekirdeğe bağlanacak.`;

        }


        return {

            success: true,

            response: response

        };

    }

};


console.log(
    "JARVIS BASIC AI CORE yüklendi."
);
