
'use client';

import Link from 'next/link';
import {
  ChevronDown,
  Menu,
  ShoppingCart,
  BookUser,
  Building2,
  Sparkles,
  HeartPulse,
  MoreHorizontal,
  SprayCan,
  MessageSquare,
  Phone,
  Landmark,
  Hand,
  Tractor,
  Users,
  Award,
  UserCircle,
  LogOut,
  Package,
  Shield,
  LayoutDashboard,
} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useCart } from '@/hooks/use-cart';
import { useUser } from '@/firebase/auth/use-user';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { CartSidebar } from '../cart/CartSidebar';
import { Badge } from '../ui/badge';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '../../app/logo.png';

const productComponents: { title: string; href: string; description: string, icon: React.ReactNode }[] = [
  {
    title: 'Liv Plus Care',
    href: '/liv-plus-care',
    description:
      'Nurturing your body with the gentle touch of nature for daily well-being.',
    icon: <HeartPulse />,
  },
  {
    title: 'Liv Plus Glow',
    href: '/liv-plus-glow',
    description:
      'Illuminate your beauty from within for radiant skin and hair.',
    icon: <Sparkles />,
  },
  {
    title: 'Liv Plus More',
    href: '/liv-plus-more',
    description: 'Wellness supplements and teas that offer more for a balanced life.',
    icon: <MoreHorizontal />,
  },
  {
    title: 'Liv Plus Clean',
    href: '/liv-plus-clean',
    description: 'Herbal and natural solutions for a clean and healthy home.',
    icon: <SprayCan />,
  },
];

const aboutComponents: { title: string; href: string; icon: React.ReactNode }[] = [
    { title: "About Rekhi Group", href: "/about-rekhi-group", icon: <Building2 /> },
    { title: "Chairman's Message", href: "/chairmans-message", icon: <Landmark /> },
    { title: "Founder's Vision", href: "/founders-vision", icon: <Hand /> },
    { title: "Establishment Year", href: "/establishment-year", icon: <Tractor /> },
    { title: "Why Us?", href: "/why-us", icon: <Award /> },
    { title: "Our Team", href: "/our-team", icon: <Users /> },
]


export function Header() {
  const [open, setOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, claims } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const isAdmin = user?.email === 'admin@app11.in';

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  };


  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="Livin Herbels Logo" width={50} height={10} className="object-contain" />
        </Link>
        
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
             {isAdmin && (
               <NavigationMenuItem>
                    <Link href="/admin" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Admin
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
             )}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Our Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {productComponents.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                      icon={component.icon}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>About Our Group</NavigationMenuTrigger>
              <NavigationMenuContent>
                 <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {aboutComponents.map(component => (
                        <ListItem key={component.title} title={component.title} href={component.href} icon={component.icon} />
                    ))}
                 </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <Link href="/community" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Community
                    </NavigationMenuLink>
                </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Contact
                    </NavigationMenuLink>
                </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart />
                    {itemCount > 0 && (
                    <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0"
                    >
                        {itemCount}
                    </Badge>
                    )}
                    <span className="sr-only">Open Cart</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <CartSidebar />
            </SheetContent>
          </Sheet>

          {user ? (
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar>
                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                            <AvatarFallback>
                               {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserCircle />}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                         <DropdownMenuItem onSelect={() => router.push('/admin')}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Admin Panel</span>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onSelect={() => router.push('/profile')}>
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => router.push('/orders')}>
                        <Package className="mr-2 h-4 w-4" />
                        <span>My Orders</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setIsCartOpen(true)}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        <span>My Cart</span>
                         {itemCount > 0 && <Badge className="ml-auto">{itemCount}</Badge>}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>
          ): (
            <Button onClick={() => router.push('/login')} className="hidden md:flex">Login</Button>
          )}

          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-6">
                  <Link
                    href="/"
                    className="flex items-center gap-2 mb-4"
                    onClick={() => setOpen(false)}
                  >
                    <Image src={logo} alt="Livin Herbels Logo" width={50} height={10} className="object-contain" />
                  </Link>
                  {isAdmin && (
                       <Link href="/admin" className="text-lg font-medium py-4 block border-b" onClick={() => setOpen(false)}>
                         <LayoutDashboard className="mr-2 h-4 w-4 inline-block" /> Admin
                       </Link>
                  )}
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="products" className="border-b">
                      <AccordionTrigger className="text-lg font-medium py-4">Our Products</AccordionTrigger>
                      <AccordionContent>
                         <div className="flex flex-col gap-2 pl-4">
                            {productComponents.map(c => (
                                <Link key={c.href} href={c.href} className="block py-2 text-muted-foreground" onClick={() => setOpen(false)}>{c.title}</Link>
                            ))}
                         </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="about" className="border-b">
                      <AccordionTrigger className="text-lg font-medium py-4">About Our Group</AccordionTrigger>
                      <AccordionContent>
                         <div className="flex flex-col gap-2 pl-4">
                            {aboutComponents.map(c => (
                                <Link key={c.href} href={c.href} className="block py-2 text-muted-foreground" onClick={() => setOpen(false)}>{c.title}</Link>
                            ))}
                         </div>
                      </AccordionContent>
                    </AccordionItem>
                     <Link href="/community" className="text-lg font-medium py-4 block border-b" onClick={() => setOpen(false)}>Community</Link>
                     <Link href="/contact" className="text-lg font-medium py-4 block border-b" onClick={() => setOpen(false)}>Contact</Link>
                  </Accordion>
                  {!user && (
                      <Button onClick={() => {router.push('/login'); setOpen(false);}} className="w-full mt-4">Login</Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}


const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-3">
             {icon && <div className="text-primary">{icon}</div>}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className={cn("line-clamp-2 text-sm leading-snug text-muted-foreground", icon && "pl-9")}>
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
