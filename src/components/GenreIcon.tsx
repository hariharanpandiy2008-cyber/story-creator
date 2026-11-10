import React from 'react';
import {
  Wand2,
  Rocket,
  Search,
  Ghost,
  Compass,
  Smile,
  Users,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface GenreIconProps {
  iconName: string;
  className?: string;
}

export const GenreIcon: React.FC<GenreIconProps> = ({ iconName, className = 'w-5 h-5' }) => {
  switch (iconName) {
    case 'Wand2':
      return <Wand2 className={className} />;
    case 'Rocket':
      return <Rocket className={className} />;
    case 'Search':
      return <Search className={className} />;
    case 'Ghost':
      return <Ghost className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'Smile':
      return <Smile className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    default:
      return <BookOpen className={className} />;
  }
};
