import { useState, useEffect } from 'react';
import { api } from '../services/api';
import AudioRecorder from '../components/AudioRecorder';

export default function QuestionDetail({ questionId, onBack, onResults }) {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuestion();
  }, [questionId]);

  const loadQuestion = async () => {
    try {
      const data = await api.getQuestion(questionId);
      setQuestion(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordingComplete = (blob) => {
    setAudioBlob(blob);
  };

  const handleSubmit = async () => {
    if (!audioBlob) {
      alert('Please record your answer first!');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const attempt = await api.submitAttempt(questionId, audioBlob, token);
      // Navigate to results page
      onResults(attempt.id);
    } catch (err) {
      alert(`Error submitting: ${err.message}`);
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  if (!question) return <div style={{ padding: '20px' }}>Question not found</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={onBack} style={{ marginBottom: '20px' }}>
        � Back to Questions
      </button>

      <div style={{
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2>{question.title}</h2>
        {question.category && (
          <span style={{
            padding: '4px 8px',
            backgroundColor: '#e0e0e0',
            borderRadius: '3px',
            fontSize: '12px',
            marginBottom: '10px',
            display: 'inline-block'
          }}>
            {question.category}
          </span>
        )}
        <p style={{ marginTop: '15px', lineHeight: '1.6' }}>{question.description}</p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h3>Record Your Answer</h3>
        <AudioRecorder onRecordingComplete={handleRecordingComplete} />

        {audioBlob && (
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                padding: '15px 40px',
                fontSize: '18px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.6 : 1
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Answer'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
