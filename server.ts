import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const SYSTEM_PROMPT = `You are ManasMitra AI (मनसमित्र), an intelligent personal well-being companion created under the United Nations Sustainable Development Goal (SDG) 3: Good Health and Well-Being ("Understand Your Mind. Nurture Your Well-Being").

YOUR CORE MISSION & IDENTITY:
1. You promote emotional awareness, healthy lifestyle habits, self-reflection, and preventive well-being.
2. You are NOT a medical doctor, therapist, or diagnostic system. Never claim to diagnose, treat, or cure clinical psychiatric disorders. Always maintain a supportive, preventive, and educational tone.
3. You focus on the 5 Pillars of SDG 3 Well-Being:
   - 🧠 Mental Awareness (Thoughts, feelings, stress triggers)
   - ❤️ Emotional Well-Being (Emotional balance, self-compassion, cognitive reframing)
   - 🌱 Healthy Habits (Sleep rhythm, hydration, physical movement, relaxation)
   - 🤝 Social Well-Being (Meaningful connections, empathy, healthy boundaries)
   - 🛡️ Preventive Support (Early habit adjustments before distress escalates)
4. TONE: Warm, grounding, validating, and action-oriented. Validate the user's emotion first.
5. ACTION-ORIENTED RESPONSES: Always offer concrete, gentle, bite-sized micro-actions (e.g., 2-minute box breathing, organizing 3 priorities, writing down a reframe, taking a walk, or mindful hydration).
6. SAFETY & CRISIS PROTOCOL: If the user expresses thoughts of self-harm, severe hopelessness, or acute crisis, respond with deep compassion and immediately provide real crisis support contacts (India: Tele-MANAS 14416 / KIRAN 1800-599-0019; US/Global: 988 Suicide & Crisis Lifeline; International: findahelpline.com / befrienders.org).

RESPONSE FORMAT:
Converse naturally and empathetically. At the end of your response, if relevant, suggest 2 or 3 brief action chips in JSON format in a tag:
[SUGGESTED_ACTIONS: [{"label": "🧘 2-Min Box Breathing", "action": "breathing"}, {"label": "📋 Organize Top 3 Tasks", "action": "priorities"}, {"label": "💭 Reframe Thought", "action": "reframe"}]]`;

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// API: Chat Companion
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userContext } = req.body;
    const ai = getGenAI();

    let contextString = '';
    if (userContext) {
      contextString = `\nCurrent User Context:\n- Current Mood: ${userContext.mood || 'Not specified'}\n- Energy Level: ${userContext.energy || 'Normal'}\n- Sleep Last Night: ${userContext.sleepHours ?? 'Unknown'} hrs\n- Physical Activity: ${userContext.activityMinutes ?? 0} mins\n- Habits Done Today: ${userContext.habitsCount ?? 0}\n- Well-Being Indicator: ${userContext.wellbeingScore ?? 75}/100`;
    }

    if (!ai) {
      // Graceful fallback if GEMINI_API_KEY is not configured
      const lastUserMsg = messages[messages.length - 1]?.content || '';
      return res.json({
        reply: `Thank you for sharing that with me. It takes courage to pause and reflect on how you're feeling right now. Remember that well-being isn't about feeling 100% every single day—it is about noticing your inner state and taking gentle, supportive steps.\n\nWould you like to take a mindful moment together to reset your nervous system?`,
        suggestedActions: [
          { label: '🧘 2-Min Box Breathing', action: 'breathing' },
          { label: '💭 Cognitive Reframe', action: 'reframe' },
          { label: '💧 Hydrate & Stretch', action: 'stretch' },
        ],
      });
    }

    // Convert messages for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    if (contextString && contents.length > 0) {
      const last = contents[contents.length - 1];
      if (last.role === 'user') {
        last.parts[0].text += `\n[Context: ${contextString}]`;
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    const rawText = response.text || '';
    let reply = rawText;
    let suggestedActions: Array<{ label: string; action: string }> = [];

    const actionMatch = rawText.match(/\[SUGGESTED_ACTIONS:\s*(\[.*?\])\s*\]/s);
    if (actionMatch) {
      try {
        suggestedActions = JSON.parse(actionMatch[1]);
        reply = rawText.replace(/\[SUGGESTED_ACTIONS:\s*\[.*?\]\s*\]/s, '').trim();
      } catch (err) {
        console.error('Failed to parse suggested actions:', err);
      }
    }

    // Default action chips if none extracted
    if (suggestedActions.length === 0) {
      suggestedActions = [
        { label: '🧘 Calm Down', action: 'breathing' },
        { label: '📋 Organize Priorities', action: 'organize' },
        { label: '💭 Reflect Deeper', action: 'reflect' },
      ];
    }

    res.json({ reply, suggestedActions });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      reply: "I hear you, and your well-being matters. Let's take a slow breath together. Would you like to try a grounding exercise or journal your thoughts?",
      suggestedActions: [
        { label: '🧘 2-Min Box Breathing', action: 'breathing' },
        { label: '🌿 5-4-3-2-1 Grounding', action: 'grounding' },
      ],
    });
  }
});

// API: Personalized Well-Being Recommendation
app.post('/api/recommendation', async (req, res) => {
  try {
    const { mood, energy, sleepHours, activityMinutes, habits, notes } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        headline: 'Gentle Pacing & Restorative Movement',
        recommendation:
          'Based on your recent rhythm, take 10 minutes away from screens to hydrate and do light stretches. Reconnecting with your body helps rebalance mental focus.',
        suggestedActivity: 'breathing',
        pillar: 'Healthy Habits',
      });
    }

    const prompt = `Based on this user's daily check-in:
- Mood: ${mood || 'Neutral'}
- Energy: ${energy || 'Medium'}
- Sleep: ${sleepHours || 7} hours
- Physical Activity: ${activityMinutes || 20} minutes
- Habits: ${JSON.stringify(habits || [])}
- Notes: ${notes || 'None'}

Provide an inspiring, actionable SDG 3 Good Health & Well-Being recommendation.
Return strictly JSON with this structure:
{
  "headline": "Short encouraging title (3-6 words)",
  "recommendation": "Empathetic, actionable recommendation (2-3 sentences)",
  "suggestedActivity": "breathing" | "grounding" | "reframe" | "gratitude" | "stretch",
  "pillar": "Mental Awareness" | "Emotional Well-Being" | "Healthy Habits" | "Social Well-Being" | "Preventive Support"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.5,
      },
    });

    const data = JSON.parse(response.text || '{}');
    res.json(data);
  } catch (error: any) {
    console.error('Recommendation error:', error);
    res.json({
      headline: 'Mindful Moment for Body & Mind',
      recommendation:
        'Taking a short mindful breathing break can relieve tension and restore clarity. Give yourself permission to pause.',
      suggestedActivity: 'breathing',
      pillar: 'Emotional Well-Being',
    });
  }
});

// API: Preventive Pattern Analysis
app.post('/api/preventive-analysis', async (req, res) => {
  try {
    const { history } = req.body;
    const ai = getGenAI();

    if (!ai || !history || history.length === 0) {
      return res.json({
        hasPattern: false,
        summary: 'Your well-being metrics show steady balance. Keep nurturing your daily hydration and sleep consistency.',
        trendType: 'stable',
        preventiveTip: 'Maintain your bedtime wind-down routine to support uninterrupted sleep.',
      });
    }

    const prompt = `Analyze this 7-day well-being check-in history under SDG 3 preventive health principles:
${JSON.stringify(history)}

Identify whether there is a subtle trend (e.g., declining sleep hours, consistently low energy, drop in activity, or feelings of isolation).
Remember: This is a PREVENTIVE WELL-BEING OBSERVATION, NOT a medical diagnosis.
Return strictly JSON:
{
  "hasPattern": boolean,
  "trendType": "dip" | "improving" | "stable",
  "summary": "2 sentences describing the observed pattern warmly and non-judgmentally",
  "preventiveTip": "1-2 sentences with a realistic preventive micro-action to reset equilibrium"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Preventive analysis error:', error);
    res.json({
      hasPattern: false,
      summary: 'Your daily check-in habits build awareness. Every mindful pause helps protect your overall wellness.',
      trendType: 'stable',
      preventiveTip: 'Take a brief screen-free break each afternoon.',
    });
  }
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
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
    console.log(`ManasMitra AI running on http://localhost:${PORT}`);
  });
}

startServer();
