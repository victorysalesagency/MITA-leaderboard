// api/getLeaderboard.js
export default async function handler(req, res) {
  const execUrl = process.env.APPSSCRIPT_EXEC_URL;
  if (!execUrl) {
    res.status(500).json({ error: "APPSSCRIPT_EXEC_URL env var not set" });
    return;
  }

  const params = new URLSearchParams();
  if (req.query.start) params.set('start', req.query.start);
  if (req.query.end)   params.set('end', req.query.end);
  const url = execUrl + (params.toString() ? `?${params.toString()}` : '');

  try {
    const r = await fetch(url, { redirect: 'follow' });
    const contentType = r.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await r.json();
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(200).json(json);
    }
    const text = await r.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).send(text);
  } catch (err) {
    return res.status(502).json({ error: String(err) });
  }
}
