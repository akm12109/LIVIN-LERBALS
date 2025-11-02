
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, PlusCircle, CreditCard, Ticket, Image as ImageIcon } from 'lucide-react';
import { AdminGuard } from '@/components/common/AdminGuard';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import logo from '../logo.png';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Button } from '@/components/ui/button';
import { UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();


  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/add-product', label: 'Add Product', icon: PlusCircle },
    { href: '/admin/slideshow', label: 'Slideshow', icon: ImageIcon },
    { href: '/admin/charges', label: 'Charges', icon: CreditCard },
    { href: '/admin/promo-codes', label: 'Promo Codes', icon: Ticket },
  ];

  return (
    <AdminGuard>
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/admin" className="flex items-center gap-2 font-semibold">
                  <Image src={logo} alt="Livin Herbels Logo" width={40} className="object-contain" />
                  <span className="">Admin Panel</span>
                </Link>
              </div>
              <div className="flex-1">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                  {navItems.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                        pathname === item.href && 'bg-muted text-primary'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
              {/* Add mobile sheet navigation here if needed */}
              <div className="w-full flex-1">
                {/* Optional: Add a search bar or title here */}
              </div>
              <ThemeToggle />
              <Button onClick={handleLogout} variant="ghost" size="icon">
                  <LogOut className="h-5 w-5" />
              </Button>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/20">
              {children}
            </main>
          </div>
        </div>
    </AdminGuard>
  );
}
