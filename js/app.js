// app.js - JARVIS v14 (KeylessAI ile - API anahtarı yok)

const JarvisApp = (function() {
    // KeylessAI endpoint (ücretsiz, anahtarsız)
    const AI_API_URL = 'https://keylessai.thryx.workers.dev/v1/chat/completions';

    const elements = {
        conversation: document.getElementById('conversation'),
        command: document.getElementById('command'),
        send: document.getElementById('send'),
        voiceButton: document.getElementById('voice-button'),
        statusDot: document.getElementById('status-dot'),
        statusText: document.getElementById('status-text')
    };

    let isProcessing = false;

    function updateStatus(status, text) {
        if (elements.statusDot) {
            elements.statusDot.className = `status-dot status-${status}`;
        }
        if (elements.statusText) {
            elements.statusText.textContent = text || status;
        }
    }

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
        meta.textContent = source === 'ai' ? '🌐 Özgür AI' : source === 'local' ? '⚡ Yerel' : '📡 JARVIS';
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

    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message jarvis typing';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `<div class="avatar">🤖</div><div class="content"><div class="text">JARVIS yazıyor...</div></div>`;
        if (elements.conversation) {
            elements.conversation.appendChild(typingDiv);
            elements.conversation.scrollTop = elements.conversation.scrollHeight;
        }
    }

    function hideTyping() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    // KeylessAI ile sohbet (API anahtarı yok!)
    async function askAI(text) {
        try {
            const response = await fetch(AI_API_URL, {
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
                return { success: true, response: data.choices[0].message.content };
            } else {
                throw new Error('Cevap alınamadı.');
            }
        } catch (error) {
            console.error('AI hatası:', error);
            return { success: false, error: error.message };
        }
    }

    async function processCommand(text) {
        if (!text || text.trim() === '' || isProcessing) return;

        const commandInput = elements.command;
        isProcessing = true;
        if (commandInput) commandInput.disabled = true;

        addMessage('user', text);
        Memory.add('user', text);
        updateStatus('processing', 'Düşünüyor...');

        try {
            // 1. Yerel komutları dene
            const localResult = await AICore.think(text);
            if (localResult && localResult.success && localResult.source === 'local') {
                addMessage('jarvis', localResult.response, 'local');
                Memory.add('jarvis', localResult.response);
                updateStatus('online', 'Hazır');
                return;
            }

            // 2. KeylessAI ile sohbet
            showTyping();
            const aiResult = await askAI(text);
            hideTyping();

            if (aiResult.success) {
                addMessage('jarvis', aiResult.response, 'ai');
                Memory.add('jarvis', aiResult.response);
                updateStatus('online', 'Hazır');
            } else {
                addMessage('jarvis', '❌ AI hatası: ' + aiResult.error, 'error');
                updateStatus('error', 'Hata');
            }

        } catch (error) {
            hideTyping();
            console.error('JARVIS hatası:', error);
            addMessage('jarvis', 'Bir hata oluştu. Lütfen daha sonra tekrar dene.', 'error');
            updateStatus('error', 'Hata');
        } finally {
            if (commandInput) {
                commandInput.value = '';
                commandInput.disabled = false;
                commandInput.focus();
            }
            isProcessing = false;
        }
    }

    function setupEventListeners() {
        if (elements.send) {
            elements.send.addEventListener('click', () => {
                if (elements.command) processCommand(elements.command.value);
            });
        }
        if (elements.command) {
            elements.command.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    processCommand(elements.command.value);
                }
            });
        }
        if (elements.voiceButton) {
            elements.voiceButton.addEventListener('click', () => {
                if (window.Voice && typeof Voice.startListening === 'function') {
                    Voice.startListening();
                } else {
                    alert('Ses sistemi başlatılamadı.');
                }
            });
        }
    }

    async function init() {
        console.log('🚀 JARVIS v14 başlatılıyor...');
        console.log('🌐 KeylessAI ile ücretsiz, anahtarsız AI!');
        setupEventListeners();
        updateStatus('online', 'Hazır');

        const hasMessages = Memory.count() > 0;
        if (!hasMessages) {
            setTimeout(() => {
                addMessage('jarvis', 'Merhaba! Ben JARVIS. Sana nasıl yardımcı olabilirim? (KeylessAI ile özgürüm!)', 'local');
            }, 500);
        }
        console.log('✅ JARVIS hazır!');
    }

    return { init, processCommand, addMessage, updateStatus };
})();

document.addEventListener('DOMContentLoaded', () => {
    JarvisApp.init();
});

window.JarvisApp = JarvisApp;
