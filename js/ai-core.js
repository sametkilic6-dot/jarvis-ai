// ai-core.js - JARVIS AI Core v10 (Düzeltilmiş isim kaydetme)

const AICore = (function() {
    // ---- YEREL KOMUT PATTERN'LERİ ----
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

    // ---- YEREL KOMUT İŞLEYİCİ (ÖZGÜR) ----
    function handleLocalCommand(text) {
        // 1. İsim kaydetme (DÜZELTİLDİ)
        for (let pattern of PATTERNS.nameSet) {
            const match = text.match(pattern);
            if (match) {
                const name = match[1].trim();
                if (name && name !== '') {
                    Memory.setName(name);
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
                if (game && game !== '') {
                    Memory.addPreference('favorite_game', game);
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
                if (location && location !== '') {
                    Memory.addPersonal('location', location);
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
                if (birthplace && birthplace !== '') {
                    Memory.addPersonal('birthplace', birthplace);
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

        // 11. Yardım
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

💬 **Sohbet (DeepSeek AI):**
- Normal sohbet için DeepSeek API kullanılır
- "Bana bir şiir yaz", "Fıkra anlat" gibi komutlar çalışır`
                };
            }
        }

        return { handled: false };
    }

    // ---- ANA THINK FONKSİYONU ----
    async function think(text) {
        if (!text || text.trim() === '') {
            return {
                success: true,
                response: 'Merhaba! Sana nasıl yardımcı olabilirim?',
                source: 'local'
            };
        }

        // Yerel komutları dene
        const localResult = handleLocalCommand(text);
        if (localResult.handled) {
            return {
                success: true,
                response: localResult.response,
                source: 'local'
            };
        }

        // Yerel komut yoksa, Worker'a yönlendir (app.js halleder)
        return {
            success: false,
            source: 'worker',
            message: 'Yerel komut bulunamadı, Worker\'a git.'
        };
    }

    // ---- PUBLIC API ----
    return {
        think,
        // Yardımcı
        handleLocalCommand
    };
})();

window.AICore = AICore;
