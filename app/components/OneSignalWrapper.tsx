'use client';

import React, { useEffect } from 'react';

// Declare OneSignal on window to fix TypeScript errors
declare global {
  interface Window {
    OneSignal: any;
  }
}

export default function OneSignalWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const initializeOneSignal = () => {
      // Check if OneSignal is already loaded
      if (window.OneSignal) {
        return;
      }

      // Load OneSignal SDK
      const script = document.createElement('script');
      script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
      script.async = true;
      script.onload = () => {
        // Initialize after script loads
        window.OneSignal = window.OneSignal || [];
        window.OneSignal.push(() => {
          window.OneSignal.init({
            appId: "43c37346-e18b-4170-8da5-a759191eb933",
            allowLocalhostAsSecureOrigin: true,
          });
        });

        // Show prompt after a delay
        setTimeout(() => {
          if (window.OneSignal && window.OneSignal.Slidedown) {
            window.OneSignal.Slidedown.promptPush();
          }
        }, 2000);

        // Save player ID
        setTimeout(() => {
          if (window.OneSignal && window.OneSignal.getUserId) {
            window.OneSignal.getUserId((userId: string) => {
              if (userId) {
                const token = localStorage.getItem('token');
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
                
                if (token) {
                  fetch(`${baseUrl}/save-player-id`, {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ player_id: userId }),
                  }).catch(err => console.error('Error saving player ID:', err));
                } else {
                  localStorage.setItem('pending_player_id', userId);
                }
              }
            });
          }
        }, 3000);
      };
      
      document.head.appendChild(script);
    };

    initializeOneSignal();
  }, []);

  return <>{children}</>;
}