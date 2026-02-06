# Quick Wins Implementation Plan

## Order of Execution (by complexity & dependency)

### 1. Add Team Records to Game Cards ⏱️ 10 min
**What:** Display "LAL (32-15)" instead of just "LAL"
**Why:** Critical context for evaluating games
**Files:** `GameCard.jsx`
**API:** Records already in ESPN response (`competitors[].records`)
**Test:** Cards should show W-L records for both teams

### 2. Extend Date Range ⏱️ 5 min
**What:** ±14 days instead of ±3 days
**Why:** Users want to review past games and plan ahead
**Files:** `DatePicker.jsx`
**Change:** Update loop from `i = -3; i <= 3` to `i = -14; i <= 14`
**Test:** Date picker should show 29 total dates

### 3. Collapsible Sections ⏱️ 15 min
**What:** Collapse NBA/NCAAM sections when toggled off or minimal games
**Why:** Reduce clutter, focus on relevant content
**Files:** `Home.jsx`
**Logic:** Add collapse animation, hide/show based on toggle
**Test:** Click NBA/NCAAM toggles to collapse/expand sections

### 4. "Games to Watch" Smart Filter ⏱️ 20 min
**What:** Highlight or sort games by importance
**Why:** Answer "what should I watch tonight?"
**Criteria:** 
- Rivalry matchups (hardcoded pairs)
- Close records (within 5 games)
- National TV (if available in API)
- Top 10 teams
**Files:** `Home.jsx`, new `utils/game-importance.js`
**Test:** Important games should appear first or have visual indicator

### 5. Expandable Game Cards ⏱️ 25 min
**What:** Click card to reveal: recent form, H2H, injuries, broadcast
**Why:** Deep context without cluttering default view
**Files:** `GameCard.jsx`, new `GameCardExpanded.jsx` component
**API:** May need additional ESPN endpoint calls
**Test:** Click card → expanded view with extra details

---

**Total Estimated Time:** ~75 minutes
**Approach:** Execute in order, test after each, commit wins incrementally
