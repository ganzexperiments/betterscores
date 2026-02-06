# 🚀 Courtside - Quick Start Guide

## Start the App (Development)

\`\`\`bash
cd react-apps/courtside
npm run dev
\`\`\`

Then open **http://localhost:5173** in your browser.

## What You'll See

### Home Page (Scores)
- Horizontal date picker at the top (scroll to browse dates)
- Toggle between NBA and NCAAM games
- Live game status with pulsing badges
- Team logos, current scores, rankings
- Mobile-optimized card layout

### Standings Page
- Toggle between NBA and NCAAM
- **NBA:** Switch between Eastern/Western conferences
- **NCAAM:** AP Top 25 rankings with team logos
- Clean table layout with W-L records, percentages, games behind

### Navigation
- Sticky top bar with Courtside logo
- Quick access to Scores and Standings

## Mobile Testing

The app is **mobile-first**, so test it by:
1. Opening Chrome DevTools (F12)
2. Click the device toolbar icon (Ctrl+Shift+M)
3. Select a mobile device (iPhone, Pixel, etc.)

Or just resize your browser to phone width!

## Build for Production

\`\`\`bash
npm run build
npm run preview  # Test production build locally
\`\`\`

Production files will be in `dist/` folder.

## Customization

Want to tweak something? Main files:

- **Colors:** `src/index.css` (Modern Varsity palette)
- **API calls:** `src/utils/api-client.js`
- **Components:** `src/components/`
- **Pages:** `src/pages/`

---

**Enjoy tracking hoops! 🏀**
