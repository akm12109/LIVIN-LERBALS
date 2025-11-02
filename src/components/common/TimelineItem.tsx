
'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type TimelineItemProps = {
  year: string;
  title: string;
  description: string;
  align: 'left' | 'right';
};

export function TimelineItem({
  year,
  title,
  description,
  align,
}: TimelineItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.5, // Trigger when 50% of the item is visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex w-full items-center',
        align === 'left' ? 'justify-start' : 'justify-end'
      )}
    >
      <div
        className={cn(
          'w-1/2 p-4 transition-all duration-700 ease-out',
          align === 'left' ? 'pr-8' : 'pl-8',
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        )}
      >
        <Card className="relative shadow-lg">
           <div className={cn(
            "absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-primary ring-4 ring-background",
            align === 'left' ? 'right-[-2rem]' : 'left-[-2rem]'
          )}></div>
           <div className={cn(
            "absolute top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent",
            align === 'left' ? "right-[-17px] border-l-[10px] border-l-card" : "left-[-17px] border-r-[10px] border-r-card"
          )}></div>
          <CardHeader>
            <div
              className={cn(
                'font-bold text-xl text-primary',
                align === 'left' ? 'text-right' : 'text-left'
              )}
            >
              {year}
            </div>
            <CardTitle
              className={cn(
                'font-headline text-accent',
                align === 'left' ? 'text-right' : 'text-left'
              )}
            >
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent
            className={cn(
              'text-muted-foreground',
              align === 'left' ? 'text-right' : 'text-left'
            )}
          >
            {description}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
