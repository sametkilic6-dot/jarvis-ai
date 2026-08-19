const commandInput = document.getElementById("command");
const sendButton = document.getElementById("send");
const microphoneButton = document.getElementById("microphone");

const conversation = document.getElementById("conversation");
const systemStatus = document.getElementById("system-status");

function addMessage(text, sender = "jarvis") {

    const message = document.createElement("div");

    message.className =
        sender === "jarvis"
            ? "message jarvis"
            : "message user";

    message.textContent = text;

    conversation.appendChild(message);

    conversation.scrollTop =
        conversation.scrollHeight;
}


function getLocalResponse(command) {

    const text = command.toLowerCase().trim();

    if (
        text.includes("merhaba") ||
        text.includes("selam")
    ) {
        return "Merhaba Samet. Hazırım.";
    }

    if (text.includes("kimsin")) {
        return "Ben JARVIS. Samet için geliştirilen kişisel yapay zekâ asistanıyım.";
    }

    if (text.includes("nasılsın")) {
        return "Tüm temel sistemler normal. AI çekirdeğinin bağlantısını bekliyorum.";
    }

    if (text.includes("saat")) {

        return `Şu an saat ${new Date().toLocaleTimeString(
            "tr-TR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        )}.`;
    }

    if (text.includes("tarih")) {

        return `Bugünün tarihi ${new Date().toLocaleDateString(
            "tr-TR"
        )}.`;
    }

    return "Komutunu aldım. Gerçek AI çekirdeği bağlandığında bunu daha gelişmiş şekilde işleyebileceğim.";
}


function speak(text) {

    if (!("speechSynthesis" in window)) {
        return;
    }

    window.speechSynthesis.cancel();

    const voice = new SpeechSynthesisUtterance(text);

    voice.lang = "tr-TR";
    voice.rate = 0.95;
    voice.pitch = 0.9;

    window.speechSynthesis.speak(voice);
}


function processCommand() {

    const command =
        commandInput.value.trim();

    if (!command) {
        return;
    }

    addMessage(command, "user");

    commandInput.value = "";

    systemStatus.textContent =
        "Komut işleniyor...";

    setTimeout(() => {

        const response =
            getLocalResponse(command);

        addMessage(response, "jarvis");

        speak(response);

        systemStatus.textContent =
            "Sistemler hazır.";

    }, 300);
}


sendButton.addEventListener(
    "click",
    processCommand
);


commandInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            processCommand();
        }

    }
);


microphoneButton.addEventListener(
    "click",
    startVoiceRecognition
);


function startVoiceRecognition() {

    const Recognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!Recognition) {

        addMessage(
            "Bu tarayıcı sesli komut özelliğini desteklemiyor.",
            "jarvis"
        );

        return;
    }

    const recognition =
        new Recognition();

    recognition.lang = "tr-TR";

    recognition.continuous = false;

    recognition.interimResults = false;

    systemStatus.textContent =
        "Seni dinliyorum...";

    recognition.start();


    recognition.onresult = event => {

        const result =
            event.results[0][0].transcript;

        commandInput.value = result;

        processCommand();
    };


    recognition.onerror = () => {

        systemStatus.textContent =
            "Ses algılanamadı.";

    };


    recognition.onend = () => {

        if (
            systemStatus.textContent ===
            "Seni dinliyorum..."
        ) {

            systemStatus.textContent =
                "Sistemler hazır.";
        }

    };

}


systemStatus.textContent =
    "JARVIS çekirdeği hazır.";
