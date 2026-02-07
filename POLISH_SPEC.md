# Courtside Core Experience Polish Spec

## Goal
Polish the game card + modal experience to feel professional and cohesive. No new features; only UX/visual refinement.

## Issues to Fix

### 1. Modal Backdrop & Positioning
**Current:** Modal appears inline in document flow, no true overlay feel  
**Target:** Fixed overlay with dark backdrop, centers properly  
**Changes:**
- Create `<GameCardExpanded>` wrapper with:
  - Fixed position overlay div (z-index: 1000)
  - Semi-transparent dark backdrop (bg-black/50)
  - Scrollable content area inside modal (max-height: 90vh)
- Modal should be portaled to document body (use React Portal)
- Close on backdrop click (outside modal)
- Close button (X) in top-right corner

### 2. Modal Layout & Content
**Current:** "View Full Stats" + "Close" buttons, redundant layout  
**Target:** Clean, focused game details with optional expansions  
**Changes:**
- Remove "View Full Stats" button (keep for future enhancement)
- Remove "Close" button (use X button + backdrop click instead)
- Improve "Leading Scorers" section styling:
  - Show top 3 scorers (not all)
  - Better spacing + alignment
  - Player photo + name + points clearly visible
- Vegas Line section: Show placeholder text ("Odds coming soon" or mock data mock)
- Add subtle dividers between sections

### 3. Card Interactions
**Current:** Card + modal interactions work but could be clearer  
**Target:** Smooth, predictable behavior  
**Changes:**
- Ensure star button (favorite) works cleanly
- Card hover animation smooth (already implemented)
- Test: Click card → modal opens. Click X or outside → closes. Click star → toggles.

### 4. Visual Refinements
**Current:** Functional but could be more polished  
**Target:** Professional, cohesive aesthetic  
**Changes:**
- Modal header: Bold team names, clear status (Live/Final/Upcoming)
- Better color hierarchy: Active team vs. opponent
- Consistent spacing throughout modal
- Tournament/broadcast info subtle but clear

## Acceptance Criteria
- ✅ Modal appears as fixed overlay with backdrop
- ✅ Modal centers on screen
- ✅ Close works: X button, backdrop click
- ✅ "View Full Stats" button removed
- ✅ Leading scorers section styled professionally
- ✅ Cards feel responsive and interactive
- ✅ No console errors

## Files to Modify
1. `GameCardExpanded.jsx` - Modal component (main refactor)
2. `GameCard.jsx` - Ensure card → modal wiring is clean
3. `Home.jsx` - Modal state management

## Testing Approach
1. Open game card → verify modal displays correctly
2. Click backdrop → verify modal closes
3. Click X button → verify modal closes
4. Click star → verify favorite toggle works
5. Take 3-4 screenshots showing final state

## Estimated Time
45-60 min including testing
