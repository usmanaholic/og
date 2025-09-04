import { useState, useEffect } from 'react';

// Generate a unique identifier for the user based on browser fingerprinting
export function useUserIdentifier() {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const generateUserId = async () => {
      // Create a simple fingerprint based on available browser data
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('User fingerprint', 2, 2);
      }
      
      const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        canvas.toDataURL(),
        localStorage.getItem('nust_user_id') || ''
      ].join('|');

      // Create a simple hash
      let hash = 0;
      for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      
      const uniqueId = Math.abs(hash).toString(36);
      
      // Store in localStorage for consistency
      if (!localStorage.getItem('nust_user_id')) {
        localStorage.setItem('nust_user_id', uniqueId);
      }
      
      setUserId(localStorage.getItem('nust_user_id') || uniqueId);
    };

    generateUserId();
  }, []);

  return userId;
}