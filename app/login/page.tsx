'use client'; // This is required in Next.js to use state and run fetch in the browser

import React, { useState } from 'react';

export default function LoginPage() {
  // 1. State to hold what the user types in
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // 2. The function that runs when they click "Login"
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the page from refreshing
    setStatusMessage('Logging in...');

    try {
      // Remember to change this URL to her live link or Ngrok link when you have it!
      const response = await fetch('http://your-domain.com/api/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName,
          password: userPassword 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // SUCCESS! Save the token to the browser
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role.name);
        
        setStatusMessage(`Login successful! Welcome ${data.user.name}`);
        
        // At this point, you would normally redirect them to the dashboard:
        // window.location.href = '/dashboard';
        
      } else {
        // FAILED
        setStatusMessage('Login failed. Please check your name and password.');
      }
    } catch (error) {
      console.error("Network error:", error);
      setStatusMessage('Network error. Cannot connect to the server.');
    }
  };

  // 3. The actual UI visible on the screen
  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', fontFamily: 'sans-serif' }}>
      <h2>Ishingiro Shop Login</h2>
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <label>Username:</label><br />
          <input 
            type="text" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>Password:</label><br />
          <input 
            type="password" 
            value={userPassword} 
            onChange={(e) => setUserPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', cursor: 'pointer' }}>
          Login
        </button>

      </form>

      {/* Shows success or error messages */}
      {statusMessage && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{statusMessage}</p>}
    </div>
  );
}