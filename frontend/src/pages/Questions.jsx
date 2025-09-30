import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Questions({ onSelectQuestion }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await api.getQuestions();
      setQuestions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading questions...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>PM Interview Questions</h2>
      {questions.length === 0 ? (
        <p>No questions yet. Create your first one!</p>
      ) : (
        <div>
          {questions.map((question) => (
            <div
              key={question.id}
              onClick={() => onSelectQuestion(question.id)}
              style={{
                padding: '15px',
                margin: '10px 0',
                border: '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer',
                backgroundColor: '#f9f9f9',
              }}
            >
              <h3 style={{ margin: '0 0 10px 0' }}>{question.title}</h3>
              {question.category && (
                <span
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '3px',
                    fontSize: '12px',
                    marginBottom: '8px',
                    display: 'inline-block',
                  }}
                >
                  {question.category}
                </span>
              )}
              <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                {question.description.substring(0, 150)}
                {question.description.length > 150 ? '...' : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
