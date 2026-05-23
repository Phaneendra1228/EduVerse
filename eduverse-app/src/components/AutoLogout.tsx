'use client';

import { useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function AutoLogout() {
  const { data: session, status } = useSession();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 2 minutes in milliseconds
  const TIMEOUT_MS = 2 * 60 * 1000;

  // --- Browser-close detection ---
  // sessionStorage is cleared when the browser closes.
  // If user has a session but no sessionStorage flag, the browser was restarted.
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'authenticated') {
      const browserFlag = sessionStorage.getItem('eduverse_browser_session');
      if (!browserFlag) {
        // Browser was closed and reopened — auto sign out
        signOut({ callbackUrl: '/login' });
        return;
      }
    }
  }, [status]);

  // Always set the flag on mount (persists within this browser session)
  useEffect(() => {
    sessionStorage.setItem('eduverse_browser_session', 'active');
  }, []);

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
