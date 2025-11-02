
'use client';

import { useCart } from '@/hooks/use-cart';
import { SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CartItem } from './CartItem';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function CartSidebar() {
  const { cart, subtotal, grandTotal, charges, itemCount } = useCart();

  return (
    <div className="flex h-full flex-col">
      <SheetHeader className="pr-6">
        <SheetTitle>My Cart ({itemCount})</SheetTitle>
      </SheetHeader>
      <Separator className="my-4" />
      {cart.length > 0 ? (
        <>
          <ScrollArea className="flex-1 pr-6">
            <div className="space-y-4">
              {cart.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </ScrollArea>
          <Separator className="my-4" />
          <div className="pr-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {charges.map(charge => (
              <div key={charge.name} className="flex justify-between">
                <span className="text-muted-foreground">{charge.name}</span>
                <span>₹{charge.amount.toFixed(2)}</span>
              </div>
            ))}
             <Separator className="my-2" />
            <div className="flex justify-between text-base font-semibold">
                <span>Grand Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <SheetFooter className="pr-6 mt-4">
            <div className="w-full space-y-4">
                <SheetClose asChild>
                    <Button asChild className="w-full" size="lg">
                        <Link href="/checkout">Proceed to Checkout</Link>
                    </Button>
                </SheetClose>
            </div>
          </SheetFooter>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center space-y-4 text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground/50" strokeWidth={1} />
            <h3 className="text-xl font-semibold">Your cart is empty</h3>
            <p className="text-muted-foreground">Add some products to get started.</p>
        </div>
      )}
    </div>
  );
}
