# Team Page Implementation Plan

## Requirements
- Click team logo/name in game card → navigate to team page
- Show: roster with player stats, current record, last 10 games, advanced stats (net/off/def rtg)

## ESPN API Endpoints Needed

1. **Team Roster:** 
   `https://site.api.espn.com/apis/site/v2/sports/basketball/{league}/teams/{teamId}/roster`

2. **Team Stats:**
   `https://site.api.espn.com/apis/site/v2/sports/basketball/{league}/teams/{teamId}/statistics`

3. **Team Schedule (for last 10):**
   `https://site.api.espn.com/apis/site/v2/sports/basketball/{league}/teams/{teamId}/schedule`

## Implementation Steps

1. Add `/team/:id` route to App.jsx
2. Create `TeamPage.jsx` component
3. Add API methods to `api-client.js`
4. Create `useTeamData` hook
5. Create `RosterTable.jsx` component
6. Create `TeamStatsCard.jsx` component
7. Make team names/logos clickable in `GameCard.jsx`

## Data Structure Expected

**Roster:** Player name, position, number, PPG, RPG, APG, FG%, 3P%, FT%, MPG
**Team Stats:** Wins, Losses, Win%, Net Rtg, Off Rtg, Def Rtg, Last 10
