'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
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

        // --- THE FIX IS HERE ---
        // Clean up the role string to guarantee it matches your cases perfectly
        // This takes "shop_manager" or "Shop_Manager" and turns it into "shopmanager"
        const cleanRole = (role || '').toLowerCase().replace(/_/g, '');

        // 4. Role-based Redirects
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
        // Handle incorrect passwords or missing users
        setStatusMessage(data.message || 'Invalid username or password.');
      }
    } catch (error) {
      console.error("Network error:", error);
      setStatusMessage('Network error. The server might be waking up—please try again.');
    }
  };

  // --- NEW: HANDLE PASSWORD RESET API ---
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('Resetting password...');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

      const response = await fetch(`${baseUrl}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          user_id: parseInt(resetUserId),
          code: resetCode,
          new_password: newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage(data.message || 'Password updated successfully! You can now log in.');
        setIsResetMode(false); // Switch back to login view
        setResetCode('');
        setNewPassword('');
        setUserPassword(''); // Clear old password from state
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
        // --- STANDARD LOGIN FORM ---
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
        // --- NEW: RESET PASSWORD FORM ---
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