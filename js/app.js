"use strict";

/*
 * JARVIS APPLICATION CORE
 * Türkçe kişisel AI asistanı
 */

const JarvisApp = {

    initialized: false,

    init() {

        if (this.initialized) {
            return;
        }

        this.initialized = true;

        this.bindEvents();

        this.updateStatus(
            "JARVIS çekirdeği hazır."
        );

        console.log(
            "JARVIS başlatıldı."
        );

    },


    bindEvents() {

        const sendButton =
            document.getElementById("send");

        const commandInput =
            document.getElementById("command");

        const microphone =
            document.getElementById("microphone");


        if (sendButton) {

            sendButton.addEventListener(
                "click",
                () => this.processCommand()
            );

        }


        if (commandInput) {

            commandInput.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        this.processCommand();

                    }

                }
            );

        }


        if (microphone) {

            microphone.addEventListener(
                "click",
                () => this.startVoice()
            );

        }

    },


    async processCommand() {

        const input =
            document.getElementById("command");

        if (!input) {
            return;
        }


        const command =
            input.value.trim();


        if (!command) {
            return;
        }


        input.value = "";


        this.addMessage(
            command,
            "user"
        );


        this.updateStatus(
            "Komut analiz ediliyor..."
        );


        /*
         * Kullanıcı mesajını hafızaya kaydet.
         */

        if (
            typeof Memory !== "undefined"
        ) {

            Memory.addConversation(
                "user",
                command
            );

        }


        let response;


        try {

            /*
             * AI Core mevcutsa kullan.
             */

            if (
                typeof AI_CORE !== "undefined" &&
                typeof AI_CORE.think === "function"
            ) {

                const result =
                    await AI_CORE.think(
                        command
                    );

                response =
                    result?.response ||
                    "Komut işlendi fakat cevap oluşturulamadı.";

            } else {

                response =
                    "AI Core henüz yüklenmedi.";

            }


        } catch (error) {

            console.error(
                "JARVIS AI Core hatası:",
                error
            );

            response =
                "Bir sistem hatası oluştu.";

        }


        /*
         * Cevabı ekrana gönder.
         */

        this.addMessage(
            response,
            "jarvis"
        );


        /*
         * Cevabı hafızaya kaydet.
         */

        if (
            typeof Memory !== "undefined"
        ) {

            Memory.addConversation(
                "assistant",
                response
            );

        }


        /*
         * Sesli cevap.
         */

        if (
            typeof Voice !== "undefined" &&
            typeof Voice.speak === "function"
        ) {

            Voice.speak(
                response
            );

        }


        this.updateStatus(
            "Sistemler hazır."
        );

    },


    addMessage(
        text,
        sender = "jarvis"
    ) {

        const conversation =
            document.getElementById(
                "conversation"
            );


        if (!conversation) {
            return;
        }


        const message =
            document.createElement(
                "div"
            );


        message.className =
            sender === "user"
                ? "message user"
                : "message jarvis";


        if (sender === "jarvis") {

            const name =
                document.createElement(
                    "div"
                );

            name.className =
                "message-name";

            name.textContent =
                "JARVIS";

            message.appendChild(
                name
            );

        }


        const content =
            document.createElement(
                "div"
            );

        content.textContent =
            text;


        message.appendChild(
            content
        );


        conversation.appendChild(
            message
        );


        window.requestAnimationFrame(
            () => {

                conversation.scrollTop =
                    conversation.scrollHeight;

            }
        );

    },


    updateStatus(text) {

        const status =
            document.getElementById(
                "system-status"
            );


        if (status) {

            status.textContent =
                text;

        }

    },


    startVoice() {

        if (
            typeof Voice === "undefined"
        ) {

            this.addMessage(
                "Ses sistemi henüz hazır değil.",
                "jarvis"
            );

            return;

        }


        if (
            typeof Voice.listen !== "function"
        ) {

            this.addMessage(
                "Ses tanıma sistemi kullanılamıyor.",
                "jarvis"
            );

            return;

        }


        Voice.listen();

    }

};


/*
 * JARVIS'i başlat.
 */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        () => JarvisApp.init()
    );

} else {

    JarvisApp.init();

}
