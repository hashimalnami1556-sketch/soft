const express = require('express');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, hasServerApiKey: Boolean(process.env.GOOGLE_VISION_API_KEY) });
});

app.post('/api/vision', async (req, res) => {
  try {
    const { image, languageHints, apiKey: providedApiKey } = req.body || {};
    const apiKey = process.env.GOOGLE_VISION_API_KEY || providedApiKey;

    if (!apiKey) {
      return res.status(400).json({
        error: 'Missing API key.',
        details: 'ضع GOOGLE_VISION_API_KEY في الخادم أو أدخل المفتاح في الواجهة.'
      });
    }

    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: 'Missing base64 image data.' });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [
          {
            image: { content: image },
            features: [{ type: 'TEXT_DETECTION' }],
            imageContext: {
              languageHints: Array.isArray(languageHints) ? languageHints : ['ar', 'en']
            }
          }
        ]
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : { raw: await response.text() };

    if (!response.ok) {
      const details = data?.error?.message || data?.raw || 'Vision API request failed.';
      return res.status(502).json({ error: 'Vision API error', details });
    }

    const text = data?.responses?.[0]?.fullTextAnnotation?.text || '';
    return res.json({ text });
  } catch (error) {
    if (error?.name === 'AbortError') {
      return res.status(504).json({ error: 'Vision timeout', details: 'انتهت مهلة الطلب قبل إكمال القراءة.' });
    }

    return res.status(500).json({ error: 'Server error', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
