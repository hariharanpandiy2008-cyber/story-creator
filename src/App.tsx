import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { StoryGenerator } from './components/StoryGenerator';
import { StoryViewer } from './components/StoryViewer';
import { ContinueStory } from './components/ContinueStory';
import { CharacterForge } from './components/CharacterForge';
import { Library } from './components/Library';
import { Story, Character, StoryGenre } from './types/story';
import { 
  getSavedStories, 
  getSavedCharacters, 
  deleteStory as removeStoryFromStorage, 
  toggleFavoriteStory as toggleFavInStorage,
  saveStory
} from './services/storage';
import { Sparkles, BookOpen, Feather, Heart, Github } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [stories, setStories] = useState<Story[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  // Cross-component transition state
  const [generatorPrefill, setGeneratorPrefill] = useState<{
    genre?: StoryGenre;
    prompt?: string;
    characters?: Character[];
  }>({});

  const [continuePrefill, setContinuePrefill] = useState<{
    storyText?: string;
    storyTitle?: string;
  }>({});

  // Initialize storage
  useEffect(() => {
    setStories(getSavedStories());
    setCharacters(getSavedCharacters());
  }, []);

  const handleRefreshStories = () => {
    setStories(getSavedStories());
  };

  const handleRefreshCharacters = () => {
    setCharacters(getSavedCharacters());
  };

  // When story is generated
  const handleStoryGenerated = (newStory: Story) => {
    setStories((prev) => [newStory, ...prev.filter((s) => s.id !== newStory.id)]);
    setSelectedStory(newStory);
  };

  // Read a story in viewer
  const handleSelectStoryToRead = (story: Story) => {
    setSelectedStory(story);
  };

  // Continue story from viewer or dashboard
  const handleContinueStory = (story: Story) => {
    const fullStory = story.fullText || `${story.beginning}\n\n${story.middle}\n\n${story.ending}`;
    setContinuePrefill({
      storyText: fullStory,
      storyTitle: story.title,
    });
    setSelectedStory(null);
    setActiveTab('continue');
  };

  // Start story with prompt from dashboard
  const handleStartWithPrompt = (prompt: string, genre: StoryGenre) => {
    setGeneratorPrefill({
      prompt,
      genre,
    });
    setSelectedStory(null);
    setActiveTab('generator');
  };

  // Select genre from explorer
  const handleSelectGenre = (genre: StoryGenre) => {
    setGeneratorPrefill({
      genre,
      prompt: '',
    });
    setSelectedStory(null);
    setActiveTab('generator');
  };

  // Use forged character in story
  const handleUseCharacterInStory = (character: Character) => {
    setGeneratorPrefill({
      characters: [character],
      genre: character.genre as StoryGenre,
      prompt: character.storyHook || '',
    });
    setSelectedStory(null);
    setActiveTab('generator');
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavInStorage(id);
    handleRefreshStories();
    if (selectedStory && selectedStory.id === id) {
      setSelectedStory((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  const handleDeleteStory = (id: string) => {
    removeStoryFromStorage(id);
    handleRefreshStories();
    if (selectedStory && selectedStory.id === id) {
      setSelectedStory(null);
    }
  };

  const handleUpdateStory = (updatedStory: Story) => {
    saveStory(updatedStory);
    handleRefreshStories();
    setSelectedStory(updatedStory);
  };

  const handleNewStoryClick = () => {
    setGeneratorPrefill({});
    setSelectedStory(null);
    setActiveTab('generator');
  };

  return (
    <div className="min-h-screen bg-[#0b091a] text-slate-100 flex flex-col font-sans-ui selection:bg-purple-600 selection:text-white relative overflow-x-hidden">
      {/* Background Ambient Cosmic Gradient & Stars */}
      <div className="fixed inset-0 pointer-events-none cosmic-grid z-0 opacity-70" />
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedStory(null);
          setActiveTab(tab);
        }}
        savedStoriesCount={stories.length}
        onNewStoryClick={handleNewStoryClick}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {selectedStory ? (
          <StoryViewer
            story={selectedStory}
            onBack={() => setSelectedStory(null)}
            onContinue={handleContinueStory}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDeleteStory}
            onUpdateStory={handleUpdateStory}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                stories={stories}
                characters={characters}
                onSelectStoryToRead={handleSelectStoryToRead}
                onSelectGenre={handleSelectGenre}
                onStartWithPrompt={handleStartWithPrompt}
                onContinueStory={handleContinueStory}
                onNavigateTab={(tab) => {
                  setSelectedStory(null);
                  setActiveTab(tab);
                }}
              />
            )}

            {activeTab === 'generator' && (
              <StoryGenerator
                initialGenre={generatorPrefill.genre}
                initialPrompt={generatorPrefill.prompt}
                initialCharacters={generatorPrefill.characters}
                savedCharacters={characters}
                onStoryGenerated={handleStoryGenerated}
                onOpenCharacterForge={() => {
                  setSelectedStory(null);
                  setActiveTab('characters');
                }}
              />
            )}

            {activeTab === 'continue' && (
              <ContinueStory
                initialStoryText={continuePrefill.storyText}
                initialStoryTitle={continuePrefill.storyTitle}
                savedStories={stories}
                onContinuationSaved={(newStory) => {
                  handleRefreshStories();
                  setSelectedStory(newStory);
                }}
              />
            )}

            {activeTab === 'characters' && (
              <CharacterForge
                savedCharacters={characters}
                onUseCharacterInStory={handleUseCharacterInStory}
                onRefreshCharacters={handleRefreshCharacters}
              />
            )}

            {activeTab === 'library' && (
              <Library
                stories={stories}
                onSelectStory={handleSelectStoryToRead}
                onContinueStory={handleContinueStory}
                onToggleFavorite={handleToggleFavorite}
                onDeleteStory={handleDeleteStory}
                onNewStory={handleNewStoryClick}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-500/15 bg-[#080614]/90 py-8 px-4 sm:px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span className="font-cinzel font-bold text-slate-200">AI Story Creator</span>
            <span className="text-slate-600">|</span>
            <span>Crafted with Google Gemini AI</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => {
                setSelectedStory(null);
                setActiveTab('generator');
              }}
              className="hover:text-purple-300 transition-colors"
            >
              Story Generator
            </button>
            <button
              onClick={() => {
                setSelectedStory(null);
                setActiveTab('continue');
              }}
              className="hover:text-purple-300 transition-colors"
            >
              Continue Story
            </button>
            <button
              onClick={() => {
                setSelectedStory(null);
                setActiveTab('characters');
              }}
              className="hover:text-purple-300 transition-colors"
            >
              Character Forge
            </button>
            <button
              onClick={() => {
                setSelectedStory(null);
                setActiveTab('library');
              }}
              className="hover:text-purple-300 transition-colors"
            >
              Library
            </button>
          </div>

          <div className="text-[11px] text-slate-500">
            Export as TXT &amp; Markdown • Browser Audio Narration
          </div>
        </div>
      </footer>
    </div>
  );
}
