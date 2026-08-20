const Voice = {

    recognition: null,

    listening: false,

    init() {

        const Recognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!Recognition) {

            console.warn(
                "Tarayıcı ses tanımayı desteklemiyor."
            );

            return false;
        }

        this.recognition =
            new Recognition();

        this.recognition.lang = "tr-TR";

        this.recognition.continuous = false;

        this.recognition.interimResults = false;

        this.recognition.onstart = () => {

            this.listening = true;

            this.updateStatus(
                "Seni dinliyorum..."
            );

        };

        this.recognition.onend = () => {

            this.listening = false;

            this.updateStatus(
                "Sistemler hazır."
            );

        };

        this.recognition.onerror = error => {

            console.error(
                "Voice error:",
                error
            );

            this.listening = false;

            this.updateStatus(
                "Ses algılanamadı."
            );

        };

        return true;

    },


    listen() {

        if (!this.recognition) {

            const initialized =
                this.init();

            if (!initialized) {
                return;
            }

        }

        if (this.listening) {
            return;
        }

        this.recognition.start();

        this.recognition.onresult =
            event => {

                const text =
                    event.results[0][0]
                        .transcript;

                this.handleCommand(text);

            };

    },


    handleCommand(text) {

        const input =
            document.getElementById(
                "command"
            );

        if (!input) {
            return;
        }

        input.value = text;

        if (
            typeof processCommand ===
            "function"
        ) {

            processCommand();

        }

    },


    speak(text) {

        if (
            !("speechSynthesis" in window)
        ) {
            return;
        }

        window.speechSynthesis.cancel();

        const speech =
            new SpeechSynthesisUtterance(
                text
            );

        speech.lang = "tr-TR";

        speech.rate = 0.95;

        speech.pitch = 0.9;

        speech.volume = 1;

        window.speechSynthesis.speak(
            speech
        );

    },


    updateStatus(text) {

        const status =
            document.getElementById(
                "system-status"
            );

        if (status) {
            status.textContent = text;
        }

    }

};
