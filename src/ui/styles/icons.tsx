import React from 'react';

export type IconEnum = 'ActiveMenuLink' | 'Add' | 'Alerts' | 'Chat' | 'DownArrow' | 'Meetup' | 'Next' | 'Previous' | 'Search' | 'UpArrow';

export type TIconProps = Readonly<{
  readonly iconName?: IconEnum,
  readonly theme?: 'light' | 'dark',
  readonly className?: string,
}>

type IconEntry = Readonly<{
  iconName: IconEnum,
  src: string
}>

type IconMap = {
  light: IconEntry[],
  dark: IconEntry[],
}

const iconMap: IconMap = {
  light: [],
  dark: [],
}

/**
 * Load icons
 */
const ligthCtx = require.context('/public/icons/light', false, /\.(svg)$/);
const darkCtx = require.context('/public/icons/dark', false, /\.(svg)$/);
function importThemeIcons(theme: 'light' | 'dark'): void {
  const ctx = theme === 'light' ? ligthCtx : darkCtx;

  ctx.keys().map((key: string) => {
    const iconName = key.replace('./', '').replace('.svg', '').replace('Icone_', '') as IconEnum;
    const icon = ctx(key);
    iconMap[theme].push({ iconName, src: icon });
  });
}

importThemeIcons('light');
importThemeIcons('dark');

function getIcon(iconName: IconEnum, theme: 'light' | 'dark'): string | undefined {

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  return iconMap[theme].find((x: IconEntry) => x.iconName === iconName)?.src;
}

export const Icon: React.FC<TIconProps> = ({
  iconName = 'Meetup',
  theme = 'light',
  className,
}: TIconProps): JSX.Element => {
  const iconSrc = getIcon(iconName, theme);
  if (!iconSrc) {
    throw new Error(`Icon ${iconName} not found`);
  }
  return <img alt={`${iconName} icon`} className={className} src={iconSrc} />
}
