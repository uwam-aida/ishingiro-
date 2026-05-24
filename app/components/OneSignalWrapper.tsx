'use client';

import React, { useEffect } from 'react';
import OneSignal from 'react-onesignal';

export default function OneSignalWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const initializeOneSignal = async () => {
      try {
        await OneSignal.init({
          appId: "43c37346-e18b-4170-8da5-a759191eb933", 
          allowLocalhostAsSecureOrigin: true,
        });

        OneSignal.Slidedown.promptPush();
        
        // Get and save player ID after initialization
        // @ts-ignore - getUserId exists in the actual OneSignal SDK
        const playerId = await OneSignal.getUserId();
        
        if (playerId) {
          const token = localStorage.getItem('token');
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
          
          if (token) {
            fetch(`${baseUrl}/save-player-id`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ player_id: playerId }),
            }).catch(err => console.error('Error saving player ID:', err));
          } else {
            localStorage.setItem('pending_player_id', playerId);
          }
        }
      } catch (error) {
        console.error("OneSignal initialization failed:", error);
      }
    };

    initializeOneSignal();
  }, []);

  return <>{children}</>;
}