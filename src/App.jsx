import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/layout/Navigation';
import { Home } from './pages/Home';
import { Standings } from './pages/Standings';
import { PlayerDetail } from './pages/PlayerDetail';
import { TeamPage } from './pages/TeamPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-transparent">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/player/:id" element={<PlayerDetail />} />
          <Route path="/team/:league/:id" element={<TeamPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
