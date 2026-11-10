import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Feather, 
  Sparkles, 
  BookOpen, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  AlertCircle, 
  Plus, 
  ArrowRight,
  Lightbulb,
  Clock,
  Compass
} from 'lucide-react';
import { Story, StoryLength, StoryContinuation, StoryGenre } from '../types/story';
import { continueStoryApi } from '../services/api';
import { saveStory } from '../services/storage';

interface ContinueStoryProps {
  initialStoryText?: string;
  initialStoryTitle?: string;
  savedStories: Story[];
  onContinuationSaved: (newStory: Story) => void;
}

export const ContinueStory: React.FC<ContinueStoryProps> = ({
  initialStoryText = '',
  initialStoryTitle = '',
  savedStories,
  onContinuationSaved,
}) => {
  const [existingStory, setExistingStory] = useState(initialStoryText);
  const [storyTitle, setStoryTitle] = useState(initialStoryTitle || 'My Continued Story');
  const [direction, setDirection] = useState('');
  const [length, setLength] = useState<StoryLength>('medium');
  const [genre, setGenre] = useState<string>('Adaptive to story');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [continuationResult, setContinuationResult] = useState<StoryContinuation | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Quick plot twist ideas
  const plotTwists = [
    'An unexpected ally arrives with vital information.',
    'A long-held secret or betrayal is abruptly unveiled.',
    'An ancient relic or hidden power unexpectedly awakens.',
    'A sudden natural catastrophe traps the characters together.',
    'They realize they have been pursuing the wrong clue all along.',
    'A mysterious riddle presents a dangerous moral dilemma.',
  ];

  // Sample story to paste for testing
  const sampleStorySnippet = `The rain had not stopped falling on the iron roofs of Oakhaven for seventeen days. Jonathan stood at the edge of the harbor wall, watching the black waves lap against the pilings. In his pocket was the brass key his brother had mailed him before vanishing into the Whispering Straits. The letter had contained only seven words: "Do not open the chest after midnight." It was currently 11:58 PM.`;

  const handleSelectSavedStory = (s: Story) => {
    setExistingStory(s.fullText || `${s.beginning}\n\n${s.middle}\n\n${s.ending}`);
    setStoryTitle(s.title + ' (Continued)');
    setGenre(s.genre);
  };

  const handleContinueStory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!existingStory.trim()) {
      setErrorMessage('Please paste or type an existing story to continue.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await continueStoryApi({
        existingStory: existingStory.trim(),
        direction: direction.trim(),
        length,
        genre,
      });

      setContinuationResult(result);

      confetti({
        particleCount: 50,
        spread: 55,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#38bdf8', '#818cf8'],
      });
    } catch (err: any) {
      console.error('Continuation error:', err);
      setErrorMessage(err.message || 'Failed to continue story. Please check your Gemini API key in Settings > Secrets.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAsFullStory = () => {
    if (!continuationResult) return;

    const combinedText = `${existingStory.trim()}\n\n---\n[CONTINUATION: ${continuationResult.continuationTitle}]\n\n${continuationResult.continuationText.trim()}`;
    const words = combinedText.split(/\s+/).length;

    const newStory: Story = {
      id: 'story_cont_' + Date.now(),
      title: `${storyTitle} - Part II`,
      logline: continuationResult.continuationSummary || 'A continuation of an epic journey.',
      synopsis: continuationResult.continuationSummary || 'Narrative extended with Gemini AI.',
      beginning: existingStory.trim().slice(0, 500) + '...',
      middle: continuationResult.continuationText.slice(0, 600) + '...',
      ending: continuationResult.continuationText.slice(600) || continuationResult.continuationText,
      fullText: combinedText,
      genre: genre || 'Adventure',
      length,
      language: 'English',
      writingStyle: 'Seamless Continuation',
      charactersUsed: continuationResult.newCharactersIntroduced || [],
      illustrationConcept: {
        artStyle: 'Atmospheric storybook art',
        sceneDescription: continuationResult.plotTwists || 'The key turning point in the continuation.',
        promptForImage: `Dramatic continuation scene: ${continuationResult.continuationTitle}, digital painting, fantasy book illustration`,
      },
      wordCount: words,
      readingTimeMinutes: Math.max(1, Math.ceil(words / 200)),
      createdAt: new Date().toISOString(),
      moralOrTheme: continuationResult.plotTwists || undefined,
    };

    saveStory(newStory);
    onContinuationSaved(newStory);
  };

  const handleCopyContinuation = async () => {
    if (!continuationResult) return;
    await navigator.clipboard.writeText(continuationResult.continuationText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-semibold">
          <Feather className="w-3.5 h-3.5 text-purple-400" />
          Narrative Continuation Studio
        </div>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
          Continue My Story
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          Paste an existing story excerpt, draft, or unfinished scene. Gemini AI will analyze the voice, characters, and stakes to write a seamless next chapter.
        </p>
      </div>

      <form onSubmit={handleContinueStory} className="space-y-6">
        {/* Existing Story Input Card */}
        <div className="rounded-2xl border border-purple-500/20 bg-[#120e2e]/70 p-5 backdrop-blur-md space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="existing-story" className="text-sm font-semibold text-purple-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              1. Paste Existing Story Excerpt
            </label>

            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setExistingStory(sampleStorySnippet)}
                className="text-purple-400 hover:text-purple-300 underline"
              >
                Paste Sample Story
              </button>
            </div>
          </div>

          {/* Quick Select from Saved Stories if any */}
          {savedStories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
              <span className="text-[11px] text-slate-400 whitespace-nowrap">Load from library:</span>
              {savedStories.slice(0, 4).map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => handleSelectSavedStory(s)}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-purple-600/20 border border-purple-500/15 text-xs text-slate-300 hover:text-purple-200 truncate max-w-[160px]"
                >
                  {s.title}
                </button>
              ))}
            </div>
          )}

          <textarea
            id="existing-story"
            rows={6}
            value={existingStory}
            onChange={(e) => setExistingStory(e.target.value)}
            placeholder="Paste your story here... e.g., 'The door swung open to reveal an empty room, except for a ticking clock on the mantelpiece...'"
            className="w-full rounded-xl bg-[#090717]/90 border border-purple-500/25 p-4 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all font-sans-ui"
          />

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>{existingStory.trim() ? existingStory.trim().split(/\s+/).length : 0} words entered</span>
            {existingStory && (
              <button
                type="button"
                onClick={() => setExistingStory('')}
                className="text-slate-400 hover:text-red-400"
              >
                Clear Text
              </button>
            )}
          </div>
        </div>

        {/* Direction & Twist Instructions */}
        <div className="rounded-2xl border border-purple-500/20 bg-[#120e2e]/70 p-5 backdrop-blur-md space-y-3">
          <label htmlFor="continuation-direction" className="text-sm font-semibold text-purple-200 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-purple-400" />
            2. Desired Direction or Plot Twist (Optional)
          </label>

          <input
            id="continuation-direction"
            type="text"
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            placeholder="e.g., Introduce a mysterious traveler who warns them about the clock..."
            className="w-full rounded-xl bg-[#090717]/90 border border-purple-500/25 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-400 transition-all font-sans-ui"
          />

          {/* Quick Plot Twist Pills */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Or pick an instant twist:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {plotTwists.map((twist, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setDirection(twist)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-purple-600/20 text-slate-300 hover:text-purple-200 border border-purple-500/15 hover:border-purple-500/40 transition-colors"
                >
                  + {twist}
                </button>
              ))}
            </div>
          </div>

          {/* Length options */}
          <div className="pt-3 border-t border-purple-500/15 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">Continuation Length:</span>
              <div className="flex rounded-lg bg-black/30 p-1 border border-purple-500/20 text-xs">
                {(['short', 'medium', 'long'] as const).map((l) => (
                  <button
                    type="button"
                    key={l}
                    onClick={() => setLength(l)}
                    className={`px-3 py-1 rounded capitalize ${
                      length === l ? 'bg-purple-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/50 p-4 flex items-start gap-3 text-red-200 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-base text-white tracking-wide transition-all shadow-xl ${
            isLoading
              ? 'bg-purple-900/60 cursor-not-allowed border border-purple-500/30'
              : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-900/50 hover:shadow-purple-600/40'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-300 animate-spin" />
              <span>Weaving Continuation with Gemini...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Feather className="w-5 h-5 text-purple-200" />
              <span>Generate Seamless Continuation</span>
            </div>
          )}
        </button>
      </form>

      {/* Generated Continuation Result */}
      {continuationResult && (
        <section className="space-y-6 pt-6 border-t border-purple-500/20 animate-fadeIn">
          <div className="rounded-3xl border border-purple-500/30 bg-[#140f36]/90 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-purple-950/40">
            {/* Continuation Title & Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-500/20 pb-4">
              <div>
                <span className="text-xs uppercase font-mono text-purple-400 font-bold">
                  Next Chapter
                </span>
                <h3 className="font-cinzel text-2xl font-bold text-white mt-0.5">
                  {continuationResult.continuationTitle}
                </h3>
                <p className="text-xs text-purple-200/80 mt-1 italic">
                  "{continuationResult.continuationSummary}"
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyContinuation}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-purple-500/20 transition-colors"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleSaveAsFullStory}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-900/30 transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Save to Library</span>
                </button>
              </div>
            </div>

            {/* Plot Twist Highlight */}
            {continuationResult.plotTwists && (
              <div className="p-3.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-xs text-purple-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Turning Point:</strong> {continuationResult.plotTwists}
                </div>
              </div>
            )}

            {/* Continuation Prose */}
            <div className="text-slate-100 font-story text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-4 p-4 rounded-2xl bg-white/[0.02] border border-purple-500/15">
              {continuationResult.continuationText}
            </div>

            {/* Next Plot Hooks Suggestions */}
            {continuationResult.nextPlotHooks && continuationResult.nextPlotHooks.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-purple-500/15">
                <span className="text-xs font-cinzel font-semibold text-purple-300 uppercase tracking-wider">
                  Where the story could journey next:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {continuationResult.nextPlotHooks.map((hook, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setExistingStory((prev) => prev + '\n\n' + continuationResult.continuationText);
                        setDirection(hook);
                      }}
                      className="p-3 rounded-xl bg-white/[0.03] border border-purple-500/15 hover:border-purple-400/40 hover:bg-white/[0.06] transition-all cursor-pointer text-xs text-slate-300 hover:text-white"
                      title="Click to queue as next prompt direction"
                    >
                      <span className="text-purple-400 font-bold block mb-1">Hook #{idx + 1}</span>
                      {hook}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
