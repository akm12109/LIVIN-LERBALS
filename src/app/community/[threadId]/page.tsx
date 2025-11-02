
'use client';

import { useMemo, useTransition } from 'react';
import { notFound } from 'next/navigation';
import type { Thread, Reply } from '@/lib/community';
import { mockThreads, mockReplies } from '@/lib/mock-data';
import {
  ThumbsUp,
  MessageSquare,
  Eye,
  Send,
  User,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useDoc, useCollection, useFirestore, useUser } from '@/firebase';
import { doc, collection, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { AuthGuard } from '@/components/common/AuthGuard';

type ThreadPageProps = {
  params: {
    threadId: string;
  };
};

export default function ThreadPage({ params }: ThreadPageProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isReplyPending, startReplyTransition] = useTransition();

  const threadRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'communityThreads', params.threadId);
  }, [firestore, params.threadId]);

  const { data: firestoreThread, loading: isLoadingThread } = useDoc<Thread>(threadRef);

  const repliesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, `communityThreads/${params.threadId}/replies`), orderBy('createdAt', 'asc'));
  }, [firestore, params.threadId]);

  const { data: firestoreReplies, loading: isLoadingReplies } = useCollection<Reply>(repliesQuery);
  
  const isLoading = isLoadingThread || isLoadingReplies;
  
  const isThreadMock = !firestoreThread;
  const thread = isThreadMock ? mockThreads.find(t => t.id === params.threadId) : firestoreThread;

  const areRepliesMock = !firestoreReplies || firestoreReplies.length === 0;
  const replies = areRepliesMock ? mockReplies : firestoreReplies;

  if (isLoading) {
    return <ThreadSkeleton />;
  }

  if (!thread) {
    notFound();
  }

  const threadWithId = { ...thread, id: params.threadId, replies: replies || [] };

  const handleReplySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user || !firestore) {
      toast({ variant: 'destructive', title: 'Login Required', description: 'You must be logged in to reply.' });
      return;
    }
    
    const formData = new FormData(event.currentTarget);
    const replyText = formData.get('replyText') as string;
    
    if (!replyText.trim()) return;

    startReplyTransition(async () => {
      try {
        await addDoc(collection(firestore, `communityThreads/${params.threadId}/replies`), {
          text: replyText,
          author: user.displayName || 'Anonymous',
          authorId: user.uid,
          avatarUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/40/40`,
          timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          likes: 0,
          createdAt: serverTimestamp(),
        });
        toast({ title: "Reply posted!", description: "Your reply has been added." });
        (event.target as HTMLFormElement).reset();
      } catch (error: any) {
        toast({ title: "Error", description: error.message || "Failed to post reply.", variant: "destructive" });
      }
    });
  };

  return (
    <AuthGuard>
      {(showLoginPrompt) => (
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-4xl mx-auto">
            {isThreadMock && !isLoadingThread && (
                <Badge className="mb-4 bg-black text-white">
                  Representative purpose only. This will be removed after development is completed.
                </Badge>
            )}
            <Card className="mb-8">
              <CardHeader>
                <h1 className="text-3xl font-bold font-headline mb-4">
                  {threadWithId.question}
                </h1>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={threadWithId.avatarUrl} alt={threadWithId.author} />
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      Asked by <strong>{threadWithId.author}</strong> &middot;{' '}
                      {threadWithId.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" /> {threadWithId.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" /> {threadWithId.replies.length}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                    {threadWithId.tags?.map(tag => (
                        <Badge key={tag} variant="secondary" className="font-normal">
                        {tag}
                        </Badge>
                    ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90">{threadWithId.details}</p>
                <div className="mt-6 flex items-center">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Like ({threadWithId.likes})
                  </Button>
                </div>
              </CardContent>
            </Card>

            <h2 className="text-2xl font-bold font-headline mb-6">
              {threadWithId.replies.length} Replies
            </h2>
            {areRepliesMock && !isLoadingReplies && (
                <Badge className="mb-4 bg-black text-white">
                  Representative purpose only. This will be removed after development is completed.
                </Badge>
            )}
            <div className="space-y-6">
              {threadWithId.replies.map(reply => (
                <ReplyCard key={reply.id} reply={reply} />
              ))}
            </div>
            
            {threadWithId.replies.length === 0 && !isLoadingReplies && (
                <div className="text-center py-12 text-muted-foreground">
                    <p className="text-lg">No replies yet.</p>
                    <p>Be the first one to help!</p>
                </div>
            )}

            <Separator className="my-10" />

            <Card>
              <CardHeader>
                <h3 className="text-xl font-bold">Your Reply</h3>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => { if (!user) { e.preventDefault(); showLoginPrompt(); } else { handleReplySubmit(e); } }}>
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/currentuser/40/40`} />
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                    <div className="w-full">
                      <Textarea
                        name="replyText"
                        placeholder="Share your knowledge and help out..."
                        rows={4}
                        required
                      />
                      <div className="mt-4 flex justify-end">
                        <Button type="submit" disabled={isReplyPending}>
                          <Send className="mr-2" /> {isReplyPending ? 'Posting...' : 'Post Reply'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}

function ReplyCard({ reply }: { reply: Reply }) {
  const isAdmin = reply.author === 'Admin';
  return (
    <Card
      className={`flex items-start gap-4 p-5 ${isAdmin ? 'bg-secondary/20 border-primary/50' : ''}`}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={reply.avatarUrl} alt={reply.author} />
        <AvatarFallback>
          <User />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-semibold">
            {reply.author}
            {isAdmin && (
              <CheckCircle className="ml-2 inline-block h-4 w-4 text-primary" />
            )}
          </p>
          <span className="text-xs text-muted-foreground">
            {reply.timestamp}
          </span>
        </div>
        <p className="mt-2 text-foreground/90">{reply.text}</p>
        <div className="mt-4 flex items-center">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
            <ThumbsUp className="h-4 w-4" />
            <span>{reply.likes}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}

function ThreadSkeleton() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="max-w-4xl mx-auto">
                <Card className="mb-8">
                    <CardHeader>
                        <Skeleton className="h-9 w-3/4 mb-4" />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                </Card>
                 <Skeleton className="h-8 w-32 mb-6" />
                <div className="space-y-6">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
        </div>
    );
}
