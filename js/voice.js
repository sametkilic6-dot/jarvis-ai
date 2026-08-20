"use strict";

/*
 * JARVIS VOICE CORE
 *
 * Türkçe:
 * - Speech Recognition
 * - Speech Synthesis
 *
 * Tamamen cihaz/tarayıcı özelliklerini kullanır.
 */

const Voice = {

    recognition: null,

    listening: false,

    initialized: false,


    /*
     * =====================================================
     * BAŞLAT
     * =====================================================
     */

    init() {

        if (this.initialized) {

            return true;

        }


        const Recognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        /*
         * Ses tanıma desteklenmiyorsa
         * konuşma özelliği yine çalışabilir.
         */

        if (Recognition) {

            this.recognition =
                new Recognition();


            this.recognition.lang =
                "tr-TR";


            this.recognition.continuous =
                false;


            this.recognition.interimResults =
                false;


            this.recognition.maxAlternatives =
                1;


            this.recognition.onstart =
                () => {

                    this.listening =
                        true;


                    this.updateStatus(
                        "Seni dinliyorum..."
                    );

                };


            this.recognition.onend =
                () => {

                    this.listening =
                        false;


                    this.updateStatus(
                        "Sistemler hazır."
                    );

                };


            this.recognition.onerror =
                event => {

                    console.error(
                        "JARVIS Voice Error:",
                        event.error
                    );


                    this.listening =
                        false;


                    this.updateStatus(
                        "Mikrofon kullanılamadı."
                    );

                };


            this.recognition.onresult =
                event => {

                    const text =
                        event
                            .results[0][0]
                            .transcript;


                    this.handleCommand(
                        text
                    );

                };

        }


        this.initialized =
            true;


        return true;

    },


    /*
     * =====================================================
     * DİNLE
     * =====================================================
     */

    listen() {

        if (!this.initialized) {

            this.init();

        }


        if (!this.recognition) {

            this.updateStatus(
                "Bu tarayıcı ses tanımayı desteklemiyor."
            );


            return false;

        }


        if (this.listening) {

            return false;

        }


        try {

            this.recognition.start();

            return true;

        } catch (error) {

            console.error(
                "Voice start error:",
                error
            );


            return false;

        }

    },


    /*
     * =====================================================
     * SESİ METNE GÖNDER
     * =====================================================
     */

    handleCommand(text) {

        if (!text) {
            return;
        }


        const input =
            document.getElementById(
                "command"
            );


        if (!input) {
            return;
        }


        input.value =
            text;


        /*
         * app.js içindeki JARVIS
         * komut motorunu çalıştır.
         */

        if (
            typeof JarvisApp !==
            "undefined" &&
            typeof JarvisApp.processCommand ===
            "function"
        ) {

            JarvisApp.processCommand();

        }

    },


    /*
     * =====================================================
     * KONUŞ
     * =====================================================
     */

    speak(text) {

        if (!text) {
            return;
        }


        if (
            !("speechSynthesis" in window)
        ) {

            return;

        }


        /*
         * Önceki konuşmayı durdur.
         */

        window.speechSynthesis.cancel();


        const utterance =
            new SpeechSynthesisUtterance(
                text
            );


        utterance.lang =
            "tr-TR";


        utterance.rate =
            0.95;


        utterance.pitch =
            0.9;


        utterance.volume =
            1;


        window.speechSynthesis.speak(
            utterance
        );

    },


    /*
     * =====================================================
     * DURUM
     * =====================================================
     */

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


    /*
     * =====================================================
     * DESTEK DURUMU
     * =====================================================
     */

    getStatus() {

        return {

            initialized:
                this.initialized,

            listening:
                this.listening,

            recognition:
                !!this.recognition,

            synthesis:
                "speechSynthesis" in window

        };

    }

};


/*
 * Ses sistemini hazırla.
 */

Voice.init();


console.log(
    "JARVIS Voice Core aktif."
);
