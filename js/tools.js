"use strict";

/*
 * JARVIS TOOLS CORE
 *
 * Bütün araçlar buraya kayıt edilir.
 * Araçlar AI tarafından doğrudan sınırsız
 * şekilde çalıştırılmaz.
 *
 * Önce Security Core kontrol eder.
 */

const JARVIS_TOOLS = {};


/*
 * =====================================================
 * ARAÇ KAYIT SİSTEMİ
 * =====================================================
 */

function registerTool({

    name,

    description,

    risk = "safe",

    execute

}) {

    if (
        !name ||
        typeof execute !== "function"
    ) {

        throw new Error(
            "Geçersiz JARVIS aracı."
        );

    }


    JARVIS_TOOLS[name] = {

        name,

        description,

        risk,

        execute

    };

}


/*
 * =====================================================
 * ARAÇ LİSTESİ
 * =====================================================
 */

function listTools() {

    return Object.values(
        JARVIS_TOOLS
    ).map(tool => ({

        name:
            tool.name,

        description:
            tool.description,

        risk:
            tool.risk

    }));

}


/*
 * =====================================================
 * SAAT
 * =====================================================
 */

registerTool({

    name: "saat",

    description:
        "Mevcut saati gösterir.",

    risk: "safe",

    execute() {

        return new Date()
            .toLocaleTimeString(
                "tr-TR",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

    }

});


/*
 * =====================================================
 * TARİH
 * =====================================================
 */

registerTool({

    name: "tarih",

    description:
        "Bugünün tarihini gösterir.",

    risk: "safe",

    execute() {

        return new Date()
            .toLocaleDateString(
                "tr-TR",
                {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                }
            );

    }

});


/*
 * =====================================================
 * HAFIZA İSTATİSTİĞİ
 * =====================================================
 */

registerTool({

    name: "hafiza-durumu",

    description:
        "JARVIS hafızasının durumunu gösterir.",

    risk: "safe",

    execute() {

        if (
            typeof Memory ===
            "undefined"
        ) {

            return "Hafıza sistemi hazır değil.";

        }


        const stats =
            Memory.getStats();


        return (
            "Hafıza hazır. " +
            stats.memories +
            " anı, " +
            stats.conversations +
            " konuşma ve " +
            stats.profileItems +
            " profil bilgisi kayıtlı."
        );

    }

});


/*
 * =====================================================
 * ARAÇ ÇALIŞTIRMA
 * =====================================================
 */

async function executeTool(
    name,
    parameters = {}
) {

    const tool =
        JARVIS_TOOLS[name];


    if (!tool) {

        return {

            success: false,

            error:
                "Araç bulunamadı: " +
                name

        };

    }


    /*
     * Araç riskini Security Core'a gönder.
     */

    const securityAction =
        `${tool.risk}-${tool.name}`;


    if (
        typeof Security !==
        "undefined"
    ) {

        const security =
            Security.canExecute(
                securityAction
            );


        if (!security.allowed) {

            const approval =
                Security
                    .createApprovalRequest({

                        action:
                            securityAction,

                        reason:
                            "JARVIS bu aracı çalıştırmak için kullanıcı kontrolüne ihtiyaç duyuyor.",

                        details: {

                            tool:
                                tool.name,

                            parameters

                        }

                    });


            return {

                success: false,

                requiresApproval: true,

                approval

            };

        }

    }


    /*
     * Aracı çalıştır.
     */

    try {

        const result =
            await tool.execute(
                parameters
            );


        return {

            success: true,

            result

        };

    } catch (error) {

        console.error(
            "JARVIS Tool Error:",
            error
        );


        return {

            success: false,

            error:
                error.message ||
                "Araç çalıştırılamadı."

        };

    }

}


/*
 * =====================================================
 * ARAÇ SİSTEMİ DURUMU
 * =====================================================
 */

function getToolsStatus() {

    return {

        active: true,

        count:
            Object.keys(
                JARVIS_TOOLS
            ).length,

        tools:
            listTools()

    };

}


console.log(
    "JARVIS Tools Core aktif.",
    getToolsStatus()
);
