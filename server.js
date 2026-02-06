const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

app.post('/api/vision', async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_VISION_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing GOOGLE_VISION_API_KEY.' });
    }

    const { image, languageHints } = req.body;
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

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(502).json({ error: 'Vision API error', details: errorText });
    }

    const data = await response.json();
    const text = data?.responses?.[0]?.fullTextAnnotation?.text || '';

    return res.json({ text });
  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
