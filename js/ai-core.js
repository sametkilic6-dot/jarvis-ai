const JARVIS_CONFIG = {
    language: "tr-TR",
    assistantName: "JARVIS",
    userName: "Samet",
    mode: "safe"
};

const AI_CORE = {

    status: "ready",

    async think(input) {

        if (!input || !input.trim()) {
            return {
                success: false,
                response: "Komut boş."
            };
        }

        const command = input.trim();

        const response = await localReasoning(command);

        return {
            success: true,
            response,
            source: "local-core"
        };
    }

};


async function localReasoning(command) {

    const text =
        command.toLocaleLowerCase("tr-TR");

    if (
        text.includes("merhaba") ||
        text.includes("selam")
    ) {
        return "Merhaba Samet. JARVIS hazır.";
    }

    if (text.includes("kimsin")) {
        return "Ben JARVIS. Türkçe çalışan kişisel yapay zekâ asistanınım.";
    }

    if (text.includes("durum")) {
        return "Temel sistemler çevrimiçi. Güvenli mod aktif.";
    }

    if (text.includes("saat")) {
        return `Saat ${new Date().toLocaleTimeString("tr-TR")}.`;
    }

    return `
Komutunu analiz ettim ancak şu anda
yerel AI modeli bağlı değil.

AI Core hazır.
Model bağlantısı bir sonraki aşamada kurulacak.
`;
}
