
import type { Timestamp } from 'firebase/firestore';

export type ProductReview = {
  id: string;
  author: string;
  rating: number;
  text: string;
  productId: string;
};

export type ProductCategory = 'liv-plus-care' | 'liv-plus-glow' | 'liv-plus-more' | 'liv-plus-clean';

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  subCategory: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  ingredients: string[];
  benefits: string[];
  treats: string[];
  uses: string;
  manufacturingDetails: string;
  images: {
    src: string;
    alt: string;
    hint: string;
  }[];
  stock: number;
  promoCodes?: string[];
};

export type Order = {
    id: string;
    userId: string;
    items: {
        id: string;
        name: string;
        quantity: number;
        price: number;
    }[];
    grandTotal: number;
    shippingAddress: {
        fullName: string;
        streetAddress: string;
        city: string;
        state: string;
        pincode: string;
        phoneNumber: string;
    };
    status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
    createdAt: Timestamp;
};

export type UserProfile = {
    id: string;
    displayName: string;
    email: string;
    photoURL?: string;
    role: 'admin' | 'user';
    createdAt: Timestamp;
}

export type HeroSlide = {
  id: string;
  heading: string;
  button: {
    text: string;
    href: string;
  };
  image: {
    src: string;
    hint: string;
  }
}

export type CheckoutCharge = {
    id: string;
    name: string;
    amount: number;
    type: 'fixed' | 'percentage';
}

export type PromoCode = {
    id: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    value: number;
}


const allSubCategories: Record<ProductCategory, string[]> = {
    'liv-plus-care': ['hair-care', 'body-care'],
    'liv-plus-glow': ['face-care', 'skin-care'],
    'liv-plus-more': ['supplements', 'teas'],
    'liv-plus-clean': ['home-care']
};

export const getSubCategories = (category: ProductCategory): string[] => {
    return allSubCategories[category] || [];
}
