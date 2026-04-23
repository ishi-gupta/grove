# Grove — Frontend UX Improvements

Observations from testing Phase 1. Ordered by impact.

---

## High Priority

### 1. Constellation mode: pause rotation on hover
**Problem:** Stars rotate constantly, making it nearly impossible to click a specific star to view its content.
**Fix:** Pause the `useFrame` rotation when any star is hovered. Optionally add a slight "snap" radius so the cursor magnetizes to nearby stars.
**File:** `components/ConstellationMode.tsx` (line ~87, the `useFrame` rotation logic)

### 2. ExpandedLeaf: click-outside to dismiss
**Problem:** The close button (X) is small and requires precise clicking. Users instinctively click outside a modal to close it.
**Fix:** Add an `onClick` handler on the backdrop/overlay that calls `onClose`. Keep the X button as a secondary option.
**File:** `components/ExpandedLeaf.tsx`

---

## Medium Priority

### 3. Quiet counter visibility
**Problem:** At 14% opacity the day counter near the root is nearly invisible — you have to know it's there to notice it.
**Fix:** Bump opacity to ~22% and add a very slow pulse animation (opacity oscillates between 18-26% over ~6 seconds). Still subtle, but the movement catches the eye.
**File:** `components/QuietCounter.tsx`

### 4. Constellation mode: add context on entry
**Problem:** When you toggle to constellation mode, there's no explanation of what the view represents. Year markers exist but are faint.
**Fix:** Show a brief one-line label ("timeline" or "your leaves, chronologically") that fades out after 2 seconds on first entry. Make year markers slightly more prominent (bump opacity from current level).
**File:** `components/ConstellationMode.tsx`

---

## Low Priority

### 5. Stars button discoverability
**Problem:** First-time users may not notice the sparkles/stars toggle button after the divider in the nav bar.
**Fix:** On first visit (check localStorage), add a subtle sparkle animation to the button icon that plays once, then stops. Or pulse the button opacity once after the ArrivalVeil completes.
**File:** `components/Navigation.tsx`

### 6. Leaf hover tooltip positioning
**Problem:** Tooltips on 3D leaves can sometimes appear behind branches or overlap with branch labels.
**Fix:** Add z-index management or use `@react-three/drei`'s `Html` component with `zIndexRange` to ensure tooltips render above other elements.
**File:** `components/Leaf3D.tsx`

### 7. ArrivalVeil: show leaf attribution
**Problem:** The ArrivalVeil shows a quote but doesn't indicate which branch it belongs to or when it was written.
**Fix:** Add a faint branch name and date below the quote text, appearing 0.5s after the quote with a separate fade-in.
**File:** `components/ArrivalVeil.tsx`
