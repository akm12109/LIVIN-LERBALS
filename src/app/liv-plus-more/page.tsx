
'use client';

import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductSidebar } from '@/components/products/ProductSidebar';
import type { ProductCategory, Product } from '@/lib/products';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { getSubCategories } from '@/lib/products';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { mockProducts } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';

export default function LivPlusMorePage() {
  const category: ProductCategory = 'liv-plus-more';
  const firestore = useFirestore();

  const subCategories = getSubCategories(category);

  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    let q = query(collection(firestore, 'products'), where('category', '==', category));
    if (selectedSubCategory) {
      q = query(q, where('subCategory', '==', selectedSubCategory));
    }
    return q;
  }, [firestore, category, selectedSubCategory]);

  const { data: firestoreProducts, loading } = useCollection<Product>(productsQuery);

  const isMockData = !firestoreProducts || firestoreProducts.length === 0;

  const products = useMemo(() => {
    const data = isMockData ? mockProducts.filter(p => p.category === category) : firestoreProducts;
    if (selectedSubCategory) {
      return data.filter(p => p.subCategory === selectedSubCategory);
    }
    return data;
  }, [firestoreProducts, selectedSubCategory, category, isMockData]);


  return (
    <div>
      <div className="page-header-banner py-16 mb-12">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary inline-block pb-2 border-b-4 border-secondary">
            Liv Plus More
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our range of wellness supplements and teas that offer more for a balanced life.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-6 pb-12 flex gap-8">
        <ProductSidebar 
          subCategories={subCategories}
          selectedSubCategory={selectedSubCategory}
          onSelectSubCategory={setSelectedSubCategory}
          className="hidden md:block"
        />
        <div className="flex-1">
          <div className="md:hidden mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter Categories
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <ProductSidebar 
                      subCategories={subCategories}
                      selectedSubCategory={selectedSubCategory}
                      onSelectSubCategory={setSelectedSubCategory}
                    />
                </SheetContent>
              </Sheet>
          </div>
          {isMockData && !loading && (
              <Badge className="mb-4 bg-black text-white">
                Representative purpose only. This will be removed after development is completed.
              </Badge>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {loading && Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="flex flex-col h-full overflow-hidden rounded-2xl">
                    <Skeleton className="w-full h-64" />
                    <CardContent className="p-6 flex-grow">
                        <Skeleton className="h-6 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                    <CardContent className="p-6 pt-0">
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            ))}
            {!loading && products?.map(product => (
              <ProductCard key={product.id} product={product} isDemo={isMockData} />
            ))}
          </div>
          {!loading && products?.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p>No products found in this category yet. Please check back later!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
