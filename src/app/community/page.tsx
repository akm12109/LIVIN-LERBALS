
'use client';
import { useCollection, useFirestore } from '@/firebase';
import type { Thread } from '@/lib/community';
import { collection, query, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';
import { QuestionCard, QuestionCardSkeleton } from '@/components/community/QuestionCard';
import { AskQuestionDialog } from '@/components/community/AskQuestionDialog';
import { mockThreads } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';

export default function CommunityPage() {
  const firestore = useFirestore();

  const threadsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'communityThreads'), orderBy('createdAt', 'desc'));
  }, [firestore]);
  
  const { data: firestoreThreads, loading } = useCollection<Thread>(threadsQuery);

  const isMockData = !firestoreThreads || firestoreThreads.length === 0;
  const threads = isMockData ? mockThreads : firestoreThreads;

  return (
    <>
      <div className="page-header-banner py-16 mb-12">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary inline-block pb-2 border-b-4 border-secondary">
            Community Forum
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Ask questions, share experiences, and connect with fellow nature
            lovers.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold font-headline">All Questions</h2>
            {isMockData && !loading && (
                <Badge className="mt-2 bg-black text-white">
                  Representative purpose only. This will be removed after development is completed.
                </Badge>
            )}
          </div>
          <AskQuestionDialog />
        </div>

        <div className="space-y-6">
          {loading && (
            <>
              <QuestionCardSkeleton />
              <QuestionCardSkeleton />
              <QuestionCardSkeleton />
            </>
          )}
          {!loading && threads?.map(thread => (
            <QuestionCard key={thread.id} thread={thread} />
          ))}
        </div>
      </div>
    </>
  );
}
