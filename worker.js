export default {
  async fetch(request) {
    // Cloudflare Workers AI endpoint'i
    const AI_URL = 'https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/ai/run/@cf/meta/llama-2-7b-chat-int8';

    // Account ID'ni buraya yaz
    const ACCOUNT_ID = 'YOUR_ACCOUNT_ID';
    const API_TOKEN = 'YOUR_CLOUDFLARE_API_TOKEN';

    // CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    try {
      const body = await request.json();
      const userMessage = body.messages?.[body.messages.length - 1]?.content || '';

      // Workers AI'ye istek gönder
      const response = await fetch(AI_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'Sen JARVIS\'sin. Kullanıcı ile sohbet ediyorsun.' },
            { role: 'user', content: userMessage }
          ],
          stream: false,
          max_tokens: 512,
        }),
      });

      const data = await response.json();
      
      // Cloudflare Workers AI cevap formatı
      if (data.success && data.result?.response) {
        return new Response(JSON.stringify({ 
          success: true, 
          response: data.result.response 
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } else {
        throw new Error(data.errors?.[0]?.message || 'AI hatası');
      }

    } catch (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 500,
      });
    }
  },
};
