'use client';

import { useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function AutoLogout() {
  const { data: session, status } = useSession();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 2 minutes in milliseconds
  const TIMEOUT_MS = 2 * 60 * 1000;

  // --- Tab/Browser Close Detection (Heartbeat Logic) ---
  // We use a localStorage heartbeat to track if ANY tab is open.
  // If all tabs are closed, the heartbeat stops. If the user returns after 10 seconds, we log them out.
  useEffect(() => {
    if (status === 'unauthenticated') {
      localStorage.removeItem('eduverse_last_active');
      return;
    }

    if (status === 'authenticated') {
      const lastActiveStr = localStorage.getItem('eduverse_last_active');
      if (lastActiveStr) {
        const lastActiveTime = parseInt(lastActiveStr, 10);
        // If it's been more than 10 seconds since the last heartbeat, all tabs were closed!
        if (Date.now() - lastActiveTime > 10000) {
          localStorage.removeItem('eduverse_last_active');
          signOut({ callbackUrl: '/login' });
          return;
        }
      }

      // Start the heartbeat for this tab
      localStorage.setItem('eduverse_last_active', Date.now().toString());
      const heartbeat = setInterval(() => {
        localStorage.setItem('eduverse_last_active', Date.now().toString());
      }, 2000);

      return () => clearInterval(heartbeat);
    }
  }, [status]);

  // --- Idle timeout ---
  useEffect(() => {
    // Only track idle time if the user is actively logged in
    if (status !== 'authenticated') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    const handleLogout = () => {
      // Log the user out and redirect them to login page
      signOut({ redirect: true, callbackUrl: '/login' });
    };

    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(handleLogout, TIMEOUT_MS);
    };

    // Initialize the timer as soon as they are logged in
    resetTimer();

    // List of events that denote the user is active
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

    // Attach event listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    // Cleanup on unmount or when status changes
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [status]);

  return null;
}
