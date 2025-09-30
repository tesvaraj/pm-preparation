import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Leaderboard() {
  const [view, setView] = useState('global'); // 'global' or 'friends'
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLeaderboard();
  }, [view]);

  const loadLeaderboard = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const data = view === 'global'
        ? await api.getGlobalLeaderboard()
        : await api.getFriendsLeaderboard(token);
      setLeaderboard(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (rank) => {
    if (rank === 0) return '>G';
    if (rank === 1) return '>H';
    if (rank === 2) return '>I';
    return `#${rank + 1}`;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Leaderboard</h2>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setView('global')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: view === 'global' ? '#4CAF50' : '#ddd',
            color: view === 'global' ? 'white' : 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Global
        </button>
        <button
          onClick={() => setView('friends')}
          style={{
            padding: '10px 20px',
            backgroundColor: view === 'friends' ? '#4CAF50' : '#ddd',
            color: view === 'friends' ? 'white' : 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Friends
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {!loading && !error && leaderboard.length === 0 && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          {view === 'friends'
            ? 'No friends with scores yet. Add some friends!'
            : 'No scores yet. Be the first!'}
        </div>
      )}

      {!loading && !error && leaderboard.length > 0 && (
        <div>
          {leaderboard.map((entry, index) => (
            <div
              key={entry.user_id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '15px',
                marginBottom: '10px',
                backgroundColor: index < 3 ? '#f9f9f9' : '#fff',
                border: index < 3 ? '2px solid #4CAF50' : '1px solid #ddd',
                borderRadius: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', minWidth: '40px' }}>
                  {getMedalEmoji(index)}
                </span>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                    {entry.username}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {entry.total_attempts} attempts
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
                  {entry.average_score.toFixed(1)}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>avg score</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
