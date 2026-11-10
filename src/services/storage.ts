import { Story, Character } from '../types/story';

const STORIES_KEY = 'ai_story_creator_stories_v1';
const CHARACTERS_KEY = 'ai_story_creator_characters_v1';

// Starter seed stories showcasing different genres and rich tripartite beginning/middle/ending structures
const INITIAL_SEED_STORIES: Story[] = [
  {
    id: 'seed_story_1',
    title: 'The Cartographer of Silent Constellations',
    logline: 'An apprentice astronomer in the clockwork towers of Lunaria discovers a constellation that is slowly turning off the stars in real life.',
    synopsis: 'Master apprentice Elian notes discrepancies on the celestial sphere, only to realize an unseen ancient entity is drinking starlight across the galaxy. Along with his mechanical owl, he must ignite a forgotten stellar beacon before their home star is extinguished.',
    beginning: 'High atop the basalt spires of Lunaria, where brass telescopes creaked like old bones against the icy night, Elian inked the perimeter of the Orion sector. He was twenty-two, with ink-stained fingertips and an astronomer’s habit of listening to silence. But tonight, the silence had teeth. When his brass lens aligned with the third star of the Cygnus drift, there was nothing. No glimmer. No cobalt diffraction. Only a square void, like someone had dipped a thumb in chimney soot and pressed it flat against the fabric of the heavens.',
    middle: 'For three nights, the void expanded. Entire clusters were swallowed whole—not obliterated with flare or thunder, but quietly blotted out. Elian brought his star charts before the Council of Astrolabes, who dismissed his panic as the hallucinations of an overwrought apprentice. Desperate, Elian broke into the restricted Vault of Nebulae. There, beside Archimedes—a small mechanical owl powered by a perpetual quartz flywheel—he discovered the journal of Arch-Magus Vaelen from six centuries ago. The entity was named the Umbral Siphon: a remnant from before the Big Bang that woke whenever mortal civilizations forgot how to look up in wonder. It was converging toward Lunaria’s golden twin suns.',
    ending: 'Armed with Vaelen’s starlight resonator, Elian and Archimedes ascended to the highest lightning pinnacle during the grand convergence. As cold shadows swept across the kingdom’s rooftops and the people screamed into the dimming sky, Elian channeled every beam of stored starlight in the tower’s battery directly into the upper stratosphere. The resonator sang—a bell-like chord vibrating through bone and stone. A pillar of incandescent lavender fire split the dark, striking the core of the Siphon. The creature did not shriek; it shattered into billions of luminescent dandelion seeds that drifted down like harmless snow, rekindling every darkened hearth in the city below. Standing in the gentle phosphorescence, Elian looked up. The sky was whole again, and Orion shone brighter than ever.',
    fullText: `High atop the basalt spires of Lunaria, where brass telescopes creaked like old bones against the icy night, Elian inked the perimeter of the Orion sector. He was twenty-two, with ink-stained fingertips and an astronomer’s habit of listening to silence. But tonight, the silence had teeth. When his brass lens aligned with the third star of the Cygnus drift, there was nothing. No glimmer. No cobalt diffraction. Only a square void, like someone had dipped a thumb in chimney soot and pressed it flat against the fabric of the heavens.

For three nights, the void expanded. Entire clusters were swallowed whole—not obliterated with flare or thunder, but quietly blotted out. Elian brought his star charts before the Council of Astrolabes, who dismissed his panic as the hallucinations of an overwrought apprentice. Desperate, Elian broke into the restricted Vault of Nebulae. There, beside Archimedes—a small mechanical owl powered by a perpetual quartz flywheel—he discovered the journal of Arch-Magus Vaelen from six centuries ago. The entity was named the Umbral Siphon: a remnant from before the Big Bang that woke whenever mortal civilizations forgot how to look up in wonder. It was converging toward Lunaria’s golden twin suns.

Armed with Vaelen’s starlight resonator, Elian and Archimedes ascended to the highest lightning pinnacle during the grand convergence. As cold shadows swept across the kingdom’s rooftops and the people screamed into the dimming sky, Elian channeled every beam of stored starlight in the tower’s battery directly into the upper stratosphere. The resonator sang—a bell-like chord vibrating through bone and stone. A pillar of incandescent lavender fire split the dark, striking the core of the Siphon. The creature did not shriek; it shattered into billions of luminescent dandelion seeds that drifted down like harmless snow, rekindling every darkened hearth in the city below. Standing in the gentle phosphorescence, Elian looked up. The sky was whole again, and Orion shone brighter than ever.`,
    genre: 'Fantasy',
    length: 'medium',
    language: 'English',
    writingStyle: 'Ethereal & Atmospheric',
    pov: 'Third Person Limited',
    tone: 'Mystical & Atmospheric',
    moralOrTheme: 'Wonder is not merely an emotion; it is the light that shields the world against encroaching darkness.',
    charactersUsed: ['Elian (Apprentice Astronomer)', 'Archimedes (Mechanical Quartz Owl)'],
    illustrationConcept: {
      artStyle: 'Ethereal cosmic digital oil painting with glowing violet and gold nebula light',
      sceneDescription: 'A lone young scholar standing atop an ancient brass observatory tower at midnight, directing a glowing amethyst beam of light into a swirling cosmic sky.',
      promptForImage: 'A lone astronomer standing atop an intricate Gothic brass observatory spire at midnight, pointing a glowing starlight resonator upward into a starry nebula, swirling violet and deep indigo sky, detailed cinematic fantasy art',
      colorPalette: ['#1e1035', '#7c3aed', '#38bdf8', '#f59e0b', '#0b091a'],
    },
    wordCount: 420,
    readingTimeMinutes: 2,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    isFavorite: true,
  },
  {
    id: 'seed_story_2',
    title: 'Echoes in the Rust Dune',
    logline: 'Two scavenger mechanics on a desert colony planet find a defunct terraforming titan that holds the heartbeat of a world they never got to see.',
    synopsis: 'Kira and Bram scour the wastes of Kepler-442b for scrap. When they unearth a buried surveyor drone, they follow its faint transmission to the heart of the Iron Canyon.',
    beginning: 'The red dust on Kepler-442b got into everything: the seals of their respirators, the hinges of their hydraulic wrenches, even their dreams. Kira knelt beside the overturned tread of a cargo hauler, blowing copper grit from a solar capacitor. "Nothing here, Bram," she called out over the whistle of the canyon gales. "Just fried relays and dead sand."',
    middle: 'Bram didn’t answer right away. He was thirty yards ahead, tapping the metal rib of what they thought was rock. It wasn’t rock. It was the shoulder plate of Titan-09, an atmospheric terraformer lost sixty years ago during the Great Desertion. And inside its chest cavity, behind centimeters of scorched titanium, a green phosphor diode was blinking in slow, deliberate triplets. Three beats. Pause. Three beats. Bram pry-barred the inspection hatch loose. "Kira. Look. The water tanks didn’t rupture. It’s been condensing moisture deep underground this entire time."',
    ending: 'Working together through the night by the glare of halogen flares, they rerouted the Titan’s emergency siphon into Kepler’s ancient aquifer. With a shudder that shook the red plateaus for miles around, the massive pumps roared to life. Cold, clear water burst forth into the dry basin, reflecting the twin moons above like a silver mirror. Kira washed her grit-caked hands in liquid that smelled of sweet rain. They looked at each other across the pool, two scavengers who had set out to find scrap, and instead had unlocked the first morning of their world’s rebirth.',
    fullText: `The red dust on Kepler-442b got into everything: the seals of their respirators, the hinges of their hydraulic wrenches, even their dreams. Kira knelt beside the overturned tread of a cargo hauler, blowing copper grit from a solar capacitor. "Nothing here, Bram," she called out over the whistle of the canyon gales. "Just fried relays and dead sand."

Bram didn’t answer right away. He was thirty yards ahead, tapping the metal rib of what they thought was rock. It wasn’t rock. It was the shoulder plate of Titan-09, an atmospheric terraformer lost sixty years ago during the Great Desertion. And inside its chest cavity, behind centimeters of scorched titanium, a green phosphor diode was blinking in slow, deliberate triplets. Three beats. Pause. Three beats. Bram pry-barred the inspection hatch loose. "Kira. Look. The water tanks didn’t rupture. It’s been condensing moisture deep underground this entire time."

Working together through the night by the glare of halogen flares, they rerouted the Titan’s emergency siphon into Kepler’s ancient aquifer. With a shudder that shook the red plateaus for miles around, the massive pumps roared to life. Cold, clear water burst forth into the dry basin, reflecting the twin moons above like a silver mirror. Kira washed her grit-caked hands in liquid that smelled of sweet rain. They looked at each other across the pool, two scavengers who had set out to find scrap, and instead had unlocked the first morning of their world’s rebirth.`,
    genre: 'Science Fiction',
    length: 'short',
    language: 'English',
    writingStyle: 'Realistic & Gritty',
    pov: 'Third Person Limited',
    tone: 'Heartwarming & Comforting',
    moralOrTheme: 'Even in the most barren wastelands, persistent hope and partnership can coax life from ancient stone.',
    charactersUsed: ['Kira (Field Scavenger)', 'Bram (Senior Technician)'],
    illustrationConcept: {
      artStyle: 'Cinematic sci-fi matte painting with amber desert dunes and shimmering turquoise oasis water',
      sceneDescription: 'Two space explorers in dusty flight suits standing before a towering half-buried colossus machine as pure water cascades into a desert basin.',
      promptForImage: 'Two scavengers in futuristic dust coats discovering a colossal rusted terraforming machine in an orange sand canyon, sparkling crystal clear water surging into a desert pool, two moons in the sky, cinematic sci-fi illustration',
      colorPalette: ['#c2410c', '#0284c7', '#1e293b', '#fbbf24'],
    },
    wordCount: 310,
    readingTimeMinutes: 2,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    isFavorite: false,
  },
];

const INITIAL_SEED_CHARACTERS: Character[] = [
  {
    id: 'char_seed_1',
    name: 'Lyra Moonshade',
    alias: 'The Whispering Cartographer',
    role: 'Protagonist',
    genre: 'Fantasy',
    physicalDescription: 'Slender with ink-stained silver curls, piercing lilac eyes, and a velvet travelling cloak stitched with luminous navigational coordinates.',
    personalityTraits: ['Relentlessly curious', 'Quietly courageous', 'Stubbornly meticulous', 'Socially hesitant'],
    background: 'Exiled from the High Guild of Mapmakers when she insisted that certain ancient forests rearrange their trees to guard secrets from uninvited visitors.',
    signatureItem: 'A compass that points not to true north, but to the location of the nearest unsolved secret.',
    voiceAndMotto: '"A path without mystery is merely a road already walked by someone else."',
    strengths: ['Eidetic memory for geography', 'Deciphering dead script dialects', 'Acrobatic climbing'],
    flaws: ['Cannot resist opening locked doors', 'Distrustful of royal authority'],
    storyHook: 'Commissioned by a blind prince to map a territory that only exists while the moon is eclipsed.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'char_seed_2',
    name: 'Jax "Spark" Vane',
    alias: 'The Neon Ghost',
    role: 'Loyal Companion',
    genre: 'Science Fiction',
    physicalDescription: 'Tall and athletic, with copper cybernetic iris implants, a weathered leather jacket filled with wiring, and a crooked, reckless grin.',
    personalityTraits: ['Loyal to the bone', 'Deadpan sarcastic humor', 'Impulsive problem-solver', 'Soft spot for stray animals'],
    background: 'Former orbital power-grid technician who turned rogue after discovering his corporation was artificially rationing oxygen in the lower dome sectors.',
    signatureItem: 'A miniaturized electromagnetic pulse baton etched with graffiti from his hometown.',
    voiceAndMotto: '"If the machine doesn’t listen to reason, hit it with eighty-thousand volts."',
    strengths: ['Hacking electrical circuitry', 'High-stress piloting', 'Improvised explosives'],
    flaws: ['Chronic insomnia', 'Gambling debts in three space stations'],
    storyHook: 'Receives an anonymous encrypted distress signal on an obsolete emergency channel.',
    createdAt: new Date().toISOString(),
  },
];

export function getSavedStories(): Story[] {
  try {
    const raw = localStorage.getItem(STORIES_KEY);
    if (!raw) {
      localStorage.setItem(STORIES_KEY, JSON.stringify(INITIAL_SEED_STORIES));
      return INITIAL_SEED_STORIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load stories from localStorage', e);
    return INITIAL_SEED_STORIES;
  }
}

export function saveStory(story: Story): void {
  const existing = getSavedStories();
  const index = existing.findIndex((s) => s.id === story.id);
  if (index >= 0) {
    existing[index] = story;
  } else {
    existing.unshift(story);
  }
  localStorage.setItem(STORIES_KEY, JSON.stringify(existing));
}

export function deleteStory(id: string): void {
  const existing = getSavedStories();
  const filtered = existing.filter((s) => s.id !== id);
  localStorage.setItem(STORIES_KEY, JSON.stringify(filtered));
}

export function toggleFavoriteStory(id: string): Story | undefined {
  const existing = getSavedStories();
  const story = existing.find((s) => s.id === id);
  if (story) {
    story.isFavorite = !story.isFavorite;
    localStorage.setItem(STORIES_KEY, JSON.stringify(existing));
  }
  return story;
}

export function getSavedCharacters(): Character[] {
  try {
    const raw = localStorage.getItem(CHARACTERS_KEY);
    if (!raw) {
      localStorage.setItem(CHARACTERS_KEY, JSON.stringify(INITIAL_SEED_CHARACTERS));
      return INITIAL_SEED_CHARACTERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load characters from localStorage', e);
    return INITIAL_SEED_CHARACTERS;
  }
}

export function saveCharacter(character: Character): void {
  const existing = getSavedCharacters();
  const index = existing.findIndex((c) => c.id === character.id);
  if (index >= 0) {
    existing[index] = character;
  } else {
    existing.unshift(character);
  }
  localStorage.setItem(CHARACTERS_KEY, JSON.stringify(existing));
}

export function deleteCharacter(id: string): void {
  const existing = getSavedCharacters();
  const filtered = existing.filter((c) => c.id !== id);
  localStorage.setItem(CHARACTERS_KEY, JSON.stringify(filtered));
}

export function exportStoryAsTxt(story: Story): void {
  const divider = '='.repeat(60);
  const subDivider = '-'.repeat(40);
  
  const content = `${divider}
${story.title.toUpperCase()}
${divider}

Genre: ${story.genre}
Language: ${story.language}
Style: ${story.writingStyle}
Word Count: ${story.wordCount} words (approx. ${story.readingTimeMinutes} min read)
Created: ${new Date(story.createdAt).toLocaleDateString()}
Logline: "${story.logline}"

${story.charactersUsed && story.charactersUsed.length > 0 ? `Featured Characters:\n${story.charactersUsed.map(c => `• ${c}`).join('\n')}\n` : ''}
${subDivider}
SYNOPSIS
${subDivider}
${story.synopsis}

${subDivider}
ACT I: THE BEGINNING
${subDivider}
${story.beginning}

${subDivider}
ACT II: THE MIDDLE
${subDivider}
${story.middle}

${subDivider}
ACT III: THE ENDING
${subDivider}
${story.ending}

${story.moralOrTheme ? `${subDivider}\nCENTRAL THEME & MORAL\n${subDivider}\n${story.moralOrTheme}\n` : ''}
${story.illustrationConcept?.sceneDescription ? `${subDivider}\nILLUSTRATION CONCEPT\n${subDivider}\nStyle: ${story.illustrationConcept.artStyle}\nScene: ${story.illustrationConcept.sceneDescription}\nPrompt: ${story.illustrationConcept.promptForImage}\n` : ''}
${divider}
Generated by AI Story Creator powered by Google Gemini AI
${divider}
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  // Clean filename
  const cleanTitle = story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  a.download = `${cleanTitle || 'story'}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportStoryAsMarkdown(story: Story): void {
  const content = `# ${story.title}

> *${story.logline}*

**Genre:** ${story.genre}  
**Style:** ${story.writingStyle} | **Language:** ${story.language}  
**Word Count:** ${story.wordCount} words (~${story.readingTimeMinutes} min read)  
**Date:** ${new Date(story.createdAt).toLocaleDateString()}  

---

## Synopsis
${story.synopsis}

${story.charactersUsed?.length ? `### Characters\n${story.charactersUsed.map(c => `- **${c}**`).join('\n')}\n` : ''}

---

## Act I: The Beginning
${story.beginning}

---

## Act II: The Middle
${story.middle}

---

## Act III: The Ending
${story.ending}

---

${story.moralOrTheme ? `### Central Theme & Moral\n*${story.moralOrTheme}*\n\n---\n` : ''}

${story.illustrationConcept?.sceneDescription ? `### Illustration Concept\n**Art Style:** ${story.illustrationConcept.artStyle}  \n**Scene:** ${story.illustrationConcept.sceneDescription}  \n**Prompt:** \`${story.illustrationConcept.promptForImage}\`\n\n---\n` : ''}

*Created with AI Story Creator & Google Gemini AI*
`;

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const cleanTitle = story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  a.download = `${cleanTitle || 'story'}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
