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
            sender === "user"
                ? "user"
                : "jarvis"
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

        addMessage(
            text,
            "user"
        );


        try {

            const result =
                await AI_CORE.think(text);


            addMessage(
                result.response,
                "jarvis"
            );


        } catch (error) {

            console.error(
                "JARVIS ERROR:",
                error
            );


            addMessage(
                "Bir hata oluştu: " +
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

            if (event.key === "Enter") {

                event.preventDefault();

                sendMessage();
            }
        }
    );

});
