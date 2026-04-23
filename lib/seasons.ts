// Seasonal lighting — the tree's ambient world shifts with the time of year.
// January is cold and stark. July is warm and golden. October is amber and low.

interface SeasonalPalette {
  ambientColor: string
  ambientIntensity: number
  topLight: string
  topLightIntensity: number
  warmLight: string
  warmLightIntensity: number
  coolLight: string
  coolLightIntensity: number
  fogColor: string
  fogNear: number
  fogFar: number
  bloomIntensity: number
  starCount: number
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function lerpColor(a: string, b: string, t: number): string {
  const aR = parseInt(a.slice(1, 3), 16)
  const aG = parseInt(a.slice(3, 5), 16)
  const aB = parseInt(a.slice(5, 7), 16)
  const bR = parseInt(b.slice(1, 3), 16)
  const bG = parseInt(b.slice(3, 5), 16)
  const bB = parseInt(b.slice(5, 7), 16)
  const r = Math.round(lerp(aR, bR, t))
  const g = Math.round(lerp(aG, bG, t))
  const blue = Math.round(lerp(aB, bB, t))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`
}

function lerpPalette(a: SeasonalPalette, b: SeasonalPalette, t: number): SeasonalPalette {
  return {
    ambientColor: lerpColor(a.ambientColor, b.ambientColor, t),
    ambientIntensity: lerp(a.ambientIntensity, b.ambientIntensity, t),
    topLight: lerpColor(a.topLight, b.topLight, t),
    topLightIntensity: lerp(a.topLightIntensity, b.topLightIntensity, t),
    warmLight: lerpColor(a.warmLight, b.warmLight, t),
    warmLightIntensity: lerp(a.warmLightIntensity, b.warmLightIntensity, t),
    coolLight: lerpColor(a.coolLight, b.coolLight, t),
    coolLightIntensity: lerp(a.coolLightIntensity, b.coolLightIntensity, t),
    fogColor: lerpColor(a.fogColor, b.fogColor, t),
    fogNear: lerp(a.fogNear, b.fogNear, t),
    fogFar: lerp(a.fogFar, b.fogFar, t),
    bloomIntensity: lerp(a.bloomIntensity, b.bloomIntensity, t),
    starCount: Math.round(lerp(a.starCount, b.starCount, t)),
  }
}

// Four anchor palettes — one per season
const winter: SeasonalPalette = {
  ambientColor: '#0d0f2e',   // deep blue-black
  ambientIntensity: 0.12,
  topLight: '#8ea8c8',       // cool silver
  topLightIntensity: 0.3,
  warmLight: '#6b7fa0',      // muted steel
  warmLightIntensity: 0.12,
  coolLight: '#4a6a8a',      // cold blue
  coolLightIntensity: 0.25,
  fogColor: '#040810',
  fogNear: 16,
  fogFar: 35,
  bloomIntensity: 0.6,
  starCount: 1200,           // winter skies are clearest
}

const spring: SeasonalPalette = {
  ambientColor: '#151528',   // warming
  ambientIntensity: 0.14,
  topLight: '#b8c8a0',       // soft green-gold
  topLightIntensity: 0.38,
  warmLight: '#c4a87a',      // early gold
  warmLightIntensity: 0.18,
  coolLight: '#6aaa98',      // teal-green
  coolLightIntensity: 0.2,
  fogColor: '#060812',
  fogNear: 18,
  fogFar: 40,
  bloomIntensity: 0.75,
  starCount: 800,
}

const summer: SeasonalPalette = {
  ambientColor: '#1a1535',   // warm purple-night
  ambientIntensity: 0.18,
  topLight: '#d4b87a',       // rich gold
  topLightIntensity: 0.45,
  warmLight: '#c8946a',      // amber
  warmLightIntensity: 0.25,
  coolLight: '#5ab8a8',      // warm teal
  coolLightIntensity: 0.18,
  fogColor: '#080a16',
  fogNear: 20,
  fogFar: 42,
  bloomIntensity: 0.9,
  starCount: 600,            // summer haze
}

const autumn: SeasonalPalette = {
  ambientColor: '#1a1220',   // dark amber-brown
  ambientIntensity: 0.15,
  topLight: '#c8a04a',       // deep gold
  topLightIntensity: 0.4,
  warmLight: '#c17f5b',      // burnt orange
  warmLightIntensity: 0.22,
  coolLight: '#7a6e9e',      // muted purple
  coolLightIntensity: 0.15,
  fogColor: '#0a0810',
  fogNear: 17,
  fogFar: 38,
  bloomIntensity: 0.85,
  starCount: 900,            // October clarity
}

const seasons = [winter, spring, summer, autumn]

/**
 * Returns the current seasonal palette, smoothly interpolated
 * between seasonal anchors based on today's date.
 */
export function getSeasonalPalette(date?: Date): SeasonalPalette {
  const now = date ?? new Date()
  const month = now.getMonth() // 0-11
  const day = now.getDate()

  // Map month+day to a continuous 0-4 cycle through the seasons
  // Winter: Dec-Feb, Spring: Mar-May, Summer: Jun-Aug, Autumn: Sep-Nov
  // Shift by 1 month so Dec=0.0, Mar=1.0, Jun=2.0, Sep=3.0
  const shifted = ((month + 1) % 12) + (day - 1) / 30
  const seasonIndex = shifted / 3 // 0-4

  const fromIndex = Math.floor(seasonIndex) % 4
  const toIndex = (fromIndex + 1) % 4
  const t = seasonIndex - Math.floor(seasonIndex)

  return lerpPalette(seasons[fromIndex], seasons[toIndex], t)
}

export type { SeasonalPalette }
