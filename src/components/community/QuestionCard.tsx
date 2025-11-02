
import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare, ThumbsUp, Eye } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Thread } from '@/lib/community';
import { Skeleton } from '../ui/skeleton';

interface QuestionCardProps {
  thread: Thread;
}

export function QuestionCard({ thread }: QuestionCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                 <Image
                    src={thread.avatarUrl}
                    alt={thread.author}
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <div>
                    <CardTitle className="text-lg leading-snug">
                        <Link href={`/community/${thread.id}`} className="hover:text-primary transition-colors">
                            {thread.question}
                        </Link>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Asked by {thread.author} &middot; {thread.timestamp}
                    </p>
                </div>
            </div>
        </div>
      </CardHeader>
      <CardContent className="py-0">
         <p className="text-muted-foreground line-clamp-2">{thread.details}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 pb-4">
        <div className="flex gap-2">
          {thread.tags?.map(tag => (
            <Badge key={tag} variant="secondary" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ThumbsUp className="w-4 h-4" /> {thread.likes}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4" /> {thread.replies?.length || 0}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" /> {thread.views}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}


export function QuestionCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="w-full space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6 mt-2" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
      </CardFooter>
    </Card>
  )
}
