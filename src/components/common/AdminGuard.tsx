
'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';

type AdminGuardProps = {
  children: ReactNode;
};

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();

  const isAdmin = user?.email === 'admin@app11.in';

  useEffect(() => {
    if (!userLoading) {
      if (!user || !isAdmin) {
        router.replace('/');
      }
    }
  }, [user, isAdmin, userLoading, router]);

  // While loading or if not an admin, show a loading/access indicator.
  if (userLoading || !isAdmin) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Verifying admin access...</p>
      </div>
    );
  }

  // If the user is the specific admin, render the children.
  return <>{children}</>;
}
