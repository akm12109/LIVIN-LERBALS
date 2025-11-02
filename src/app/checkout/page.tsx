
'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Landmark, ShoppingBag, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const { cart, subtotal, charges, grandTotal, itemCount } = useCart();
  const { toast } = useToast();

  const handlePlaceOrder = () => {
    // In a real app, this would process the payment and save the order.
    toast({
        title: "Order Placed!",
        description: "Thank you for your purchase. You'll receive a confirmation email shortly."
    });
    // Here you would typically clear the cart and redirect the user.
    // clearCart();
    // router.push('/order-confirmation');
  }

  if (itemCount === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-24 text-center">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground/50" strokeWidth={1} />
        <h1 className="mt-4 text-3xl font-bold font-headline">Your Cart is Empty</h1>
        <p className="mt-2 text-muted-foreground">You have no items in your cart to check out.</p>
        <Button asChild className="mt-6">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left Side: Forms */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
              <CardDescription>
                Enter the address where you want to receive your order.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" placeholder="123 Blossom Lane" />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Nashik" />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="Maharashtra" />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input id="pincode" placeholder="422001" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select how you'd like to pay.</CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup defaultValue="cod" className="space-y-4">
                    <Label className="flex items-center gap-4 rounded-md border p-4 cursor-pointer hover:bg-muted/50 has-[input:checked]:border-primary has-[input:checked]:bg-primary/5">
                         <RadioGroupItem value="cod" id="cod" />
                         <div className="flex-grow">
                             <h3 className="font-semibold">Cash on Delivery (COD)</h3>
                             <p className="text-sm text-muted-foreground">Pay with cash when your order arrives.</p>
                         </div>
                         <Truck className="h-6 w-6 text-primary" />
                    </Label>
                    <Label className="flex items-center gap-4 rounded-md border p-4 cursor-pointer hover:bg-muted/50 has-[input:checked]:border-primary has-[input:checked]:bg-primary/5">
                         <RadioGroupItem value="online" id="online" />
                         <div className="flex-grow">
                             <h3 className="font-semibold">Online Payment</h3>
                             <p className="text-sm text-muted-foreground">Pay with UPI, Credit/Debit Card, or Netbanking.</p>
                         </div>
                         <CreditCard className="h-6 w-6 text-primary" />
                    </Label>
                </RadioGroup>
            </CardContent>
          </Card>

        </div>

        {/* Right Side: Order Summary */}
        <div className="md:sticky top-24">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>You have {itemCount} items in your cart.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-64 overflow-y-auto space-y-4 pr-2">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                        <Image src={item.images[0].src} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-grow">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <Separator />
               <div className="space-y-2 text-sm">
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
                <div className="flex justify-between text-base font-bold">
                    <span>Grand Total</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" onClick={handlePlaceOrder}>
                Place Order
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
