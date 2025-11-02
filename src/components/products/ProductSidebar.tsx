
'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ProductSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  subCategories: string[];
  selectedSubCategory: string | null;
  onSelectSubCategory: (subCategory: string | null) => void;
}

export function ProductSidebar({ subCategories, selectedSubCategory, onSelectSubCategory, className, ...props }: ProductSidebarProps) {
  const formatSubCategory = (subCategory: string) => {
    return subCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <aside className={cn("w-64", className)} {...props}>
      <h2 className="text-xl font-bold font-headline mb-4">Categories</h2>
      <div className="space-y-2 flex flex-col items-start">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            selectedSubCategory === null ? 'bg-accent text-accent-foreground' : ''
          )}
          onClick={() => onSelectSubCategory(null)}
        >
          All
        </Button>
        {subCategories.map(subCategory => (
          <Button
            key={subCategory}
            variant="ghost"
            className={cn(
              'w-full justify-start',
              selectedSubCategory === subCategory ? 'bg-accent text-accent-foreground' : ''
            )}
            onClick={() => onSelectSubCategory(subCategory)}
          >
            {formatSubCategory(subCategory)}
          </Button>
        ))}
      </div>
    </aside>
  );
}
