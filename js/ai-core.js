// ai-core.js - JARVIS AI Core v3 (WebLLM ile)
// Yerel komutlar + WebLLM entegrasyonu

const AICore = (function() {
    // WebLLM engine
    let engine = null;
    let isModelLoaded = false;
    let isLoading = false;
    let modelName = 'Llama-3.2-3B-Instruct-q4f32_1'; // Hafif model

    // Yerel komut desenleri
    const PATTERNS = {
        // İsim kaydetme
        nameSet: [
            /benim adım\s+(.+)/i,
            /adım\s+(.+)/i,
            /ismim\s+(.+)/i
        ],
        // İsim sorgulama
        nameGet: [
            /benim adım ne\s*/i,
            /adım ne\s*/i,
            /ismim ne\s*/i
        ],
        // Favori oyun kaydetme
        gameSet: [
            /favori oyunum artık\s+(.+)/i,
            /favori oyunum\s+(.+)/i,
            /en sevdiğim oyun artık\s+(.+)/i,
            /en sevdiğim oyun\s+(.+)/i
        ],
        // Favori oyun sorgulama
        gameGet: [
            /favori oyunum ne\s*/i,
            /favori oyunum nedir\s*/i,
            /en sevdiğim oyun ne\s*/i,
            /en sevdiğim oyun nedir\s*/i
        ],
        // Yaşadığı yer kaydetme
        locationSet: [
            /ben (.+)'da yaşıyorum/i,
            /ben (.+)'de yaşıyorum/i,
            /ben (.+)'nda yaşıyorum/i,
            /ben (.+)'nde yaşıyorum/i,
            /yaşıyorum (.+)/i
        ],
        // Yaşadığı yer sorgulama
        locationGet: [
            /nerede yaşıyorum\s*/i,
            /yaşadığım yer neresi\s*/i,
            /ikametim neresi\s*/i
        ],
        // Doğum yeri kaydetme
        birthplaceSet: [
            /doğum yerim\s+(.+)/i,
            /memleketim\s+(.+)/i
        ],
        // Doğum yeri sorgulama
        birthplaceGet: [
            /doğum yerim neresi\s*/i,
            /memleketim neresi\s*/i,
            /nerede doğdum\s*/i
        ],
        // Benim hakkımda bilgi
        aboutMe: [
            /benim hakkımda ne biliyorsun\s*/i,
            /beni ne kadar tanıyorsun\s*/i,
            /hakkımda bilgi ver\s*/i
        ],
        // Hafıza durumu
        memoryStatus: [
            /hafıza durumu\s*/i,
            /hafıza istatistikleri\s*/i
        ]
    };

    // Yerel komut işleyici
    function handleLocalCommand(text) {
        // 1. İsim kaydetme
        for (let pattern of PATTERNS.nameSet) {
            const match = text.match(pattern);
            if (match) {
                const name = match[1].trim();
                if (Memory.setName(name)) {
                    return {
                        handled: true,
                        response: `Adını ${name} olarak kaydettim.`
                    };
                }
            }
        }

        // 2. İsim sorgulama
        for (let pattern of PATTERNS.nameGet) {
            if (pattern.test(text)) {
                const name = Memory.getName();
                if (name) {
                    return {
                        handled: true,
                        response: `Adının ${name} olduğunu hatırlıyorum.`
                    };
                } else {
                    return {
                        handled: true,
                        response: 'Adını henüz hatırlamıyorum. Söyler misin?'
                    };
                }
            }
        }

        // 3. Favori oyun kaydetme
        for (let pattern of PATTERNS.gameSet) {
            const match = text.match(pattern);
            if (match) {
                const game = match[1].trim();
                if (Memory.addPreference('favorite_game', game)) {
                    return {
                        handled: true,
                        response: `Favori oyununu ${game} olarak kaydettim.`
                    };
                }
            }
        }

        // 4. Favori oyun sorgulama
        for (let pattern of PATTERNS.gameGet) {
            if (pattern.test(text)) {
                const game = Memory.getPreference('favorite_game');
                if (game) {
                    return {
                        handled: true,
                        response: `Favori oyununun ${game} olduğunu hatırlıyorum.`
                    };
                } else {
                    return {
                        handled: true,
                        response: 'Favori oyununu henüz hatırlamıyorum. Söyler misin?'
                    };
                }
            }
        }

        // 5. Yaşadığı yer kaydetme
        for (let pattern of PATTERNS.locationSet) {
            const match = text.match(pattern);
            if (match) {
                const location = match[1].trim();
                if (Memory.addPersonal('location', location)) {
                    return {
                        handled: true,
                        response: `Yaşadığın yeri ${location} olarak kaydettim.`
                    };
                }
            }
        }

        // 6. Yaşadığı yer sorgulama
        for (let pattern of PATTERNS.locationGet) {
            if (pattern.test(text)) {
                const location = Memory.getPersonal('location');
                if (location) {
                    return {
                        handled: true,
                        response: `${location}'da yaşadığını hatırlıyorum.`
                    };
                } else {
                    return {
                        handled: true,
                        response: 'Nerede yaşadığını henüz hatırlamıyorum. Söyler misin?'
                    };
                }
            }
        }

        // 7. Doğum yeri kaydetme
        for (let pattern of PATTERNS.birthplaceSet) {
            const match = text.match(pattern);
            if (match) {
                const birthplace = match[1].trim();
                if (Memory.addPersonal('birthplace', birthplace)) {
                    return {
                        handled: true,
                        response: `Doğum yerini ${birthplace} olarak kaydettim.`
                    };
                }
            }
        }

        // 8. Doğum yeri sorgulama
        for (let pattern of PATTERNS.birthplaceGet) {
            if (pattern.test(text)) {
                const birthplace = Memory.getPersonal('birthplace');
                if (birthplace) {
                    return {
                        handled: true,
                        response: `Doğum yerinin ${birthplace} olduğunu hatırlıyorum.`
                    };
                } else {
                    return {
                        handled: true,
                        response: 'Doğum yerini henüz hatırlamıyorum. Söyler misin?'
                    };
                }
            }
        }

        // 9. Benim hakkımda bilgi
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
                    return {
                        handled: true,
                        response: 'Senin hakkında henüz hiçbir bilgi kaydetmedim. Bana kendinden bahset!'
                    };
                }
                return {
                    handled: true,
                    response: `Senin hakkında bildiklerim:\n${info.join('\n')}`
                };
            }
        }

        // 10. Hafıza durumu
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

        return { handled: false };
    }

    // WebLLM ile sohbet
    async function chatWithWebLLM(text) {
        try {
            if (!isModelLoaded && !isLoading) {
                await loadModel();
            }

            if (!isModelLoaded) {
                return {
                    success: false,
                    error: 'Model henüz yüklenmedi. Lütfen bekleyin.'
                };
            }

            // Kullanıcı bilgilerini bağlam olarak ekle
            const name = Memory.getName();
            const game = Memory.getPreference('favorite_game');
            const location = Memory.getPersonal('location');
            
            let context = 'Kullanıcı ile sohbet ediyorsun.';
            if (name) context += ` Kullanıcının adı: ${name}.`;
            if (game) context += ` Kullanıcının favori oyunu: ${game}.`;
            if (location) context += ` Kullanıcı ${location}'da yaşıyor.`;

            const messages = [
                { role: 'system', content: context },
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
                error: 'AI modeli cevap verirken hata oluştu.'
            };
        }
    }

    // Modeli yükle
    async function loadModel() {
        try {
            if (isLoading) return;
            isLoading = true;
            
            // WebLLM'i import et
            const webllm = await import('https://esm.run/@mlc-ai/web-llm');
            
            engine = new webllm.Engine();
            await engine.reload(modelName);
            
            isModelLoaded = true;
            isLoading = false;
            console.log('✅ WebLLM model yüklendi:', modelName);
            
        } catch (error) {
            console.error('Model yükleme hatası:', error);
            isLoading = false;
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

        // 1. Önce yerel komutları dene
        const localResult = handleLocalCommand(text);
        if (localResult.handled) {
            return {
                success: true,
                response: localResult.response,
                source: 'local'
            };
        }

        // 2. Yerel komut yoksa WebLLM'yi dene
        try {
            const aiResult = await chatWithWebLLM(text);
            if (aiResult.success) {
                return {
                    success: true,
                    response: aiResult.response,
                    source: 'webllm'
                };
            } else {
                // Model yüklenmemiş veya hata varsa
                return {
                    success: true,
                    response: 'Bu soruya cevap vermek için yapay zeka modelini kullanmam gerekiyor. ' +
                              'Model yükleniyor, lütfen birkaç saniye bekleyip tekrar dene.'
                };
            }
        } catch (error) {
            console.error('AI Core hatası:', error);
            return {
                success: true,
                response: 'Üzgünüm, şu anda cevap veremiyorum. Lütfen daha sonra tekrar dene.'
            };
        }
    }

    // Public API
    return {
        think,
        loadModel,
        isModelLoaded: () => isModelLoaded,
        isLoading: () => isLoading,
        getModelName: () => modelName
    };
})();

window.AICore = AICore;
