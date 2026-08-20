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
            "JARVIS: Arayüz elemanları bulunamadı."
        );

        return;
    }


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
            text;

        message.appendChild(content);

        conversation.appendChild(message);

        conversation.scrollTop =
            conversation.scrollHeight;

    }


    function getMemory() {

        if (
            typeof Memory === "undefined"
        ) {

            return {
                name: null,
                facts: {},
                preferences: {},
                recent: []
            };

        }


        return {

            name:
                Memory.getName(),

            facts:
                Memory.allFacts(),

            preferences:
                Memory.allPreferences(),

            recent:
                Memory.recent(10)

        };

    }


    async function sendMessage() {

        const text =
            input.value.trim();


        if (!text) {
            return;
        }


        input.value = "";


        addMessage(
            text,
            "user"
        );


        try {

            /*
             * =================================
             * 1. ÖNCE LOCAL AI CORE
             * =================================
             *
             * Hafıza gerektiren komutlar burada
             * işlenir.
             */

            if (
                typeof AI_CORE !== "undefined" &&
                typeof AI_CORE.think === "function"
            ) {

                const localResult =
                    await AI_CORE.think(text);


                if (
                    localResult &&
                    localResult.response &&
                    !localResult.response.startsWith(
                        "Komutunu aldım:"
                    )
                ) {

                    addMessage(
                        localResult.response,
                        "jarvis"
                    );


                    if (
                        typeof Memory !==
                        "undefined"
                    ) {

                        Memory.add(
                            "user",
                            text
                        );

                        Memory.add(
                            "jarvis",
                            localResult.response
                        );

                    }


                    return;

                }

            }


            /*
             * =================================
             * 2. CLOUDFLARE WORKERS AI
             * =================================
             */

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


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error ||
                    "Worker hata verdi."
                );

            }


            const answer =
                result.response ||
                "JARVIS cevap vermedi.";


            addMessage(
                answer,
                "jarvis"
            );


            if (
                typeof Memory !==
                "undefined"
            ) {

                Memory.add(
                    "user",
                    text
                );

                Memory.add(
                    "jarvis",
                    answer
                );

            }


        } catch (error) {

            console.error(
                "JARVIS ERROR:",
                error
            );


            addMessage(
                "Bağlantı hatası: " +
                error.message,
                "jarvis"
            );

        }

    }


    send.addEventListener(
        "click",
        sendMessage
    );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );

});
