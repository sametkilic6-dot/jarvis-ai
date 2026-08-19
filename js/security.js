const SECURITY_LEVELS = {
    SAFE: "safe",
    CONTROLLED: "controlled",
    CRITICAL: "critical"
};

const Security = {

    permissions: {
        safe: true,
        controlled: false,
        critical: false
    },

    classify(action) {

        const criticalActions = [
            "delete",
            "remove",
            "install",
            "execute",
            "modify-security",
            "modify-permissions",
            "self-update"
        ];

        const controlledActions = [
            "write-file",
            "edit-file",
            "memory-change",
            "run-tool"
        ];

        const actionName =
            String(action).toLowerCase();

        if (
            criticalActions.some(
                keyword =>
                    actionName.includes(keyword)
            )
        ) {
            return SECURITY_LEVELS.CRITICAL;
        }

        if (
            controlledActions.some(
                keyword =>
                    actionName.includes(keyword)
            )
        ) {
            return SECURITY_LEVELS.CONTROLLED;
        }

        return SECURITY_LEVELS.SAFE;
    },


    requiresApproval(action) {

        const level =
            this.classify(action);

        return (
            level ===
            SECURITY_LEVELS.CRITICAL
        );
    },


    createApprovalRequest(action, reason) {

        return {

            id: crypto.randomUUID(),

            action,

            reason,

            level:
                this.classify(action),

            status: "pending",

            createdAt:
                new Date().toISOString()

        };

    },


    approve(request) {

        if (!request) {
            return false;
        }

        request.status = "approved";

        return true;

    },


    deny(request) {

        if (!request) {
            return false;
        }

        request.status = "denied";

        return true;

    }

};
