const express = require('express');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

app.post('/api/vision', async (req, res) => {
  try {
    const { image, languageHints, apiKey: providedApiKey } = req.body;
    const apiKey = process.env.GOOGLE_VISION_API_KEY || providedApiKey;

    if (!apiKey) {
      return res.status(400).json({
        error: 'Missing API key.',
        details: 'ضع GOOGLE_VISION_API_KEY في الخادم أو أدخل المفتاح في الواجهة.'
      });
    }

    if (!image) {
      return res.status(400).json({ error: 'Missing base64 image data.' });
    }

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
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const details = data?.error?.message || 'Vision API request failed.';
      return res.status(502).json({ error: 'Vision API error', details });
    }

    const text = data?.responses?.[0]?.fullTextAnnotation?.text || '';
    return res.json({ text });
  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
