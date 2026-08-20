"use strict";

/*
 * JARVIS SECURITY CORE
 *
 * Temel prensip:
 *
 * JARVIS kendini geliştirebilir.
 * Ancak güvenlik sınırlarını,
 * yetkilerini veya onay sistemini
 * kendi başına değiştiremez.
 */

const SECURITY_LEVELS = {

    SAFE: "safe",

    CONTROLLED: "controlled",

    CRITICAL: "critical"

};


const Security = {

    version: "1.0.0",

    approvalRequests: [],


    /*
     * Değiştirilemeyecek korumalı alanlar.
     */

    protectedModules: [

        "security.js",

        "self-improve.js"

    ],


    /*
     * İşlemin risk seviyesini belirle.
     */

    classify(action) {

        const value =
            String(action || "")
                .toLowerCase();


        const criticalKeywords = [

            "delete-system",

            "delete-all",

            "execute-system",

            "install-system",

            "modify-security",

            "modify-permission",

            "modify-protection",

            "disable-security",

            "disable-approval",

            "change-owner",

            "self-update-core",

            "self-modify-security"

        ];


        const controlledKeywords = [

            "write-file",

            "edit-file",

            "create-file",

            "delete-file",

            "memory-change",

            "run-tool",

            "self-improvement",

            "system-change"

        ];


        if (
            criticalKeywords.some(
                keyword =>
                    value.includes(keyword)
            )
        ) {

            return SECURITY_LEVELS.CRITICAL;

        }


        if (
            controlledKeywords.some(
                keyword =>
                    value.includes(keyword)
            )
        ) {

            return SECURITY_LEVELS.CONTROLLED;

        }


        return SECURITY_LEVELS.SAFE;

    },


    /*
     * Kritik işlem mi?
     */

    requiresApproval(action) {

        return (
            this.classify(action) ===
            SECURITY_LEVELS.CRITICAL
        );

    },


    /*
     * Kontrollü işlemler de
     * ileride kullanıcı onayına
     * bağlanabilecek.
     */

    requiresControl(action) {

        const level =
            this.classify(action);


        return (
            level ===
            SECURITY_LEVELS.CONTROLLED
        );

    },


    /*
     * Korunan dosya mı?
     */

    isProtectedModule(
        moduleName
    ) {

        if (!moduleName) {
            return false;
        }


        return this.protectedModules
            .includes(
                moduleName
            );

    },


    /*
     * Onay isteği oluştur.
     */

    createApprovalRequest({

        action,

        reason = "",

        details = {}

    }) {

        const request = {

            id:
                this.createId(),

            action,

            reason,

            details,

            level:
                this.classify(
                    action
                ),

            status:
                "pending",

            createdAt:
                new Date()
                    .toISOString()

        };


        this.approvalRequests.push(
            request
        );


        return request;

    },


    /*
     * Bekleyen onaylar.
     */

    getPendingApprovals() {

        return this.approvalRequests
            .filter(
                request =>
                    request.status ===
                    "pending"
            );

    },


    /*
     * Kullanıcı onayı.
     */

    approve(id) {

        const request =
            this.approvalRequests
                .find(
                    item =>
                        item.id === id
                );


        if (!request) {

            return {

                success: false,

                error:
                    "Onay isteği bulunamadı."

            };

        }


        request.status =
            "approved";


        request.approvedAt =
            new Date()
                .toISOString();


        return {

            success: true,

            request

        };

    },


    /*
     * Kullanıcı reddi.
     */

    deny(id) {

        const request =
            this.approvalRequests
                .find(
                    item =>
                        item.id === id
                );


        if (!request) {

            return {

                success: false,

                error:
                    "Onay isteği bulunamadı."

            };

        }


        request.status =
            "denied";


        request.deniedAt =
            new Date()
                .toISOString();


        return {

            success: true,

            request

        };

    },


    /*
     * Güvenlik kontrolü.
     */

    canExecute(action) {

        const level =
            this.classify(
                action
            );


        if (
            level ===
            SECURITY_LEVELS.SAFE
        ) {

            return {

                allowed: true,

                level

            };

        }


        return {

            allowed: false,

            level,

            reason:
                "Kullanıcı kontrolü gerekiyor."

        };

    },


    /*
     * Benzersiz ID.
     */

    createId() {

        if (
            typeof crypto !==
                "undefined" &&
            typeof crypto.randomUUID ===
                "function"
        ) {

            return crypto.randomUUID();

        }


        return (
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2)
        );

    }

};


/*
 * Güvenlik çekirdeği başlatıldı.
 */

console.log(
    "JARVIS Security Core aktif."
);
