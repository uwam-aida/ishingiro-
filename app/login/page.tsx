'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithRetry } from '../lib/api';

export default function LoginPage () {
  const router = useRouter();
  
  // Login States
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  
  // Reset Password States
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetUserId, setResetUserId] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [statusMessage, setStatusMessage] = useState('');

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

  // Save OneSignal player ID after login
  const savePlayerIdAfterLogin = async (token: string) => {
  try {
    let playerId = localStorage.getItem('pending_player_id');
    
    if (!playerId && (window as any).OneSignal) {
      // Use OneSignal.getUserId() if available on the global OneSignal object
      const getUserId = (window as any).OneSignal.getUserId || (window as any).OneSignal.User?.getUserId;
      if (typeof getUserId === 'function') {
        playerId = await getUserId();
      }
    }
    
    if (playerId) {
      await fetchWithRetry('/api/save-player-id', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ player_id: playerId }),
        retries: 1,
        timeout: 8000
      });
      localStorage.removeItem('pending_player_id');
    }
  } catch (error) {
    console.error('Error saving player ID:', error);
  }
};

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('Connecting to server...');

    try {
      const response = await fetchWithRetry(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: userName,
          password: userPassword,
        }),
        retries: 2,
        timeout: 10000,
      });

      const data = await response.json();
      console.log("Server Response:", data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userId', data.user.id.toString());
        localStorage.setItem('roleId', data.user.role_id.toString());
        
        // Save OneSignal player ID
        await savePlayerIdAfterLogin(data.token);
        
        let role = data.user.normalized_name;
        let userLoc = data.user.location;

        if (!role && data.user.name) {
            const nameParts = data.user.name.split('_'); 
            if (nameParts.length >= 3) {
                userLoc = nameParts.pop(); 
                role = nameParts.join(''); 
            } else {
                role = data.user.name.replace(/_/g, ''); 
            }
        }

        let cleanRole = (role || '').toLowerCase().replace(/_/g, '').replace(/\s/g, '');

        if (cleanRole.startsWith('shopmanager')) {
            const extractedBranch = cleanRole.replace('shopmanager', '');
            if (extractedBranch.length > 0) {
                userLoc = extractedBranch;
            }
            cleanRole = 'shopmanager'; 
        }

        const branchId = (userLoc || 'kabuga').toLowerCase();

        localStorage.setItem('userRole', cleanRole);
        localStorage.setItem('userLocation', branchId);

        setStatusMessage(`Login successful! Redirecting...`);

        switch (cleanRole) {
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
          case 'productionmanager':
            router.push('/production-manager');
            break;
          case 'financechief':
          case 'chieffinance':
            router.push('/cheif-finance');
            break;
          case 'cicm':
            router.push('/cicm');
            break;
          case 'shopmanager':
            router.push(`/${branchId}/shop-manager`);
            break;
          default:
            console.warn("Unrecognized role, going to home:", cleanRole);
            router.push('/');
        }
      } else {
        setStatusMessage(data.message || 'Invalid username or password.');
      }
    } catch (error) {
      console.error("Network error:", error);
      setStatusMessage('Network error. The server might be waking up—please try again.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('Resetting password...');

    try {
      const response = await fetchWithRetry(`${baseUrl}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          user_id: parseInt(resetUserId, 10),
          code: resetCode,
          new_password: newPassword,
        }),
        retries: 2,
        timeout: 10000,
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage(data.message || 'Password updated successfully! You can now log in.');
        setIsResetMode(false);
        setResetCode('');
        setNewPassword('');
        setUserPassword('');
      } else {
        setStatusMessage(data.message || 'Failed to reset password. Please check your code.');
      }
    } catch (error) {
      console.error("Network error:", error);
      setStatusMessage('Network error while trying to reset password.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', fontFamily: 'sans-serif', padding: '30px', border: '1px solid #eaeaea', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>
        {isResetMode ? 'Reset Password' : 'Ishingiro Shop Login'}
      </h2>
      
      {!isResetMode ? (
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
          
          <button 
            type="button" 
            onClick={() => { setIsResetMode(true); setStatusMessage(''); }} 
            style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' }}
          >
            Forgot Password / Have a Reset Code?
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Your User ID</label>
            <input 
              type="number" 
              placeholder="e.g. 3"
              value={resetUserId} 
              onChange={(e) => setResetUserId(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>6-Digit Reset Code</label>
            <input 
              type="text" 
              placeholder="e.g. 482910"
              value={resetCode} 
              onChange={(e) => setResetCode(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', letterSpacing: '2px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>New Password</label>
            <input 
              type="password" 
              placeholder="Enter new password"
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" style={{ padding: '14px', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
            Update Password
          </button>

          <button 
            type="button" 
            onClick={() => { setIsResetMode(false); setStatusMessage(''); }} 
            style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' }}
          >
            Back to Login
          </button>
        </form>
      )}

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