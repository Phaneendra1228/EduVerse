'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Do not wrap admin routes in the page transition to prevent layout breakage and sidebar flashing
  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <div className="page-transition-wrapper">
      {children}
    </div>
  );
}
