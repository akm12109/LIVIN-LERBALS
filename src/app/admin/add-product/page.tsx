
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const productSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  slug: z.string().min(3, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with no spaces.'),
  category: z.enum(['liv-plus-care', 'liv-plus-glow', 'liv-plus-more', 'liv-plus-clean'], {
      required_error: "You need to select a product category.",
  }),
  subCategory: z.string().min(3, 'Sub-category is required'),
  shortDescription: z.string().min(10, 'Short description is required'),
  longDescription: z.string().min(20, 'Long description is required'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  originalPrice: z.coerce.number().optional(),
  stock: z.coerce.number().min(0, 'Stock must be a positive number'),
  ingredients: z.string().min(3, 'Ingredients are required'),
  benefits: z.string().min(3, 'Benefits are required'),
  treats: z.string().min(3, 'Treatments are required'),
  uses: z.string().min(10, 'Usage instructions are required'),
  manufacturingDetails: z.string().min(10, 'Manufacturing details are required'),
});

export default function AddProductPage() {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const firestore = useFirestore();

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            slug: '',
            subCategory: '',
            shortDescription: '',
            longDescription: '',
            price: 0,
            stock: 0,
            ingredients: '',
            benefits: '',
            treats: '',
            uses: '',
            manufacturingDetails: '',
        }
    });

    const onSubmit = (values: z.infer<typeof productSchema>) => {
        if (!firestore) {
            toast({ title: "Error", description: "Firestore not available.", variant: "destructive" });
            return;
        }

        startTransition(async () => {
            try {
                await addDoc(collection(firestore, "products"), {
                    ...values,
                    ingredients: values.ingredients.split(',').map(s => s.trim()),
                    benefits: values.benefits.split(',').map(s => s.trim()),
                    treats: values.treats.split(',').map(s => s.trim()),
                    images: [
                        { src: `https://picsum.photos/seed/${values.slug}/600/400`, alt: values.name, hint: 'product photo' },
                        { src: `https://picsum.photos/seed/${values.slug}2/600/400`, alt: values.name, hint: 'product context' },
                    ],
                    createdAt: serverTimestamp(),
                    promoCodes: [],
                });

                toast({
                    title: "Product Added!",
                    description: `${values.name} has been successfully added.`,
                });
                form.reset();
            } catch (error: any) {
                toast({
                    title: "Error",
                    description: error.message || "There was a problem adding the product.",
                    variant: "destructive",
                });
            }
        });
    }

  return (
    <>
      <h1 className="text-3xl font-bold font-headline mb-4">Add New Product</h1>
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
           <CardDescription>Fill out the form below to add a new product to your store.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Herbal Hair Oil" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., herbal-hair-oil" {...field} />
                                </FormControl>
                                <FormDescription>Lowercase, no spaces, use hyphens.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="liv-plus-care">Liv Plus Care</SelectItem>
                                        <SelectItem value="liv-plus-glow">Liv Plus Glow</SelectItem>
                                        <SelectItem value="liv-plus-more">Liv Plus More</SelectItem>
                                        <SelectItem value="liv-plus-clean">Liv Plus Clean</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="subCategory"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sub Category</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., hair-care" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Short Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="A brief summary of the product" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="longDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Long Description</FormLabel>
                            <FormControl>
                                <Textarea rows={4} placeholder="A detailed description of the product" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid md:grid-cols-3 gap-6">
                     <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price (₹)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="e.g., 250" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="originalPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Original Price (₹) <span className="text-muted-foreground">(Optional)</span></FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="e.g., 300" {...field} />
                                </FormControl>
                                <FormDescription>Used to show a discount.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stock Quantity</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="e.g., 100" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                 <FormField
                        control={form.control}
                        name="ingredients"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ingredients</FormLabel>
                                <FormControl>
                                    <Input placeholder="Amla, Brahmi, Bhringraj" {...field} />
                                </FormControl>
                                <FormDescription>Comma-separated list.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                 <FormField
                        control={form.control}
                        name="benefits"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Benefits</FormLabel>
                                <FormControl>
                                    <Input placeholder="Reduces hair fall, Promotes growth" {...field} />
                                </FormControl>
                                <FormDescription>Comma-separated list.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                <FormField
                        control={form.control}
                        name="treats"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>What it Treats</FormLabel>
                                <FormControl>
                                    <Input placeholder="Dandruff, Dry scalp" {...field} />
                                </FormControl>
                                <FormDescription>Comma-separated list.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                
                <FormField
                    control={form.control}
                    name="uses"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>How to Use</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Instructions for use..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                 <FormField
                    control={form.control}
                    name="manufacturingDetails"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Manufacturing Details</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Details about manufacturing, certifications, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isPending} size="lg">
                    {isPending ? 'Adding Product...' : 'Add Product'}
                </Button>

            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
