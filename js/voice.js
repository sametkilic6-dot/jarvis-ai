// voice.js - JARVIS Ses Sistemi v3
// Düzeltilmiş transcript ve status ID

const Voice = (function() {
    let recognition = null;
    let isListening = false;
    let synthesis = window.speechSynthesis;

    // Konuşma tanıma başlat
    function initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.warn('❌ SpeechRecognition desteklenmiyor');
            updateStatus('error', 'Ses desteği yok');
            return null;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'tr-TR';
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            isListening = true;
            updateStatus('listening', 'Dinliyor...');
            console.log('🎤 Dinleme başladı');
        };

        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
                
                // Eğer nihai sonuçsa
                if (event.results[i].isFinal) {
                    console.log('📝 Transcript:', transcript);
                    
                    // Doğrudan app.js'ye gönder
                    if (window.JarvisApp && typeof window.JarvisApp.processCommand === 'function') {
                        window.JarvisApp.processCommand(transcript);
                    } else {
                        console.error('❌ JarvisApp.processCommand bulunamadı');
                        alert('Sistem henüz başlatılmadı. Lütfen sayfayı yenileyin.');
                    }
                    
                    // Durumu güncelle
                    updateStatus('online', 'Hazır');
                    isListening = false;
                }
            }
        };

        recognition.onerror = (event) => {
            console.error('❌ Ses hatası:', event.error);
            
            let statusText = 'Ses hatası';
            if (event.error === 'not-allowed') {
                statusText = 'Mikrofon izni reddedildi';
            } else if (event.error === 'no-speech') {
                statusText = 'Konuşma algılanmadı';
                // Tekrar deneme
                setTimeout(() => {
                    if (window.JarvisApp) {
                        window.JarvisApp.updateStatus('online', 'Hazır');
                    }
                }, 1000);
                return;
            }
            
            updateStatus('error', statusText);
            isListening = false;
        };

        recognition.onend = () => {
            isListening = false;
            console.log('🔇 Dinleme bitti');
            // Eğer app.js durumu yönetiyorsa, onu kullan
            if (window.JarvisApp && typeof window.JarvisApp.updateStatus === 'function') {
                window.JarvisApp.updateStatus('online', 'Hazır');
            } else {
                updateStatus('online', 'Hazır');
            }
        };

        return recognition;
    }

    // Durum güncelleme (app.js ile uyumlu)
    function updateStatus(status, text) {
        // Önce app.js üzerinden dene
        if (window.JarvisApp && typeof window.JarvisApp.updateStatus === 'function') {
            window.JarvisApp.updateStatus(status, text);
            return;
        }

        // Fallback: doğrudan DOM
        const statusDot = document.getElementById('status-dot');
        const statusText = document.getElementById('status-text');
        
        if (statusDot) {
            statusDot.className = `status-dot status-${status}`;
        }
        if (statusText) {
            statusText.textContent = text || status;
        }
    }

    // Dinlemeyi başlat
    function startListening() {
        if (!recognition) {
            recognition = initSpeechRecognition();
            if (!recognition) {
                alert('Ses tanıma desteği yok. Lütfen modern bir tarayıcı kullanın.');
                return;
            }
        }

        if (isListening) {
            recognition.stop();
            return;
        }

        try {
            recognition.start();
        } catch (error) {
            console.error('❌ Başlatma hatası:', error);
            // Zaten başlamışsa durdur ve yeniden başlat
            if (error.message.includes('already started')) {
                recognition.stop();
                setTimeout(() => {
                    recognition.start();
                }, 200);
            } else {
                updateStatus('error', 'Başlatma hatası');
            }
        }
    }

    // Dinlemeyi durdur
    function stopListening() {
        if (recognition && isListening) {
            recognition.stop();
            isListening = false;
            updateStatus('online', 'Hazır');
        }
    }

    // Konuşma sentezi (sesli cevap)
    function speak(text, language = 'tr-TR') {
        if (!synthesis) {
            console.warn('❌ SpeechSynthesis desteklenmiyor');
            return;
        }

        // Önceki konuşmayı durdur
        synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Türkçe ses seç
        const voices = synthesis.getVoices();
        const trVoice = voices.find(v => v.lang.startsWith('tr'));
        if (trVoice) {
            utterance.voice = trVoice;
        }

        synthesis.speak(utterance);
    }

    // Ses sistemini kontrol et
    function checkSupport() {
        const hasRecognition = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
        const hasSynthesis = !!window.speechSynthesis;
        
        return {
            recognition: hasRecognition,
            synthesis: hasSynthesis,
            supported: hasRecognition || hasSynthesis
        };
    }

    // Public API
    return {
        startListening,
        stopListening,
        speak,
        checkSupport,
        isListening: () => isListening
    };
})();

// Global erişim
window.Voice = Voice;

// Sayfa yüklendiğinde sesleri hazırla
document.addEventListener('DOMContentLoaded', () => {
    // Sesleri yükle
    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }
});

console.log('🎤 Voice sistemi hazır');
