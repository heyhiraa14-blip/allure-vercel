const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed.' });
  }

  if (!GOOGLE_SCRIPT_URL) {
    return res.status(500).json({
      ok: false,
      message: 'GOOGLE_SCRIPT_URL is not configured.'
    });
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body || {})
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { ok: false, message: 'Invalid response from Google Apps Script.' };
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: 'Could not connect to the backend.'
    });
  }
}
