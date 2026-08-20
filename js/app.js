"use strict";

const JarvisApp = {

    initialized: false,

    init() {

        if (this.initialized) {
            return;
        }

        this.initialized = true;

        this.bindEvents();

        this.updateStatus(
            "Sistemler çevrimiçi."
        );

    },


    bindEvents() {

        const send =
            document.getElementById("send");

        const command =
            document.getElementById("command");


        if (send) {

            send.addEventListener(
                "click",
                () => this.processCommand()
            );

        }


        if (command) {

            command.addEventListener(
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

    },


    async processCommand() {

        const input =
            document.getElementById(
                "command"
            );


        if (!input) {
            return;
        }


        const text =
            input.value.trim();


        if (!text) {
            return;
        }


        input.value = "";


        this.addMessage(
            text,
            "user"
        );


        this.updateStatus(
            "JARVIS düşünüyor..."
        );


        try {

            const result =
                await AI_CORE.think(
                    text
                );


            const response =
                result &&
                result.response
                    ? result.response
                    : "JARVIS cevap vermedi.";


            this.addMessage(
                response,
                "jarvis"
            );


            this.updateStatus(
                "Sistemler çevrimiçi."
            );


        } catch (error) {

            console.error(
                "JARVIS ERROR:",
                error
            );


            this.addMessage(
                "JARVIS hata verdi: " +
                (
                    error.message ||
                    error
                ),
                "jarvis"
            );


            this.updateStatus(
                "Hata oluştu."
            );

        }

    },


    addMessage(
        text,
        sender
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


        if (
            sender !== "user"
        ) {

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


        conversation.scrollTop =
            conversation.scrollHeight;

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

    }

};


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        () => JarvisApp.init()
    );

} else {

    JarvisApp.init();

}
