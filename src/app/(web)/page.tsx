
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, limit, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore, useUser } from '@/firebase';
import type { Product, HeroSlide } from '@/lib/types';
import { mockProducts } from '@/lib/mock-data';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';


const mockHeroSlides: HeroSlide[] = [
  {
    id: '1',
    image: {
      src: 'https://picsum.photos/seed/hero-1/1800/1200',
      hint: 'green leaves',
    },
    heading: 'The Essence of Nature, Bottled.',
    button: {
      text: 'Explore Products',
      href: '/liv-plus-care',
    },
  },
  {
    id: '2',
    image: {
      src: 'https://picsum.photos/seed/hero-2/1800/1200',
      hint: 'herbal ingredients',
    },
    heading: 'Purity in Every Drop.',
    button: {
      text: 'About Us',
      href: '/about-rekhi-group',
    },
  },
];

export default function Home() {
  const firestore = useFirestore();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), limit(3));
  }, [firestore]);

  const slidesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'heroSlides'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: firestoreProducts, loading: loadingProducts } = useCollection<Product>(productsQuery);
  const { data: firestoreSlides, loading: loadingSlides } = useCollection<HeroSlide>(slidesQuery);

  const isMockProducts = !firestoreProducts || firestoreProducts.length === 0;
  const products = isMockProducts ? mockProducts : firestoreProducts;

  const isMockSlides = !firestoreSlides || firestoreSlides.length === 0;
  const heroSlides = isMockSlides ? mockHeroSlides : firestoreSlides;

  useEffect(() => {
    if (!userLoading && user) {
        if (user.email === 'admin@app11.in') {
            router.push('/admin');
        } else {
            router.push('/liv-plus-care');
        }
    }
  }, [user, userLoading, router]);

  if (userLoading || user) {
      return (
        <div className="flex h-screen items-center justify-center">
            <p>Loading...</p>
        </div>
      );
  }

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[70vh]">
        <Carousel
          className="w-full h-full"
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: true,
            }),
          ]}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent className="h-full">
            {loadingSlides && (
              <CarouselItem className="h-full">
                 <Skeleton className="w-full h-full" />
              </CarouselItem>
            )}
            {!loadingSlides && heroSlides.map(slide => (
              <CarouselItem key={slide.id} className="h-full">
                <div className="relative w-full h-full flex items-center justify-center text-center md:justify-end">
                  <Image
                    src={slide.image.src}
                    alt={slide.heading}
                    data-ai-hint={slide.image.hint}
                    fill
                    className="object-cover object-center absolute inset-0 z-0"
                    priority={slide.id === '1'}
                  />
                  <div className="absolute inset-0 bg-black/50 z-10" />
                  <div className="relative z-20 container px-4 md:px-6 text-white md:w-1/2 md:text-right">
                    <div className="overflow-hidden">
                      <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-slide-up">
                        {slide.heading}
                      </h1>
                    </div>
                    <div className="mt-8">
                      <Button
                        asChild
                        size="lg"
                        className="font-bold"
                      >
                        <Link href={slide.button.href}>
                          {slide.button.text}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      <section id="products" className="py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              Our Featured Products
            </h2>
            {isMockProducts && !loadingProducts && (
              <Badge className="mt-2 bg-black text-white">
                Representative purpose only. This will be removed after development is completed.
              </Badge>
            )}
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
              A curated selection of our finest herbal products, crafted for your
              well-being.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingProducts && Array.from({ length: 3 }).map((_, i) => (
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
            {!loadingProducts && products?.map(product => (
              <ProductCard key={product.id} product={product} isDemo={isMockProducts} />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-12 md:py-24 bg-muted">
        <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Image
              src="https://picsum.photos/seed/aboutus/800/600"
              alt="Herbal ingredients on a wooden table"
              data-ai-hint="herbal ingredients table"
              width={800}
              height={600}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              About Livin Sources
            </h2>
            <p className="mt-4 text-muted-foreground">
              Livin Sources (India) Private Limited is a company established in the year 2012 incorporated under the Companies Act in India. Situated in the City of Nashik in the State of Maharashtra, Livin Sources (India) Private Limited is specialized in herbal cosmetic products as well as Herbal Ayurvedic Medicines, in a country which has the roots of Ayurvedha, the production of herbal products is not a surprise but comes naturally.
            </p>
            <p className="mt-4 text-muted-foreground">
              In the fast moving world almost all people have lost their well being and overlooked to be well. In the current scenario people tend to seek solutions immediately for any problem and instant remedy for all issues. As a task of taking back people closer to Mother Nature, Livin Sources (India) Private Limited is taking initiatives to evolve herbal cosmetics in public.
            </p>
            <p className="mt-4 text-muted-foreground">
              Livin Sources (India) Private Limited is managed by a team of professionals. Apart from dealing with the herbal products, the company is much interested in creating awareness about advantages of herbal products over chemical products. The focus of the company is “LIVIN - LIV GREEN”
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
