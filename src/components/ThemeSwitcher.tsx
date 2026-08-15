import React, { useRef } from 'react';
import { Sun, Moon, MoonStar } from 'lucide-react';
import type { Theme } from '../useTheme';

interface ThemeSwitcherProps {
  theme: Theme;
  onSelect: (theme: Theme) => void;
}

interface SwitchOption {
  value: Theme;
  option: 1 | 2 | 3;
  label: string;
  Icon: typeof Sun;
}

const OPTIONS: SwitchOption[] = [
  { value: 'light', option: 1, label: 'Light mode', Icon: Sun },
  { value: 'dark', option: 2, label: 'Dark mode', Icon: Moon },
  { value: 'dim', option: 3, label: 'Dim mode', Icon: MoonStar },
];

/**
 * Liquid-glass theme switcher (light / dark / dim).
 * A frosted ::after indicator slides between options via
 * :has(input[data-c-option="N"]:checked); a pop keyframe replays
 * on every change, scaled from the direction of the previous option
 * (tracked through the data-c-previous attribute).
 */
export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, onSelect }) => {
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  const prevRef = useRef<number | null>(null);

  const handleChange = (next: SwitchOption) => {
    const fieldset = fieldsetRef.current;
    const prev = prevRef.current;

    if (fieldset && prev !== null && prev !== next.option) {
      fieldset.setAttribute('data-c-previous', String(prev));
      const movingRight = next.option > prev;
      fieldset.style.setProperty('--pop-x', `${(next.option - 1) * 100}%`);
      fieldset.style.setProperty('--pop-sx', movingRight ? '0.78' : '1.28');
      fieldset.style.setProperty('--pop-sy', movingRight ? '1.18' : '0.82');
      fieldset.classList.remove('theme-switcher--pop');
      void fieldset.offsetWidth;
      fieldset.classList.add('theme-switcher--pop');
    }

    prevRef.current = next.option;
    onSelect(next.value);
  };

  return (
    <fieldset ref={fieldsetRef} className="theme-switcher" aria-label="Color theme">
      <legend className="sr-only">Choose a color theme</legend>
      {OPTIONS.map(({ value, option, label, Icon }) => (
        <label key={value} className="theme-switcher__option" data-c-option={option}>
          <input
            className="theme-switcher__input"
            type="radio"
            name="theme-switcher"
            value={value}
            data-c-option={option}
            checked={theme === value}
            onChange={() => handleChange({ value, option, label, Icon })}
            aria-label={label}
          />
          <Icon className="theme-switcher__icon" strokeWidth={1.9} />
        </label>
      ))}
    </fieldset>
  );
};

export default ThemeSwitcher;