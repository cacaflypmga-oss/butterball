// ═══════════════════════════════════════════════════════════════
//  Butterball — OpenAI API Proxy
//  作用:代打 OpenAI API,繞開瀏覽器 CORS 限制
//  使用者的 API Key 透過 header 傳入,不儲存在伺服器
// ═══════════════════════════════════════════════════════════════

export const config = {
  api: {
    bodyParser: false, // 讓 multipart/form-data 也能通過
  },
  maxDuration: 300, // Vercel 允許最長 300 秒(給生圖用)
};

export default async function handler(req, res) {
  // ─── CORS headers(讓瀏覽器允許跨網域呼叫此 API)─────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-OpenAI-Key, X-Target-Path');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // ─── 取得使用者的 OpenAI Key ─────
  const userKey = req.headers['x-user-openai-key'];
  if (!userKey || typeof userKey !== 'string' || !userKey.startsWith('sk-')) {
    return res.status(400).json({
      error: {
        message: 'Missing or invalid OpenAI API Key. Please set it in Butterball settings.',
        type: 'auth_error'
      }
    });
  }

  // ─── 取得要打的 OpenAI 端點路徑 ─────
  const targetPath = req.headers['x-target-path'];
  const allowedPaths = [
    '/v1/images/generations',
    '/v1/images/edits',
    '/v1/chat/completions',
  ];
  if (!targetPath || !allowedPaths.includes(targetPath)) {
    return res.status(400).json({
      error: {
        message: `Invalid target path. Allowed: ${allowedPaths.join(', ')}`,
        type: 'invalid_request'
      }
    });
  }

  const openaiUrl = `https://api.openai.com${targetPath}`;

  try {
    // ─── 讀 request body(可能是 JSON 或 multipart)─────
    const contentType = req.headers['content-type'] || 'application/json';
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks);

    // ─── 代打 OpenAI ─────
    const openaiRes = await fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userKey}`,
        'Content-Type': contentType,
      },
      body: rawBody,
    });

    // ─── 把 OpenAI 回應原樣回傳給前端 ─────
    const respContentType = openaiRes.headers.get('content-type') || 'application/json';
    res.setHeader('Content-Type', respContentType);
    res.status(openaiRes.status);

    const respBuffer = Buffer.from(await openaiRes.arrayBuffer());
    return res.send(respBuffer);

  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({
      error: {
        message: err.message || 'Proxy internal error',
        type: 'proxy_error'
      }
    });
  }
}
