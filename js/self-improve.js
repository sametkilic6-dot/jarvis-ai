// self-improve.js - JARVIS Kendini Güncelleme Core v5 (Worker yok)

const SelfImprove = (function() {
    const STORAGE_KEY = 'jarvis_self_improve_v1';

    function load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return { proposals: [], history: [] };
    }

    function save(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {}
    }

    let state = load();

    function createProposal(title, description, codeChanges, type = 'enhancement') {
        const proposal = {
            id: Date.now(),
            title,
            description,
            type,
            codeChanges,
            status: 'pending',
            createdAt: new Date().toISOString(),
            appliedAt: null
        };
        state.proposals.push(proposal);
        save(state);
        return proposal;
    }

    function getPendingProposals() {
        return state.proposals.filter(p => p.status === 'pending');
    }

    function getProposals() {
        return state.proposals;
    }

    function approveProposal(id) {
        const proposal = state.proposals.find(p => p.id === id);
        if (!proposal) return null;
        proposal.status = 'approved';
        save(state);
        return proposal;
    }

    function rejectProposal(id) {
        const proposal = state.proposals.find(p => p.id === id);
        if (!proposal) return null;
        proposal.status = 'rejected';
        save(state);
        return proposal;
    }

    function applyProposal(id) {
        const proposal = state.proposals.find(p => p.id === id);
        if (!proposal || proposal.status !== 'approved') return null;
        try {
            for (const change of proposal.codeChanges) {
                console.log(`📝 ${change.file} güncelleniyor...`);
                // Gerçek kod değişikliği burada yapılacak
            }
            proposal.status = 'applied';
            proposal.appliedAt = new Date().toISOString();
            save(state);
            return proposal;
        } catch (error) {
            console.error('Öneri uygulanırken hata:', error);
            return null;
        }
    }

    // Sohbet eklentisi önerisi (Worker yok, sadece mesaj)
    function proposeChatFeature() {
        return createProposal(
            'Sohbet Yeteneği (Yerel)',
            'JARVIS sohbet edemiyor. Bunun için Worker/API gerekir. Şimdilik bu özellik devre dışı.',
            [
                {
                    file: 'ai-core.js',
                    oldCode: '// Sohbet kodu burada olacak',
                    newCode: `// Sohbet yeteneği şu anda devre dışı.\n// Worker/API entegrasyonu gerektirir.`
                }
            ],
            'feature'
        );
    }

    function analyze() {
        const missing = [];
        // Sohbet kontrolü (AICore içinde chatWithAI yoksa)
        if (typeof AICore?.chatWithAI !== 'function') {
            const proposal = proposeChatFeature();
            missing.push({
                title: 'Sohbet Yeteneği',
                description: 'JARVIS sohbet edemiyor. Worker/API entegrasyonu gerektirir.',
                proposal: proposal
            });
        }
        return missing;
    }

    return {
        createProposal,
        getPendingProposals,
        getProposals,
        approveProposal,
        rejectProposal,
        applyProposal,
        proposeChatFeature,
        analyze
    };
})();

window.SelfImprove = SelfImprove;
