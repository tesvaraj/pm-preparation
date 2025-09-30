import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function AttemptResults({ attemptId, onBack }) {
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAttempt();
  }, [attemptId]);

  const loadAttempt = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await api.getAttempt(attemptId, token);
      setAttempt(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading results...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  if (!attempt) return <div style={{ padding: '20px' }}>Results not found</div>;

  const feedback = attempt.feedback || {};
  const scores = feedback.scores || {};

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <button onClick={onBack} style={{ marginBottom: '20px' }}>
        ê Back to Questions
      </button>

      <div style={{ backgroundColor: '#f5f5f5', padding: '30px', borderRadius: '12px', marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', margin: '0 0 10px 0', color: getScoreColor(attempt.score) }}>
          {attempt.score ? attempt.score.toFixed(1) : 'N/A'}
        </h1>
        <p style={{ fontSize: '18px', color: '#666', margin: 0 }}>Overall Score</p>
      </div>

      {feedback.summary && (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
          <h3>Summary</h3>
          <p style={{ lineHeight: '1.6' }}>{feedback.summary}</p>
        </div>
      )}

      {scores && Object.keys(scores).length > 0 && (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
          <h3>Detailed Scores</h3>
          {Object.entries(scores).map(([key, value]) => (
            <div key={key} style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {key.replace(/_/g, ' ')}
                </span>
                <span style={{ color: getScoreColor(value) }}>{value}/10</span>
              </div>
              <div style={{ backgroundColor: '#e0e0e0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  backgroundColor: getScoreColor(value),
                  width: `${value * 10}%`,
                  height: '100%',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {feedback.strengths && feedback.strengths.length > 0 && (
        <div style={{ padding: '20px', backgroundColor: '#f0f9f0', borderRadius: '8px', marginBottom: '20px', border: '1px solid #4CAF50' }}>
          <h3 style={{ color: '#4CAF50' }}> Strengths</h3>
          <ul>
            {feedback.strengths.map((strength, idx) => (
              <li key={idx} style={{ marginBottom: '8px', lineHeight: '1.5' }}>{strength}</li>
            ))}
          </ul>
        </div>
      )}

      {feedback.improvements && feedback.improvements.length > 0 && (
        <div style={{ padding: '20px', backgroundColor: '#fff8f0', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ff9800' }}>
          <h3 style={{ color: '#ff9800' }}>° Areas for Improvement</h3>
          <ul>
            {feedback.improvements.map((improvement, idx) => (
              <li key={idx} style={{ marginBottom: '8px', lineHeight: '1.5' }}>{improvement}</li>
            ))}
          </ul>
        </div>
      )}

      {attempt.transcript && (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3>Your Answer Transcript</h3>
          <p style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{attempt.transcript}</p>
        </div>
      )}
    </div>
  );
}

function getScoreColor(score) {
  if (score >= 8) return '#4CAF50';
  if (score >= 6) return '#ff9800';
  return '#f44336';
}
