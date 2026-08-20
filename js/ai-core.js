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
            "JARVIS cihazı kontrol ediyor..."
        );

        try {

            /*
             * 1. WebGPU kontrolü
             */

            if (!navigator.gpu) {

                throw new Error(
                    "WebGPU bu tarayıcıda bulunamadı."
                );

            }

            this.updateStatus(
                "WebGPU bulundu. AI motoru hazırlanıyor..."
            );


            /*
             * 2. GPU adapter kontrolü
             */

            const adapter =
                await navigator.gpu.requestAdapter();


            if (!adapter) {

                throw new Error(
                    "GPU adapter oluşturulamadı."
                );

            }


            /*
             * 3. WebLLM yükle
             */

            this.updateStatus(
                "WebLLM yükleniyor..."
            );


            const webllm =
                await import(
                    "https://esm.run/@mlc-ai/web-llm"
                );


            /*
             * 4. Modeli başlat
             */

            this.updateStatus(
                "Yerel AI modeli başlatılıyor..."
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


            this.initialized =
                true;

            this.modelLoaded =
                true;

            this.loading =
                false;


            this.updateStatus(
                "JARVIS çevrimiçi."
            );

            this.updateModelStatus(
                "Yerel AI aktif."
            );


            return true;


        } catch (error) {

            this.loading =
                false;


            const message =
                error?.message ||
                String(error);


            console.error(
                "JARVIS AI ERROR:",
                error
            );


            /*
             * Gerçek hatayı ekranda göster.
             */

            this.updateStatus(
                "AI başlatılamadı."
            );


            this.updateModelStatus(
                "HATA: " + message
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
                        "Yerel AI başlatılamadı. " +
                        "Ekrandaki hata mesajını kontrol et."

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
                    Memory
                        .getRecentConversations(
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

Doğal ve anlaşılır cevaplar ver.

Bilmediğin bilgileri uydurma.

Kritik işlemler için Samet'in
onayı gerekir.

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


            return {

                success: true,

                response:
                    response ||
                    "AI boş cevap döndürdü."

            };


        } catch (error) {

            console.error(
                "JARVIS cevap hatası:",
                error
            );


            return {

                success: false,

                response:
                    "AI cevap oluştururken hata oluştu: " +
                    (
                        error?.message ||
                        "Bilinmeyen hata"
                    )

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
                ? `Model hazırlanıyor: ${percent}%`
                : (
                    progress?.text ||
                    "Model hazırlanıyor..."
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
    "JARVIS DIAGNOSTIC AI CORE yüklendi."
);
