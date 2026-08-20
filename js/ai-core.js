"use strict";

/*
 * JARVIS LOCAL AI CORE
 *
 * WebLLM ile modeli doğrudan tarayıcıda çalıştırır.
 *
 * API KEY YOK
 * Sunucu YOK
 * İstek başına ücret YOK
 */

const AI_CORE = {

    engine: null,

    initialized: false,

    loading: false,

    modelLoaded: false,

    /*
     * İlk test için nispeten küçük model.
     *
     * Model seçimini daha sonra cihazın
     * gücüne göre otomatikleştireceğiz.
     */

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

            /*
             * WebLLM'i doğrudan module olarak yükle.
             */

            const webllm =
                await import(
                    "https://esm.run/@mlc-ai/web-llm"
                );


            /*
             * Engine oluştur.
             */

            this.engine =
                await webllm.CreateMLCEngine(
                    this.model,
                    {

                        initProgressCallback:
                            progress =>
                                this.handleProgress(
                                    progress
                                )

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
                "Yerel AI aktif"
            );


            console.log(
                "JARVIS Local AI hazır."
            );


            return true;


        } catch (error) {

            console.error(
                "WebLLM başlatma hatası:",
                error
            );


            this.loading =
                false;


            this.updateStatus(
                "Yerel AI başlatılamadı."
            );


            this.updateModelStatus(
                "AI modeli bu cihazda çalıştırılamadı."
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


        /*
         * Model henüz yüklenmediyse başlat.
         */

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

            /*
             * Hafızadan yakın konuşmaları al.
             */

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


                if (
                    recent.length
                ) {

                    context =
                        recent
                            .map(
                                message =>
                                    `${message.role}: ${message.text}`
                            )
                            .join("\n");

                }

            }


            const systemPrompt = `

Sen JARVIS'sin.

Kullanıcı: Samet.

Türkçe konuş.

Kısa, doğal ve anlaşılır cevaplar ver.

Kendini JARVIS olarak tanıt.

Bilmediğin bilgileri uydurma.

Kritik sistem işlemlerini kullanıcı
onayı olmadan gerçekleştirme.

Kullanıcı senden kod veya sistem
değişikliği istediğinde önce ne
yapacağını açıkla.

Önceki konuşma bağlamı:

${context}

`;


            const response =
                await this.engine.chat.completions.create({

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


            const text =
                response
                    ?.choices?.[0]
                    ?.message
                    ?.content
                    ?.trim();


            if (!text) {

                return {

                    success: false,

                    response:
                        "AI cevap oluşturamadı."

                };

            }


            return {

                success: true,

                response:
                    text

            };


        } catch (error) {

            console.error(
                "JARVIS AI hatası:",
                error
            );


            return {

                success: false,

                response:
                    "Yerel AI çalışırken bir hata oluştu."

            };

        }

    },


    handleProgress(progress) {

        const value =
            progress?.progress;


        const text =
            progress?.text;


        const percent =
            typeof value === "number"
                ? Math.round(
                    value * 100
                )
                : null;


        const message =
            percent !== null
                ? `AI modeli hazırlanıyor: ${percent}%`
                : (
                    text ||
                    "AI modeli hazırlanıyor..."
                );


        this.updateModelStatus(
            message
        );


        const progressElement =
            document.getElementById(
                "model-progress"
            );


        if (progressElement) {

            progressElement.style.display =
                "block";


            progressElement.textContent =
                message;

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


/*
 * Sayfa açıldığında AI modelini
 * otomatik indirmiyoruz.
 *
 * Kullanıcı ilk mesajı gönderdiğinde
 * model başlatılacak.
 */

console.log(
    "JARVIS Local AI Core yüklendi."
);
