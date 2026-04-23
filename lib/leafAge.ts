// Leaf aging — older leaves subtly change appearance.
// A leaf from two years ago looks different from one added yesterday.
// Older leaves become slightly more translucent and shift warmer in tone.

interface LeafAgeStyle {
  opacityMultiplier: number  // 1.0 for new, fading gently for old
  warmthShift: number        // 0.0 for new, increases for old (used to tint toward amber)
  emissiveBoost: number      // old leaves glow slightly more — like embers
  scaleMultiplier: number    // old leaves are very slightly smaller — weathered
}

/**
 * Compute visual aging properties for a leaf based on its date.
 * Changes are subtle — this is felt, not seen.
 */
export function getLeafAgeStyle(dateStr: string): LeafAgeStyle {
  const leafDate = new Date(dateStr)
  const now = new Date()
  const ageMs = now.getTime() - leafDate.getTime()
  const ageDays = Math.max(0, ageMs / (1000 * 60 * 60 * 24))

  // Normalize: 0 = brand new, 1 = ~2 years old, capped at 1
  const ageNorm = Math.min(ageDays / 730, 1.0)

  // Smooth easing — changes accelerate slowly then plateau
  const eased = 1 - Math.pow(1 - ageNorm, 2.5)

  return {
    opacityMultiplier: 1.0 - eased * 0.18,      // new=1.0, old=0.82
    warmthShift: eased * 0.12,                    // subtle amber tint
    emissiveBoost: eased * 0.15,                  // old leaves glow warmer
    scaleMultiplier: 1.0 - eased * 0.06,          // old=0.94 (barely noticeable)
  }
}

/**
 * Shift a hex color toward warm amber by a given amount (0-1).
 */
export function shiftWarm(hexColor: string, amount: number): string {
  if (amount <= 0) return hexColor

  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)

  // Target warm: amber (#c8a060)
  const tR = 200, tG = 160, tB = 96

  const newR = Math.round(r + (tR - r) * amount)
  const newG = Math.round(g + (tG - g) * amount)
  const newB = Math.round(b + (tB - b) * amount)

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}
