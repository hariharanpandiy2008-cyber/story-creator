import React, { useState } from 'react';
import { 
  Library as LibraryIcon, 
  Search, 
  Download, 
  Trash2, 
  BookOpen, 
  Star, 
  Clock, 
  Filter, 
  SlidersHorizontal, 
  PlusCircle, 
  Feather,
  Sparkles,
  FileText
} from 'lucide-react';
import { Story, StoryGenre } from '../types/story';
import { GENRES } from '../data/genres';
import { exportStoryAsTxt, exportStoryAsMarkdown } from '../services/storage';

interface LibraryProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
  onContinueStory: (story: Story) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteStory: (id: string) => void;
  onNewStory: () => void;
}

export const Library: React.FC<LibraryProps> = ({
  stories,
  onSelectStory,
  onContinueStory,
  onToggleFavorite,
  onDeleteStory,
  onNewStory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'longest' | 'shortest' | 'alphabetical'>('newest');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Filter & search
  const filteredStories = stories.filter((story) => {
    // Search match
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      story.title.toLowerCase().includes(term) ||
      story.logline.toLowerCase().includes(term) ||
      story.synopsis.toLowerCase().includes(term) ||
      (story.charactersUsed && story.charactersUsed.some((c) => c.toLowerCase().includes(term)));

    // Genre match
    const matchesGenre = selectedGenreFilter === 'all' || story.genre === selectedGenreFilter;

    // Favorites match
    const matchesFav = !onlyFavorites || story.isFavorite;

    return matchesSearch && matchesGenre && matchesFav;
  });

  // Sort
  filteredStories.sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'longest') {
      return (b.wordCount || 0) - (a.wordCount || 0);
    }
    if (sortBy === 'shortest') {
      return (a.wordCount || 0) - (b.wordCount || 0);
    }
    if (sortBy === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-semibold mb-2">
            <LibraryIcon className="w-3.5 h-3.5 text-purple-400" />
            Story Archive &amp; Shelf
          </div>
          <h1 className="font-cinzel text-3xl font-extrabold text-white tracking-wide">
            Your Saved Stories
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse, re-read, continue, and download your literary creations.
          </p>
        </div>

        <button
          onClick={onNewStory}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-900/40 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Story</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="rounded-2xl border border-purple-500/20 bg-[#120e2e]/70 p-4 sm:p-5 backdrop-blur-md space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, character, or plot..."
              className="w-full rounded-xl bg-[#090717]/90 border border-purple-500/25 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-400 transition-all font-sans-ui"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-xl bg-[#090717]/90 border border-purple-500/25 px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-400 font-sans-ui"
            >
              <option value="newest" className="bg-[#120e2e]">Newest First</option>
              <option value="oldest" className="bg-[#120e2e]">Oldest First</option>
              <option value="longest" className="bg-[#120e2e]">Longest (Word Count)</option>
              <option value="shortest" className="bg-[#120e2e]">Shortest (Word Count)</option>
              <option value="alphabetical" className="bg-[#120e2e]">Alphabetical (A-Z)</option>
            </select>
          </div>

          {/* Favorites Filter Toggle */}
          <div className="sm:col-span-3 flex items-center justify-end">
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                onlyFavorites
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-white/[0.03] text-slate-300 border-purple-500/20 hover:bg-white/[0.06]'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>Favorites Only</span>
            </button>
          </div>
        </div>

        {/* Genre Pill Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedGenreFilter('all')}
            className={`px-3 py-1 rounded-lg border whitespace-nowrap transition-all ${
              selectedGenreFilter === 'all'
                ? 'bg-purple-600 text-white border-purple-500 font-semibold shadow-sm'
                : 'bg-white/[0.03] text-slate-300 border-purple-500/15 hover:bg-white/[0.06]'
            }`}
          >
            All Genres ({stories.length})
          </button>
          {GENRES.map((g) => {
            const count = stories.filter((s) => s.genre === g.id).length;
            const isSelected = selectedGenreFilter === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGenreFilter(g.id)}
                className={`px-3 py-1 rounded-lg border whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-500 font-semibold shadow-sm'
                    : 'bg-white/[0.03] text-slate-300 border-purple-500/15 hover:bg-white/[0.06]'
                }`}
              >
                {g.id === 'Romance-free friendship stories' ? 'Friendship' : g.name} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stories Grid */}
      {filteredStories.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-purple-500/20 bg-[#120e2e]/40 space-y-4">
          <BookOpen className="w-14 h-14 text-purple-400/40 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-cinzel font-semibold text-white">No stories match your criteria</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search filters or generate a fresh original tale with Gemini AI.
            </p>
          </div>
          <button
            onClick={onNewStory}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-md shadow-purple-900/30"
          >
            <Sparkles className="w-4 h-4" />
            Create New Story
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="group relative rounded-2xl border border-purple-500/20 bg-gradient-to-br from-[#140f35]/85 via-[#100c28]/90 to-[#0c0922] p-5 backdrop-blur-md flex flex-col justify-between hover:border-purple-500/40 transition-all hover:shadow-xl hover:shadow-purple-950/40"
            >
              <div>
                {/* Badge row */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30">
                    {story.genre === 'Romance-free friendship stories' ? 'Friendship' : story.genre}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleFavorite(story.id)}
                      className="text-slate-400 hover:text-amber-400 transition-colors"
                      title={story.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
                    >
                      <Star className={`w-4 h-4 ${story.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                <h3
                  onClick={() => onSelectStory(story)}
                  className="font-cinzel text-lg font-bold text-white group-hover:text-purple-300 transition-colors cursor-pointer line-clamp-1"
                >
                  {story.title}
                </h3>

                <p className="text-xs text-purple-200/80 italic mt-1 line-clamp-2">
                  "{story.logline}"
                </p>

                <p className="text-xs text-slate-300 mt-3 line-clamp-3 leading-relaxed">
                  {story.synopsis || story.beginning}
                </p>

                {/* Characters Pills */}
                {story.charactersUsed && story.charactersUsed.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {story.charactersUsed.slice(0, 2).map((char, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.03] text-slate-300 border border-purple-500/10 truncate max-w-[120px]">
                        {char}
                      </span>
                    ))}
                    {story.charactersUsed.length > 2 && (
                      <span className="text-[10px] px-1.5 py-0.5 text-slate-500">
                        +{story.charactersUsed.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3 border-t border-purple-500/10 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-purple-400" />
                    {story.readingTimeMinutes} min read
                  </span>
                  <span>{story.wordCount} words</span>
                  <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center justify-between gap-1 pt-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectStory(story)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-purple-600/40 hover:bg-purple-600/70 border border-purple-500/40 transition-colors"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Read</span>
                    </button>

                    <button
                      onClick={() => onContinueStory(story)}
                      className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-purple-300 hover:text-white hover:bg-purple-900/30 transition-colors"
                      title="Continue story"
                    >
                      <Feather className="w-3 h-3" />
                      <span>Continue</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => exportStoryAsTxt(story)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-white/5 transition-colors"
                      title="Download formatted TXT"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${story.title}"?`)) {
                          onDeleteStory(story.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete story"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
