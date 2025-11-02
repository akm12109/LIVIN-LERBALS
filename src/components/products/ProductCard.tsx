
"use client";

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hourglass, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '../common/AuthGuard';
import { useUser } from '@/firebase';

type ProductCardProps = {
  product: Product;
  isDemo?: boolean;
};

export function ProductCard({ product, isDemo }: ProductCardProps) {
  const { toast } = useToast();
  const { addProduct } = useCart();
  const router = useRouter();
  const { user } = useUser();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  
  const isLowStock = product.stock > 0 && product.stock < 20;

  const handleAction = (callback: () => void, showLoginPrompt: () => void) => {
    if (user) {
        callback();
    } else {
        showLoginPrompt();
    }
  }

  return (
    <AuthGuard>
        {(showLoginPrompt) => (
            <Card className="group flex flex-col h-full overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="p-0 relative">
                <Link href={`/products/${product.slug}`} className="block relative w-full h-64">
                {product.images.map((image, index) => (
                    <Image
                    key={index}
                    src={image.src}
                    alt={image.alt}
                    width={600}
                    height={400}
                    className={
                        `object-cover w-full h-full transition-opacity duration-300 ease-in-out absolute inset-0
                        ${index === 0 ? 'opacity-100 group-hover:opacity-0' : 'opacity-0 group-hover:opacity-100'}`
                    }
                    data-ai-hint={image.hint}
                    />
                ))}
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                        <Badge variant="destructive" className="text-lg">OUT OF STOCK</Badge>
                    </div>
                )}
                </Link>
                <Button 
                    size="icon" 
                    variant="secondary"
                    className="absolute top-3 right-3 rounded-full h-9 w-9 bg-background/80 hover:bg-background backdrop-blur-sm"
                    onClick={() => handleAction(() => {
                        if (product.stock === 0) {
                            toast({ title: 'Out of Stock', description: `${product.name} is currently out of stock.`, variant: 'destructive' });
                            return;
                        }
                        addProduct(product);
                        toast({ title: 'Added to Cart', description: `${product.name} has been added to your cart.` });
                    }, showLoginPrompt)}
                    aria-label="Add to cart"
                    disabled={product.stock === 0}
                >
                <ShoppingCart className="h-5 w-5"/>
                </Button>
                {isDemo && (
                    <Badge className="absolute bottom-3 left-3 bg-black/70 text-white">Demo</Badge>
                )}
                {discount > 0 && (
                <Badge variant="destructive" className="absolute top-3 left-3">{discount}% OFF</Badge>
                )}
            </CardHeader>
            <CardContent className="flex-grow p-6">
                {isLowStock && (
                    <Badge variant="secondary" className="mb-2 bg-amber-500/20 text-amber-700 border-amber-500/30 hover:bg-amber-500/30">
                        <Hourglass className="h-3 w-3 mr-1.5" />
                        Hurry up! Only {product.stock} left
                    </Badge>
                )}
                <CardTitle className="font-headline text-xl">
                <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">{product.name}</Link>
                </CardTitle>
                <CardDescription className="mt-2 line-clamp-2">
                {product.shortDescription}
                </CardDescription>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex justify-between items-center">
                <div className="flex flex-col">
                <span className="font-bold text-xl">₹{product.price}</span>
                {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                    ₹{product.originalPrice}
                    </span>
                )}
                </div>
                <Button 
                onClick={() => handleAction(() => {
                    if (product.stock === 0) {
                        toast({ title: 'Out of Stock', description: `${product.name} is currently out of stock.`, variant: 'destructive' });
                        return;
                    }
                    addProduct(product);
                    router.push('/checkout');
                }, showLoginPrompt)} 
                disabled={product.stock === 0}
                >
                Buy Now
                </Button>
            </CardFooter>
            </Card>
        )}
    </AuthGuard>
  );
}
