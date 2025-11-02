
import Link from 'next/link';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Image from 'next/image';
import logo from '../../app/logo.png';

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
             <Link href="/" className="flex items-center gap-2">
                <Image src={logo} alt="Livin Herbels Logo" width={140} height={40} className="object-contain" />
            </Link>
            <p className="text-sm">
                The Essence of Nature, Bottled. Experience wellness inspired by Ayurveda.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-headline text-lg font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about-rekhi-group" className="text-sm hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/liv-plus-care" className="text-sm hover:text-primary transition-colors">Products</Link></li>
              <li><Link href="/community" className="text-sm hover:text-primary transition-colors">Community</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-headline text-lg font-semibold text-foreground">Contact Us</h4>
             <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                <p className="text-sm">
                  Survey No.- 604/ 1A/2, Plot No. 134, Tidke Colony Road, Near Manas Hospital, Opp. Tupsakhare Lawns, Nashik- 422002, Maharashtra, India
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="tel:+919325017111" className="text-sm hover:text-primary transition-colors">+91 9325017111</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="mailto:info@livinsourcesindia.com" className="text-sm hover:text-primary transition-colors break-all">
                  info@livinsourcesindia.com
                </a>
              </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
             <h4 className="font-headline text-lg font-semibold text-foreground">Subscribe to our Newsletter</h4>
             <p className="text-sm">Get the latest updates on new products and upcoming sales.</p>
             <div className="flex w-full max-w-sm items-center space-x-2">
                <Input type="email" placeholder="Email" />
                <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                </Button>
            </div>
          </div>

        </div>

        <div className="mt-12 border-t pt-6 text-center text-sm">
            <p>
            &copy; {new Date().getFullYear()} Livin Sources (India) Pvt. Ltd. All
            rights reserved.
            </p>
            <p className="text-xs mt-1">
            Crafted with care in Nashik, Maharashtra, India.
            </p>
        </div>

      </div>
    </footer>
  );
}

    