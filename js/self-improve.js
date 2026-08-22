// self-improve.js - JARVIS Kendini Güncelleme Core v7 (Gerçek Kod Değişikliği)

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
            codeChanges, // [{ file: 'ai-core.js', oldCode: '...', newCode: '...' }]
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

    // GERÇEK KOD DEĞİŞİKLİĞİ
    function applyProposal(id) {
        const proposal = state.proposals.find(p => p.id === id);
        if (!proposal || proposal.status !== 'approved') return null;

        try {
            for (const change of proposal.codeChanges) {
                console.log(`📝 ${change.file} güncelleniyor...`);

                // 1. Mevcut kodu al
                const currentCode = change.oldCode;

                // 2. Yeni kodu bul
                const newCode = change.newCode;

                // 3. Gerçek kod değişikliği (eval ile güncelleme)
                // NOT: Bu güvenlik riski taşır, ama JARVIS'in amacı bu.
                // Sadece senin onayladığın kodlar çalışır.
                try {
                    // Fonksiyonu güncelle
                    if (change.file === 'ai-core.js') {
                        // AICore içindeki chatWithAI fonksiyonunu güncelle
                        if (window.AICore) {
                            // Yeni fonksiyonu çalıştır
                            const fn = new Function('return ' + newCode)();
                            window.AICore.chatWithAI = fn;
                            console.log('✅ AICore.chatWithAI güncellendi');
                        }
                    }
                } catch (e) {
                    console.error('❌ Kod uygulama hatası:', e);
                    return null;
                }
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

    // Sohbet eklentisi önerisi (KeylessAI)
    function proposeChatFeature() {
        return createProposal(
            'Sohbet Yeteneği Ekle (KeylessAI)',
            'JARVIS\'e KeylessAI ile sohbet yeteneği ekler. API anahtarı gerekmez, ücretsiz.',
            [
                {
                    file: 'ai-core.js',
                    oldCode: '// Sohbet kodu burada olacak',
                    newCode: `
async function chatWithAI(text) {
    try {
        const response = await fetch('https://keylessai.thryx.workers.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer not-needed'
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: 'Sen JARVIS\\'sin. Kullanıcı ile sohbet ediyorsun.' },
                    { role: 'user', content: text }
                ],
                stream: false,
                max_tokens: 512
            })
        });
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('AI hatası:', error);
        return 'AI bağlantısı kurulamadı.';
    }
}`
                }
            ],
            'feature'
        );
    }

    function analyze() {
        const missing = [];
        // Sohbet kontrolü
        if (typeof AICore?.chatWithAI !== 'function') {
            const proposal = proposeChatFeature();
            missing.push({
                title: 'Sohbet Yeteneği',
                description: 'JARVIS sohbet edemiyor. KeylessAI ile ücretsiz sohbet eklenebilir.',
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
