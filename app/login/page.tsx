'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('Connecting to server...');

    try {
      // 1. URL points to your live backend login endpoint
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

      const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: userName,
          password: userPassword
        }),
      });

      const data = await response.json();
      console.log("Server Response:", data);

      if (response.ok) {
        // 2. Store the token and user details from the new API response
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userId', data.user.id.toString());
        localStorage.setItem('roleId', data.user.role_id.toString());
        
        // 3. Extract Role and Location based on the API name (e.g., "shop_manager_kabuga")
        let role = data.user.normalized_name; // Keep as fallback if backend adds it later
        let userLoc = data.user.location;

        if (!role && data.user.name) {
            // Split "shop_manager_kabuga" into parts
            const nameParts = data.user.name.split('_'); 
            if (nameParts.length >= 3) {
                userLoc = nameParts.pop(); // Gets the last part (e.g., "kabuga")
                role = nameParts.join(''); // Joins the rest (e.g., "shopmanager")
            } else {
                // For roles without locations like "cicm"
                role = data.user.name.replace(/_/g, ''); 
            }
        }

        // Save to local storage for the rest of the app to use
        localStorage.setItem('userRole', role || '');
        localStorage.setItem('userLocation', userLoc || 'kabuga');

        setStatusMessage(`Login successful! Redirecting...`);

        const branchId = (userLoc || 'kabuga').toLowerCase();

        // 4. Role-based Redirects
        switch (role) {
          case 'marketingmanager': 
            router.push('/marketing-manager');
            break;
          case 'bakerassistant':
            router.push('/baker-assistant');
            break;
          case 'storekeeper':
            router.push('/store-keeper');
            break;
          case 'salescoordinator':
            router.push('/sales-coordinator');
            break;
          case 'operationsmanager':
            router.push('/production-manager');
            break;
          case 'financechief':
            router.push('/cheif-finance');
            break;
          case 'cicm':
            router.push('/cicm');
            break;
          case 'shopmanager':
            router.push(`/${branchId}/shop-manager`);
            break;
          default:
            router.push('/');
        }
      } else {
        // Handle incorrect passwords or missing users
        setStatusMessage(data.message || 'Invalid username or password.');
      }
    } catch (error) {
      console.error("Network error:", error);
      setStatusMessage('Network error. The server might be waking up—please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', fontFamily: 'sans-serif', padding: '30px', border: '1px solid #eaeaea', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Ishingiro Shop Login</h2>
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Username</label>
          <input 
            type="text" 
            placeholder="Enter username"
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
            required 
            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Password</label>
          <input 
            type="password" 
            placeholder="••••••••"
            value={userPassword} 
            onChange={(e) => setUserPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" style={{ padding: '14px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          Sign In
        </button>
      </form>

      {statusMessage && (
        <p style={{ 
          marginTop: '25px', 
          padding: '12px', 
          borderRadius: '6px',
          textAlign: 'center',
          backgroundColor: statusMessage.includes('failed') || statusMessage.includes('Invalid') || statusMessage.includes('error') ? '#fff5f5' : '#f0fff4',
          color: statusMessage.includes('failed') || statusMessage.includes('Invalid') || statusMessage.includes('error') ? '#c53030' : '#2f855a',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {statusMessage}
        </p>
      )}
    </div>
  );
}