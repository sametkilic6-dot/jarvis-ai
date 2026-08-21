// ai-core.js - JARVIS AI Core v11 (Sorgulama ÖNCE)

const AICore = (function() {
    const PATTERNS = {
        // ÖNCE SORGULAMA (GET)
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
        // SONRA KAYDETME (SET)
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
        ]
    };

    function handleLocalCommand(text) {
        // 1. İsim sorgulama
        for (let pattern of PATTERNS.nameGet) {
            if (pattern.test(text)) {
                const name = Memory.getName();
                if (name) return { handled: true, response: `Adının ${name} olduğunu hatırlıyorum.` };
                else return { handled: true, response: 'Adını henüz hatırlamıyorum. Söyler misin?' };
            }
        }
        // 2. Oyun sorgulama
        for (let pattern of PATTERNS.gameGet) {
            if (pattern.test(text)) {
                const game = Memory.getPreference('favorite_game');
                if (game) return { handled: true, response: `Favori oyununun ${game} olduğunu hatırlıyorum.` };
                else return { handled: true, response: 'Favori oyununu henüz hatırlamıyorum. Söyler misin?' };
            }
        }
        // 3. Yer sorgulama
        for (let pattern of PATTERNS.locationGet) {
            if (pattern.test(text)) {
                const location = Memory.getPersonal('location');
                if (location) return { handled: true, response: `${location}'da yaşadığını hatırlıyorum.` };
                else return { handled: true, response: 'Nerede yaşadığını henüz hatırlamıyorum. Söyler misin?' };
            }
        }
        // 4. Doğum yeri sorgulama
        for (let pattern of PATTERNS.birthplaceGet) {
            if (pattern.test(text)) {
                const birthplace = Memory.getPersonal('birthplace');
                if (birthplace) return { handled: true, response: `Doğum yerinin ${birthplace} olduğunu hatırlıyorum.` };
                else return { handled: true, response: 'Doğum yerini henüz hatırlamıyorum. Söyler misin?' };
            }
        }
        // 5. Hakkımda
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
                if (info.length === 0) return { handled: true, response: 'Senin hakkında henüz hiçbir bilgi kaydetmedim. Bana kendinden bahset!' };
                return { handled: true, response: `Senin hakkında bildiklerim:\n${info.join('\n')}` };
            }
        }
        // 6. Hafıza durumu
        for (let pattern of PATTERNS.memoryStatus) {
            if (pattern.test(text)) {
                const stats = Memory.getStats();
                return { handled: true, response: `📊 Hafıza İstatistikleri:\n- Toplam Mesaj: ${stats.totalMessages}\n- Kullanıcı: ${stats.userMessages}\n- JARVIS: ${stats.jarvisMessages}\n- Gerçekler: ${stats.profile.factsCount}\n- Tercihler: ${stats.profile.preferencesCount}\n- Kişisel Bilgiler: ${stats.profile.personalCount}\n- Hedefler: ${stats.profile.goalsCount}` };
            }
        }
        // 7. Yardım
        for (let pattern of PATTERNS.help) {
            if (pattern.test(text)) {
                return { handled: true, response: `🤖 JARVIS Yardım Menüsü:
📝 Hafıza Komutları:
- "Benim adım [isim]" - Adını kaydeder
- "Benim adım ne?" - Adını sorar
- "Favori oyunum artık [oyun]" - Oyunu kaydeder
- "Favori oyunum ne?" - Oyunu sorar
- "Ben [yer]'da yaşıyorum" - Yer kaydeder
- "Nerede yaşıyorum?" - Yeri sorar
- "Doğum yerim [yer]" - Doğum yeri kaydeder
- "Doğum yerim neresi?" - Doğum yeri sorar
🧠 Bilgi Komutları:
- "Benim hakkımda ne biliyorsun?" - Tüm bilgileri gösterir
- "Hafıza durumu" - İstatistikleri gösterir
🔊 Ses: 🎤 Mikrofon butonuna basarak sesli komut verebilirsin
💬 Sohbet: DeepSeek AI ile sohbet edebilirsin` };
            }
        }

        // ---- KAYDETME (SET) ----
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

        return { handled: false };
    }

    async function think(text) {
        if (!text || text.trim() === '') {
            return { success: true, response: 'Merhaba! Sana nasıl yardımcı olabilirim?', source: 'local' };
        }
        const localResult = handleLocalCommand(text);
        if (localResult.handled) {
            return { success: true, response: localResult.response, source: 'local' };
        }
        return { success: false, source: 'worker', message: 'Yerel komut bulunamadı, Worker\'a git.' };
    }

    return { think, handleLocalCommand };
})();

window.AICore = AICore;
