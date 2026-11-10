export type StoryGenre = 
  | 'Horror'
  | 'Comedy'
  | 'Adventure'
  | 'Fantasy'
  | 'Mystery'
  | 'Romance-free friendship stories'
  | 'Science Fiction'
  | 'Inspirational';

export type StoryLength = 'short' | 'medium' | 'long';

export interface IllustrationConcept {
  sceneDescription: string;
  artStyle: string;
  promptForImage: string;
  colorPalette?: string[];
  imageUrl?: string;
  isActualImage?: boolean;
}

export interface Story {
  id: string;
  title: string;
  logline: string;
  synopsis: string;
  beginning: string;
  middle: string;
  ending: string;
  fullText: string;
  genre: StoryGenre | string;
  length: StoryLength;
  language: string;
  writingStyle: string;
  pov?: string;
  tone?: string;
  moralOrTheme?: string;
  charactersUsed: string[];
  illustrationConcept: IllustrationConcept;
  wordCount: number;
  readingTimeMinutes: number;
  createdAt: string;
  isFavorite?: boolean;
}

export interface Character {
  id: string;
  name: string;
  alias: string;
  role: string;
  genre: string;
  physicalDescription: string;
  personalityTraits: string[];
  background: string;
  signatureItem: string;
  voiceAndMotto?: string;
  strengths: string[];
  flaws: string[];
  storyHook?: string;
  createdAt: string;
}

export interface StoryContinuation {
  continuationTitle: string;
  continuationSummary: string;
  continuationText: string;
  newCharactersIntroduced: string[];
  plotTwists: string;
  nextPlotHooks: string[];
  wordCount: number;
  createdAt: string;
}

export interface StoryPromptIdea {
  title: string;
  premise: string;
  characterIdea: string;
  conflict: string;
}
