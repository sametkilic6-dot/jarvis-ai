// ai-core.js - JARVIS AI Core v13 (Self-Improve ile)

const AICore = (function() {
    // ... (önceki PATTERNS ve handleLocalCommand aynen)

    function handleLocalCommand(text) {
        // ... (önceki komutlar)

        // YENİ: Kendini güncelle komutu
        if (/kendini güncelle|kendini geliştir|kendi kendini güncelle/i.test(text)) {
            const missing = SelfImprove.analyze();
            if (missing.length === 0) {
                return {
                    handled: true,
                    response: '✅ JARVIS şu anda tam donanımlı. Güncellenecek bir şey yok.'
                };
            }
            const proposals = missing.map(m => `- ${m.title}: ${m.description}`).join('\n');
            return {
                handled: true,
                response: `🔍 JARVIS eksik özellikler tespit etti:\n${proposals}\n\n💡 "Ekle" yazarak öneriyi onaylayabilirsin.`
            };
        }

        // Öneriyi onayla
        if (/ekle|onayla|kabul/i.test(text)) {
            const pending = SelfImprove.getPendingProposals();
            if (pending.length === 0) {
                return {
                    handled: true,
                    response: '📭 Bekleyen öneri yok. Önce "kendini güncelle" yaz.'
                };
            }
            const proposal = pending[0];
            SelfImprove.approveProposal(proposal.id);
            SelfImprove.applyProposal(proposal.id);
            return {
                handled: true,
                response: `✅ "${proposal.title}" önerisi onaylandı ve uygulandı! JARVIS yeniden başlatılıyor...`
            };
        }

        return { handled: false };
    }

    // ... (think fonksiyonu aynen)
})();

window.AICore = AICore;
