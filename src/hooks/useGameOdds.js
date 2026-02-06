import React, { useState, useEffect } from 'react';
import { api } from '../utils/api-client';

export function useGameOdds(league, gameId) {
  const [odds, setOdds] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gameId) return;
    
    async function fetchOdds() {
      try {
        const data = await api.getGameOdds(league, gameId);
        // ESPN odds structure: items[0].overUnder, items[0].details (spread)
        if (data && data.items && data.items.length > 0) {
          setOdds(data.items[0]);
        }
      } catch (err) {
        console.error('Odds fetch failed', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOdds();
  }, [league, gameId]);

  return { odds, loading };
}
