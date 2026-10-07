import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini on server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Voice command parsing endpoint
app.post('/api/voice-command', async (req, res) => {
  try {
    const { transcript, isLocked, secretCodeWord } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    // Call Gemini 3.8 Flash to interpret user voice command into phone action
    const prompt = `You are the MAYUI AI Voice Agent running on a TECNO SPARK Go 2024 smartphone.
Analyze the user's spoken voice command and return a structured JSON action to control the phone.

Current phone state:
- Is Screen Locked: ${isLocked ? 'YES' : 'NO'}
- Configured Voice Secret Code Word / Password: "${secretCodeWord || 'open sesame'}"

Voice Command: "${transcript}"

Possible Actions:
- "unlock": user is speaking the secret code word or password or explicitly requesting to unlock with password. Allowed phrases: saying the code word ("${secretCodeWord || 'open sesame'}"), or "open phone with password ...", "unlock phone". If code word matches or close match, action is "unlock". If code word is wrong, action is "unlock_failed".
- "lock": user wants to lock the phone, turn off display, sleep, or close device (e.g., "lock phone", "turn off screen", "close phone").
- "launch_app": user wants to open an application. Provide appId: one of ["camera", "calculator", "settings", "booster", "maystore", "files", "phone", "messages", "browser", "gallery", "clock", "music", "notes"].
- "toggle_flashlight": turn on/off flashlight/torch. Provide state: true or false.
- "toggle_wifi": turn on/off Wi-Fi. Provide state: true or false.
- "toggle_bluetooth": turn on/off Bluetooth. Provide state: true or false.
- "toggle_battery_saver": enable/disable battery saver. Provide state: true or false.
- "boost_ram": boost RAM, optimize Unisoc T606 memory, clean junk.
- "clean_storage": clean cache / storage.
- "switch_ui_mode": switch between MAYUI and TECNO HiOS. Provide targetMode: "mayui" or "hios".
- "open_notifications": show or open notifications.
- "clear_notifications": clear all notifications.
- "open_quick_panel": open control center / quick settings.
- "open_app_drawer": open all apps / app library.
- "download_apk": download MAYUI APK launcher package.
- "set_volume": adjust volume level (0-100).
- "set_brightness": adjust brightness (0-100).
- "answer": generic question or conversational reply.

Return JSON matching this schema:
{
  "action": string,
  "appId"?: string,
  "state"?: boolean,
  "targetMode"?: string,
  "level"?: number,
  "spokenFeedback": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            action: { type: Type.STRING },
            appId: { type: Type.STRING },
            state: { type: Type.BOOLEAN },
            targetMode: { type: Type.STRING },
            level: { type: Type.NUMBER },
            spokenFeedback: { type: Type.STRING },
          },
          required: ['action', 'spokenFeedback'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Gemini voice command processing error:', error?.message);
    // Return graceful fallback indicator so client can use offline parser
    return res.status(500).json({
      fallback: true,
      error: error?.message || 'Server error',
    });
  }
});

async function startServer() {
  // Mount Vite middlewares in development
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MAYUI OS Server running at http://localhost:${PORT}`);
  });
}

startServer();
