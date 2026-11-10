import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client utility with required telemetry header
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Please configure your API key in Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    time: new Date().toISOString(),
  });
});

// 1. Generate Story
app.post('/api/generate-story', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      genre = 'Fantasy',
      length = 'medium',
      characterNames = '',
      characters = [],
      language = 'English',
      writingStyle = 'Ethereal & Atmospheric',
      pov = 'Third Person Limited',
      tone = 'Engaging & Immersive',
    } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Please provide a story idea or topic.' });
    }

    const ai = getGeminiClient();

    let targetWords = '600 to 1000 words';
    if (length === 'short') targetWords = '350 to 500 words';
    if (length === 'long') targetWords = '1400 to 2000 words';

    const charDetails = Array.isArray(characters) && characters.length > 0
      ? characters.map((c: any) => `- ${c.name || 'Unnamed'}: ${c.description || ''} (${c.traits ? c.traits.join(', ') : ''})`).join('\n')
      : (characterNames ? `Characters involved: ${characterNames}` : 'Create compelling characters fitting the plot.');

    const systemInstruction = `You are a master literary author and creative storytelling AI specializing in evocative, rich prose.
Your task is to write an original, complete, captivating story based on user criteria.
The story must have a clearly structured narrative arc:
1. Beginning (exposition, intriguing hook, atmospheric worldbuilding, character introduction)
2. Middle (rising action, central conflict, hurdles, emotional stakes, turning point)
3. Ending (satisfying climax and poignant resolution)

Follow these strict rules:
- Genre: "${genre}"
- If the genre is "Romance-free friendship stories", focus purely on platonic camaraderie, loyalty, mutual trust, and shared adventures with absolutely NO romantic subplots.
- Length: approximately ${targetWords}.
- Language: ${language} (Write entirely in ${language}, including section titles and synopsis).
- Style: ${writingStyle}
- Point of View: ${pov}
- Tone: ${tone}
- Characters:
${charDetails}
- Include an artistic concept description for an illustration representing the story climax or key visual.`;

    const userPrompt = `Write an original story about the following idea/topic:
"${prompt.trim()}"

Provide the response in structured JSON with:
- title: A creative, memorable, evocative story title.
- logline: A single punchy sentence summarizing the story hook.
- synopsis: A brief 2-3 sentence overview.
- beginning: The complete opening narrative section (world setup, introduction).
- middle: The complete middle narrative section (conflict escalation, turning point).
- ending: The complete concluding narrative section (climax and resolution).
- fullText: The combined narrative prose of beginning, middle, and ending formatted with paragraph breaks.
- moralOrTheme: The central insight, question, or philosophical theme explored.
- charactersUsed: List of main characters that appeared.
- illustrationConcept: An object with:
    - sceneDescription: Vivid visual description of a key moment to paint.
    - artStyle: Suitable art style (e.g., "Moody digital concept art with celestial violet glowing highlights").
    - promptForImage: A detailed text-to-image prompt (without markdown) ready for an image generation model.
    - colorPalette: Array of 3-5 hex or descriptive color tones.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            logline: { type: Type.STRING },
            synopsis: { type: Type.STRING },
            beginning: { type: Type.STRING },
            middle: { type: Type.STRING },
            ending: { type: Type.STRING },
            fullText: { type: Type.STRING },
            moralOrTheme: { type: Type.STRING },
            charactersUsed: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            illustrationConcept: {
              type: Type.OBJECT,
              properties: {
                sceneDescription: { type: Type.STRING },
                artStyle: { type: Type.STRING },
                promptForImage: { type: Type.STRING },
                colorPalette: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['sceneDescription', 'artStyle', 'promptForImage'],
            },
          },
          required: ['title', 'logline', 'beginning', 'middle', 'ending', 'fullText', 'charactersUsed', 'illustrationConcept'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Gemini returned an empty response. Please try again.');
    }

    const storyData = JSON.parse(text);

    // Compute approximate word count & reading time
    const words = storyData.fullText ? storyData.fullText.trim().split(/\s+/).length : 0;
    const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

    res.json({
      success: true,
      data: {
        ...storyData,
        genre,
        length,
        language,
        writingStyle,
        wordCount: words,
        readingTimeMinutes,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error('Error in /api/generate-story:', err);
    res.status(500).json({
      error: err?.message || 'Failed to generate story. Please verify your Gemini API key in Settings > Secrets.',
    });
  }
});

// 2. Continue My Story
app.post('/api/continue-story', async (req: Request, res: Response) => {
  try {
    const {
      existingStory,
      direction = '',
      length = 'medium',
      language = 'English',
      writingStyle = 'Seamless with original style',
      genre = 'Adaptive to story',
    } = req.body;

    if (!existingStory || typeof existingStory !== 'string' || !existingStory.trim()) {
      return res.status(400).json({ error: 'Please provide your existing story text to continue.' });
    }

    const ai = getGeminiClient();

    let targetWords = '500 to 800 words';
    if (length === 'short') targetWords = '250 to 400 words';
    if (length === 'long') targetWords = '1000 to 1500 words';

    const systemInstruction = `You are a master story consultant and literary continuation author.
Your task is to analyze an existing story excerpt and write a compelling, high-quality continuation that seamlessly fits the characters, tone, atmosphere, tension, and prose style of the original.
Follow user direction if provided: "${direction || 'Develop the plot logically with an intriguing twist or natural next step'}".
Target continuation length: approximately ${targetWords}.
Language: ${language}.
Genre context: ${genre}.
Style: ${writingStyle}.`;

    const userPrompt = `Here is the existing story:
"""
${existingStory.trim()}
"""

Continuation Instructions / Desired Direction:
${direction ? `"${direction}"` : 'Continue the scene seamlessly, elevating the stakes and staying true to the established characters and voice.'}

Provide your response in JSON with:
- continuationTitle: An evocative title for this new chapter or act.
- continuationSummary: 2-3 sentences explaining what occurs in this continuation.
- continuationText: The actual narrative continuation prose (ready to read, formatted with paragraphs).
- newCharactersIntroduced: List of any new figures introduced (if none, empty array).
- plotTwists: A brief explanation of the twist or key turning point introduced.
- nextPlotHooks: Array of 3 distinct, creative suggestions for what could happen next if the author continues further.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            continuationTitle: { type: Type.STRING },
            continuationSummary: { type: Type.STRING },
            continuationText: { type: Type.STRING },
            newCharactersIntroduced: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            plotTwists: { type: Type.STRING },
            nextPlotHooks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['continuationTitle', 'continuationSummary', 'continuationText', 'nextPlotHooks'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Gemini returned an empty continuation. Please try again.');
    }

    const continuationData = JSON.parse(text);
    const words = continuationData.continuationText ? continuationData.continuationText.trim().split(/\s+/).length : 0;

    res.json({
      success: true,
      data: {
        ...continuationData,
        wordCount: words,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error('Error in /api/continue-story:', err);
    res.status(500).json({
      error: err?.message || 'Failed to continue story. Please check your Gemini API key in Settings > Secrets.',
    });
  }
});

// 3. AI Character Generator
app.post('/api/generate-character', async (req: Request, res: Response) => {
  try {
    const {
      genre = 'Fantasy',
      archetype = 'Adventurer',
      role = 'Protagonist',
      prompt = '',
      language = 'English',
    } = req.body;

    const ai = getGeminiClient();

    const systemInstruction = `You are a visionary character designer and novelist.
Generate a distinctive, multi-dimensional character tailored for the "${genre}" genre.
Avoid generic clichés; give the character specific quirks, sensory details, an inner contradiction, and strong narrative drive.
Language: ${language}.`;

    const userPrompt = `Create a deep, vivid fictional character with:
- Genre: ${genre}
- Archetype: ${archetype}
- Role: ${role}
${prompt ? `- Custom instructions: "${prompt}"` : ''}

Output as structured JSON with:
- name: Full memorable character name.
- alias: Epithet or title (e.g., "The Whispering Cartographer", "Echo Seven").
- role: Their narrative role (Protagonist, Antagonist, Mentor, Trickster, Loyal Companion, etc.).
- physicalDescription: 2-3 vivid sentences of their appearance, clothes, and telltale mannerisms.
- personalityTraits: Array of 4-6 specific traits (both positive strengths and sharp flaws).
- background: 3-4 sentences detailing their origin, defining formative event, and secret motive.
- signatureItem: A unique tool, talisman, weapon, or keepsake they always carry.
- voiceAndMotto: A quote or motto capturing their speaking style and worldview.
- strengths: Array of 3 key skills or advantages.
- flaws: Array of 2-3 vulnerabilities, vices, or psychological blind spots.
- storyHook: A 1-sentence prompt for how this character could plunge into a story right now.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            alias: { type: Type.STRING },
            role: { type: Type.STRING },
            physicalDescription: { type: Type.STRING },
            personalityTraits: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            background: { type: Type.STRING },
            signatureItem: { type: Type.STRING },
            voiceAndMotto: { type: Type.STRING },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            flaws: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            storyHook: { type: Type.STRING },
          },
          required: ['name', 'alias', 'role', 'physicalDescription', 'personalityTraits', 'background', 'signatureItem', 'strengths', 'flaws', 'storyHook'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No character returned.');
    }

    const charData = JSON.parse(text);
    res.json({
      success: true,
      data: {
        id: 'char_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        ...charData,
        genre,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error('Error in /api/generate-character:', err);
    res.status(500).json({
      error: err?.message || 'Failed to generate character.',
    });
  }
});

// 4. Generate Story Prompts & Ideas for inspiration
app.post('/api/generate-prompt', async (req: Request, res: Response) => {
  try {
    const { genre = 'Fantasy', language = 'English' } = req.body;
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate 3 innovative, high-concept story hooks for the "${genre}" genre in ${language}.
Avoid overused tropes. Make them fresh, gripping, and emotionally resonant.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              premise: { type: Type.STRING },
              characterIdea: { type: Type.STRING },
              conflict: { type: Type.STRING },
            },
            required: ['title', 'premise', 'characterIdea', 'conflict'],
          },
        },
      },
    });

    const text = response.text;
    const prompts = JSON.parse(text || '[]');
    res.json({ success: true, prompts });
  } catch (err: any) {
    console.error('Error in /api/generate-prompt:', err);
    res.status(500).json({ error: err?.message || 'Failed to generate inspiration prompt.' });
  }
});

// 5. AI Story Illustration
app.post('/api/generate-illustration', async (req: Request, res: Response) => {
  try {
    const { prompt, aspectRatio = '1:1', storyTitle = 'Story Illustration' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Please provide an image prompt.' });
    }

    const ai = getGeminiClient();

    // Clean and enhance prompt for image generation
    const enhancedPrompt = `${prompt.trim()}, highly detailed digital painting, storybook cover art, cinematic atmospheric lighting, masterpiece, rich dark fantasy aesthetic`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            {
              text: enhancedPrompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
          },
        },
      });

      let foundImage = false;
      let imageUrl = '';

      for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          const base64Data = part.inlineData.data;
          const mime = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mime};base64,${base64Data}`;
          foundImage = true;
          break;
        }
      }

      if (foundImage && imageUrl) {
        return res.json({
          success: true,
          imageUrl,
          enhancedPrompt,
          isActualImage: true,
        });
      }

      // If text only was returned or no inline image part
      return res.json({
        success: true,
        isActualImage: false,
        enhancedPrompt,
        message: 'Concept illustration prompt generated successfully.',
      });
    } catch (imageErr: any) {
      console.warn('Image generation call failed or requires paid tier key:', imageErr?.message);
      // Graceful fallback with detailed concept prompt so users can still enjoy illustration art cards!
      return res.json({
        success: true,
        isActualImage: false,
        enhancedPrompt,
        fallbackNotice: 'AI illustration concept crafted. If you wish to enable live image generation, ensure your Gemini API key in Settings > Secrets has image permissions.',
      });
    }
  } catch (err: any) {
    console.error('Error in /api/generate-illustration:', err);
    res.status(500).json({
      error: err?.message || 'Failed to generate illustration.',
    });
  }
});

// Vite middleware for dev or static serving in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from dist
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (dev mode: ${isDev})`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});
