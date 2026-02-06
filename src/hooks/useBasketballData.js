import { useState, useEffect } from 'react';
import { espnAPI } from '../utils/api-client';

export const useScoreboard = (league, date, autoRefresh = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (isInitial = false) => {
      try {
        if (isInitial) setLoading(true);
        const result = league === 'nba' 
          ? await espnAPI.getNBAScoreboard(date)
          : await espnAPI.getNCAAMScoreboard(date);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        if (isInitial) setLoading(false);
      }
    };

    // Initial fetch
    fetchData(true);

    // Set up auto-refresh if enabled
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchData(false); // Background refresh every 10s
      }, 10000); // 10 seconds

      return () => clearInterval(interval);
    }
  }, [league, date, autoRefresh]);

  return { data, loading, error };
};

export const useStandings = (league, conference = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let result;
        
        if (league === 'nba') {
          result = await espnAPI.getNBAStandings();
        } else {
          // NCAAM: if conference is 'all' or null, get rankings; otherwise get standings
          if (!conference || conference === 'all') {
            result = await espnAPI.getNCAAMRankings();
          } else {
            result = await espnAPI.getNCAAMStandings();
          }
        }
        
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [league, conference]);

  return { data, loading, error };
};

export const usePlayerStats = (playerId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!playerId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await espnAPI.getPlayerStats(playerId);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [playerId]);

  return { data, loading, error };
};

export const useTeamData = (league, teamId) => {
  const [teamInfo, setTeamInfo] = useState(null);
  const [roster, setRoster] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!teamId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [infoData, rosterData, statsData] = await Promise.all([
          espnAPI.getTeamInfo(league, teamId),
          espnAPI.getTeamRoster(league, teamId),
          espnAPI.getTeamStatistics(league, teamId),
        ]);

        setTeamInfo(infoData);
        setRoster(rosterData);
        setStatistics(statsData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [league, teamId]);

  return { teamInfo, roster, statistics, loading, error };
};
