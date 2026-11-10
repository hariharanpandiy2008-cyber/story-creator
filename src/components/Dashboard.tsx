import React, { useState } from 'react';
import { 
  Sparkles, 
  Feather, 
  Users, 
  BookOpen, 
  Clock, 
  Dices, 
  ArrowRight, 
  FileText, 
  Download, 
  Star, 
  Flame,
  Wand2,
  Compass
} from 'lucide-react';
import { GENRES, GenreMeta } from '../data/genres';
import { Story, Character, StoryGenre } from '../types/story';
import { GenreIcon } from './GenreIcon';
import { exportStoryAsTxt } from '../services/storage';

interface DashboardProps {
  stories: Story[];
  characters: Character[];
  onSelectStoryToRead: (story: Story) => void;
  onSelectGenre: (genre: StoryGenre) => void;
  onStartWithPrompt: (prompt: string, genre: StoryGenre) => void;
  onContinueStory: (story: Story) => void;
  onNavigateTab: (tab: 'generator' | 'continue' | 'characters' | 'library') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stories,
  characters,
  onSelectStoryToRead,
  onSelectGenre,
  onStartWithPrompt,
  onContinueStory,
  onNavigateTab,
}) => {
  // Random inspiration prompt roller
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  const curatedInspirations = [
    {
      title: 'The Cartographer’s Secret Ink',
      genre: 'Fantasy' as StoryGenre,
      prompt: 'An exiled mapmaker discovers that whenever she uses ink ground from fallen meteors, any doorway drawn into the parchment opens into that room in real life.',
    },
    {
      title: 'Midnight on the Quantum Drift',
      genre: 'Science Fiction' as StoryGenre,
      prompt: 'An interstellar beacon operator detects a frequency transmitting a song written by his grandmother seventy years before spaceflight was invented.',
    },
    {
      title: 'The Cat That Knew Too Much',
      genre: 'Comedy' as StoryGenre,
      prompt: 'A pompous museum director realizes his office cat has secretly been replacing priceless stolen Renaissance oil paintings with finger-painted forgeries.',
    },
    {
      title: 'The Clockmaker of Whispering Hollow',
      genre: 'Mystery' as StoryGenre,
      prompt: 'Every clock in a foggy mountain village stops at 3:17 AM, except for the pocket watch of a traveler who arrived five minutes later.',
    },
    {
      title: 'The Unbreakable Iron Pact',
      genre: 'Romance-free friendship stories' as StoryGenre,
      prompt: 'Two former battlefield rivals, now grey-haired blacksmiths, join forces to protect their orphan apprentices from a predatory mining syndicate.',
    },
    {
      title: 'The Silent Greenhouse',
      genre: 'Inspirational' as StoryGenre,
      prompt: 'A retired botanist who lost the ability to speak uses rare night-blooming jasmine to heal the fractured community of a neglected city district.',
    },
  ];

  const rollInspiration = () => {
    setCurrentPromptIndex((prev) => (prev + 1) % curatedInspirations.length);
  };

  const activeInspiration = curatedInspirations[currentPromptIndex];

  // Calculate metrics
  const totalWords = stories.reduce((sum, s) => sum + (s.wordCount || 0), 0);
  const totalReadingMins = Math.ceil(totalWords / 200);
  const recentStories = stories.slice(0, 4);

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Hero Atmospheric Welcome Section */}
      <section className="relative overflow-hidden rounded-3xl border border-purple-500/25 bg-gradient-to-br from-[#19113b] via-[#120e2d] to-[#0a071c] p-6 sm:p-10 shadow-2xl shadow-purple-950/40">
        {/* Glow backdrop balls */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full bg-fuchsia-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-semibold tracking-wide backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
              Google Gemini Powered Storytelling Studio
            </div>

            <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-white tracking-wide leading-tight">
              Where Words Awaken <br />
              <span className="bg-gradient-to-r from-purple-300 via-pink-200 to-cyan-300 bg-clip-text text-transparent">
                Infinite Worlds.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Generate captivating original stories, forge unique characters, extend existing plots, 
              and paint evocative storybook illustrations—all crafted with the literary finesse of Gemini AI.
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab('generator')}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/50 hover:shadow-purple-600/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sparkles className="w-5 h-5 text-purple-200" />
                <span>Create New Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateTab('continue')}
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl font-medium text-purple-200 bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/30 transition-all hover:border-purple-400/50"
              >
                <Feather className="w-4 h-4 text-purple-400" />
                <span>Continue a Story</span>
              </button>

              <button
                onClick={() => onNavigateTab('characters')}
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl font-medium text-slate-200 bg-slate-900/50 hover:bg-slate-800/60 border border-slate-700/60 transition-all"
              >
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Forge Character</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Badge Column */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-purple-500/20 backdrop-blur-md">
              <div className="flex items-center justify-between text-purple-300 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Stories</span>
                <BookOpen className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-cinzel">
                {stories.length}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Saved in library</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-indigo-500/20 backdrop-blur-md">
              <div className="flex items-center justify-between text-indigo-300 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Words</span>
                <Flame className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-cinzel">
                {totalWords.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Original prose generated</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-cyan-500/20 backdrop-blur-md">
              <div className="flex items-center justify-between text-cyan-300 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Read Time</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-cinzel">
                {totalReadingMins} <span className="text-xs font-normal text-slate-300">mins</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Total immersion</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-fuchsia-500/20 backdrop-blur-md">
              <div className="flex items-center justify-between text-fuchsia-300 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Characters</span>
                <Users className="w-4 h-4 text-fuchsia-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-cinzel">
                {characters.length}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">In character vault</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Magic Inspiration Roller */}
      <section className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-950/30 via-[#140f35]/60 to-indigo-950/30 p-5 sm:p-6 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30">
              <Dices className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono font-bold tracking-wider text-purple-400">
                  Spark of Inspiration
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-500/30">
                  {activeInspiration.genre}
                </span>
              </div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-white mt-0.5">
                "{activeInspiration.title}"
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={rollInspiration}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              title="Roll another prompt"
            >
              <Dices className="w-3.5 h-3.5" />
              Roll Dice
            </button>
            <button
              onClick={() => onStartWithPrompt(activeInspiration.prompt, activeInspiration.genre)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-900/30 transition-all"
            >
              <Wand2 className="w-3.5 h-3.5" />
              Use This Idea
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-300 italic mt-3 pl-2 border-l-2 border-purple-500/40">
          "{activeInspiration.prompt}"
        </p>
      </section>

      {/* 3. Genre Explorer Cards */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-cinzel text-2xl font-bold text-white tracking-wide flex items-center gap-2">
              <Compass className="w-6 h-6 text-purple-400" />
              Explore Story Genres
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Select a genre to tailor tone, atmospheric tropes, and narrative pacing.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('generator')}
            className="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            Custom Genre in Generator <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GENRES.map((genre: GenreMeta) => (
            <div
              key={genre.id}
              onClick={() => onSelectGenre(genre.id)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-purple-500/15 bg-[#120e2e]/60 hover:bg-[#1a1442]/80 backdrop-blur-md p-5 transition-all duration-300 hover:border-purple-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/40 flex flex-col justify-between"
            >
              {/* Subtle top gradient bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${genre.accentColor} opacity-70 group-hover:opacity-100 transition-opacity`} />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${genre.accentColor} p-2 text-white flex items-center justify-center shadow-md`}>
                    <GenreIcon iconName={genre.iconName} className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${genre.badgeBg}`}>
                    {genre.id === 'Romance-free friendship stories' ? 'Friendship' : genre.id}
                  </span>
                </div>

                <h3 className="font-cinzel text-lg font-bold text-white group-hover:text-purple-200 transition-colors">
                  {genre.name}
                </h3>
                <p className="text-xs text-purple-300/80 font-medium mt-0.5">
                  {genre.tagline}
                </p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {genre.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-purple-500/10 flex items-center justify-between text-xs text-purple-300/90 font-medium">
                <span>Write {genre.name}</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Recently Created / Saved Stories Carousel */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-cinzel text-2xl font-bold text-white tracking-wide flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-400" />
              Recent Stories
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Dive back into your generated worlds or export them for offline reading.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('library')}
            className="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            View All ({stories.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentStories.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border border-purple-500/20 bg-[#120e2e]/40">
            <BookOpen className="w-12 h-12 text-purple-400/40 mx-auto mb-3" />
            <h3 className="text-lg font-cinzel font-semibold text-white">No stories created yet</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Your bookshelf awaits its first masterpiece. Generate a story with Gemini AI in just seconds.
            </p>
            <button
              onClick={() => onNavigateTab('generator')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-md shadow-purple-900/30"
            >
              <Sparkles className="w-4 h-4" />
              Create First Story
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentStories.map((story) => (
              <div
                key={story.id}
                className="relative rounded-2xl border border-purple-500/20 bg-gradient-to-br from-[#140f35]/80 via-[#100c2a]/90 to-[#0c0922] p-5 backdrop-blur-md flex flex-col justify-between hover:border-purple-500/40 transition-all hover:shadow-lg hover:shadow-purple-950/30 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-950/70 text-purple-300 border border-purple-500/30">
                      {story.genre}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {story.readingTimeMinutes} min
                      </span>
                      <span>•</span>
                      <span>{story.wordCount} words</span>
                      {story.isFavorite && (
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      )}
                    </div>
                  </div>

                  <h3 
                    onClick={() => onSelectStoryToRead(story)}
                    className="font-cinzel text-lg font-bold text-white group-hover:text-purple-300 transition-colors cursor-pointer"
                  >
                    {story.title}
                  </h3>

                  <p className="text-xs text-purple-200/80 italic mt-1 line-clamp-1">
                    "{story.logline}"
                  </p>

                  <p className="text-xs text-slate-300 mt-2.5 line-clamp-3 leading-relaxed">
                    {story.synopsis || story.beginning}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-purple-500/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectStoryToRead(story)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-purple-600/40 hover:bg-purple-600/60 border border-purple-500/40 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Read Story
                    </button>
                    <button
                      onClick={() => onContinueStory(story)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-purple-300 hover:text-white hover:bg-purple-900/30 transition-colors"
                      title="Continue plot"
                    >
                      <Feather className="w-3.5 h-3.5" />
                      Continue
                    </button>
                  </div>

                  <button
                    onClick={() => exportStoryAsTxt(story)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    title="Download as TXT file"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
