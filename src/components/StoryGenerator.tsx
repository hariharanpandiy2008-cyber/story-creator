import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Wand2, 
  Dices, 
  SlidersHorizontal, 
  Users, 
  Languages, 
  BookOpen, 
  PenTool, 
  AlertCircle, 
  Clock, 
  Check, 
  X,
  ChevronDown,
  ChevronUp,
  Eye,
  Smile
} from 'lucide-react';
import { GENRES, LANGUAGES, WRITING_STYLES, POV_OPTIONS, TONE_OPTIONS, GenreMeta } from '../data/genres';
import { Story, StoryGenre, StoryLength, Character } from '../types/story';
import { generateStoryApi } from '../services/api';
import { saveStory } from '../services/storage';
import { GenreIcon } from './GenreIcon';

interface StoryGeneratorProps {
  initialGenre?: StoryGenre;
  initialPrompt?: string;
  initialCharacters?: Character[];
  savedCharacters: Character[];
  onStoryGenerated: (story: Story) => void;
  onOpenCharacterForge: () => void;
}

export const StoryGenerator: React.FC<StoryGeneratorProps> = ({
  initialGenre = 'Fantasy',
  initialPrompt = '',
  initialCharacters = [],
  savedCharacters,
  onStoryGenerated,
  onOpenCharacterForge,
}) => {
  // Form state
  const [prompt, setPrompt] = useState(initialPrompt);
  const [selectedGenre, setSelectedGenre] = useState<StoryGenre>(initialGenre);
  const [storyLength, setStoryLength] = useState<StoryLength>('medium');
  const [language, setLanguage] = useState<string>('English');
  const [writingStyle, setWritingStyle] = useState<string>('Ethereal & Atmospheric');
  const [pov, setPov] = useState<string>('Third Person Limited');
  const [tone, setTone] = useState<string>('Mystical & Atmospheric');
  
  // Custom characters
  const [characterNamesInput, setCharacterNamesInput] = useState<string>('');
  const [selectedVaultCharacters, setSelectedVaultCharacters] = useState<Character[]>(initialCharacters);
  const [showVaultSelector, setShowVaultSelector] = useState(false);

  // Advanced customization accordion
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeGenreMeta = GENRES.find((g) => g.id === selectedGenre) || GENRES[0];

  // Cycling mystical loading messages
  const loadingMessages = [
    'Attuning with the celestial ether of Gemini AI...',
    `Establishing the narrative foundation for ${selectedGenre}...`,
    'Summoning evocative characters and building dramatic tension...',
    'Writing Act I: The Beginning (exposition & hook)...',
    'Weaving Act II: The Middle (turning point & conflict)...',
    'Crafting Act III: The Ending (climax & resolution)...',
    'Polishing prose and dreaming up illustration concepts...',
  ];

  // Random prompt dice
  const handleRandomizePrompt = () => {
    const prompts = activeGenreMeta.starterPrompts;
    const randomPick = prompts[Math.floor(Math.random() * prompts.length)];
    setPrompt(randomPick);
  };

  const toggleVaultCharacter = (char: Character) => {
    if (selectedVaultCharacters.some((c) => c.id === char.id)) {
      setSelectedVaultCharacters(selectedVaultCharacters.filter((c) => c.id !== char.id));
    } else {
      setSelectedVaultCharacters([...selectedVaultCharacters, char]);
    }
  };

  // Submit Handler
  const handleGenerateStory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setErrorMessage('Please enter a story idea or premise before generating.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStep(0);

    // Increment loading step to give vivid feedback
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 2400);

    try {
      // Combine manual character names with selected vault characters
      const combinedCharNames = [
        ...selectedVaultCharacters.map((c) => `${c.name} (${c.role || 'Protagonist'})`),
        characterNamesInput.trim(),
      ].filter(Boolean).join(', ');

      const newStory = await generateStoryApi({
        prompt: prompt.trim(),
        genre: selectedGenre,
        length: storyLength,
        characterNames: combinedCharNames,
        characters: selectedVaultCharacters,
        language,
        writingStyle,
        pov,
        tone,
      });

      clearInterval(interval);

      // Save to local storage
      saveStory(newStory);

      // Trigger celebratory confetti
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#6366f1', '#38bdf8', '#fbbf24'],
      });

      // Pass up to parent
      onStoryGenerated(newStory);
    } catch (err: any) {
      clearInterval(interval);
      console.error('Story generation failed:', err);
      setErrorMessage(
        err.message || 'Failed to generate story. Please check your Gemini API key in Settings > Secrets and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-semibold">
          <Wand2 className="w-3.5 h-3.5 text-purple-400" />
          Original Story Forge
        </div>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
          Generate a Complete Story
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          Provide your premise or let Gemini weave an imaginative tale with a structured beginning, middle, and climax.
        </p>
      </div>

      {/* Main Generator Form */}
      <form onSubmit={handleGenerateStory} className="space-y-6">
        {/* 1. Genre Selection Grid */}
        <div className="rounded-2xl border border-purple-500/20 bg-[#120e2e]/70 p-5 backdrop-blur-md space-y-3">
          <label className="text-sm font-semibold text-purple-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              1. Choose Genre
            </span>
            <span className="text-xs text-slate-400 font-normal">
              Active: <strong className="text-purple-300">{activeGenreMeta.name}</strong>
            </span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {GENRES.map((genre: GenreMeta) => {
              const isSelected = selectedGenre === genre.id;
              return (
                <button
                  type="button"
                  key={genre.id}
                  onClick={() => {
                    setSelectedGenre(genre.id);
                    if (genre.suggestedStyles[0]) {
                      setWritingStyle(genre.suggestedStyles[0]);
                    }
                  }}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? `bg-gradient-to-r ${genre.accentColor} text-white border-transparent shadow-md shadow-purple-900/40 font-semibold scale-[1.02]`
                      : 'bg-white/[0.03] border-purple-500/15 text-slate-300 hover:text-white hover:bg-white/[0.07] hover:border-purple-500/30'
                  }`}
                >
                  <GenreIcon iconName={genre.iconName} className="w-4 h-4 shrink-0" />
                  <span className="text-xs truncate">
                    {genre.id === 'Romance-free friendship stories' ? 'Friendship' : genre.name}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-purple-300/80 italic pt-1 pl-1">
            "{activeGenreMeta.tagline}" — {activeGenreMeta.description}
          </p>
        </div>

        {/* 2. Story Idea Input */}
        <div className="rounded-2xl border border-purple-500/20 bg-[#120e2e]/70 p-5 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="story-prompt" className="text-sm font-semibold text-purple-200 flex items-center gap-2">
              <PenTool className="w-4 h-4 text-purple-400" />
              2. Story Idea or Premise
            </label>
            <button
              type="button"
              onClick={handleRandomizePrompt}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-purple-300 bg-purple-900/40 hover:bg-purple-800/50 border border-purple-500/30 transition-colors"
            >
              <Dices className="w-3.5 h-3.5 text-purple-400" />
              Surprise Me ({activeGenreMeta.name})
            </button>
          </div>

          <div className="relative">
            <textarea
              id="story-prompt"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A clockmaker discovers that one of his pocket watches does not tick seconds, but tracks how many lies the wearer tells..."
              className="w-full rounded-xl bg-[#090717]/90 border border-purple-500/25 p-4 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all font-sans-ui"
            />
            {prompt && (
              <button
                type="button"
                onClick={() => setPrompt('')}
                className="absolute top-3 right-3 p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Premise Starters for Active Genre */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Quick starters for {activeGenreMeta.name}:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeGenreMeta.starterPrompts.map((starter, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setPrompt(starter)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-purple-600/20 text-slate-300 hover:text-purple-200 border border-purple-500/15 hover:border-purple-500/40 transition-colors text-left truncate max-w-full"
                >
                  "{starter.substring(0, 70)}..."
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Core Story Customization (Length & Characters) */}
        <div className="rounded-2xl border border-purple-500/20 bg-[#120e2e]/70 p-5 backdrop-blur-md space-y-5">
          <h3 className="text-sm font-semibold text-purple-200 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-purple-400" />
            3. Story Customization
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Story Length */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                Story Length
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'short', label: 'Short', desc: '~350-500 words' },
                    { id: 'medium', label: 'Medium', desc: '~600-1000 words' },
                    { id: 'long', label: 'Long', desc: '~1400-2000 words' },
                  ] as const
                ).map((l) => (
                  <button
                    type="button"
                    key={l.id}
                    onClick={() => setStoryLength(l.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      storyLength === l.id
                        ? 'bg-purple-600/30 border-purple-400 text-white font-semibold shadow-sm'
                        : 'bg-white/[0.03] border-purple-500/15 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold">{l.label}</div>
                    <div className="text-[10px] text-purple-300/80">{l.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Character Names Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  Character Names
                </label>
                <button
                  type="button"
                  onClick={() => setShowVaultSelector(!showVaultSelector)}
                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
                >
                  {showVaultSelector ? 'Hide Vault' : 'Pick from Vault'}
                </button>
              </div>

              <input
                type="text"
                value={characterNamesInput}
                onChange={(e) => setCharacterNamesInput(e.target.value)}
                placeholder="e.g., Elian, Archimedes, Lady Thorne"
                className="w-full rounded-xl bg-[#090717]/90 border border-purple-500/25 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-400 transition-all font-sans-ui"
              />

              {/* Selected Vault Characters Pills */}
              {selectedVaultCharacters.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedVaultCharacters.map((char) => (
                    <span
                      key={char.id}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-indigo-950/80 text-indigo-200 border border-indigo-500/40"
                    >
                      <span>{char.name}</span>
                      <button
                        type="button"
                        onClick={() => toggleVaultCharacter(char)}
                        className="hover:text-red-300 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Vault Character Selector Drawer */}
          {showVaultSelector && (
            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/25 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-200">
                  Select Characters from your Character Vault:
                </span>
                <button
                  type="button"
                  onClick={onOpenCharacterForge}
                  className="text-xs text-purple-400 hover:underline"
                >
                  + Forge New Character
                </button>
              </div>

              {savedCharacters.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  No characters saved yet. Use the Character Forge to design custom figures with deep backgrounds!
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {savedCharacters.map((char) => {
                    const isPicked = selectedVaultCharacters.some((c) => c.id === char.id);
                    return (
                      <div
                        key={char.id}
                        onClick={() => toggleVaultCharacter(char)}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between ${
                          isPicked
                            ? 'bg-purple-600/30 border-purple-400 text-white'
                            : 'bg-black/20 border-purple-500/15 text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="text-xs font-semibold">{char.name}</div>
                          <div className="text-[10px] text-purple-300/80 truncate">
                            {char.alias || char.role} ({char.genre})
                          </div>
                        </div>
                        {isPicked && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Advanced Customization Toggle */}
          <div className="pt-2 border-t border-purple-500/15">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-xs font-semibold text-purple-300 hover:text-purple-200"
            >
              <span className="flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5" />
                Language, Writing Style, POV & Tone Settings
              </span>
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAdvanced && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 mt-2">
                {/* Language */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Story Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-xl bg-[#090717]/90 border border-purple-500/25 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-400 font-sans-ui"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code} className="bg-[#120e2e] text-white">
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Writing Style */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Writing Style</label>
                  <select
                    value={writingStyle}
                    onChange={(e) => setWritingStyle(e.target.value)}
                    className="w-full rounded-xl bg-[#090717]/90 border border-purple-500/25 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-400 font-sans-ui"
                  >
                    {WRITING_STYLES.map((style) => (
                      <option key={style} value={style} className="bg-[#120e2e] text-white">
                        {style}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Point of View */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Point of View (POV)</label>
                  <select
                    value={pov}
                    onChange={(e) => setPov(e.target.value)}
                    className="w-full rounded-xl bg-[#090717]/90 border border-purple-500/25 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-400 font-sans-ui"
                  >
                    {POV_OPTIONS.map((item) => (
                      <option key={item.value} value={item.value} className="bg-[#120e2e] text-white">
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tone */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Atmospheric Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full rounded-xl bg-[#090717]/90 border border-purple-500/25 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-400 font-sans-ui"
                  >
                    {TONE_OPTIONS.map((t) => (
                      <option key={t} value={t} className="bg-[#120e2e] text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/50 p-4 flex items-start gap-3 text-red-200">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <p className="font-semibold">{errorMessage}</p>
              <p className="text-red-300/80">
                Ensure your GEMINI_API_KEY is configured in the AI Studio Settings &gt; Secrets panel.
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full relative overflow-hidden py-4 px-6 rounded-2xl font-bold text-base text-white tracking-wide transition-all shadow-xl ${
              isLoading
                ? 'bg-purple-900/60 cursor-not-allowed border border-purple-500/30'
                : 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-900/50 hover:shadow-purple-600/40 hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-300 animate-spin" />
                  <span>Weaving Your Tale...</span>
                </div>
                <span className="text-xs font-normal text-purple-200/90 animate-pulse">
                  {loadingMessages[loadingStep]}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-200" />
                <span>Generate Original Story</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
