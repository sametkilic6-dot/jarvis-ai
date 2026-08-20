"use strict";

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const input =
            document.getElementById(
                "command"
            );

        const button =
            document.getElementById(
                "send"
            );

        const conversation =
            document.getElementById(
                "conversation"
            );


        button.addEventListener(
            "click",
            async () => {

                const text =
                    input.value.trim();

                if (!text) return;

                input.value = "";

                addMessage(
                    "Sen: " + text
                );


                const result =
                    await AI_CORE.think(
                        text
                    );


                addMessage(
                    "JARVIS: " +
                    result.response
                );

            }
        );


        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    button.click();

                }

            }
        );


        function addMessage(text) {

            const message =
                document.createElement(
                    "p"
                );

            message.textContent =
                text;

            conversation.appendChild(
                message
            );

        }

    }
);
