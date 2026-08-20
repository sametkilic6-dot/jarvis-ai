const JARVIS_TOOLS = {};


/*
 * Araç kaydetme
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
 * Araç listeleme
 */

function listTools() {

    return Object.values(
        JARVIS_TOOLS
    ).map(tool => ({

        name: tool.name,

        description:
            tool.description,

        risk: tool.risk

    }));

}


/*
 * Güvenli araç: saat
 */

registerTool({

    name: "saat",

    description:
        "Mevcut saati söyler.",

    risk: "safe",

    execute() {

        return new Date()
            .toLocaleTimeString(
                "tr-TR"
            );

    }

});


/*
 * Güvenli araç: tarih
 */

registerTool({

    name: "tarih",

    description:
        "Bugünün tarihini söyler.",

    risk: "safe",

    execute() {

        return new Date()
            .toLocaleDateString(
                "tr-TR"
            );

    }

});


/*
 * JARVIS'in araç çalıştırması
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
                "Araç bulunamadı."

        };

    }


    /*
     * Kritik araçlar Security Core
     * tarafından kontrol edilecek.
     */

    if (
        typeof Security !== "undefined" &&
        Security.requiresApproval(
            `${tool.risk}-${name}`
        )
    ) {

        const approval =
            Security.createApprovalRequest(

                name,

                "JARVIS bu aracı çalıştırmak için izin istiyor."

            );

        return {

            success: false,

            requiresApproval: true,

            approval

        };

    }


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

        return {

            success: false,

            error:
                error.message

        };

    }

}
