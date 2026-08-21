// app.js - JARVIS Uygulama Orkestratörü v3
// Worker bağlantısı kaldırıldı, tamamen yerel AI Core kullanılıyor

const JarvisApp = (function() {
    // DOM elementleri
    const elements = {
        conversation: document.getElementById('conversation'),
        command: document.getElementById('command'),
        send: document.getElementById('send'),
        voiceButton: document.getElementById('voice-button'),
        statusDot: document.getElementById('status-dot'),
        statusText: document.getElementById('status-text')
    };

    let isProcessing = false;

    // UI durumunu güncelle
    function updateStatus(status, text) {
        if (elements.statusDot) {
            elements.statusDot.className = `status-dot status-${status}`;
        }
        if (elements.statusText) {
            elements.statusText.textContent = text || status;
        }
    }

    // Mesaj ekle (UI)
    function addMessage(role, text, source = 'local') {
        if (!elements.conversation) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.textContent = role === 'user' ? '👤' : '🤖';
        
        const content = document.createElement('div');
        content.className = 'content';
        
        const textNode = document.createElement('div');
        textNode.className = 'text';
        textNode.textContent = text;
        
        const meta = document.createElement('div');
        meta.className = 'meta';
        meta.textContent = source === 'webllm' ? '🤖 AI (Yerel)' : source === 'local' ? '⚡ Yerel' : '📡 JARVIS';
        meta.style.fontSize = '10px';
        meta.style.opacity = '0.6';
        meta.style.marginTop = '4px';
        
        content.appendChild(textNode);
        content.appendChild(meta);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        elements.conversation.appendChild(messageDiv);
        elements.conversation.scrollTop = elements.conversation.scrollHeight;
    }

    // Yazıyor göstergesi
    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message jarvis typing';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="avatar">🤖</div>
            <div class="content">
                <div class="text">JARVIS yazıyor...</div>
            </div>
        `;
        if (elements.conversation) {
            elements.conversation.appendChild(typingDiv);
            elements.conversation.scrollTop = elements.conversation.scrollHeight;
        }
    }

    function hideTyping() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    // Ana komut işleme
    async function processCommand(text) {
        if (!text || text.trim() === '' || isProcessing) return;

        isProcessing = true;
        const commandInput = elements.command;
        if (commandInput) commandInput.disabled = true;
        
        // Kullanıcı mesajını ekle
        addMessage('user', text);
        Memory.add('user', text);

        // Durumu güncelle
        updateStatus('processing', 'Düşünüyor...');

        try {
            // Yazıyor göster
            showTyping();

            // AI Core'u çağır
            const result = await AICore.think(text);

            // Yazıyor'u gizle
            hideTyping();

            // Cevabı ekle
            if (result.success && result.response) {
                const source = result.source || 'local';
                addMessage('jarvis', result.response, source);
                Memory.add('jarvis', result.response);
                updateStatus('online', 'Hazır');
            } else {
                addMessage('jarvis', 'Üzgünüm, bir hata oluştu. Lütfen tekrar dener misin?', 'error');
                updateStatus('error', 'Hata');
            }

        } catch (error) {
            hideTyping();
            console.error('JARVIS hatası:', error);
            addMessage('jarvis', 'Bir hata oluştu. Lütfen daha sonra tekrar dene.', 'error');
            updateStatus('error', 'Hata');
        }

        // Input'u temizle
        if (commandInput) {
            commandInput.value = '';
            commandInput.disabled = false;
            commandInput.focus();
        }

        isProcessing = false;
    }

    // Modeli kontrol et ve yükle
    async function initializeModel() {
        try {
            updateStatus('processing', 'AI modeli yükleniyor...');
            
            // Model zaten yüklü mü?
            if (!AICore.isModelLoaded()) {
                await AICore.loadModel();
                updateStatus('online', 'Hazır');
                addMessage('jarvis', 'Merhaba! Ben JARVIS. Yerel AI modelim hazır. İstediğin her şeyi sorabilirsin. 😊', 'local');
            } else {
                updateStatus('online', 'Hazır');
            }
        } catch (error) {
            console.error('Model yükleme hatası:', error);
            updateStatus('error', 'Model yüklenemedi');
            addMessage('jarvis', 
                'AI modeli yüklenirken bir sorun oluştu. ' +
                'Yine de hafıza işlemlerini ve araçları kullanabilirsin.\n' +
                'WebLLM modeli için lütfen sayfayı yenile ve tekrar dene.', 
                'error'
            );
        }
    }

    // Olay dinleyicileri
    function setupEventListeners() {
        // Gönder butonu
        if (elements.send) {
            elements.send.addEventListener('click', () => {
                if (elements.command) {
                    processCommand(elements.command.value);
                }
            });
        }

        // Enter tuşu
        if (elements.command) {
            elements.command.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    processCommand(elements.command.value);
                }
            });
        }

        // Ses butonu (voice.js üzerinden)
        if (elements.voiceButton) {
            elements.voiceButton.addEventListener('click', () => {
                if (window.Voice && typeof Voice.startListening === 'function') {
                    Voice.startListening();
                } else {
                    alert('Ses sistemi henüz başlatılmadı.');
                }
            });
        }
    }

    // Uygulamayı başlat
    async function init() {
        console.log('🚀 JARVIS başlatılıyor...');
        
        setupEventListeners();
        
        // Durumu güncelle
        updateStatus('connecting', 'Bağlanıyor...');

        // Modeli yükle
        await initializeModel();

        // Hoşgeldin mesajı (eğer daha önce eklenmediyse)
        const hasMessages = Memory.count() > 0;
        if (!hasMessages) {
            setTimeout(() => {
                addMessage('jarvis', 'Merhaba! Ben JARVIS. Sana nasıl yardımcı olabilirim?', 'local');
            }, 500);
        }

        console.log('✅ JARVIS hazır!');
    }

    // Public API
    return {
        init,
        processCommand,
        addMessage,
        updateStatus
    };
})();

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    JarvisApp.init();
});

// Global erişim
window.JarvisApp = JarvisApp;
