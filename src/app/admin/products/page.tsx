
'use client';

import { useMemo, useTransition, useState } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import type { Product, PromoCode } from '@/lib/types';
import { collection, query, orderBy, doc, updateDoc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Ticket, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function AdminProductsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), orderBy('name', 'asc'));
  }, [firestore]);

  const promoCodesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'promoCodes'), orderBy('code', 'asc'));
  }, [firestore]);

  const { data: products, loading } = useCollection<Product>(productsQuery);
  const { data: promoCodes, loading: loadingPromoCodes } = useCollection<PromoCode>(promoCodesQuery);

  const handleAssignPromoCode = async (productId: string, promoCode: string) => {
    if (!firestore) {
        toast({ title: 'Error', description: 'Firestore not available.', variant: 'destructive' });
        return;
    }
    startTransition(async () => {
        try {
            const productRef = doc(firestore, 'products', productId);
            await updateDoc(productRef, {
                promoCodes: arrayUnion(promoCode)
            });
            toast({ title: 'Success', description: `Promo code ${promoCode} assigned to product.` });
        } catch (error: any) {
            toast({ title: 'Error', description: error.message || 'Failed to assign promo code.', variant: 'destructive' });
        }
    });
  };

  const handleRemovePromoCode = async (productId: string, promoCode: string) => {
      if (!firestore) return;
      startTransition(async () => {
          try {
              const productRef = doc(firestore, 'products', productId);
              await updateDoc(productRef, {
                  promoCodes: arrayRemove(promoCode)
              });
              toast({ title: 'Success', description: `Promo code ${promoCode} removed.` });
          } catch (error: any) {
              toast({ title: 'Error', description: error.message || 'Failed to remove promo code.', variant: 'destructive' });
          }
      });
  };

  const handleDeleteProduct = () => {
    if (!firestore || !productToDelete) return;
    startTransition(async () => {
        try {
            await deleteDoc(doc(firestore, 'products', productToDelete));
            toast({ title: 'Product Deleted', description: 'The product has been successfully deleted.' });
            setProductToDelete(null);
        } catch (error: any) {
            toast({ title: 'Error', description: error.message || 'Failed to delete product.', variant: 'destructive' });
            setProductToDelete(null);
        }
    });
  };


  return (
    <>
      <h1 className="text-3xl font-bold font-headline mb-4">Products</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>
            A list of all products in your store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Promo Codes</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-16 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-12" />
                    </TableCell>
                     <TableCell>
                        <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              {!loading && products?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No products found. Add one to get started.
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                products?.map(product => (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                        <Image
                            alt={product.name}
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={product.images[0]?.src || '/placeholder.svg'}
                            width="64"
                        />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-1">
                            {product.promoCodes?.map(code => (
                                <DropdownMenu key={code}>
                                    <DropdownMenuTrigger asChild>
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 cursor-pointer">
                                            <Ticket className="mr-1 h-3 w-3" />
                                            {code}
                                        </Badge>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem 
                                            onClick={() => handleRemovePromoCode(product.id, code)} 
                                            className="text-destructive"
                                            disabled={isPending}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Remove
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ))}
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                    <Link href={`/admin/products/edit/${product.id}`}><Edit className="mr-2 h-4 w-4" />Edit</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger disabled={isPending}>
                                        <Ticket className="mr-2 h-4 w-4" />
                                        Assign Promo Code
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            {loadingPromoCodes && <DropdownMenuItem disabled>Loading...</DropdownMenuItem>}
                                            {promoCodes && promoCodes.map(pc => (
                                                <DropdownMenuItem 
                                                    key={pc.id} 
                                                    onClick={() => handleAssignPromoCode(product.id, pc.code)}
                                                    disabled={product.promoCodes?.includes(pc.code) || isPending}
                                                >
                                                    {pc.code}
                                                </DropdownMenuItem>
                                            ))}
                                            {promoCodes?.length === 0 && <DropdownMenuItem disabled>No codes available</DropdownMenuItem>}
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={() => setProductToDelete(product.id)} disabled={isPending}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the product.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} disabled={isPending}>
                {isPending ? 'Deleting...' : 'Continue'}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}

    
