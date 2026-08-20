"use strict";

/*
 * JARVIS SELF-IMPROVEMENT CORE
 *
 * JARVIS:
 * - Hata tespit edebilir
 * - İyileştirme önerebilir
 * - Önerileri kaydedebilir
 * - Test sonucu tutabilir
 *
 * JARVIS:
 * - Güvenlik çekirdeğini değiştiremez
 * - Onay mekanizmasını atlayamaz
 * - Kendi yetkisini artıramaz
 *
 * Gerçek kod değişikliği daha sonra
 * güvenli bir backend/sandbox üzerinden
 * ve kullanıcı onayıyla yapılacaktır.
 */

const SelfImprove = {

    version: "1.0.0",

    enabled: true,

    proposals: [],

    protectedModules: [

        "security.js",

        "self-improve.js"

    ],


    /*
     * =====================================================
     * GELİŞTİRME ÖNERİSİ OLUŞTUR
     * =====================================================
     */

    createProposal({

        title,

        description,

        target,

        reason,

        expectedBenefit = ""

    }) {

        if (
            !title ||
            !description ||
            !target
        ) {

            return {

                success: false,

                error:
                    "Eksik geliştirme bilgisi."

            };

        }


        /*
         * Korunan modüller değiştirilemez.
         */

        if (
            this.isProtected(
                target
            )
        ) {

            return {

                success: false,

                error:
                    "Bu modül JARVIS tarafından değiştirilemez."

            };

        }


        const proposal = {

            id:
                this.createId(),

            title,

            description,

            target,

            reason,

            expectedBenefit,

            status:
                "pending",

            testStatus:
                "not-tested",

            createdAt:
                new Date()
                    .toISOString()

        };


        this.proposals.push(
            proposal
        );


        this.save();


        return {

            success: true,

            proposal

        };

    },


    /*
     * =====================================================
     * KORUMALI MODÜL KONTROLÜ
     * =====================================================
     */

    isProtected(
        moduleName
    ) {

        return this.protectedModules
            .includes(
                moduleName
            );

    },


    /*
     * =====================================================
     * ÖNERİLER
     * =====================================================
     */

    getProposals() {

        return [
            ...this.proposals
        ];

    },


    getPendingProposals() {

        return this.proposals.filter(
            proposal =>
                proposal.status ===
                "pending"
        );

    },


    /*
     * =====================================================
     * TEST SONUCU
     * =====================================================
     */

    recordTest(
        id,
        success,
        details = ""
    ) {

        const proposal =
            this.findProposal(id);


        if (!proposal) {

            return {

                success: false,

                error:
                    "Öneri bulunamadı."

            };

        }


        proposal.testStatus =
            success
                ? "passed"
                : "failed";


        proposal.testDetails =
            details;


        proposal.testedAt =
            new Date()
                .toISOString();


        this.save();


        return {

            success: true,

            proposal

        };

    },


    /*
     * =====================================================
     * SAMET ONAYI
     * =====================================================
     */

    approve(id) {

        const proposal =
            this.findProposal(id);


        if (!proposal) {

            return {

                success: false,

                error:
                    "Öneri bulunamadı."

            };

        }


        /*
         * Test başarılı olmadan
         * kritik geliştirme onaylanamaz.
         */

        if (
            proposal.testStatus !==
            "passed"
        ) {

            return {

                success: false,

                error:
                    "Önce geliştirme test edilmelidir."

            };

        }


        proposal.status =
            "approved";


        proposal.approvedAt =
            new Date()
                .toISOString();


        this.save();


        return {

            success: true,

            proposal

        };

    },


    /*
     * =====================================================
     * REDDET
     * =====================================================
     */

    reject(id) {

        const proposal =
            this.findProposal(id);


        if (!proposal) {

            return {

                success: false,

                error:
                    "Öneri bulunamadı."

            };

        }


        proposal.status =
            "rejected";


        proposal.rejectedAt =
            new Date()
                .toISOString();


        this.save();


        return {

            success: true,

            proposal

        };

    },


    /*
     * =====================================================
     * GELİŞTİRME ANALİZİ
     * =====================================================
     */

    analyze(

        target,

        reason

    ) {

        return this.createProposal({

            title:
                "JARVIS geliştirme önerisi",

            description:
                `${target} modülünde geliştirme önerildi.`,

            target,

            reason,

            expectedBenefit:
                "Daha iyi performans ve daha güvenilir çalışma."

        });

    },


    /*
     * =====================================================
     * ÖNERİ BUL
     * =====================================================
     */

    findProposal(id) {

        return this.proposals.find(
            proposal =>
                proposal.id === id
        );

    },


    /*
     * =====================================================
     * HAFIZAYA KAYDET
     * =====================================================
     */

    save() {

        try {

            localStorage.setItem(

                "jarvis_self_improvements",

                JSON.stringify(
                    this.proposals
                )

            );

        } catch (error) {

            console.error(
                "Self-improvement kayıt hatası:",
                error
            );

        }

    },


    /*
     * =====================================================
     * KAYITLARI YÜKLE
     * =====================================================
     */

    load() {

        try {

            const saved =
                localStorage.getItem(
                    "jarvis_self_improvements"
                );


            if (saved) {

                const parsed =
                    JSON.parse(
                        saved
                    );


                if (
                    Array.isArray(
                        parsed
                    )
                ) {

                    this.proposals =
                        parsed;

                }

            }

        } catch (error) {

            console.error(
                "Self-improvement yükleme hatası:",
                error
            );

        }

    },


    /*
     * =====================================================
     * ID
     * =====================================================
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
 * Önceden kaydedilmiş geliştirmeleri yükle.
 */

SelfImprove.load();


console.log(
    "JARVIS Self-Improvement Core aktif."
);
