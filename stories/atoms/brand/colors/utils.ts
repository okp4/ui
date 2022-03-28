import colors from './_exports.module.scss'

export type ColorKey = string

/**
 * @param colorKey the key of the color.
 * @returns the variable name of the color (in saas referential).
 */
export const colorVariable = (colorKey: string) => {
  const [theme, _set, ...tail] = colorKey.split('-')

  return `$color-${theme}-${tail.join('-')}`
}

/**
 * @param colorKey the key of the color.
 * @returns the name of the color (human readable derived from the key).
 */
export const colorName = (colorKey: string) => {
  const [_theme, _set, ...tail] = colorKey.split('-')
  return `${tail.join(' ').toLowerCase()}`
}

/**
 * @param set the set from which the colors are retrieved.
 * @returns all the color keys which belong to the provided set.
 */
export const colorsSet = (theme: string, set: string) =>
  Object.keys(colors).filter(color => color.indexOf(`${theme}-${set}-`) === 0)
