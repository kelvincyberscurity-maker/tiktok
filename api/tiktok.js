// Vercel Serverless Function: /api/tiktok
// Configure API_KEY in Vercel Project Settings > Environment Variables.
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!['GET', 'POST'].includes(req.method)) {
    return res.status(405).json({ code: 405, msg: 'Method not allowed. Use GET or POST.' });
  }

  const expectedKey = process.env.API_KEY;
  const suppliedKey =
    req.headers['x-api-key'] ||
    (req.headers.authorization || '').replace(/^Bearer\s+/i, '');

  if (!expectedKey) {
    return res.status(503).json({
      code: 503,
      msg: 'API belum dikonfigurasi. Atur API_KEY di Vercel Environment Variables.'
    });
  }
  if (!suppliedKey || suppliedKey !== expectedKey) {
    return res.status(401).json({ code: 401, msg: 'API key tidak valid.' });
  }

  const inputUrl = req.method === 'GET' ? req.query.url : (req.body && req.body.url);
  if (typeof inputUrl !== 'string' || !inputUrl.trim()) {
    return res.status(400).json({
      code: 400,
      msg: 'Parameter url wajib diisi.',
      example: 'GET /api/tiktok?url=https%3A%2F%2Fwww.tiktok.com%2F...'
    });
  }

  let parsed;
  try {
    parsed = new URL(inputUrl.trim());
    if (!/(^|\.)tiktok\.com$/i.test(parsed.hostname)) throw new Error('invalid host');
  } catch {
    return res.status(400).json({ code: 400, msg: 'URL TikTok tidak valid.' });
  }

  try {
    const upstream = new URL('https://tk-down-app.vercel.app/api/tiktok');
    upstream.searchParams.set('url', parsed.toString());

    const response = await fetch(upstream.toString(), {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(20000)
    });
    const raw = await response.text();
    let payload;
    try { payload = JSON.parse(raw); }
    catch { payload = { code: response.status, msg: raw || 'Respons upstream bukan JSON.' }; }

    if (!response.ok) {
      return res.status(response.status).json({
        code: response.status,
        msg: payload.msg || payload.message || `Upstream HTTP ${response.status}`
      });
    }
    return res.status(200).json(payload);
  } catch (error) {
    return res.status(502).json({
      code: 502,
      msg: 'Gagal mengambil data dari layanan TikTok.',
      error: error.name === 'TimeoutError' ? 'Upstream timeout' : error.message
    });
  }
};
