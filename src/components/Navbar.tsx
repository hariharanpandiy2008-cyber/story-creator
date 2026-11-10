import React from 'react';
import { BookOpen, Sparkles, Feather, Library as LibraryIcon, PlusCircle, Compass, Users } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'generator' | 'continue' | 'characters' | 'library';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  savedStoriesCount: number;
  onNewStoryClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedStoriesCount,
  onNewStoryClick,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-500/20 bg-[#0b091a]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-violet-800 p-[1px] shadow-lg shadow-purple-900/30 group-hover:shadow-purple-600/40 transition-all">
              <div className="w-full h-full bg-[#0d0a21] rounded-[11px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <span className="font-cinzel text-lg sm:text-xl font-bold tracking-wider bg-gradient-to-r from-purple-200 via-pink-100 to-indigo-200 bg-clip-text text-transparent">
                AI Story Creator
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded border border-purple-500/30 text-purple-300 font-mono bg-purple-950/40">
                Gemini AI
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-purple-600/20 text-purple-200 border border-purple-500/40 shadow-sm shadow-purple-900/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className="w-4 h-4 text-purple-400" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'generator'
                  ? 'bg-purple-600/20 text-purple-200 border border-purple-500/40 shadow-sm shadow-purple-900/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              Generate Story
            </button>

            <button
              onClick={() => setActiveTab('continue')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'continue'
                  ? 'bg-purple-600/20 text-purple-200 border border-purple-500/40 shadow-sm shadow-purple-900/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Feather className="w-4 h-4 text-purple-400" />
              Continue Story
            </button>

            <button
              onClick={() => setActiveTab('characters')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'characters'
                  ? 'bg-purple-600/20 text-purple-200 border border-purple-500/40 shadow-sm shadow-purple-900/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4 text-purple-400" />
              Character Forge
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'library'
                  ? 'bg-purple-600/20 text-purple-200 border border-purple-500/40 shadow-sm shadow-purple-900/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <LibraryIcon className="w-4 h-4 text-purple-400" />
              Library
              {savedStoriesCount > 0 && (
                <span className="ml-1 text-xs px-2 py-0.2 rounded-full bg-purple-500/30 text-purple-200 font-semibold border border-purple-500/30">
                  {savedStoriesCount}
                </span>
              )}
            </button>
          </nav>

          {/* Action CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNewStoryClick}
              className="relative inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-900/40 hover:shadow-purple-600/30 transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Create Story</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>
        </div>

        {/* Mobile Subnav */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-purple-500/10 text-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 py-1 px-2 ${activeTab === 'dashboard' ? 'text-purple-300 font-bold' : 'text-slate-400'}`}
          >
            <Compass className="w-4 h-4" />
            Home
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex flex-col items-center gap-1 py-1 px-2 ${activeTab === 'generator' ? 'text-purple-300 font-bold' : 'text-slate-400'}`}
          >
            <Sparkles className="w-4 h-4" />
            Generate
          </button>
          <button
            onClick={() => setActiveTab('continue')}
            className={`flex flex-col items-center gap-1 py-1 px-2 ${activeTab === 'continue' ? 'text-purple-300 font-bold' : 'text-slate-400'}`}
          >
            <Feather className="w-4 h-4" />
            Continue
          </button>
          <button
            onClick={() => setActiveTab('characters')}
            className={`flex flex-col items-center gap-1 py-1 px-2 ${activeTab === 'characters' ? 'text-purple-300 font-bold' : 'text-slate-400'}`}
          >
            <Users className="w-4 h-4" />
            Characters
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex flex-col items-center gap-1 py-1 px-2 ${activeTab === 'library' ? 'text-purple-300 font-bold' : 'text-slate-400'}`}
          >
            <LibraryIcon className="w-4 h-4" />
            Library ({savedStoriesCount})
          </button>
        </div>
      </div>
    </header>
  );
};
