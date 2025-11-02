

import type { Timestamp } from 'firebase/firestore';

export type ProductReview = {
  id: string;
  author: string;
  rating: number;
  text: string;
  productId: string;
  createdAt: Timestamp;
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
};

// This file now only contains type definitions.
// The product data is fetched from Firestore.

const allSubCategories: Record<ProductCategory, string[]> = {
    'liv-plus-care': ['hair-care', 'body-care'],
    'liv-plus-glow': ['face-care', 'skin-care'],
    'liv-plus-more': ['supplements', 'teas'],
    'liv-plus-clean': ['home-care']
};

export const getSubCategories = (category: ProductCategory): string[] => {
    return allSubCategories[category] || [];
}
