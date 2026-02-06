# 🏀 Courtside - Modern Basketball Tracker

A mobile-first basketball tracking app featuring NBA and NCAAM scores, standings, and rankings with a "Modern Varsity" design aesthetic.

## ✨ Features

### Scoreboard
- **Combined View:** See NBA and NCAAM games in one place (customizable)
- **Date Navigation:** Browse games from 7 days back to 60 days forward
- **Live Updates:** Real-time game status with pulsing "LIVE" badges
- **Game Details:** Team logos, scores, rankings, broadcast info, and game notes

### Standings & Rankings
- **NBA Standings:** Eastern and Western Conference splits
- **NCAAM Rankings:** AP Top 25 with team logos and records
- **Visual Hierarchy:** Ranked teams highlighted in Terracotta

### Player Pages
- **Season Stats:** PPG, RPG, APG, FG% in a Bento Box grid layout
- **Player Info:** Photo, position, jersey number, team

## 🎨 Design System (Modern Varsity)

- **Background:** `#FDFCFB` (Warm Bone/Paper)
- **Primary Text:** `#1E293B` (Deep Navy Slate)
- **Accent:** `#C2410C` (Terracotta - basketball orange)
- **Action:** `#1D4ED8` (Royal Blue)
- **Success/Live:** `#065F46` (Forest Green)

**UI Style:** Large border-radius, subtle shadows, minimal borders, plenty of whitespace

## 🛠️ Tech Stack

- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.3.1
- **Styling:** Tailwind CSS v4
- **Icons:** lucide-react
- **Animations:** framer-motion
- **Date Handling:** date-fns
- **Routing:** react-router-dom
- **API:** Public ESPN APIs (no authentication required)

## 🚀 Getting Started

### Prerequisites
- Node.js v22+ 
- npm 10+

### Installation

\`\`\`bash
cd react-apps/courtside
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Opens at `http://localhost:5173`

### Build

\`\`\`bash
npm run build    # Production build
npm run preview  # Preview production build
\`\`\`

## 📁 Project Structure

\`\`\`
src/
├── components/
│   ├── layout/
│   │   ├── Navigation.jsx      # Top navigation bar
│   │   └── PageWrapper.jsx     # Page layout wrapper
│   ├── scores/
│   │   ├── DatePicker.jsx      # Horizontal date scroller
│   │   └── GameCard.jsx        # Individual game display
│   ├── standings/
│   │   └── StandingsTable.jsx  # Standings/rankings table
│   └── ui/
│       ├── Badge.jsx           # Status badges (Live, Final, Ranked)
│       ├── Button.jsx          # Reusable button component
│       └── Skeleton.jsx        # Loading skeletons
├── hooks/
│   └── useBasketballData.js    # Data fetching hooks
├── pages/
│   ├── Home.jsx                # Scoreboard page
│   ├── Standings.jsx           # Standings & rankings
│   └── PlayerDetail.jsx        # Player stats page
├── utils/
│   └── api-client.js           # ESPN API wrapper
├── App.jsx                      # Router setup
├── main.jsx                     # App entry point
└── index.css                    # Global styles & theme
\`\`\`

## 🌐 API Endpoints

All data fetched from public ESPN APIs:

- **NBA Scoreboard:** `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard`
- **NCAAM Scoreboard:** `https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard`
- **NBA Standings:** `https://site.api.espn.com/apis/v2/sports/basketball/nba/standings`
- **NCAAM Rankings:** `https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/rankings`

## 📱 Mobile Optimization

- **Mobile-first design:** Optimized for phone screens
- **Touch-friendly:** Large tap targets, smooth scrolling
- **Responsive grid:** Adapts from 1 column (mobile) to 3 columns (desktop)
- **Sticky navigation:** Always accessible at top of screen

## 🎯 Future Enhancements

- [ ] Player search
- [ ] Team pages
- [ ] Conference filtering for NCAAM
- [ ] Game detail pages with play-by-play
- [ ] Push notifications for live games
- [ ] Dark mode
- [ ] Favorite teams

## 📝 License

Built as a personal project. ESPN data used under their public API terms.

---

**Built with ❤️ using React + Vite**
