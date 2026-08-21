// ai-core.js - JARVIS AI Core v5 (TinyLlama ile)
// Yerel komutlar + WebLLM (hafif model)

const AICore = (function() {
    let engine = null;
    let isModelLoaded = false;
    let isLoading = false;
    let loadError = null;
    // DAHA HAFİF MODEL: TinyLlama 1.1B
    let modelName = 'TinyLlama-1.1B-Chat-v0.4-q4f32_1';

    // Yerel komut desenleri (aynen)
    const PATTERNS = {
        nameSet: [
            /benim adım\s+(.+)/i,
            /adım\s+(.+)/i,
            /ismim\s+(.+)/i
        ],
        nameGet: [
            /benim adım ne\s*/i,
            /adım ne\s*/i,
            /ismim ne\s*/i
        ],
        gameSet: [
            /favori oyunum artık\s+(.+)/i,
            /favori oyunum\s+(.+)/i,
            /en sevdiğim oyun artık\s+(.+)/i,
            /en sevdiğim oyun\s+(.+)/i
        ],
        gameGet: [
            /favori oyunum ne\s*/i,
            /favori oyunum nedir\s*/i,
            /en sevdiğim oyun ne\s*/i,
            /en sevdiğim oyun nedir\s*/i
        ],
        locationSet: [
            /ben (.+)'da yaşıyorum/i,
            /ben (.+)'de yaşıyorum/i,
            /ben (.+)'nda yaşıyorum/i,
            /ben (.+)'nde yaşıyorum/i,
            /yaşıyorum (.+)/i
        ],
        locationGet: [
            /nerede yaşıyorum\s*/i,
            /yaşadığım yer neresi\s*/i,
            /ikametim neresi\s*/i
        ],
        birthplaceSet: [
            /doğum yerim\s+(.+)/i,
            /memleketim\s+(.+)/i
        ],
        birthplaceGet: [
            /doğum yerim neresi\s*/i,
            /memleketim neresi\s*/i,
            /nerede doğdum\s*/i
        ],
        aboutMe: [
            /benim hakkımda ne biliyorsun\s*/i,
            /beni ne kadar tanıyorsun\s*/i,
            /hakkımda bilgi ver\s*/i
        ],
        memoryStatus: [
            /hafıza durumu\s*/i,
            /hafıza istatistikleri\s*/i
        ],
        help: [
            /yardım\s*/i,
            /ne yapabilirsin\s*/i,
            /özelliklerin neler\s*/i
        ]
    };

    // Yerel komut işleyici (aynı, kısaltmak için tekrar yazmıyorum)
    function handleLocalCommand(text) {
        // ... (önceki kodun aynısı, yerden tasarruf için kısaltıyorum)
        // Daha önce verdiğim kodun aynısını kullan
        // (Burada uzun kod var, aşağıda tam halini veriyorum)
    }

    // WebLLM ile sohbet (TinyLlama)
    async function chatWithWebLLM(text) {
        try {
            if (!isModelLoaded && !isLoading) {
                await loadModel();
            }

            if (!isModelLoaded) {
                throw new Error('Model yüklenemedi');
            }

            const messages = [
                { role: 'system', content: 'Sen JARVIS\'sin. Kullanıcı ile sohbet ediyorsun.' },
                { role: 'user', content: text }
            ];

            const response = await engine.chat.completions.create({
                messages: messages,
                stream: false
            });

            return {
                success: true,
                response: response.choices[0].message.content
            };

        } catch (error) {
            console.error('WebLLM hatası:', error);
            return {
                success: false,
                error: error.message || 'AI modeli cevap verirken hata oluştu.'
            };
        }
    }

    // Modeli yükle (TinyLlama)
    async function loadModel() {
        try {
            if (isLoading) return;
            if (isModelLoaded) return;
            
            isLoading = true;
            loadError = null;
            
            console.log('🔄 TinyLlama modeli yükleniyor...', modelName);
            
            const webllm = await import('https://esm.run/@mlc-ai/web-llm');
            
            engine = new webllm.Engine();
            await engine.reload(modelName);
            
            isModelLoaded = true;
            isLoading = false;
            console.log('✅ TinyLlama model yüklendi!');
            
        } catch (error) {
            console.error('❌ Model yükleme hatası:', error);
            loadError = error;
            isLoading = false;
            isModelLoaded = false;
            throw error;
        }
    }

    // Ana think fonksiyonu
    async function think(text) {
        if (!text || text.trim() === '') {
            return {
                success: true,
                response: 'Merhaba! Sana nasıl yardımcı olabilirim?'
            };
        }

        // 1. Yerel komutları dene
        const localResult = handleLocalCommand(text);
        if (localResult.handled) {
            return {
                success: true,
                response: localResult.response,
                source: 'local'
            };
        }

        // 2. WebLLM ile dene
        try {
            const aiResult = await chatWithWebLLM(text);
            if (aiResult.success) {
                return {
                    success: true,
                    response: aiResult.response,
                    source: 'webllm'
                };
            } else {
                return {
                    success: true,
                    response: '⚠️ TinyLlama modeli yüklenemedi. ' +
                              '📝 Hafıza komutlarım (isim, oyun, yer) çalışıyor.\n\n' +
                              '💡 **Öneri:** Chrome veya Edge kullanmayı dene.'
                };
            }
        } catch (error) {
            console.error('AI Core hatası:', error);
            return {
                success: true,
                response: 'JARVIS çalışıyor ama AI modeli yüklenemedi.\n' +
                          '✅ Hafıza komutları çalışıyor (isim, oyun, yer).'
            };
        }
    }

    // ---- handleLocalCommand'un tam hali ----
    function handleLocalCommand(text) {
        // İsim kaydetme
        for (let pattern of PATTERNS.nameSet) {
            const match = text.match(pattern);
            if (match) {
                const name = match[1].trim();
                if (Memory.setName(name)) {
                    return { handled: true, response: `Adını ${name} olarak kaydettim.` };
                }
            }
        }
        // İsim sorgulama
        for (let pattern of PATTERNS.nameGet) {
            if (pattern.test(text)) {
                const name = Memory.getName();
                if (name) {
                    return { handled: true, response: `Adının ${name} olduğunu hatırlıyorum.` };
                } else {
                    return { handled: true, response: 'Adını henüz hatırlamıyorum. Söyler misin?' };
                }
            }
        }
        // Favori oyun kaydetme
        for (let pattern of PATTERNS.gameSet) {
            const match = text.match(pattern);
            if (match) {
                const game = match[1].trim();
                if (Memory.addPreference('favorite_game', game)) {
                    return { handled: true, response: `Favori oyununu ${game} olarak kaydettim.` };
                }
            }
        }
        // Favori oyun sorgulama
        for (let pattern of PATTERNS.gameGet) {
            if (pattern.test(text)) {
                const game = Memory.getPreference('favorite_game');
                if (game) {
                    return { handled: true, response: `Favori oyununun ${game} olduğunu hatırlıyorum.` };
                } else {
                    return { handled: true, response: 'Favori oyununu henüz hatırlamıyorum. Söyler misin?' };
                }
            }
        }
        // Yaşadığı yer kaydetme
        for (let pattern of PATTERNS.locationSet) {
            const match = text.match(pattern);
            if (match) {
                const location = match[1].trim();
                if (Memory.addPersonal('location', location)) {
                    return { handled: true, response: `Yaşadığın yeri ${location} olarak kaydettim.` };
                }
            }
        }
        // Yaşadığı yer sorgulama
        for (let pattern of PATTERNS.locationGet) {
            if (pattern.test(text)) {
                const location = Memory.getPersonal('location');
                if (location) {
                    return { handled: true, response: `${location}'da yaşadığını hatırlıyorum.` };
                } else {
                    return { handled: true, response: 'Nerede yaşadığını henüz hatırlamıyorum. Söyler misin?' };
                }
            }
        }
        // Doğum yeri kaydetme
        for (let pattern of PATTERNS.birthplaceSet) {
            const match = text.match(pattern);
            if (match) {
                const birthplace = match[1].trim();
                if (Memory.addPersonal('birthplace', birthplace)) {
                    return { handled: true, response: `Doğum yerini ${birthplace} olarak kaydettim.` };
                }
            }
        }
        // Doğum yeri sorgulama
        for (let pattern of PATTERNS.birthplaceGet) {
            if (pattern.test(text)) {
                const birthplace = Memory.getPersonal('birthplace');
                if (birthplace) {
                    return { handled: true, response: `Doğum yerinin ${birthplace} olduğunu hatırlıyorum.` };
                } else {
                    return { handled: true, response: 'Doğum yerini henüz hatırlamıyorum. Söyler misin?' };
                }
            }
        }
        // Benim hakkımda bilgi
        for (let pattern of PATTERNS.aboutMe) {
            if (pattern.test(text)) {
                const name = Memory.getName();
                const game = Memory.getPreference('favorite_game');
                const location = Memory.getPersonal('location');
                const birthplace = Memory.getPersonal('birthplace');
                
                let info = [];
                if (name) info.push(`Adın: ${name}`);
                if (game) info.push(`Favori oyunun: ${game}`);
                if (location) info.push(`Yaşadığın yer: ${location}`);
                if (birthplace) info.push(`Doğum yerin: ${birthplace}`);
                
                if (info.length === 0) {
                    return { handled: true, response: 'Senin hakkında henüz hiçbir bilgi kaydetmedim. Bana kendinden bahset!' };
                }
                return { handled: true, response: `Senin hakkında bildiklerim:\n${info.join('\n')}` };
            }
        }
        // Hafıza durumu
        for (let pattern of PATTERNS.memoryStatus) {
            if (pattern.test(text)) {
                const stats = Memory.getStats();
                return {
                    handled: true,
                    response: `📊 Hafıza İstatistikleri:\n` +
                        `- Toplam Mesaj: ${stats.totalMessages}\n` +
                        `- Kullanıcı: ${stats.userMessages}\n` +
                        `- JARVIS: ${stats.jarvisMessages}\n` +
                        `- Gerçekler: ${stats.profile.factsCount}\n` +
                        `- Tercihler: ${stats.profile.preferencesCount}\n` +
                        `- Kişisel Bilgiler: ${stats.profile.personalCount}\n` +
                        `- Hedefler: ${stats.profile.goalsCount}`
                };
            }
        }
        // Yardım
        for (let pattern of PATTERNS.help) {
            if (pattern.test(text)) {
                return {
                    handled: true,
                    response: `🤖 JARVIS Yardım Menüsü:
📝 **Hafıza Komutları:**
- "Benim adım [isim]" - Adını kaydeder
- "Benim adım ne?" - Adını sorar
- "Favori oyunum artık [oyun]" - Oyunu kaydeder
- "Favori oyunum ne?" - Oyunu sorar
- "Ben [yer]'da yaşıyorum" - Yer kaydeder
- "Nerede yaşıyorum?" - Yeri sorar
- "Doğum yerim [yer]" - Doğum yeri kaydeder
- "Doğum yerim neresi?" - Doğum yeri sorar

🧠 **Bilgi Komutları:**
- "Benim hakkımda ne biliyorsun?" - Tüm bilgileri gösterir
- "Hafıza durumu" - İstatistikleri gösterir

🔊 **Ses:**
- 🎤 Mikrofon butonuna basarak sesli komut verebilirsin

💬 **Sohbet:**
- Normal sohbet için TinyLlama AI kullanılır
- "Bana bir şiir yaz", "Fıkra anlat" gibi komutlar çalışır`
                };
            }
        }
        return { handled: false };
    }

    // Public API
    return {
        think,
        loadModel,
        isModelLoaded: () => isModelLoaded,
        isLoading: () => isLoading,
        getModelName: () => modelName,
        getLoadError: () => loadError
    };
})();

window.AICore = AICore;
