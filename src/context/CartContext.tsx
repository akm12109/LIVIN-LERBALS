
'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { Product, CheckoutCharge, PromoCode } from '@/lib/types';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addProduct: (product: Product, quantity?: number) => void;
  removeProduct: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  grandTotal: number;
  discount: number;
  charges: { name: string; amount: number }[];
  itemCount: number;
  applyPromoCode: (code: string, productIds: string[]) => void;
  appliedPromoCode: PromoCode | null;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedPromoCode, setAppliedPromoCode] = useState<PromoCode | null>(null);
  const firestore = useFirestore();
  const { toast } = useToast();

  const { data: chargesData, loading: chargesLoading } = useCollection<CheckoutCharge>('checkoutCharges');

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    const savedPromo = localStorage.getItem('promoCode');
    if (savedPromo) {
        setAppliedPromoCode(JSON.parse(savedPromo));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (appliedPromoCode) {
        localStorage.setItem('promoCode', JSON.stringify(appliedPromoCode));
    } else {
        localStorage.removeItem('promoCode');
    }
  }, [appliedPromoCode]);

  const addProduct = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeProduct = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0) // Remove if quantity is 0 or less
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromoCode(null);
  };

  const applyPromoCode = useCallback(async (code: string, applicableProductIds: string[]) => {
      if (!firestore) return;

      const promoQuery = query(collection(firestore, 'promoCodes'), where('code', '==', code));
      const querySnapshot = await getDocs(promoQuery);

      if (querySnapshot.empty) {
          toast({ title: 'Invalid Promo Code', description: 'This promo code does not exist.', variant: 'destructive' });
          return;
      }
      
      const promoDoc = querySnapshot.docs[0];
      const promoData = { id: promoDoc.id, ...promoDoc.data() } as PromoCode;

      const applicableCartItems = cart.filter(item => applicableProductIds.includes(item.id));
      
      if (applicableCartItems.length === 0) {
          toast({ title: 'Promo Code Not Applicable', description: 'This promo code is not valid for any items in your cart.', variant: 'destructive' });
          return;
      }

      // Check if product has this promo code
      const productHasPromo = applicableCartItems.some(item => item.promoCodes?.includes(code));
      if (!productHasPromo) {
           toast({ title: 'Promo Code Not Applicable', description: 'This promo code is not valid for the selected product.', variant: 'destructive' });
          return;
      }


      setAppliedPromoCode(promoData);
      toast({ title: 'Promo Code Applied!', description: `You've got a discount with ${code}.` });

  }, [firestore, cart, toast]);


  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  let discount = 0;
  if (appliedPromoCode) {
      const applicableItems = cart.filter(item => item.promoCodes?.includes(appliedPromoCode.code));
      const applicableSubtotal = applicableItems.reduce((total, item) => total + item.price * item.quantity, 0);

      if (appliedPromoCode.discountType === 'fixed') {
          discount = Math.min(applicableSubtotal, appliedPromoCode.value);
      } else { // percentage
          discount = applicableSubtotal * (appliedPromoCode.value / 100);
      }
  }

  const subtotalAfterDiscount = subtotal - discount;

  const charges = chargesData?.map(charge => {
    if (charge.type === 'fixed') {
        return { name: charge.name, amount: charge.amount };
    }
    // Percentage-based charge
    return { name: `${charge.name} (${charge.amount}%)`, amount: subtotalAfterDiscount * (charge.amount / 100) };
  }) || [];

  const totalCharges = charges.reduce((acc, charge) => acc + charge.amount, 0);
  const grandTotal = subtotalAfterDiscount + totalCharges;


  return (
    <CartContext.Provider value={{ cart, addProduct, removeProduct, updateQuantity, clearCart, subtotal, grandTotal, charges, itemCount, discount, applyPromoCode, appliedPromoCode }}>
      {children}
    </CartContext.Provider>
  );
};
