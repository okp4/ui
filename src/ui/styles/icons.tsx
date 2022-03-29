import React, { useEffect, useState } from 'react'

export type IconEnum = 'ActiveMenuLink' | 'Add' | 'Alerts' | 'Chat' | 'DownArrow' | 'Meetup' | 'Next' | 'Previous' | 'Search' | 'UpArrow'; 

export type TIconProps = Readonly<{
  readonly iconName?: IconEnum,
  readonly theme?: 'light' | 'dark',
  readonly className?: string,
}>

export const Icon: React.FC<TIconProps> = ({
  iconName = 'Meetup',
  theme = 'light',
  className,
}: TIconProps): JSX.Element => {

  const defaultImage = ''
  // eslint-disable-next-line @typescript-eslint/typedef
  const [image, setImage] = useState<string>('')

  useEffect(() => {
    const fetchImage = async (): Promise<void> => {
      try {
        const response = await import(`/public/icons/${theme}/Icone_${iconName}.svg`)
        setImage(response.default)
      } catch (err: unknown) {
        const response = await import(defaultImage)
        setImage(response.default)
      }
    }

    fetchImage();
  }, [iconName, theme]);

  return <img alt={`${iconName} icon`} className={className} src={image} />
}
