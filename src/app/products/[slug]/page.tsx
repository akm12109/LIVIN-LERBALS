
'use client';

import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { InquiryForm } from '@/components/products/InquiryForm';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Star, Truck, Undo2, Banknote, PackageCheck, Hourglass, Ticket } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductCard } from '@/components/products/ProductCard';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect, useRef, useMemo, useTransition } from 'react';
import { useCart } from '@/hooks/use-cart';
import { useFirestore, useCollection, useUser } from '@/firebase';
import { collection, query, where, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import type { Product, ProductReview } from '@/lib/types';
import { mockProducts, mockReviews } from '@/lib/mock-data';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthGuard } from '@/components/common/AuthGuard';

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export default function ProductPage({ params }: ProductPageProps) {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { addProduct, applyPromoCode, appliedPromoCode } = useCart();
  const { user } = useUser();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const actionButtonsRef = useRef<HTMLDivElement>(null);
  const [isReviewPending, startReviewTransition] = useTransition();
  const [promoCodeInput, setPromoCodeInput] = useState("");

  const productQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), where('slug', '==', params.slug), limit(1));
  }, [firestore, params.slug]);

  const { data: products, loading: loadingProduct } = useCollection<Product>(productQuery);
  const firestoreProduct = products?.[0];

  const isProductMockData = !firestoreProduct;
  const product = isProductMockData ? mockProducts.find(p => p.slug === params.slug) : firestoreProduct;

  const reviewsQuery = useMemo(() => {
    if (!firestore || !product?.id) return null;
    return query(collection(firestore, `products/${product.id}/reviews`));
  }, [firestore, product?.id]);

  const { data: firestoreReviews, loading: loadingReviews } = useCollection<ProductReview>(reviewsQuery);
  
  const isReviewsMockData = !firestoreReviews || firestoreReviews.length === 0;
  const reviews = isReviewsMockData ? mockReviews.filter(r => r.productId === product?.id) : firestoreReviews;

  useEffect(() => {
    if (!actionButtonsRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { rootMargin: "0px 0px -100% 0px" } 
    );

    observer.observe(actionButtonsRef.current);

    return () => {
      if (actionButtonsRef.current) {
        observer.unobserve(actionButtonsRef.current);
      }
    };
  }, [loadingProduct]);

  if (loadingProduct) {
    return <ProductPageSkeleton />;
  }

  if (!product) {
    notFound();
  }
  
  const similarProductsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), where('category', '==', product.category), limit(5));
  }, [firestore, product.category]);

  const { data: allSimilarFirestoreProducts } = useCollection<Product>(similarProductsQuery);
  
  const isSimilarMockData = !allSimilarFirestoreProducts || allSimilarFirestoreProducts.length === 0;
  const allSimilarProducts = isSimilarMockData ? mockProducts : allSimilarFirestoreProducts;

  const similarProducts = allSimilarProducts?.filter(p => p.id !== product.id).slice(0, 4) || [];

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.price) * 100)
    : 0;
    
  const isLowStock = product.stock > 0 && product.stock < 20;

  const averageRating = reviews && reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;
  
  const ActionButtons = ({ showLoginPrompt } : { showLoginPrompt: () => void; user: any; }) => {
    
    const handleAddToCart = () => {
        if (product.stock === 0) {
          toast({ title: 'Out of Stock', description: 'This product is currently unavailable.', variant: 'destructive' });
          return;
        }
        if (!user) {
            showLoginPrompt();
            return;
        }
        addProduct(product);
        toast({ title: 'Added to Cart', description: `${product.name} has been added to your cart.` });
    };

    const handleBuyNow = () => {
        if (product.stock === 0) {
          toast({ title: 'Out of Stock', description: 'This product is currently unavailable.', variant: 'destructive' });
          return;
        }
        if (!user) {
            showLoginPrompt();
            return;
        }
        addProduct(product);
        router.push('/checkout');
    };
    
    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={product.stock === 0}>
                <ShoppingCart className="h-5 w-5 mr-2"/> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Button size="lg" variant="secondary" className="w-full" onClick={handleBuyNow} disabled={product.stock === 0}>
                Buy Now
            </Button>
        </div>
    );
  };
  
  const handleReviewSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!user || !firestore) {
        toast({ variant: 'destructive', title: 'Login Required', description: 'You must be logged in to write a review.' });
        return;
      }
      
      const formData = new FormData(event.currentTarget);
      const reviewText = formData.get('reviewText') as string;
      const author = user.displayName || 'Anonymous';
      
      startReviewTransition(async () => {
          try {
            const reviewsCollection = collection(firestore, `products/${product.id}/reviews`);
            await addDoc(reviewsCollection, {
                rating,
                text: reviewText,
                author,
                authorId: user.uid,
                createdAt: serverTimestamp(),
            });
            toast({
                title: "Review submitted!",
                description: "Thank you for your feedback."
            });
            setRating(0);
            (event.target as HTMLFormElement).reset();
          } catch (error: any) {
              toast({
                  title: "Error",
                  description: error.message || "Failed to submit review.",
                  variant: "destructive"
              });
          }
      });
  };

  const handleApplyPromoCode = () => {
    applyPromoCode(promoCodeInput, [product.id]);
    setPromoCodeInput("");
  };

  return (
    <AuthGuard>
    {(showLoginPrompt) => (
    <>
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        {isProductMockData && !loadingProduct && (
            <Badge className="mb-4 bg-black text-white">
            Representative purpose only. This will be removed after development is completed.
            </Badge>
        )}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          <div className="flex items-start justify-center">
            <Carousel
              className="w-full max-w-md"
              plugins={[
                Autoplay({
                  delay: 2000,
                  stopOnInteraction: true,
                  stopOnHover: true,
                }),
              ]}
              opts={{
                loop: true,
              }}
            >
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg object-cover w-full aspect-[4/3]"
                      data-ai-hint={image.hint}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
          <div>
            <h1 className="font-headline text-3xl md:text-4xl font-bold">
              {product.name}
            </h1>
            <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${averageRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground text-sm">({reviews?.length || 0} reviews)</span>
                </div>
                 <Separator orientation="vertical" className="h-5" />
                 {product.stock > 0 ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                        <PackageCheck className="h-4 w-4 mr-1.5" /> In Stock
                    </Badge>
                ) : (
                     <Badge variant="destructive">Out of Stock</Badge>
                )}
            </div>
            <p className="mt-4 text-lg text-muted-foreground">
              {product.longDescription}
            </p>

            <div className="mt-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
                {discount > 0 && (
                  <Badge variant="destructive">{discount}% OFF</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Inclusive of all taxes</p>
            </div>
            
            {isLowStock && (
                <div className="mt-4">
                    <Badge variant="secondary" className="text-base bg-amber-500/20 text-amber-700 border-amber-500/30 hover:bg-amber-500/30">
                        <Hourglass className="h-4 w-4 mr-1.5" />
                        Hurry up! Only {product.stock} left in stock.
                    </Badge>
                </div>
            )}


            <div className="mt-6 flex gap-2">
              <Input 
                placeholder="Apply Coupon" 
                className="max-w-xs" 
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
              />
              <Button variant="outline" onClick={handleApplyPromoCode}>Apply</Button>
            </div>
            {appliedPromoCode && (
              <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                <span>Promo code <strong>{appliedPromoCode.code}</strong> applied!</span>
              </div>
            )}
            
            <div ref={actionButtonsRef} className="mt-6">
              <ActionButtons showLoginPrompt={showLoginPrompt} user={user} />
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg bg-muted/50 border border-dashed">
                  <Truck className="h-7 w-7 text-primary"/>
                  <span className="text-sm font-medium text-muted-foreground">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg bg-muted/50 border border-dashed">
                  <Undo2 className="h-7 w-7 text-primary"/>
                  <span className="text-sm font-medium text-muted-foreground">7-Day Returns</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg bg-muted/50 border border-dashed">
                  <Banknote className="h-7 w-7 text-primary"/>
                  <span className="text-sm font-medium text-muted-foreground">Cash on Delivery</span>
              </div>
            </div>

            <Accordion
              type="single"
              collapsible
              className="w-full mt-8"
              defaultValue="item-1"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-semibold">
                  Ingredients
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {product.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-semibold">
                  Benefits
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {product.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-semibold">
                  What it Treats
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {product.treats.map((treat, index) => (
                      <li key={index}>{treat}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg font-semibold">
                  How to Use
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{product.uses}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg font-semibold">
                  Manufacturing Details
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {product.manufacturingDetails}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        
        <Separator className="my-16 md:my-24" />

        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6">Customer Reviews</h2>
            {isReviewsMockData && !loadingReviews && (
                <Badge className="mb-4 bg-black text-white">
                    Representative purpose only. This will be removed after development is completed.
                </Badge>
            )}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Ratings & Reviews</CardTitle>
                  <div className="text-sm text-muted-foreground">{reviews?.length || 0} reviews</div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${averageRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-lg">{averageRating.toFixed(1)} out of 5</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {loadingReviews && <Skeleton className="h-20 w-full" />}
                {!loadingReviews && reviews?.map(review => (
                  <div key={review.id} className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">{review.author}</p>
                      <div className="flex items-center">
                        {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                        {[...Array(5 - review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-gray-300" />)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{review.text}</p>
                  </div>
                ))}
                {!loadingReviews && reviews?.length === 0 && <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>}
              </CardContent>
            </Card>
          </div>
          <div>
            <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6">Write a Review</h2>
            <Card>
              <CardHeader>
                <CardTitle>Rate This Product</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => { if (!user) { e.preventDefault(); showLoginPrompt(); } else { handleReviewSubmit(e); } }}>
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-8 h-8 cursor-pointer transition-colors ${(hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                  <Textarea name="reviewText" placeholder="Share your thoughts on the product..." rows={5} className="mb-4" required/>
                  <Button type="submit" disabled={isReviewPending || rating === 0}>
                    {isReviewPending ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Separator className="my-16 md:my-24" />

        <div>
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-center mb-12">
              You Might Also Like
          </h2>
          {isSimilarMockData && <Badge className="mb-4 bg-black text-white">Representative purpose only. This will be removed after development is completed.</Badge>}
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {similarProducts.map((p) => (
                <CarouselItem key={p.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <ProductCard product={p} isDemo={isSimilarMockData} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4 md:-left-12" />
            <CarouselNext className="-right-4 md:-right-12" />
          </Carousel>
        </div>

        <Separator className="my-16 md:my-24" />

        <div className="max-w-2xl mx-auto">
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-center">
            Have a Question?
          </h2>
          <p className="mt-2 text-muted-foreground text-center">
            Submit an inquiry for {product.name}
          </p>
          <InquiryForm productName={product.name} />
        </div>
      </div>
      {/* Sticky Bottom Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-4 border-t transition-transform duration-300 z-50 ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="container mx-auto flex items-center justify-between">
            <div className='flex items-center gap-4'>
                <Image src={product.images[0].src} alt={product.name} width={40} height={40} className="rounded-md" />
                <div>
                    <h3 className="font-bold text-sm">{product.name}</h3>
                    <p className="font-bold text-md">₹{product.price}</p>
                </div>
            </div>
            <div className="w-1/2">
                <ActionButtons showLoginPrompt={showLoginPrompt} user={user} />
            </div>
        </div>
      </div>
    </>
    )}
    </AuthGuard>
  );
}

function ProductPageSkeleton() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <div>
          <Skeleton className="w-full max-w-md aspect-[4/3] rounded-lg" />
        </div>
        <div>
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-6" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-6" />
          <Skeleton className="h-12 w-1/3 mb-8" />
          <div className="flex gap-4">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 flex-1" />
          </div>
        </div>
      </div>
    </div>
  )
}
