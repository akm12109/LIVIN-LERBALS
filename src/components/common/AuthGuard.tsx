
'use client';

import { useState, type ReactNode } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { Leaf } from 'lucide-react';

type AuthGuardProps = {
  children: (showLoginPrompt: () => void) => ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const { user } = useUser();
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const router = useRouter();

  const showLoginPrompt = () => {
      if (!user) {
          setIsPromptOpen(true);
      }
  };

  const handleLoginRedirect = () => {
    setIsPromptOpen(false);
    // Save the current path to redirect back after login
    const currentPath = window.location.pathname + window.location.search;
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  return (
    <>
      {children(showLoginPrompt)}
      <Dialog open={isPromptOpen} onOpenChange={setIsPromptOpen}>
        <DialogContent>
          <DialogHeader className="text-center items-center">
             <div className="mx-auto mb-4 flex items-center justify-center">
                <Leaf className="h-10 w-10 text-primary" />
             </div>
            <DialogTitle className="font-headline text-2xl">Please Log In</DialogTitle>
            <DialogDescription className="max-w-xs mx-auto">
              You need to be logged in to perform this action. Please log in or create an account to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-4">
            <Button size="lg" onClick={handleLoginRedirect}>Log In</Button>
            <Button size="lg" variant="outline" onClick={() => { setIsPromptOpen(false); router.push('/signup'); }}>
              Sign Up
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
