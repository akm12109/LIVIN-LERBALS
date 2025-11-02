
'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquarePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { AuthGuard } from '../common/AuthGuard';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function AskQuestionDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const { user } = useUser();
  const firestore = useFirestore();

  const handleOpen = (showLoginPrompt: () => void) => {
      if (!user) {
          showLoginPrompt();
      } else {
          setOpen(true);
      }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !firestore) {
        toast({
            title: 'Please log in',
            description: 'You need to be logged in to ask a question.',
            variant: 'destructive',
        });
        return;
    }

    const formData = new FormData(event.currentTarget);
    const values = {
      question: formData.get('question') as string,
      details: formData.get('details') as string,
      tags: formData.get('tags') as string,
      author: user.displayName || 'Anonymous',
      authorId: user.uid,
      avatarUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/40/40`,
    };

    if (!values.question) {
        toast({ title: "Question is required", variant: "destructive" });
        return;
    }

    startTransition(async () => {
      try {
        await addDoc(collection(firestore, 'communityThreads'), {
            ...values,
            tags: values.tags?.split(',').map(tag => tag.trim()) || [],
            likes: 0,
            views: 0,
            timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            createdAt: serverTimestamp(),
        });
        toast({
          title: 'Question Posted!',
          description: 'Your question has been added to the community forum.',
        });
        setOpen(false);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'There was a problem posting your question.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <AuthGuard>
    {(showLoginPrompt) => (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button onClick={() => handleOpen(showLoginPrompt)}>
            <MessageSquarePlus className="mr-2" />
            Ask a Question
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
            <DialogHeader>
                <DialogTitle>Ask a New Question</DialogTitle>
                <DialogDescription>
                Share your question with the community. Be detailed and clear.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                <Label htmlFor="question-title">Question Title</Label>
                <Input
                    id="question-title"
                    name="question"
                    placeholder="e.g., What's the best product for oily skin?"
                    required
                />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="question-details">Details</Label>
                <Textarea
                    id="question-details"
                    name="details"
                    placeholder="Provide more context, what you've tried, etc."
                    rows={5}
                />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="question-tags">Tags</Label>
                <Input
                    id="question-tags"
                    name="tags"
                    placeholder="e.g., skin-care, acne, hair-oil"
                />
                <p className="text-sm text-muted-foreground">
                    Comma-separated tags to help categorize your question.
                </p>
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" disabled={isPending}>
                {isPending ? 'Posting...' : 'Post Question'}
                </Button>
            </DialogFooter>
            </form>
        </DialogContent>
        </Dialog>
    )}
    </AuthGuard>
  );
}
