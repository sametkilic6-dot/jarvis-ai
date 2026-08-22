// self-improve.js - JARVIS Kendini Güncelleme Core v3

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

    // Yeni öneri oluştur
    function createProposal(title, description, codeChanges, type = 'enhancement') {
        const proposal = {
            id: Date.now(),
            title,
            description,
            type,
            codeChanges, // [{ file: 'ai-core.js', oldCode: '...', newCode: '...' }]
            status: 'pending', // pending, approved, rejected, applied
            createdAt: new Date().toISOString(),
            appliedAt: null
        };
        state.proposals.push(proposal);
        save(state);
        return proposal;
    }

    // Bekleyen önerileri getir
    function getPendingProposals() {
        return state.proposals.filter(p => p.status === 'pending');
    }

    // Tüm önerileri getir
    function getProposals() {
        return state.proposals;
    }

    // Öneriyi onayla
    function approveProposal(id) {
        const proposal = state.proposals.find(p => p.id === id);
        if (!proposal) return null;
        proposal.status = 'approved';
        save(state);
        return proposal;
    }

    // Öneriyi reddet
    function rejectProposal(id) {
        const proposal = state.proposals.find(p => p.id === id);
        if (!proposal) return null;
        proposal.status = 'rejected';
        save(state);
        return proposal;
    }

    // Öneriyi uygula (kodu değiştir)
    function applyProposal(id) {
        const proposal = state.proposals.find(p => p.id === id);
        if (!proposal || proposal.status !== 'approved') return null;

        try {
            // Kod değişikliklerini uygula
            for (const change of proposal.codeChanges) {
                console.log(`📝 ${change.file} güncelleniyor...`);
                // Burada gerçek kod değişikliği yapılacak
                // Şimdilik sadece log
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

    // Sohbet eklentisi önerisi oluştur
    function proposeChatFeature(apiKey = 'YOUR_DEEPSEEK_API_KEY') {
        return createProposal(
            'Sohbet Yeteneği Ekle (DeepSeek)',
            'JARVIS\'e DeepSeek API ile sohbet yeteneği ekler. İnternet bağlantısı ve API anahtarı gerektirir.',
            [
                {
                    file: 'ai-core.js',
                    oldCode: '// Sohbet kodu burada olacak',
                    newCode: `
// DeepSeek API ile sohbet
async function chatWithAI(text) {
    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ${apiKey}'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [{ role: 'user', content: text }],
                stream: false,
                max_tokens: 512
            })
        });
        const data = await response.json();
        if (data.choices && data.choices[0]) {
            return data.choices[0].message.content;
        } else {
            return 'Cevap alınamadı. Lütfen tekrar dener misin?';
        }
    } catch (error) {
        console.error('Sohbet hatası:', error);
        return 'Sohbet bağlantısı kurulamadı.';
    }
}`
                }
            ],
            'feature'
        );
    }

    // Analiz et (hangi özellikler eksik?)
    function analyze() {
        const missing = [];
        // Sohbet kontrolü
        if (typeof AICore?.chatWithAI !== 'function') {
            missing.push({
                title: 'Sohbet Yeteneği',
                description: 'JARVIS sohbet edemiyor. DeepSeek API ile konuşma yeteneği eklenebilir.',
                proposal: proposeChatFeature
            });
        }
        return missing;
    }

    // Sohbet önerisini doğrudan oluştur (API key ile)
    function proposeChatWithKey(apiKey) {
        return proposeChatFeature(apiKey);
    }

    return {
        createProposal,
        getPendingProposals,
        getProposals,
        approveProposal,
        rejectProposal,
        applyProposal,
        proposeChatFeature,
        proposeChatWithKey,
        analyze
    };
})();

window.SelfImprove = SelfImprove;
