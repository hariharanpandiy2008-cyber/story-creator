import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Users, 
  Sparkles, 
  Wand2, 
  Shield, 
  Trash2, 
  Copy, 
  Check, 
  ArrowRight, 
  AlertCircle, 
  BookOpen, 
  Tag, 
  Bookmark,
  Sword,
  Compass
} from 'lucide-react';
import { GENRES, GenreMeta } from '../data/genres';
import { Character, StoryGenre } from '../types/story';
import { generateCharacterApi } from '../services/api';
import { saveCharacter, deleteCharacter } from '../services/storage';

interface CharacterForgeProps {
  savedCharacters: Character[];
  onUseCharacterInStory: (character: Character) => void;
  onRefreshCharacters: () => void;
}

export const CharacterForge: React.FC<CharacterForgeProps> = ({
  savedCharacters,
  onUseCharacterInStory,
  onRefreshCharacters,
}) => {
  const [genre, setGenre] = useState<string>('Fantasy');
  const [archetype, setArchetype] = useState<string>('Reluctant Hero');
  const [role, setRole] = useState<string>('Protagonist');
  const [customPrompt, setCustomPrompt] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeForgedCharacter, setActiveForgedCharacter] = useState<Character | null>(
    savedCharacters[0] || null
  );
  const [isCopied, setIsCopied] = useState(false);

  const archetypes = [
    'Reluctant Hero',
    'Cunning Trickster',
    'Mystic Scholar',
    'Hardboiled Detective',
    'Rogue Outlaw',
    'Fierce Guardian',
    'Eccentric Inventor',
    'Wandering Bard',
    'Noble Fallen Leader',
    'Silent Assassin',
  ];

  const roles = [
    'Protagonist',
    'Antagonist',
    'Mentor',
    'Loyal Companion',
    'Wildcard Ally',
    'Comic Foil',
  ];

  const handleForgeCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const forged = await generateCharacterApi({
        genre,
        archetype,
        role,
        prompt: customPrompt.trim(),
      });

      // Save to local vault
      saveCharacter(forged);
      setActiveForgedCharacter(forged);
      onRefreshCharacters();

      confetti({
        particleCount: 45,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#818cf8', '#c084fc', '#38bdf8'],
      });
    } catch (err: any) {
      console.error('Character generation failed:', err);
      setErrorMessage(err.message || 'Failed to forge character. Please verify your Gemini API key in Settings > Secrets.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this character from your vault?')) {
      deleteCharacter(id);
      onRefreshCharacters();
      if (activeForgedCharacter?.id === id) {
        setActiveForgedCharacter(null);
      }
    }
  };

  const handleCopyProfile = async () => {
    if (!activeForgedCharacter) return;
    const profile = `Name: ${activeForgedCharacter.name} (${activeForgedCharacter.alias})
Role: ${activeForgedCharacter.role} | Genre: ${activeForgedCharacter.genre}
Description: ${activeForgedCharacter.physicalDescription}
Traits: ${activeForgedCharacter.personalityTraits.join(', ')}
Background: ${activeForgedCharacter.background}
Signature Item: ${activeForgedCharacter.signatureItem}
Strengths: ${activeForgedCharacter.strengths.join(', ')}
Flaws: ${activeForgedCharacter.flaws.join(', ')}
Story Hook: ${activeForgedCharacter.storyHook || 'N/A'}`;

    await navigator.clipboard.writeText(profile);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-semibold">
          <Users className="w-3.5 h-3.5 text-purple-400" />
          AI Character Forge
        </div>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
          Forge Deep, Memorable Characters
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          Summon multi-dimensional fictional characters with evocative appearances, rich backstories, psychological flaws, and immediate story hooks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Generator Form */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleForgeCharacter} className="rounded-2xl border border-purple-500/20 bg-[#120e2e]/70 p-5 backdrop-blur-md space-y-5">
            <h3 className="text-sm font-semibold text-purple-200 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-purple-400" />
              Summoning Parameters
            </h3>

            {/* Genre */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full rounded-xl bg-[#090717]/90 border border-purple-500/25 px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-purple-400 font-sans-ui"
              >
                {GENRES.map((g) => (
                  <option key={g.id} value={g.id} className="bg-[#120e2e] text-white">
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Narrative Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl bg-[#090717]/90 border border-purple-500/25 px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-purple-400 font-sans-ui"
              >
                {roles.map((r) => (
                  <option key={r} value={r} className="bg-[#120e2e] text-white">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Archetype */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Archetype
              </label>
              <select
                value={archetype}
                onChange={(e) => setArchetype(e.target.value)}
                className="w-full rounded-xl bg-[#090717]/90 border border-purple-500/25 px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-purple-400 font-sans-ui"
              >
                {archetypes.map((a) => (
                  <option key={a} value={a} className="bg-[#120e2e] text-white">
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Instructions */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Special Details or Quirks (Optional)
              </label>
              <textarea
                rows={2}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g., Carries an antique silver pocketwatch, afraid of enclosed water..."
                className="w-full rounded-xl bg-[#090717]/90 border border-purple-500/25 p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-400 font-sans-ui"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white tracking-wide transition-all shadow-lg ${
                isLoading
                  ? 'bg-purple-900/60 cursor-not-allowed border border-purple-500/30'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-900/40'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-300 animate-spin" />
                  <span>Forging Character...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4 text-purple-200" />
                  <span>Forge Character with Gemini</span>
                </div>
              )}
            </button>
          </form>

          {/* Character Vault Shelf */}
          <div className="rounded-2xl border border-purple-500/20 bg-[#120e2e]/50 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-purple-300 font-semibold">
              <span>Character Vault ({savedCharacters.length})</span>
            </div>

            {savedCharacters.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                Your character vault is empty. Forge your first character above!
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {savedCharacters.map((char) => (
                  <div
                    key={char.id}
                    onClick={() => setActiveForgedCharacter(char)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      activeForgedCharacter?.id === char.id
                        ? 'bg-purple-600/30 border-purple-400 text-white shadow-sm'
                        : 'bg-white/[0.03] border-purple-500/15 text-slate-300 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs font-bold text-white truncate">{char.name}</div>
                      <div className="text-[10px] text-purple-300/80 truncate">
                        {char.alias || char.role} • {char.genre}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(char.id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete character"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Character Profile Sheet */}
        <div className="lg:col-span-7">
          {activeForgedCharacter ? (
            <div className="rounded-3xl border border-purple-500/25 bg-gradient-to-br from-[#140f36]/90 via-[#100c28]/90 to-[#0c0922] p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-purple-950/40 space-y-6">
              {/* Header Profile */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-purple-500/20 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30">
                      {activeForgedCharacter.role}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {activeForgedCharacter.genre}
                    </span>
                  </div>
                  <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white">
                    {activeForgedCharacter.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-purple-300 font-medium italic mt-0.5">
                    "{activeForgedCharacter.alias}"
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyProfile}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-purple-500/20 transition-all"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy Profile'}</span>
                  </button>

                  <button
                    onClick={() => onUseCharacterInStory(activeForgedCharacter)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-900/30 transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Write Story with {activeForgedCharacter.name.split(' ')[0]}</span>
                  </button>
                </div>
              </div>

              {/* Physical Description */}
              <div className="space-y-1.5">
                <span className="text-xs font-cinzel font-bold text-purple-300 uppercase tracking-wider">
                  Appearance &amp; Demeanor
                </span>
                <p className="text-sm text-slate-200 leading-relaxed font-sans-ui">
                  {activeForgedCharacter.physicalDescription}
                </p>
              </div>

              {/* Personality Traits */}
              <div className="space-y-2">
                <span className="text-xs font-cinzel font-bold text-purple-300 uppercase tracking-wider">
                  Personality Traits
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeForgedCharacter.personalityTraits.map((trait, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs bg-purple-950/60 text-purple-200 border border-purple-500/25"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Background & Origin */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-white/[0.02] border border-purple-500/15">
                <span className="text-xs font-cinzel font-bold text-indigo-300 uppercase tracking-wider">
                  Origin &amp; Secret Motive
                </span>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {activeForgedCharacter.background}
                </p>
              </div>

              {/* Signature Item & Motto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-black/25 border border-purple-500/15 space-y-1">
                  <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                    Signature Item
                  </span>
                  <p className="text-xs text-slate-200">
                    {activeForgedCharacter.signatureItem}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/25 border border-purple-500/15 space-y-1">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                    Voice &amp; Motto
                  </span>
                  <p className="text-xs text-slate-200 italic">
                    {activeForgedCharacter.voiceAndMotto || '"Actions speak louder than ancient prophecies."'}
                  </p>
                </div>
              </div>

              {/* Strengths & Flaws */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> Strengths
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {activeForgedCharacter.strengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sword className="w-3.5 h-3.5" /> Vulnerabilities &amp; Flaws
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {activeForgedCharacter.flaws.map((flaw, i) => (
                      <li key={i}>{flaw}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Story Hook Prompt */}
              {activeForgedCharacter.storyHook && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/25 space-y-1">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Instant Narrative Hook
                  </span>
                  <p className="text-xs text-slate-200 italic leading-relaxed">
                    "{activeForgedCharacter.storyHook}"
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center rounded-3xl border border-purple-500/20 bg-[#120e2e]/40">
              <Users className="w-16 h-16 text-purple-400/40 mb-3" />
              <h3 className="text-lg font-cinzel font-semibold text-white">No Character Selected</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Configure parameters on the left and click Forge Character, or pick an existing character from the vault.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
