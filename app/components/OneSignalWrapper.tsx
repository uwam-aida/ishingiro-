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
          // notifyButton block removed completely!
        });

        OneSignal.Slidedown.promptPush();
      } catch (error) {
        console.error("OneSignal initialization failed:", error);
      }
    };

    initializeOneSignal();
  }, []);

  return <>{children}</>;
}