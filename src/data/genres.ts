import { StoryGenre } from '../types/story';

export interface GenreMeta {
  id: StoryGenre;
  name: string;
  tagline: string;
  description: string;
  iconName: string; // Lucide icon identifier
  accentColor: string; // Tailwind color classes
  badgeBg: string;
  glowColor: string;
  starterPrompts: string[];
  suggestedStyles: string[];
}

export const GENRES: GenreMeta[] = [
  {
    id: 'Fantasy',
    name: 'Fantasy',
    tagline: 'Ancient spells & mythical realms',
    description: 'Enchanted forests, lost kingdoms, forgotten magic, and legendary beasts.',
    iconName: 'Wand2',
    accentColor: 'from-purple-500 to-indigo-600',
    badgeBg: 'bg-purple-950/60 text-purple-300 border-purple-500/30',
    glowColor: 'rgba(168, 85, 247, 0.35)',
    starterPrompts: [
      'A cartographer draws a map that starts rewriting the geography of the actual kingdom.',
      'An apprentice enchanter accidentally gives sentient life to a grumpy stone gargoyle.',
      'The moon fails to rise one evening, plunging the realm into an eerie twilight ruled by moths.',
    ],
    suggestedStyles: ['Epic High Fantasy', 'Whimsical & Fairy Tale', 'Mythic & Poetic'],
  },
  {
    id: 'Science Fiction',
    name: 'Science Fiction',
    tagline: 'Stars, cybernetics & the unknown future',
    description: 'Distant galaxies, rogue artificial intelligences, time rifts, and high-tech wonders.',
    iconName: 'Rocket',
    accentColor: 'from-cyan-500 to-blue-600',
    badgeBg: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30',
    glowColor: 'rgba(6, 182, 212, 0.35)',
    starterPrompts: [
      'A deep space salvage diver finds an orbital station where time runs backwards for every door opened.',
      'A lonely communications officer receives an echo of a radio broadcast transmitted 1,000 years in the future.',
      'In a mega-city where citizens can trade memories like currency, someone discovers an illegal memory of the sun.',
    ],
    suggestedStyles: ['Hard Sci-Fi Speculative', 'Cyberpunk Neon Noir', 'Atmospheric Space Opera'],
  },
  {
    id: 'Mystery',
    name: 'Mystery',
    tagline: 'Shadows, puzzles & unraveled secrets',
    description: 'Locked room enigmas, cryptic clues, detective deduction, and vanished relics.',
    iconName: 'Search',
    accentColor: 'from-amber-500 to-orange-600',
    badgeBg: 'bg-amber-950/60 text-amber-300 border-amber-500/30',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    starterPrompts: [
      'A rare book collector is found unharmed inside a vault sealed from within, but his reflection has disappeared.',
      'An antique grandfather clock chimes thirteen times every night, precisely when a town secret is exposed.',
      'A train passenger vanishes between two stations with all luggage untouched and a single black chess knight on the seat.',
    ],
    suggestedStyles: ['Suspenseful Noir', 'Classic Cozy Deduction', 'Dark Psychological Thriller'],
  },
  {
    id: 'Horror',
    name: 'Horror',
    tagline: 'Chills, dread & things that lurk',
    description: 'Psychological terror, haunted corridors, folk folklore, and atmospheric tension.',
    iconName: 'Ghost',
    accentColor: 'from-rose-600 to-red-800',
    badgeBg: 'bg-red-950/60 text-rose-300 border-rose-500/30',
    glowColor: 'rgba(225, 29, 72, 0.35)',
    starterPrompts: [
      'A photographer develops old film rolls found in an abandoned lighthouse, revealing someone standing closer in each frame.',
      'A radio DJ hosting the 3 AM graveyard shift starts getting calls from voices describing what he will do in 5 minutes.',
      'In a quiet winter village, the snow falls upward whenever the forest bell tolls.',
    ],
    suggestedStyles: ['Gothic Atmospheric Dread', 'Eerie Folk Horror', 'Psychological Suspense'],
  },
  {
    id: 'Adventure',
    name: 'Adventure',
    tagline: 'Expeditions, perils & heroic feats',
    description: 'Uncharted wilderness, sunken galleons, daring escapes, and pulse-pounding treks.',
    iconName: 'Compass',
    accentColor: 'from-emerald-500 to-teal-700',
    badgeBg: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    starterPrompts: [
      'Two mountain climbers locate a cloud canyon that appears only once every seventy years during the solar equinox.',
      'A sunken temple is exposed when the tide pulls back further than it ever has in recorded history.',
      'Navigators aboard an airship encounter a floating archipelago drifting through the jet stream.',
    ],
    suggestedStyles: ['Fast-paced & Thrilling', 'Classic Pulp Expedition', 'Vivid Naturalist Adventure'],
  },
  {
    id: 'Comedy',
    name: 'Comedy',
    tagline: 'Laughter, absurd mishaps & wit',
    description: 'Slapstick blunders, satirical situations, hilarious misunderstandings, and witty banter.',
    iconName: 'Smile',
    accentColor: 'from-yellow-400 to-amber-500',
    badgeBg: 'bg-yellow-950/60 text-yellow-300 border-yellow-500/30',
    glowColor: 'rgba(234, 179, 8, 0.35)',
    starterPrompts: [
      'A chaotic wizard mistakenly casts a spell that turns all solemn palace pronouncements into limericks.',
      'An ordinary barista is mistaken for an intergalactic warlord because of a bizarrely shaped mug.',
      'A pet cat accidentally gains the ability to speak telepathically, but only complains about supermarket dry food brands.',
    ],
    suggestedStyles: ['Witty & Satirical', 'Playful & Lighthearted', 'Deadpan & Absurdist'],
  },
  {
    id: 'Romance-free friendship stories',
    name: 'Friendship (Romance-Free)',
    tagline: 'Loyalty, shared journeys & kindred bonds',
    description: 'Pure platonic camaraderie, unshakeable loyalty, mutual trust, and partners-in-crime adventures.',
    iconName: 'Users',
    accentColor: 'from-blue-500 to-indigo-600',
    badgeBg: 'bg-blue-950/60 text-blue-300 border-blue-500/30',
    glowColor: 'rgba(59, 130, 246, 0.35)',
    starterPrompts: [
      'Two rival village bakers join forces against a corrupt royal food inspector to save both of their shops.',
      'A stray wolf pup and an old lighthouse keeper learn to communicate through rhythmic lantern flashes.',
      'Three childhood friends reunite thirty years later to fulfill a forgotten pact buried in a rusty tin can under the old oak.',
    ],
    suggestedStyles: ['Heartwarming & Soulful', 'Character-Driven Dramedy', 'Nostalgic & Uplifting'],
  },
  {
    id: 'Inspirational',
    name: 'Inspirational',
    tagline: 'Triumph of the human spirit & hope',
    description: 'Overcoming adversity, resilience, redemption, purpose, and kindling inner strength.',
    iconName: 'Sparkles',
    accentColor: 'from-violet-500 to-fuchsia-600',
    badgeBg: 'bg-fuchsia-950/60 text-fuchsia-300 border-fuchsia-500/30',
    glowColor: 'rgba(217, 70, 239, 0.35)',
    starterPrompts: [
      'A retired violinist who lost her hearing teaches a young boy in an orphanage how to feel music vibrations through floorboards.',
      'A disgraced marathon runner finds renewal while coaching an underprivileged youth team across rocky desert terrain.',
      'An abandoned greenhouse in a concrete metropolis is revived by a lonely night-shift nurse, slowly uniting the whole neighborhood.',
    ],
    suggestedStyles: ['Poetic & Lyrical', 'Emotionally Uplifting', 'Philosophical & Reflective'],
  },
];

export const LANGUAGES = [
  { code: 'English', label: 'English' },
  { code: 'Spanish', label: 'Español (Spanish)' },
  { code: 'French', label: 'Français (French)' },
  { code: 'German', label: 'Deutsch (German)' },
  { code: 'Japanese', label: '日本語 (Japanese)' },
  { code: 'Hindi', label: 'हिन्दी (Hindi)' },
  { code: 'Portuguese', label: 'Português (Portuguese)' },
  { code: 'Italian', label: 'Italiano (Italian)' },
  { code: 'Chinese (Simplified)', label: '中文 (Simplified Chinese)' },
  { code: 'Arabic', label: 'العربية (Arabic)' },
  { code: 'Russian', label: 'Русский (Russian)' },
  { code: 'Korean', label: '한국어 (Korean)' },
];

export const WRITING_STYLES = [
  'Ethereal & Atmospheric',
  'Poetic & Lyrical',
  'Fast-paced & Action-Packed',
  'Humorous & Witty',
  'Gothic & Darkly Romantic',
  'Mythic & High Epic',
  'Children’s Storybook (Gentle & Playful)',
  'Suspenseful & Gripping Noir',
  'Philosophical & Thought-Provoking',
  'Realistic & Gritty',
];

export const POV_OPTIONS = [
  { value: 'Third Person Limited', label: 'Third Person Limited (Follows main character)' },
  { value: 'First Person', label: 'First Person ("I", intimate & direct)' },
  { value: 'Third Person Omniscient', label: 'Third Person Omniscient (God\'s-eye view)' },
  { value: 'Second Person', label: 'Second Person ("You", immersive choice-like)' },
];

export const TONE_OPTIONS = [
  'Mystical & Atmospheric',
  'Heartwarming & Comforting',
  'Tense & Nail-biting',
  'Playful & Whimsical',
  'Dark & Foreboding',
  'Heroic & Triumphant',
  'Melancholic & Reflective',
];
