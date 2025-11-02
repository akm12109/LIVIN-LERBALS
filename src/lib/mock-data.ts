
import type { Product, ProductReview } from './products';
import type { Thread, Reply } from './community';

export const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Herbal Hair Oil',
        slug: 'herbal-hair-oil',
        category: 'liv-plus-care',
        subCategory: 'hair-care',
        shortDescription: 'Nourishing hair oil with a blend of traditional herbs.',
        longDescription: 'Revitalize your hair with our Herbal Hair Oil, a potent mixture of Amla, Brahmi, and Bhringraj. This traditional formula strengthens hair from the roots, reduces hair fall, and promotes healthy growth, leaving your hair shiny and strong.',
        price: 250,
        originalPrice: 300,
        stock: 15,
        ingredients: ['Amla', 'Brahmi', 'Bhringraj', 'Coconut Oil'],
        benefits: ['Reduces hair fall', 'Promotes hair growth', 'Prevents dandruff'],
        treats: ['Hair fall', 'Dandruff', 'Dry scalp'],
        uses: 'Gently massage into scalp and hair. Leave for at least an hour before washing.',
        manufacturingDetails: 'Made with cold-pressed oils and sun-dried herbs. ISO 9001 and GMP certified.',
        images: [
            { src: 'https://picsum.photos/seed/prod-1a/600/400', alt: 'Herbal Hair Oil', hint: 'herbal oil bottle' },
            { src: 'https://picsum.photos/seed/prod-1b/600/400', alt: 'Herbs for oil', hint: 'amla brahmi herbs' },
        ]
    },
    {
        id: '2',
        name: 'Neem Face Wash',
        slug: 'neem-face-wash',
        category: 'liv-plus-glow',
        subCategory: 'face-care',
        shortDescription: 'Purifying face wash with the goodness of Neem.',
        longDescription: 'Our Purifying Neem Face Wash is a soap-free, herbal formulation that cleans impurities and helps clear pimples. A natural blend of Neem and Turmeric bring together their antibacterial and antifungal properties to prevent the recurrence of acne over time.',
        price: 150,
        stock: 50,
        ingredients: ['Neem', 'Turmeric', 'Aloe Vera'],
        benefits: ['Cleanses skin', 'Prevents pimples', 'Soothes skin'],
        treats: ['Acne', 'Oily skin', 'Blemishes'],
        uses: 'Moisten face, apply a small quantity of face wash and gently work up a lather. Rinse and pat dry.',
        manufacturingDetails: 'Dermatologically tested. Hypoallergenic. No harmful chemicals.',
        images: [
            { src: 'https://picsum.photos/seed/prod-2a/600/400', alt: 'Neem Face Wash', hint: 'face wash tube' },
            { src: 'https://picsum.photos/seed/prod-2b/600/400', alt: 'Neem leaves', hint: 'neem leaves' },
        ]
    },
    {
        id: '3',
        name: 'Herbal Green Tea',
        slug: 'herbal-green-tea',
        category: 'liv-plus-more',
        subCategory: 'teas',
        shortDescription: 'A refreshing and detoxifying blend of green tea and herbs.',
        longDescription: 'Start your day with a cup of our Herbal Green Tea, a perfect blend of premium green tea leaves, tulsi, and mint. This antioxidant-rich tea helps in detoxification, boosts metabolism, and provides a refreshing start to your day.',
        price: 200,
        stock: 30,
        ingredients: ['Green Tea Leaves', 'Tulsi', 'Mint', 'Ginger'],
        benefits: ['Boosts metabolism', 'Rich in antioxidants', 'Aids in digestion'],
        treats: ['Indigestion', 'Slow metabolism'],
        uses: 'Place a tea bag in a cup. Pour hot water and let it steep for 2-3 minutes.',
        manufacturingDetails: 'Sourced from organic tea gardens in Assam. Packed to retain freshness.',
        images: [
            { src: 'https://picsum.photos/seed/prod-3a/600/400', alt: 'Herbal Green Tea', hint: 'cup of tea' },
            { src: 'https://picsum.photos/seed/prod-3b/600/400', alt: 'Tea leaves', hint: 'tea leaves mint' },
        ]
    }
];

export const mockReviews: ProductReview[] = [
    {
        id: 'review1',
        productId: '1',
        author: 'Priya S.',
        rating: 5,
        text: 'This hair oil is amazing! My hair fall has reduced significantly in just a few weeks. It smells very natural too.'
    },
    {
        id: 'review2',
        productId: '1',
        author: 'Rahul Verma',
        rating: 4,
        text: 'Good product. Makes my hair soft and shiny. The only thing is the smell is a bit strong for me, but it works well.'
    }
];

export const mockThreads: Thread[] = [
    {
        id: 'thread1',
        author: 'Anjali',
        avatarUrl: 'https://picsum.photos/seed/anjali/40/40',
        timestamp: 'Sep 12',
        question: 'Which product is best for reducing dark spots and pigmentation?',
        details: 'I have been struggling with dark spots on my cheeks for a while now. I have tried a few products but nothing seems to work. My skin type is combination. Any suggestions from the Livin Herbels range would be appreciated!',
        tags: ['skin-care', 'pigmentation', 'face-care'],
        likes: 12,
        views: 156,
        createdAt: new Date() as any,
    },
    {
        id: 'thread2',
        author: 'Vikram',
        avatarUrl: 'https://picsum.photos/seed/vikram/40/40',
        timestamp: 'Sep 10',
        question: 'Is the herbal hair oil suitable for colored hair?',
        details: 'I recently got my hair colored and I am looking for a natural hair oil that won\'t fade the color. Has anyone with colored hair used the Herbal Hair Oil? Please share your experience.',
        tags: ['hair-care', 'hair-oil'],
        likes: 8,
        views: 98,
        createdAt: new Date() as any,
    }
];

export const mockReplies: Reply[] = [
    {
        id: 'reply1',
        author: 'Admin',
        avatarUrl: 'https://picsum.photos/seed/admin/40/40',
        timestamp: 'Sep 12',
        text: 'Hi Anjali, for dark spots we recommend our Liv Plus Glow face cream. It has natural ingredients like Saffron and Turmeric that are known to reduce pigmentation. Use it twice a day for best results!',
        likes: 5,
        createdAt: new Date() as any,
    },
    {
        id: 'reply2',
        author: 'Sneha',
        avatarUrl: 'https://picsum.photos/seed/sneha/40/40',
        timestamp: 'Sep 13',
        text: 'I second the admin. The face cream worked wonders for my skin!',
        likes: 2,
        createdAt: new Date() as any,
    }
];
