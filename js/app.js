"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("command");
    const send = document.getElementById("send");
    const conversation = document.getElementById("conversation");

    if (!input || !send || !conversation) {
        console.error("JARVIS: Arayüz elemanları bulunamadı.");
        return;
    }


    function addMessage(text, sender) {

        const message = document.createElement("div");

        message.classList.add(
            "message",
            sender === "user" ? "user" : "jarvis"
        );


        if (sender !== "user") {

            const name =
                document.createElement("div");

            name.className = "message-name";

            name.textContent = "JARVIS";

            message.appendChild(name);
        }


        const content =
            document.createElement("div");

        content.textContent = text;

        message.appendChild(content);

        conversation.appendChild(message);

        conversation.scrollTop =
            conversation.scrollHeight;
    }


    async function sendMessage() {

        const text =
            input.value.trim();

        if (!text) {
            return;
        }


        input.value = "";


        // Kullanıcı mesajını ekrana yaz
        addMessage(text, "user");


        // Kullanıcı mesajını hafızaya kaydet
        if (typeof Memory !== "undefined") {

            Memory.add(
                "user",
                text
            );

        }


        try {

            const result =
                await AI_CORE.think(text);


            const response =
                result &&
                result.response
                    ? result.response
                    : "Şu anda cevap oluşturamadım.";


            // JARVIS cevabını ekrana yaz
            addMessage(
                response,
                "jarvis"
            );


            // JARVIS cevabını hafızaya kaydet
            if (typeof Memory !== "undefined") {

                Memory.add(
                    "jarvis",
                    response
                );

            }


        } catch (error) {

            console.error(
                "JARVIS ERROR:",
                error
            );


            const errorMessage =
                "Bir hata oluştu: " +
                error.message;


            addMessage(
                errorMessage,
                "jarvis"
            );


            if (typeof Memory !== "undefined") {

                Memory.add(
                    "jarvis",
                    errorMessage
                );

            }

        }

    }


    send.addEventListener(
        "click",
        sendMessage
    );


    input.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                sendMessage();

            }

        }
    );


    console.log(
        "🤖 JARVIS uygulaması hazır."
    );

});
