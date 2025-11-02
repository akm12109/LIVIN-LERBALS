'use client';
import { useMemo, type ReactNode } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const firebase = useMemo(() => initializeFirebase(), []);
  return <FirebaseProvider value={firebase}>{children}</FirebaseProvider>;
}
