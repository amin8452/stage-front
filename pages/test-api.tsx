import { useState } from 'react';

export default function TestAPI() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testPdfAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalInfo: {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            phone: '123456789',
            address: 'Test Address'
          },
          education: {
            degree: 'Test Degree',
            school: 'Test School',
            year: '2023'
          },
          experience: [{
            company: 'Test Company',
            position: 'Test Position',
            duration: '2023-2024',
            description: 'Test description'
          }],
          skills: ['Test Skill 1', 'Test Skill 2'],
          template: 'modern'
        })
      });

      const data = await response.json();
      setResult({ status: response.status, data });
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Erreur inconnue' });
    }
    setLoading(false);
  };

  const testLoginAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'wrongpassword'
        })
      });

      const data = await response.json();
      setResult({ status: response.status, data });
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Erreur inconnue' });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test des APIs</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testPdfAPI} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Test en cours...' : 'Tester API PDF (POST)'}
        </button>

        <button 
          onClick={testLoginAPI} 
          disabled={loading}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Test en cours...' : 'Tester API Login (POST)'}
        </button>
      </div>

      {result && (
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '5px',
          marginTop: '20px'
        }}>
          <h3>Résultat :</h3>
          <pre style={{ 
            backgroundColor: 'white', 
            padding: '10px', 
            borderRadius: '3px',
            overflow: 'auto'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
