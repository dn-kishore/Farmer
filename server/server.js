const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const dns = require('dns');
const https = require('https');

// Force IPv4 first for DNS resolution to prevent fetch failures in cloud environments
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

// Load environment variables from the local server folder
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all requests (important for Capacitor webview origin: http://localhost, etc.)
app.use(cors());

// Body parser
app.use(express.json());

// Set up multer for processing audio file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

// Helper to make native HTTPS GET requests to avoid Node 18/20 fetch dual-stack ETIMEDOUT bugs in cloud environments
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          json: async () => JSON.parse(data),
          text: async () => data
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// 1. Weather API Proxy
app.get('/api/weather', async (req, res) => {
  try {
    const { lat, lon, q } = req.query;
    const proxyUrl = process.env.WEATHER_PROXY_URL;
    
    let url;
    if (proxyUrl) {
      // Use Cloudflare Worker proxy if configured
      if (lat && lon) {
        url = `${proxyUrl}?lat=${lat}&lon=${lon}`;
      } else if (q) {
        url = `${proxyUrl}?q=${encodeURIComponent(q)}`;
      } else {
        return res.status(400).json({ error: 'Missing parameter: lat/lon or q is required' });
      }
      console.log(`[Weather] Fetching weather via Cloudflare Worker proxy: ${url}`);
    } else {
      // Fallback to direct OpenWeatherMap API
      const apiKey = process.env.OPENWEATHER_API_KEY || 'e7d96cb598ba84ac3c1fb223a233c543';
      if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      } else if (q) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${apiKey}&units=metric`;
      } else {
        return res.status(400).json({ error: 'Missing parameter: lat/lon or q is required' });
      }
      console.log(`[Weather] Fetching weather directly from OpenWeatherMap: ${url.replace(apiKey, 'HIDDEN')}`);
    }

    const response = await httpsGet(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: `Weather API failed with status ${response.status}` });
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('[Weather] Route error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// 2. Chat Completions API Proxy (OpenRouter)
app.post('/api/chat', async (req, res) => {
  try {
    const { model, messages } = req.body;
    const openrouterApiKey = process.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;

    if (!openrouterApiKey) {
      console.error('[Chat] OpenRouter API key is missing from environment variables');
      return res.status(500).json({ error: 'OpenRouter API key is not configured on server' });
    }

    console.log(`[Chat] Forwarding completions request to OpenRouter using model: ${model}`);
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openrouterApiKey}`,
        'HTTP-Referer': 'https://agriassist.app',
        'X-Title': 'AgriAssist AI'
      },
      body: JSON.stringify({ model, messages })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Chat] OpenRouter API returned error:', errorText);
      return res.status(response.status).json({ error: `OpenRouter API failed: ${response.statusText}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('[Chat] Route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Text-to-Speech API Proxy (Sarvam AI)
app.post('/api/tts', async (req, res) => {
  try {
    const { text, lang } = req.body;
    const sarvamApiKey = process.env.VITE_SARVAM_API_KEY || process.env.SARVAM_API_KEY;

    if (!sarvamApiKey) {
      console.error('[TTS] Sarvam API key is missing from environment variables');
      return res.status(500).json({ error: 'Sarvam API key is not configured on server' });
    }

    console.log(`[TTS] Requesting voice synthesis from Sarvam for language: ${lang}`);
    const response = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': sarvamApiKey
      },
      body: JSON.stringify({
        text: text,
        target_language_code: lang === 'te' ? 'te-IN' : 'en-IN',
        speaker: lang === 'te' ? 'roopa' : 'shubh',
        model: 'bulbul:v3'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[TTS] Sarvam API returned error:', errorText);
      return res.status(response.status).json({ error: `Sarvam TTS API failed: ${response.statusText}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('[TTS] Route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. Speech-to-Text API Proxy (Sarvam AI)
app.post('/api/stt', upload.single('file'), async (req, res) => {
  try {
    const { language_code } = req.body;
    const file = req.file;
    const sarvamApiKey = process.env.VITE_SARVAM_API_KEY || process.env.SARVAM_API_KEY;

    if (!sarvamApiKey) {
      console.error('[STT] Sarvam API key is missing from environment variables');
      return res.status(500).json({ error: 'Sarvam API key is not configured on server' });
    }

    if (!file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    console.log(`[STT] Transcribing audio with language code: ${language_code}`);

    // Create file blob in Node.js using File/Blob (native in Node.js 18+)
    const fileBlob = new Blob([file.buffer], { type: file.mimetype || 'audio/wav' });
    const formData = new FormData();
    formData.append('file', fileBlob, file.originalname || 'query.wav');
    formData.append('model', 'saaras:v3');
    formData.append('mode', 'transcribe');
    formData.append('language_code', language_code || 'en-IN');

    const response = await fetch('https://api.sarvam.ai/speech-to-text', {
      method: 'POST',
      headers: {
        'api-subscription-key': sarvamApiKey
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[STT] Sarvam STT API returned error:', errorText);
      return res.status(response.status).json({ error: `Sarvam STT API failed: ${response.statusText}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('[STT] Route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Simple Healthcheck Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

app.listen(port, () => {
  console.log(`AgriAssist secure proxy backend server running on port ${port}`);
});
