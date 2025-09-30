const API_URL = 'http://127.0.0.1:8000';

export const api = {
  async register(username, email, password) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }
    return response.json();
  },

  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }
    return response.json();
  },

  async getCurrentUser(token) {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to get user info');
    return response.json();
  },

  async getQuestions() {
    const response = await fetch(`${API_URL}/questions/`);
    if (!response.ok) throw new Error('Failed to get questions');
    return response.json();
  },

  async createQuestion(title, description, category, token) {
    const response = await fetch(`${API_URL}/questions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, category }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create question');
    }
    return response.json();
  },

  async getQuestion(id) {
    const response = await fetch(`${API_URL}/questions/${id}`);
    if (!response.ok) throw new Error('Failed to get question');
    return response.json();
  },

  async submitAttempt(questionId, audioBlob, token) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('question_id', questionId);

    const response = await fetch(`${API_URL}/attempts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to submit attempt');
    }
    return response.json();
  },
};
