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

        const microphone =
            document.getElementById("microphone");


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


        if (microphone) {

            microphone.addEventListener(
                "click",
                () => {

                    if (
                        typeof Voice !==
                        "undefined"
                    ) {

                        Voice.listen();

                    }

                }
            );

        }

    },


    async processCommand() {

        const input =
            document.getElementById("command");


        if (!input) {
            return;
        }


        const command =
            input.value.trim();


        if (!command) {
            return;
        }


        input.value = "";


        this.addMessage(
            command,
            "user"
        );


        this.updateStatus(
            "JARVIS düşünüyor..."
        );


        try {

            const result =
                await AI_CORE.think(
                    command
                );


            const response =
                result?.response ||
                "AI cevap vermedi.";


            this.addMessage(
                response,
                "jarvis"
            );


            if (
                typeof Memory !==
                "undefined"
            ) {

                Memory.addConversation(
                    "user",
                    command
                );


                Memory.addConversation(
                    "assistant",
                    response
                );

            }


            if (
                typeof Voice !==
                "undefined" &&
                typeof Voice.speak ===
                "function"
            ) {

                Voice.speak(
                    response
                );

            }


            this.updateStatus(
                "Sistemler çevrimiçi."
            );


        } catch (error) {

            console.error(
                "JARVIS APP ERROR:",
                error
            );


            const message =
                error?.message ||
                String(error);


            this.addMessage(
                "GERÇEK HATA: " +
                message,
                "jarvis"
            );


            this.updateStatus(
                "HATA: " +
                message
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
