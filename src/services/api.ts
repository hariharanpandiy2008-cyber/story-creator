import { Story, Character, StoryContinuation, StoryPromptIdea, StoryGenre, StoryLength } from '../types/story';

export interface GenerateStoryParams {
  prompt: string;
  genre: StoryGenre | string;
  length: StoryLength;
  characterNames?: string;
  characters?: Character[];
  language: string;
  writingStyle: string;
  pov?: string;
  tone?: string;
}

export interface ContinueStoryParams {
  existingStory: string;
  direction?: string;
  length?: StoryLength;
  language?: string;
  writingStyle?: string;
  genre?: string;
}

export interface GenerateCharacterParams {
  genre: string;
  archetype?: string;
  role?: string;
  prompt?: string;
  language?: string;
}

export async function generateStoryApi(params: GenerateStoryParams): Promise<Story> {
  const res = await fetch('/api/generate-story', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to generate story. Please verify your Gemini API key in Settings > Secrets.');
  }

  return {
    id: 'story_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    ...data.data,
  };
}

export async function continueStoryApi(params: ContinueStoryParams): Promise<StoryContinuation> {
  const res = await fetch('/api/continue-story', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to continue story. Please check your Gemini API key.');
  }

  return data.data;
}

export async function generateCharacterApi(params: GenerateCharacterParams): Promise<Character> {
  const res = await fetch('/api/generate-character', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to forge character.');
  }

  return data.data;
}

export async function generatePromptsApi(genre: string, language: string = 'English'): Promise<StoryPromptIdea[]> {
  const res = await fetch('/api/generate-prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ genre, language }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to generate prompts.');
  }

  return data.prompts || [];
}

export async function generateIllustrationApi(
  prompt: string,
  aspectRatio: '1:1' | '16:9' | '3:4' = '1:1',
  storyTitle?: string
): Promise<{ imageUrl?: string; isActualImage: boolean; enhancedPrompt: string; fallbackNotice?: string }> {
  const res = await fetch('/api/generate-illustration', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, aspectRatio, storyTitle }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to generate illustration.');
  }

  return data;
}

export async function checkBackendHealth(): Promise<{ status: string; hasApiKey: boolean }> {
  try {
    const res = await fetch('/api/health');
    return await res.json();
  } catch {
    return { status: 'error', hasApiKey: false };
  }
}
