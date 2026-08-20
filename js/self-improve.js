const SelfImprove = {

    enabled: true,

    protectedModules: [
        "security.js",
        "self-improve.js"
    ],

    proposals: [],


    createProposal({
        title,
        description,
        target,
        reason
    }) {

        if (!title || !description || !target) {
            return {
                success: false,
                error: "Eksik geliştirme önerisi."
            };
        }

        if (
            this.protectedModules.includes(target)
        ) {

            return {
                success: false,
                error:
                    "Bu modül JARVIS tarafından değiştirilemez."
            };

        }


        const proposal = {

            id: crypto.randomUUID(),

            title,

            description,

            target,

            reason,

            status: "pending",

            createdAt:
                new Date().toISOString()

        };


        this.proposals.push(proposal);


        return {

            success: true,

            proposal

        };

    },


    getPendingProposals() {

        return this.proposals.filter(
            proposal =>
                proposal.status === "pending"
        );

    },


    approve(id) {

        const proposal =
            this.proposals.find(
                item => item.id === id
            );

        if (!proposal) {

            return {
                success: false,
                error: "Öneri bulunamadı."
            };

        }


        proposal.status = "approved";

        return {

            success: true,

            proposal

        };

    },


    reject(id) {

        const proposal =
            this.proposals.find(
                item => item.id === id
            );

        if (!proposal) {

            return {
                success: false,
                error: "Öneri bulunamadı."
            };

        }


        proposal.status = "rejected";

        return {

            success: true,

            proposal

        };

    },


    analyzeImprovement(target, reason) {

        return this.createProposal({

            title:
                "JARVIS iyileştirme önerisi",

            description:
                "JARVIS bu modülün geliştirilmesini öneriyor.",

            target,

            reason

        });

    }

};
