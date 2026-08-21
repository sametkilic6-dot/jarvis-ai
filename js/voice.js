"use strict";

/*
 * ==========================================
 * JARVIS VOICE CORE v2
 * ==========================================
 *
 * Türkçe:
 * - Speech Recognition
 * - Speech Synthesis
 * - app.js ile doğrudan bağlantı
 */

const Voice = {

    recognition: null,

    listening: false,

    initialized: false,


    /*
     * ==========================================
     * BAŞLAT
     * ==========================================
     */

    init() {

        if (this.initialized) {

            return true;

        }


        const Recognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


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
                            .transcript
                            .trim();


                    if (!text) {

                        return;

                    }


                    this.handleCommand(
                        text
                    );

                };

        }


        this.initialized =
            true;


        /*
         * Ses butonunu bağla.
         */

        const voiceButton =
            document.getElementById(
                "voice-button"
            );


        if (voiceButton) {

            voiceButton.addEventListener(
                "click",
                () => {

                    this.listen();

                }
            );

        }


        return true;

    },


    /*
     * ==========================================
     * DİNLE
     * ==========================================
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
                "JARVIS Voice başlatma hatası:",
                error
            );


            return false;

        }

    },


    /*
     * ==========================================
     * SESİ KOMUTA DÖNÜŞTÜR
     * ==========================================
     */

    handleCommand(text) {

        const command =
            String(text || "").trim();


        if (!command) {

            return;

        }


        /*
         * Önce input'a yaz.
         */

        const input =
            document.getElementById(
                "command"
            );


        if (input) {

            input.value =
                command;

        }


        /*
         * app.js'deki gerçek komut
         * motoruna SESLİ KOMUTU
         * doğrudan gönderiyoruz.
         */

        if (
            window.JarvisApp &&
            typeof window.JarvisApp.processCommand ===
                "function"
        ) {

            window.JarvisApp.processCommand(
                command
            );

            return;

        }


        console.error(
            "JARVIS: JarvisApp.processCommand bulunamadı."
        );

    },


    /*
     * ==========================================
     * KONUŞ
     * ==========================================
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


        window.speechSynthesis.cancel();


        const utterance =
            new SpeechSynthesisUtterance(
                String(text)
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
     * ==========================================
     * DURUM GÜNCELLE
     * ==========================================
     */

    updateStatus(text) {

        const status =
            document.getElementById(
                "status-text"
            );


        if (status) {

            status.textContent =
                String(text || "");

        }

    },


    /*
     * ==========================================
     * DURUM
     * ==========================================
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
 * ==========================================
 * BAŞLAT
 * ==========================================
 */

Voice.init();


/*
 * GLOBAL ERİŞİM
 */

window.Voice =
    Voice;


console.log(
    "🎙️ JARVIS Voice Core v2 aktif."
);
