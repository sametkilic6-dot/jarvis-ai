// ai-core.js - JARVIS AI Core v18 (KeylessAI ile sohbet eklendi)

const AICore = (function() {
    const PATTERNS = {
        nameGet: [
            /benim adım ne\s*/i,
            /adım ne\s*/i,
            /ismim ne\s*/i
        ],
        gameGet: [
            /favori oyunum ne\s*/i,
            /favori oyunum nedir\s*/i,
            /en sevdiğim oyun ne\s*/i,
            /en sevdiğim oyun nedir\s*/i
        ],
        colorGet: [
            /en sevdiğim renk ne\s*/i,
            /favori rengim ne\s*/i,
            /sevdiğim renk ne\s*/i
        ],
        locationGet: [
            /nerede yaşıyorum\s*/i,
            /yaşadığım yer neresi\s*/i,
            /ikametim neresi\s*/i
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
        ],
        nameSet: [
            /benim adım\s+(.+)/i,
            /adım\s+(.+)/i,
            /ismim\s+(.+)/i
        ],
        gameSet: [
            /favori oyunum artık\s+(.+)/i,
            /favori oyunum\s+(.+)/i,
            /en sevdiğim oyun artık\s+(.+)/i,
            /en sevdiğim oyun\s+(.+)/i
        ],
        colorSet: [
            /en sevdiğim renk\s+(.+)/i,
            /favori rengim\s+(.+)/i,
            /sevdiğim renk\s+(.+)/i
        ],
        locationSet: [
            /ben (.+)'da yaşıyorum/i,
            /ben (.+)'de yaşıyorum/i,
            /ben (.+)'nda yaşıyorum/i,
            /ben (.+)'nde yaşıyorum/i,
            /yaşıyorum (.+)/i
        ],
        birthplaceSet: [
            /doğum yerim\s+(.+)/i,
            /memleketim\s+(.+)/i
        ],
        selfUpdate: [
            /kendini güncelle\s*/i,
            /kendini geliştir\s*/i,
            /özellik ekle\s*/i
        ],
        approveProposal: [
            /ekle\s*/i,
            /onayla\s*/i,
            /kabul\s*/i,
            /evet\s*/i
        ]
    };

    // ---- KEYLESSAI İLE SOHBET FONKSİYONU ----
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
                        { role: 'system', content: 'Sen JARVIS\'sin. Kullanıcı ile sohbet ediyorsun.' },
                        { role: 'user', content: text }
                    ],
                    stream: false,
                    max_tokens: 512
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'AI hatası');
            }

            const data = await response.json();
            if (data.choices && data.choices[0]) {
                return {
                    success: true,
                    response: data.choices[0].message.content
                };
            } else {
                throw new Error('Cevap alınamadı.');
            }
        } catch (error) {
            console.error('AI hatası:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    function handleLocalCommand(text) {
        // ---- SORGULAMA ----
        for (let pattern of PATTERNS.nameGet) {
            if (pattern.test(text)) {
                const name = Memory.getName();
                if (name) return { handled: true, response: `Adının ${name} olduğunu hatırlıyorum.` };
                else return { handled: true, response: 'Adını henüz hatırlamıyorum. Söyler misin?' };
            }
        }
        for (let pattern of PATTERNS.gameGet) {
            if (pattern.test(text)) {
                const game = Memory.getPreference('favorite_game');
                if (game) return { handled: true, response: `Favori oyununun ${game} olduğunu hatırlıyorum.` };
                else return { handled: true, response: 'Favori oyununu henüz hatırlamıyorum. Söyler misin?' };
            }
        }
        for (let pattern of PATTERNS.colorGet) {
            if (pattern.test(text)) {
                const color = Memory.getPreference('favorite_color');
                if (color) return { handled: true, response: `En sevdiğin rengin ${color} olduğunu hatırlıyorum.` };
                else return { handled: true, response: 'En sevdiğin rengi henüz hatırlamıyorum. Söyler misin?' };
            }
        }
        for (let pattern of PATTERNS.locationGet) {
            if (pattern.test(text)) {
                const location = Memory.getPersonal('location');
                if (location) return { handled: true, response: `${location}'da yaşadığını hatırlıyorum.` };
                else return { handled: true, response: 'Nerede yaşadığını henüz hatırlamıyorum. Söyler misin?' };
            }
        }
        for (let pattern of PATTERNS.birthplaceGet) {
            if (pattern.test(text)) {
                const birthplace = Memory.getPersonal('birthplace');
                if (birthplace) return { handled: true, response: `Doğum yerinin ${birthplace} olduğunu hatırlıyorum.` };
                else return { handled: true, response: 'Doğum yerini henüz hatırlamıyorum. Söyler misin?' };
            }
        }
        for (let pattern of PATTERNS.aboutMe) {
            if (pattern.test(text)) {
                const name = Memory.getName();
                const game = Memory.getPreference('favorite_game');
                const color = Memory.getPreference('favorite_color');
                const location = Memory.getPersonal('location');
                const birthplace = Memory.getPersonal('birthplace');
                let info = [];
                if (name) info.push(`Adın: ${name}`);
                if (game) info.push(`Favori oyunun: ${game}`);
                if (color) info.push(`En sevdiğin renk: ${color}`);
                if (location) info.push(`Yaşadığın yer: ${location}`);
                if (birthplace) info.push(`Doğum yerin: ${birthplace}`);
                if (info.length === 0) return { handled: true, response: 'Senin hakkında henüz hiçbir bilgi kaydetmedim. Bana kendinden bahset!' };
                return { handled: true, response: `Senin hakkında bildiklerim:\n${info.join('\n')}` };
            }
        }
        for (let pattern of PATTERNS.memoryStatus) {
            if (pattern.test(text)) {
                const stats = Memory.getStats();
                return { handled: true, response: `📊 Hafıza İstatistikleri:\n- Toplam Mesaj: ${stats.totalMessages}\n- Kullanıcı: ${stats.userMessages}\n- JARVIS: ${stats.jarvisMessages}\n- Gerçekler: ${stats.profile.factsCount}\n- Tercihler: ${stats.profile.preferencesCount}\n- Kişisel Bilgiler: ${stats.profile.personalCount}\n- Hedefler: ${stats.profile.goalsCount}` };
            }
        }
        for (let pattern of PATTERNS.help) {
            if (pattern.test(text)) {
                return { handled: true, response: `🤖 JARVIS Yardım Menüsü:
📝 **Hafıza Komutları:**
- "Benim adım [isim]" - Adını kaydeder
- "Benim adım ne?" - Adını sorar
- "Favori oyunum artık [oyun]" - Oyunu kaydeder
- "Favori oyunum ne?" - Oyunu sorar
- "En sevdiğim renk [renk]" - Rengi kaydeder
- "En sevdiğim renk ne?" - Rengi sorar
- "Ben [yer]'da yaşıyorum" - Yer kaydeder
- "Nerede yaşıyorum?" - Yeri sorar
- "Doğum yerim [yer]" - Doğum yeri kaydeder
- "Doğum yerim neresi?" - Doğum yeri sorar

🧠 **Bilgi Komutları:**
- "Benim hakkımda ne biliyorsun?" - Tüm bilgileri gösterir
- "Hafıza durumu" - İstatistikleri gösterir

🔊 **Ses:** 🎤 Mikrofon butonuna basarak sesli komut verebilirsin

🔄 **Kendini Güncelleme:**
- "Kendini güncelle" - Eksik özellikleri tespit eder
- "Ekle" / "Onayla" - Öneriyi uygular

🌐 **AI Sohbet:** KeylessAI ile ücretsiz, anahtarsız AI!` };
            }
        }

        // ---- KAYDETME ----
        for (let pattern of PATTERNS.nameSet) {
            const match = text.match(pattern);
            if (match) {
                const name = match[1].trim();
                if (name && name !== '') { Memory.setName(name); return { handled: true, response: `Adını ${name} olarak kaydettim.` }; }
            }
        }
        for (let pattern of PATTERNS.gameSet) {
            const match = text.match(pattern);
            if (match) {
                const game = match[1].trim();
                if (game && game !== '') { Memory.addPreference('favorite_game', game); return { handled: true, response: `Favori oyununu ${game} olarak kaydettim.` }; }
            }
        }
        for (let pattern of PATTERNS.colorSet) {
            const match = text.match(pattern);
            if (match) {
                const color = match[1].trim();
                if (color && color !== '') { Memory.addPreference('favorite_color', color); return { handled: true, response: `En sevdiğin rengi ${color} olarak kaydettim.` }; }
            }
        }
        for (let pattern of PATTERNS.locationSet) {
            const match = text.match(pattern);
            if (match) {
                const location = match[1].trim();
                if (location && location !== '') { Memory.addPersonal('location', location); return { handled: true, response: `Yaşadığın yeri ${location} olarak kaydettim.` }; }
            }
        }
        for (let pattern of PATTERNS.birthplaceSet) {
            const match = text.match(pattern);
            if (match) {
                const birthplace = match[1].trim();
                if (birthplace && birthplace !== '') { Memory.addPersonal('birthplace', birthplace); return { handled: true, response: `Doğum yerini ${birthplace} olarak kaydettim.` }; }
            }
        }

        // ---- KENDİNİ GÜNCELLE ----
        for (let pattern of PATTERNS.selfUpdate) {
            if (pattern.test(text)) {
                const pending = SelfImprove.getPendingProposals();
                if (pending.length > 0) {
                    const proposal = pending[0];
                    return {
                        handled: true,
                        response: `📋 **Bekleyen bir öneri var:**\n- **${proposal.title}**: ${proposal.description}\n\n💡 **"Ekle"** yazarak onaylayabilirsin.`
                    };
                }
                const missing = SelfImprove.analyze();
                const newPending = SelfImprove.getPendingProposals();
                if (newPending.length === 0) {
                    return {
                        handled: true,
                        response: '✅ JARVIS şu anda tam donanımlı. Güncellenecek bir şey yok.'
                    };
                }
                const proposal = newPending[0];
                return {
                    handled: true,
                    response: `🔍 **JARVIS eksik özellik tespit etti:**\n- **${proposal.title}**: ${proposal.description}\n\n💡 **"Ekle"** yazarak öneriyi onaylayabilirsin.`
                };
            }
        }

        for (let pattern of PATTERNS.approveProposal) {
            if (pattern.test(text)) {
                const pending = SelfImprove.getPendingProposals();
                if (pending.length === 0) {
                    return {
                        handled: true,
                        response: '📭 Bekleyen öneri yok. Önce **"Kendini güncelle"** yaz.'
                    };
                }
                const proposal = pending[0];
                SelfImprove.approveProposal(proposal.id);
                const result = SelfImprove.applyProposal(proposal.id);
                if (result) {
                    return {
                        handled: true,
                        response: `✅ **"${proposal.title}"** önerisi onaylandı ve uygulandı!\n🔄 JARVIS yeniden başlatılıyor... (Sayfayı yenile)`
                    };
                } else {
                    return {
                        handled: true,
                        response: '❌ Öneri uygulanırken bir hata oluştu.'
                    };
                }
            }
        }

        return { handled: false };
    }

    async function think(text) {
        if (!text || text.trim() === '') {
            return {
                success: true,
                response: 'Merhaba! Sana nasıl yardımcı olabilirim?',
                source: 'local'
            };
        }

        const localResult = handleLocalCommand(text);
        if (localResult.handled) {
            return {
                success: true,
                response: localResult.response,
                source: 'local'
            };
        }

        // Sohbet yeteneği ile AI'ya sor
        const aiResult = await chatWithAI(text);
        if (aiResult.success) {
            return {
                success: true,
                response: aiResult.response,
                source: 'ai'
            };
        } else {
            return {
                success: true,
                response: '🤔 Bu komutu anlamadım. Yardım için "Yardım" yazabilirsin.',
                source: 'local'
            };
        }
    }

    return {
        think,
        handleLocalCommand,
        chatWithAI
    };
})();

window.AICore = AICore;
