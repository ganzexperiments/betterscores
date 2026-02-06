import { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { DatePicker } from '../components/scores/DatePicker';
import { GameCard } from '../components/scores/GameCard';
import { GameCardSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { useScoreboard } from '../hooks/useBasketballData';
import { formatDateForAPI } from '../utils/api-client';
import { sortGamesByImportance } from '../utils/game-importance';

export const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeLeagues, setActiveLeagues] = useState(['nba', 'ncaam']);

  const formattedDate = formatDateForAPI(selectedDate);

  const { data: nbaData, loading: nbaLoading } = useScoreboard(
    'nba',
    activeLeagues.includes('nba') ? formattedDate : null
  );

  const { data: ncaamData, loading: ncaamLoading } = useScoreboard(
    'ncaam',
    activeLeagues.includes('ncaam') ? formattedDate : null
  );

  const toggleLeague = (league) => {
    setActiveLeagues((prev) =>
      prev.includes(league)
        ? prev.filter((l) => l !== league)
        : [...prev, league]
    );
  };

  const nbaGames = nbaData?.events || [];
  const ncaamGames = ncaamData?.events || [];
  
  // Sort all games: Live first, then by importance
  const sortGamesWithLiveFirst = (games, league) => {
    const liveGames = games.filter(g => g.competitions?.[0]?.status?.type?.state === 'in');
    const otherGames = games.filter(g => g.competitions?.[0]?.status?.type?.state !== 'in');
    const sortedOther = sortGamesByImportance(otherGames, league);
    return [...liveGames, ...sortedOther];
  };
  
  const nbaGamesSorted = sortGamesWithLiveFirst(nbaGames, 'nba');
  const ncaamGamesSorted = sortGamesWithLiveFirst(ncaamGames, 'ncaam');

  return (
    <PageWrapper>
      <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {/* League Toggles */}
      <div className="flex gap-3 mb-8">
        <Button
          variant={activeLeagues.includes('nba') ? 'primary' : 'outline'}
          size="sm"
          onClick={() => toggleLeague('nba')}
        >
          NBA
        </Button>
        <Button
          variant={activeLeagues.includes('ncaam') ? 'primary' : 'outline'}
          size="sm"
          onClick={() => toggleLeague('ncaam')}
        >
          NCAAM
        </Button>
      </div>

      <div className="space-y-12">
        {/* NBA Section */}
        {activeLeagues.includes('nba') && (
          <div className="animate-slide-up" style={{ animationDuration: '200ms' }}>
            {/* Section Header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-100">
                NBA
              </h2>
            </div>
            
            {nbaLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <GameCardSkeleton key={i} />
                ))}
              </div>
            ) : nbaGames.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nbaGamesSorted.map((game) => (
                  <GameCard key={game.id} game={game} league="nba" />
                ))}
              </div>
            ) : (
              <div className="bg-[#12151c] rounded-lg border border-white/10 border-dashed p-12 text-center">
                <p className="text-sm text-slate-400">No NBA games scheduled</p>
              </div>
            )}
          </div>
        )}

        {/* NCAAM Section */}
        {activeLeagues.includes('ncaam') && (
          <div className="animate-slide-up" style={{ animationDuration: '200ms' }}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-100">
                NCAAM
              </h2>
            </div>
            
            {ncaamLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <GameCardSkeleton key={i} />
                ))}
              </div>
            ) : ncaamGames.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ncaamGamesSorted.map((game) => (
                  <GameCard key={game.id} game={game} league="ncaam" />
                ))}
              </div>
            ) : (
              <div className="bg-[#12151c] rounded-lg border border-white/10 border-dashed p-12 text-center">
                <p className="text-sm text-slate-400">No NCAAM games scheduled</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
