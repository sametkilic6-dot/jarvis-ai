"use strict";

const AI_CORE = {

    engine: null,

    initialized: false,

    loading: false,

    modelLoaded: false,

    model:
        "Llama-3.2-1B-Instruct-q4f16_1-MLC",


    async init() {

        if (this.initialized) {
            return true;
        }

        if (this.loading) {
            return false;
        }

        this.loading = true;

        this.updateStatus(
            "Yerel AI hazırlanıyor..."
        );

        try {

            const webllm =
                await import(
                    "https://esm.run/@mlc-ai/web-llm"
                );

            this.engine =
                await webllm.CreateMLCEngine(
                    this.model,
                    {
                        initProgressCallback:
                            progress => {
                                this.handleProgress(
                                    progress
                                );
                            }
                    }
                );

            this.initialized = true;
            this.modelLoaded = true;
            this.loading = false;

            this.updateStatus(
                "JARVIS çevrimiçi."
            );

            this.updateModelStatus(
                "Yerel AI aktif"
            );

            return true;

        } catch (error) {

            console.error(
                "WebLLM başlatma hatası:",
                error
            );

            this.loading = false;

            this.updateStatus(
                "Yerel AI başlatılamadı."
            );

            this.updateModelStatus(
                "AI modeli başlatılamadı."
            );

            return false;
        }
    },


    async think(input) {

        if (
            !input ||
            !input.trim()
        ) {

            return {
                success: false,
                response:
                    "Komut algılanamadı."
            };
        }


        if (!this.modelLoaded) {

            const ready =
                await this.init();

            if (!ready) {

                return {
                    success: false,
                    response:
                        "Yerel AI modeli başlatılamadı."
                };
            }
        }


        try {

            let context = "";


            if (
                typeof Memory !==
                "undefined"
            ) {

                const recent =
                    Memory.getRecentConversations(
                        10
                    );

                context =
                    recent
                        .map(
                            message =>
                                `${message.role}: ${message.text}`
                        )
                        .join("\n");
            }


            const systemPrompt = `
Sen JARVIS'sin.

Kullanıcı Samet.

Her zaman Türkçe konuş.

Doğal, anlaşılır ve doğru cevaplar ver.

Bilmediğin bilgileri uydurma.

Kritik sistem işlemleri için
kullanıcı onayı gerekir.

Önceki konuşmalar:

${context}
`;


            const result =
                await this.engine
                    .chat
                    .completions
                    .create({

                        messages: [

                            {
                                role:
                                    "system",

                                content:
                                    systemPrompt
                            },

                            {
                                role:
                                    "user",

                                content:
                                    input
                            }

                        ],

                        temperature:
                            0.7,

                        max_tokens:
                            512
                    });


            const response =
                result
                    ?.choices?.[0]
                    ?.message
                    ?.content
                    ?.trim();


            if (!response) {

                return {
                    success: false,
                    response:
                        "AI cevap oluşturamadı."
                };
            }


            return {

                success: true,

                response

            };


        } catch (error) {

            console.error(
                "JARVIS AI hatası:",
                error
            );

            return {

                success: false,

                response:
                    "Yerel AI çalışırken hata oluştu."

            };

        }

    },


    handleProgress(progress) {

        const percent =
            typeof progress?.progress ===
            "number"
                ? Math.round(
                    progress.progress * 100
                )
                : null;


        const text =
            percent !== null
                ? `AI modeli hazırlanıyor: ${percent}%`
                : (
                    progress?.text ||
                    "AI modeli hazırlanıyor..."
                );


        this.updateModelStatus(
            text
        );


        const element =
            document.getElementById(
                "model-progress"
            );


        if (element) {

            element.style.display =
                "block";

            element.textContent =
                text;
        }

    },


    updateStatus(text) {

        const element =
            document.getElementById(
                "system-status"
            );

        if (element) {

            element.textContent =
                text;
        }

    },


    updateModelStatus(text) {

        const element =
            document.getElementById(
                "model-status"
            );

        if (element) {

            element.textContent =
                text;
        }

    }

};


console.log(
    "JARVIS LOCAL AI CORE yüklendi."
);
