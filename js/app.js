"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("command");
    const send = document.getElementById("send");
    const conversation = document.getElementById("conversation");

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


    function isMemorySummary(text) {

        const t =
            text
                .toLowerCase()
                .replace(/ı/g, "i")
                .replace(/ş/g, "s")
                .replace(/ğ/g, "g")
                .replace(/ü/g, "u")
                .replace(/ö/g, "o")
                .replace(/ç/g, "c")
                .trim();


        return (

            t.includes("benim hakkimda ne biliyorsun") ||

            t.includes("benim hakkimda neler biliyorsun") ||

            t.includes("benim bilgilerim neler") ||

            t.includes("hafizamda ne var") ||

            t.includes("hafizamda neler var") ||

            t.includes("benimle ilgili ne biliyorsun") ||

            t.includes("beni taniyor musun")

        );

    }


    function createMemorySummary(memory) {

        const lines = [];


        if (memory.name) {

            lines.push(
                "Ad: " +
                memory.name
            );

        }


        Object.entries(
            memory.facts || {}
        ).forEach(
            ([key, value]) => {

                lines.push(
                    key +
                    ": " +
                    value
                );

            }
        );


        Object.entries(
            memory.preferences || {}
        ).forEach(
            ([key, value]) => {

                lines.push(
                    key +
                    ": " +
                    value
                );

            }
        );


        if (!lines.length) {

            return (
                "Hafızamda senin hakkında " +
                "kayıtlı bilgi bulunmuyor."
            );

        }


        return (
            "Hafızamda bulunan gerçek bilgiler:\n\n" +
            lines
                .map(
                    item => "• " + item
                )
                .join("\n")
        );

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
             * 1. ÖNCE YEREL AI CORE
             *
             * İsim, favori renk gibi
             * hafıza işlemleri burada yapılır.
             */

            if (
                typeof AI_CORE !== "undefined" &&
                typeof AI_CORE.think === "function"
            ) {

                const localResult =
                    await AI_CORE.think(text);


                /*
                 * AI Core gerçekten
                 * özel bir cevap ürettiyse
                 * doğrudan kullan.
                 */

                if (
                    localResult &&
                    localResult.response
                ) {

                    const lower =
                        text.toLowerCase();


                    const isKnownCommand =
                        lower.includes("benim adım") ||
                        lower.includes("ismim") ||
                        lower.includes("en sevdiğim renk") ||
                        lower.includes("sevdiğim renk ne") ||
                        lower.includes("benim adım ne") ||
                        lower.includes("ismim ne");


                    if (isKnownCommand) {

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

            }


            /*
             * 2. HAFIZA ÖZETİ
             *
             * Bu soru AI'ya gitmez.
             * Sadece gerçek Memory okunur.
             */

            const memory =
                getMemory();


            if (
                isMemorySummary(text)
            ) {

                const answer =
                    createMemorySummary(
                        memory
                    );


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


                return;

            }


            /*
             * 3. NORMAL MESAJ
             *
             * Cloudflare Workers AI
             */

            const response =
                await fetch(
                    WORKER_URL,
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                message:
                                    text,

                                memory:
                                    getMemory()

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
