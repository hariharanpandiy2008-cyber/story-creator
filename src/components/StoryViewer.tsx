import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Star, 
  Feather, 
  Volume2, 
  VolumeX, 
  Pause, 
  Play, 
  Image as ImageIcon, 
  Sparkles, 
  Type as TypeIcon, 
  Share2, 
  Trash2, 
  ArrowLeft,
  Palette,
  ExternalLink,
  Layers
} from 'lucide-react';
import { Story } from '../types/story';
import { exportStoryAsTxt, exportStoryAsMarkdown } from '../services/storage';
import { generateIllustrationApi } from '../services/api';

interface StoryViewerProps {
  story: Story;
  onBack: () => void;
  onContinue: (story: Story) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateStory: (updatedStory: Story) => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  story,
  onBack,
  onContinue,
  onToggleFavorite,
  onDelete,
  onUpdateStory,
}) => {
  // Reading preferences
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [activeTab, setActiveTab] = useState<'tripartite' | 'full' | 'illustration'>('tripartite');
  const [isCopied, setIsCopied] = useState(false);

  // Audio Speech Synthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPausedAudio, setIsPausedAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);

  // Illustration generation state
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCopyStory = async () => {
    try {
      const fullContent = `${story.title}\n\n${story.logline}\n\nAct I: The Beginning\n${story.beginning}\n\nAct II: The Middle\n${story.middle}\n\nAct III: The Ending\n${story.ending}\n\nTheme & Moral: ${story.moralOrTheme || 'N/A'}`;
      await navigator.clipboard.writeText(fullContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Text to speech controls
  const handleToggleSpeech = () => {
    if (!window.speechSynthesis) return;

    if (isPlayingAudio) {
      if (isPausedAudio) {
        window.speechSynthesis.resume();
        setIsPausedAudio(false);
      } else {
        window.speechSynthesis.pause();
        setIsPausedAudio(true);
      }
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${story.title}. ${story.fullText}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = speechRate;
      utterance.onend = () => {
        setIsPlayingAudio(false);
        setIsPausedAudio(false);
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setIsPausedAudio(false);
      };
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
      setIsPausedAudio(false);
    }
  };

  const handleStopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setIsPausedAudio(false);
  };

  // Generate live image from illustration concept
  const handleGenerateLiveImage = async () => {
    if (!story.illustrationConcept?.promptForImage) return;

    setIsGeneratingImage(true);
    setImageError(null);

    try {
      const res = await generateIllustrationApi(
        story.illustrationConcept.promptForImage,
        '1:1',
        story.title
      );

      if (res.imageUrl) {
        const updated: Story = {
          ...story,
          illustrationConcept: {
            ...story.illustrationConcept,
            imageUrl: res.imageUrl,
            isActualImage: true,
          },
        };
        onUpdateStory(updated);
      } else if (res.fallbackNotice) {
        setImageError(res.fallbackNotice);
      }
    } catch (err: any) {
      console.warn('Image generation error:', err);
      setImageError(err.message || 'Image generation requires a Gemini API key with image permissions in Settings > Secrets.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const fontSizeClass = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base sm:text-lg leading-relaxed',
    lg: 'text-lg sm:text-xl leading-relaxed',
    xl: 'text-xl sm:text-2xl leading-loose',
  }[fontSize];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-purple-500/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(story.id)}
            className={`p-2 rounded-xl border transition-all ${
              story.isFavorite
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-white/5 text-slate-400 border-purple-500/20 hover:text-white'
            }`}
            title={story.isFavorite ? 'Favorited' : 'Add to Favorites'}
          >
            <Star className={`w-4 h-4 ${story.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>

          <button
            onClick={handleCopyStory}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-purple-500/20 transition-all"
            title="Copy full story to clipboard"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-purple-400" />}
            <span className="hidden sm:inline">{isCopied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={() => exportStoryAsTxt(story)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-purple-500/20 transition-all"
            title="Download formatted TXT file"
          >
            <Download className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">TXT</span>
          </button>

          <button
            onClick={() => exportStoryAsMarkdown(story)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-purple-500/20 transition-all"
            title="Download Markdown file"
          >
            <FileText className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">MD</span>
          </button>

          <button
            onClick={() => onContinue(story)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-900/30 transition-all"
          >
            <Feather className="w-4 h-4" />
            <span>Continue Story</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this story?')) {
                onDelete(story.id);
              }
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors"
            title="Delete story"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Story Book Card */}
      <article className="relative overflow-hidden rounded-3xl border border-purple-500/25 bg-[#120e2e]/85 backdrop-blur-xl shadow-2xl shadow-purple-950/50 p-6 sm:p-10 space-y-8">
        {/* Story Header */}
        <header className="space-y-4 border-b border-purple-500/20 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-500/30">
              {story.genre}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs text-slate-400 bg-white/5 border border-white/10">
              {story.language}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs text-slate-400 bg-white/5 border border-white/10">
              {story.writingStyle}
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-400 ml-auto">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>{story.readingTimeMinutes} min read</span>
              <span>•</span>
              <span>{story.wordCount} words</span>
            </div>
          </div>

          <h1 className="font-cinzel text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-wide leading-tight">
            {story.title}
          </h1>

          <p className="text-base sm:text-lg text-purple-200/90 italic font-story border-l-2 border-purple-400/50 pl-3">
            "{story.logline}"
          </p>

          {/* Featured Characters */}
          {story.charactersUsed && story.charactersUsed.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
              <span className="font-semibold text-purple-300">Dramatis Personae:</span>
              {story.charactersUsed.map((char, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-purple-500/20 text-slate-200">
                  {char}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Reader Customization Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#090717]/80 border border-purple-500/20 text-xs text-slate-300">
          {/* Tab Selector: Tripartite vs Full vs Illustration */}
          <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('tripartite')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'tripartite'
                  ? 'bg-purple-600/30 text-white border border-purple-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              Three Acts (Beginning / Middle / End)
            </button>
            <button
              onClick={() => setActiveTab('full')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'full'
                  ? 'bg-purple-600/30 text-white border border-purple-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              Seamless Narrative
            </button>
            <button
              onClick={() => setActiveTab('illustration')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'illustration'
                  ? 'bg-purple-600/30 text-white border border-purple-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-pink-400" />
              AI Illustration
            </button>
          </div>

          {/* Reader Preferences & Speech Controls */}
          <div className="flex items-center gap-3">
            {/* Audio Reader Controls */}
            {typeof window !== 'undefined' && 'speechSynthesis' in window && (
              <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-xl">
                <button
                  onClick={handleToggleSpeech}
                  className="flex items-center gap-1 text-purple-300 hover:text-purple-200 px-1.5 py-0.5 rounded hover:bg-white/5 transition-colors"
                  title={isPlayingAudio ? (isPausedAudio ? 'Resume Narration' : 'Pause Narration') : 'Listen with Audio Narration'}
                >
                  {isPlayingAudio && !isPausedAudio ? (
                    <Pause className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span className="text-[11px] font-medium">
                    {isPlayingAudio ? (isPausedAudio ? 'Resume' : 'Pause') : 'Narrate'}
                  </span>
                </button>

                {isPlayingAudio && (
                  <button
                    onClick={handleStopSpeech}
                    className="p-1 text-slate-400 hover:text-red-400"
                    title="Stop Audio"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Typography Controls */}
            <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-xl">
              <button
                onClick={() => setFontFamily(fontFamily === 'serif' ? 'sans' : 'serif')}
                className="px-2 py-0.5 rounded text-[11px] font-mono hover:bg-white/5 transition-colors"
                title="Toggle font style"
              >
                {fontFamily === 'serif' ? 'Serif' : 'Sans'}
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => {
                  const sizes: ('sm' | 'base' | 'lg' | 'xl')[] = ['sm', 'base', 'lg', 'xl'];
                  const nextIndex = (sizes.indexOf(fontSize) + 1) % sizes.length;
                  setFontSize(sizes[nextIndex]);
                }}
                className="px-1.5 py-0.5 rounded text-[11px] font-bold hover:bg-white/5 text-purple-300"
                title="Change font size"
              >
                A± ({fontSize})
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Tripartite Beginning, Middle, Ending */}
        {activeTab === 'tripartite' && (
          <div className={`space-y-8 text-slate-100 ${fontFamily === 'serif' ? 'font-story' : 'font-sans-ui'}`}>
            {/* Act I: The Beginning */}
            <section className="space-y-3 rounded-2xl bg-white/[0.02] border border-purple-500/15 p-5 sm:p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-cinzel font-bold uppercase tracking-wider text-purple-400">
                <span className="w-6 h-6 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-200">
                  I
                </span>
                <span>Act I: The Beginning</span>
              </div>
              <div className={`text-slate-200 whitespace-pre-line leading-relaxed ${fontSizeClass}`}>
                {story.beginning}
              </div>
            </section>

            {/* Act II: The Middle */}
            <section className="space-y-3 rounded-2xl bg-white/[0.02] border border-indigo-500/15 p-5 sm:p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-cinzel font-bold uppercase tracking-wider text-indigo-400">
                <span className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-200">
                  II
                </span>
                <span>Act II: The Middle &amp; Conflict</span>
              </div>
              <div className={`text-slate-200 whitespace-pre-line leading-relaxed ${fontSizeClass}`}>
                {story.middle}
              </div>
            </section>

            {/* Act III: The Ending */}
            <section className="space-y-3 rounded-2xl bg-white/[0.02] border border-cyan-500/15 p-5 sm:p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-cinzel font-bold uppercase tracking-wider text-cyan-400">
                <span className="w-6 h-6 rounded-full bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-200">
                  III
                </span>
                <span>Act III: Climax &amp; Resolution</span>
              </div>
              <div className={`text-slate-200 whitespace-pre-line leading-relaxed ${fontSizeClass}`}>
                {story.ending}
              </div>
            </section>
          </div>
        )}

        {/* Tab 2: Full Seamless Narrative */}
        {activeTab === 'full' && (
          <div className={`text-slate-200 whitespace-pre-line leading-relaxed space-y-4 p-4 rounded-2xl bg-white/[0.02] border border-purple-500/15 ${fontSizeClass} ${fontFamily === 'serif' ? 'font-story' : 'font-sans-ui'}`}>
            {story.fullText}
          </div>
        )}

        {/* Tab 3: AI Story Illustration & Concept */}
        {activeTab === 'illustration' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-purple-500/25 bg-[#090717]/80 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    AI Story Illustration Concept
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Artistic vision crafted by Gemini to accompany this narrative climax.
                  </p>
                </div>

                {!story.illustrationConcept?.imageUrl && (
                  <button
                    onClick={handleGenerateLiveImage}
                    disabled={isGeneratingImage}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-md shadow-purple-900/40 transition-all disabled:opacity-50"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>{isGeneratingImage ? 'Painting Image...' : 'Generate Live Image'}</span>
                  </button>
                )}
              </div>

              {/* Render Image or Concept Canvas */}
              {story.illustrationConcept?.imageUrl ? (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 max-h-[500px] flex items-center justify-center bg-black/60 shadow-2xl">
                    <img
                      src={story.illustrationConcept.imageUrl}
                      alt={story.title}
                      className="w-full h-auto object-contain max-h-[500px]"
                    />
                  </div>
                  <div className="flex justify-end">
                    <a
                      href={story.illustrationConcept.imageUrl}
                      download={`${story.title.replace(/[^a-z0-9]/gi, '_')}_illustration.png`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-purple-300 bg-white/5 hover:bg-white/10 border border-purple-500/25 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Illustration
                    </a>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl p-6 border border-purple-500/20 bg-gradient-to-br from-purple-950/30 via-[#100c28] to-indigo-950/30 overflow-hidden text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto shadow-lg shadow-purple-950/40">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 max-w-md mx-auto">
                    <h4 className="font-cinzel text-base font-bold text-white">
                      Storybook Cover Concept
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{story.illustrationConcept?.sceneDescription || 'Atmospheric scene depicting the climax of the story.'}"
                    </p>
                  </div>

                  {story.illustrationConcept?.colorPalette && (
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <span className="text-xs text-slate-400 font-medium">Palette:</span>
                      {story.illustrationConcept.colorPalette.map((col, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: col }}
                          title={col}
                        />
                      ))}
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-black/40 text-left text-xs font-mono text-purple-200/90 border border-purple-500/15 break-words">
                    <strong className="text-purple-400">Prompt:</strong> {story.illustrationConcept?.promptForImage}
                  </div>
                </div>
              )}

              {/* Error notice if live image generation failed or required paid key */}
              {imageError && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs">
                  {imageError}
                </div>
              )}

              {/* Art Style Tag */}
              {story.illustrationConcept?.artStyle && (
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <span className="font-semibold text-purple-300">Recommended Style:</span>
                  <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/20 text-purple-200">
                    {story.illustrationConcept.artStyle}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Moral / Central Theme Card */}
        {story.moralOrTheme && (
          <footer className="pt-6 border-t border-purple-500/20">
            <div className="rounded-2xl bg-gradient-to-r from-purple-950/30 to-indigo-950/30 border border-purple-500/20 p-5 space-y-1">
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider font-cinzel">
                Central Theme &amp; Insight
              </span>
              <p className="text-sm text-slate-200 italic font-story">
                "{story.moralOrTheme}"
              </p>
            </div>
          </footer>
        )}
      </article>
    </div>
  );
};
