import React from 'react';
import {
  Film, Tv, Dumbbell, Music, Bot, Languages, Play, Newspaper,
  Gamepad2, Zap as ZapIcon, Target, Plane, ShieldAlert, Laptop, Shield,
} from 'lucide-react';

/**
 * Resolves the string iconName stored in mock data to an actual
 * Lucide icon component. Falls back to Target for unknown names.
 */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Film, Tv, Dumbbell, Music, Bot, Languages, Play, Newspaper,
  Gamepad2, Zap: ZapIcon, Target, Plane, ShieldAlert, Laptop, Shield,
};

interface SubIconProps {
  name: string;
  className?: string;
}

export const SubIcon: React.FC<SubIconProps> = ({ name, className = 'w-5 h-5' }) => {
  const Icon = iconMap[name] ?? Target;
  return <Icon className={className} aria-hidden="true" />;
};
