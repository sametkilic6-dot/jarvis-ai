"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const input =
        document.getElementById("command");

    const send =
        document.getElementById("send");

    const conversation =
        document.getElementById("conversation");


    if (!input || !send || !conversation) {

        console.error(
            "JARVIS: Arayüz elemanları bulunamadı."
        );

        return;
    }


    const WORKER_URL =
        "https://jarvis-ai.agitacer6.workers.dev/";


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


    function isMemorySummaryQuestion(text) {

        const normalized =
            text
                .toLowerCase()
                .replace(/ı/g, "i")
                .replace(/ş/g, "s")
                .replace(/ğ/g, "g")
                .replace(/ü/g, "u")
                .replace(/ö/g, "o")
                .replace(/ç/g, "c");


        const patterns = [

            "benim hakkimda ne biliyorsun",

            "benim hakkimda neler biliyorsun",

            "benim hakkimda bildiklerin",

            "benim hakkimda ne biliyorsun",

            "beni taniyor musun",

            "benim bilgilerim neler",

            "hafizamda ne var",

            "benimle ilgili ne biliyorsun"

        ];


        return patterns.some(
            pattern =>
                normalized.includes(pattern)
        );

    }


    function createMemorySummary(memory) {

        const lines = [];


        if (memory.name) {

            lines.push(
                "Adın: " +
                memory.name
            );

        }


        const facts =
            Object.entries(
                memory.facts || {}
            );


        for (const [key, value]
            of facts) {

            lines.push(
                `${key}: ${value}`
            );

        }


        const preferences =
            Object.entries(
                memory.preferences || {}
            );


        for (const [key, value]
            of preferences) {

            lines.push(
                `${key}: ${value}`
            );

        }


        if (!lines.length) {

            return "Hafızamda senin hakkında kayıtlı bilgi bulunmuyor.";

        }


        return (
            "Hafızamda senin hakkında kayıtlı gerçek bilgiler:\n\n" +
            lines
                .map(item => "• " + item)
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

            const memory =
                getMemory();


            /*
             * GENİŞ HAFIZA SORULARI
             * DOĞRUDAN GERÇEK MEMORY'DEN CEVAPLANIR.
             */

            if (
                isMemorySummaryQuestion(text)
            ) {

                const summary =
                    createMemorySummary(
                        memory
                    );


                addMessage(
                    summary,
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
                        summary
                    );

                }


                return;

            }


            /*
             * NORMAL SORULAR
             * CLOUDFLARE AI'YA GİDER.
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
