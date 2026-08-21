"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const input =
        document.getElementById("command");

    const send =
        document.getElementById("send");

    const conversation =
        document.getElementById("conversation");


    const WORKER_URL =
        "https://jarvis-ai.agitacer6.workers.dev/";


    if (!input || !send || !conversation) {

        console.error(
            "JARVIS: Gerekli arayüz elemanları bulunamadı."
        );

        return;
    }


    /*
     * ==========================================
     * MESAJ GÖSTER
     * ==========================================
     */

    function addMessage(text, sender) {

        const message =
            document.createElement("div");

        message.classList.add(
            "message",
            sender === "user"
                ? "user"
                : "jarvis"
        );


        if (sender !== "user") {

            const name =
                document.createElement("div");

            name.className =
                "message-name";

            name.textContent =
                "JARVIS";

            message.appendChild(name);

        }


        const content =
            document.createElement("div");

        content.textContent =
            String(text || "");

        message.appendChild(content);

        conversation.appendChild(message);

        conversation.scrollTop =
            conversation.scrollHeight;

    }


    /*
     * ==========================================
     * HAFIZA
     * ==========================================
     */

    function getMemory() {

        if (
            typeof Memory === "undefined"
        ) {

            return {

                name: null,

                facts: {},

                preferences: {},

                personal: {},

                goals: {},

                recent: []

            };

        }


        return {

            name:
                typeof Memory.getName === "function"
                    ? Memory.getName()
                    : null,

            facts:
                typeof Memory.allFacts === "function"
                    ? Memory.allFacts()
                    : {},

            preferences:
                typeof Memory.allPreferences === "function"
                    ? Memory.allPreferences()
                    : {},

            personal:
                typeof Memory.allPersonal === "function"
                    ? Memory.allPersonal()
                    : {},

            goals:
                typeof Memory.allGoals === "function"
                    ? Memory.allGoals()
                    : {},

            recent:
                typeof Memory.recent === "function"
                    ? Memory.recent(10)
                    : []

        };

    }


    /*
     * ==========================================
     * HAFIZAYA MESAJ KAYDET
     * ==========================================
     */

    function saveConversation(
        userText,
        jarvisText
    ) {

        if (
            typeof Memory === "undefined"
        ) {

            return;

        }


        try {

            if (
                typeof Memory.add === "function"
            ) {

                Memory.add(
                    "user",
                    userText
                );

                Memory.add(
                    "jarvis",
                    jarvisText
                );

            }

        } catch (error) {

            console.error(
                "JARVIS hafıza konuşma kayıt hatası:",
                error
            );

        }

    }


    /*
     * ==========================================
     * WORKER
     * ==========================================
     */

    async function askWorker(text) {

        const memory =
            getMemory();


        const response =
            await fetch(
                WORKER_URL,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            message:
                                text,

                            memory:
                                memory

                        })

                }
            );


        let result;

        try {

            result =
                await response.json();

        } catch (error) {

            throw new Error(
                "Worker geçersiz cevap verdi."
            );

        }


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Worker hata verdi."
            );

        }


        return (
            result.response ||
            "JARVIS cevap vermedi."
        );

    }


    /*
     * ==========================================
     * ANA KOMUT MOTORU
     * ==========================================
     */

    async function processCommand(text) {

        const message =
            String(text || "").trim();


        if (!message) {

            return;

        }


        addMessage(
            message,
            "user"
        );


        /*
         * ======================================
         * 1. LOCAL AI CORE
         * ======================================
         */

        if (
            typeof AI_CORE !== "undefined" &&
            typeof AI_CORE.think === "function"
        ) {

            try {

                const localResult =
                    await AI_CORE.think(message);


                if (
                    localResult &&
                    typeof localResult.response === "string" &&
                    localResult.response.trim() &&
                    !localResult.response.startsWith(
                        "Komutunu aldım:"
                    )
                ) {

                    const answer =
                        localResult.response.trim();


                    addMessage(
                        answer,
                        "jarvis"
                    );


                    saveConversation(
                        message,
                        answer
                    );


                    return;

                }

            } catch (error) {

                console.error(
                    "JARVIS AI Core hatası:",
                    error
                );

            }

        }


        /*
         * ======================================
         * 2. CLOUDFLARE WORKER
         * ======================================
         */

        try {

            const answer =
                await askWorker(message);


            addMessage(
                answer,
                "jarvis"
            );


            saveConversation(
                message,
                answer
            );

        } catch (error) {

            console.error(
                "JARVIS Worker hatası:",
                error
            );


            addMessage(
                "Bağlantı hatası: " +
                error.message,
                "jarvis"
            );

        }

    }


    /*
     * ==========================================
     * GLOBAL API
     * ==========================================
     *
     * voice.js bunu kullanabilecek.
     */

    window.JarvisApp = {

        processCommand

    };


    /*
     * ==========================================
     * GÖNDER BUTONU
     * ==========================================
     */

    send.addEventListener(
        "click",
        () => {

            processCommand(
                input.value
            );

            input.value = "";

            input.focus();

        }
    );


    /*
     * ==========================================
     * ENTER
     * ==========================================
     */

    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                processCommand(
                    input.value
                );

                input.value = "";

            }

        }
    );


    console.log(
        "🚀 JARVIS App aktif."
    );

});
