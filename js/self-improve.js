// self-improve.js - JARVIS Kendini Güncelleme Core v8 (AI servisini değiştir)

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
                if (change.file === 'ai-core.js' && window.AICore) {
                    try {
                        const fn = new Function('return ' + change.newCode)();
                        window.AICore.chatWithAI = fn;
                        console.log('✅ AICore.chatWithAI güncellendi');
                    } catch (e) {
                        console.error('❌ Kod uygulama hatası:', e);
                        return null;
                    }
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

    // ---- AI SERVİSİ ÖNERİLERİ ----

    // 1. DeepSeek API (ücretsiz, API anahtarı gerekir)
    function proposeDeepSeek(apiKey = 'YOUR_API_KEY') {
        return createProposal(
            'AI Servisini Değiştir: DeepSeek API',
            `JARVIS'in AI servisini DeepSeek API ile değiştirir. API anahtarı gerekir: ${apiKey}`,
            [
                {
                    file: 'ai-core.js',
                    oldCode: '// Sohbet kodu burada olacak',
                    newCode: `
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
        return data.choices[0].message.content;
    } catch (error) {
        console.error('DeepSeek hatası:', error);
        return 'DeepSeek bağlantısı kurulamadı.';
    }
}`
                }
            ],
            'feature'
        );
    }

    // 2. Hugging Face (ücretsiz, API anahtarı gerekir)
    function proposeHuggingFace(apiKey = 'YOUR_API_KEY') {
        return createProposal(
            'AI Servisini Değiştir: Hugging Face',
            'JARVIS\'in AI servisini Hugging Face ile değiştirir. API anahtarı gerekir.',
            [
                {
                    file: 'ai-core.js',
                    oldCode: '// Sohbet kodu burada olacak',
                    newCode: `
async function chatWithAI(text) {
    try {
        const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ${apiKey}'
            },
            body: JSON.stringify({
                inputs: text,
                parameters: { max_new_tokens: 512 }
            })
        });
        const data = await response.json();
        return data[0]?.generated_text || 'Cevap alınamadı.';
    } catch (error) {
        console.error('Hugging Face hatası:', error);
        return 'Hugging Face bağlantısı kurulamadı.';
    }
}`
                }
            ],
            'feature'
        );
    }

    // 3. Tamamen Yerel (Offline) - AI'yı kaldır
    function proposeOffline() {
        return createProposal(
            'AI Servisini Kaldır: Tamamen Yerel',
            'JARVIS\'in AI sohbet yeteneğini tamamen kaldırır. Sadece yerel hafıza komutları çalışır.',
            [
                {
                    file: 'ai-core.js',
                    oldCode: '// Sohbet kodu burada olacak',
                    newCode: `
async function chatWithAI(text) {
    return 'JARVIS yerel modda çalışıyor. Sohbet yeteneği devre dışı.';
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
            // Mevcut AI bağlantı durumunu kontrol et
            // KeylessAI çalışmıyorsa, alternatif öner
            const currentAI = localStorage.getItem('jarvis_ai_service') || 'keylessai';
            if (currentAI === 'keylessai') {
                missing.push({
                    title: 'AI Servisini Değiştir',
                    description: 'KeylessAI çalışmıyor. DeepSeek API veya Hugging Face ile değiştirebilirsin.',
                    proposal: proposeDeepSeek
                });
            }
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
        proposeDeepSeek,
        proposeHuggingFace,
        proposeOffline,
        analyze
    };
})();

window.SelfImprove = SelfImprove;
