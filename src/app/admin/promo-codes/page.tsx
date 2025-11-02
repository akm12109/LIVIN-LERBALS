
'use client';

import { useMemo, useTransition, useState } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import type { PromoCode } from '@/lib/types';
import { collection, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit } from 'lucide-react';

const promoCodeSchema = z.object({
  code: z.string().min(3, 'Code is required').regex(/^[A-Z0-9]+$/, 'Code must be uppercase letters and numbers only.'),
  discountType: z.enum(['fixed', 'percentage'], { required_error: 'Type is required' }),
  value: z.coerce.number().min(0, 'Value must be positive'),
});

export default function AdminPromoCodesPage() {
  const firestore = useFirestore();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [editingPromoCode, setEditingPromoCode] = useState<PromoCode | null>(null);
  const [promoCodeToDelete, setPromoCodeToDelete] = useState<string | null>(null);

  const promoCodesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'promoCodes'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: promoCodes, loading } = useCollection<PromoCode>(promoCodesQuery);

  const form = useForm<z.infer<typeof promoCodeSchema>>({
    resolver: zodResolver(promoCodeSchema),
    defaultValues: { code: '', value: 0, discountType: 'fixed' },
  });

  const editForm = useForm<z.infer<typeof promoCodeSchema>>({
    resolver: zodResolver(promoCodeSchema),
  });

  const onSubmit = (values: z.infer<typeof promoCodeSchema>) => {
    if (!firestore) {
      toast({ title: 'Error', description: 'Firestore not available.', variant: 'destructive' });
      return;
    }
    startTransition(async () => {
      try {
        await addDoc(collection(firestore, 'promoCodes'), {
            ...values,
            createdAt: serverTimestamp(),
        });
        toast({ title: 'Success', description: 'New promo code has been added.' });
        form.reset();
      } catch (error: any) {
        toast({ title: 'Error', description: error.message || 'Failed to add promo code.', variant: 'destructive' });
      }
    });
  };
  
  const onEditSubmit = (values: z.infer<typeof promoCodeSchema>) => {
    if (!firestore || !editingPromoCode) return;
    startTransition(async () => {
      try {
        const docRef = doc(firestore, 'promoCodes', editingPromoCode.id);
        await updateDoc(docRef, { ...values, updatedAt: serverTimestamp() });
        toast({ title: 'Success', description: 'Promo code updated successfully.' });
        setEditingPromoCode(null);
      } catch (error: any) {
        toast({ title: 'Error', description: error.message || 'Failed to update promo code.', variant: 'destructive' });
      }
    });
  };

  const handleDelete = () => {
    if (!firestore || !promoCodeToDelete) return;
    
    startTransition(async () => {
        try {
            await deleteDoc(doc(firestore, 'promoCodes', promoCodeToDelete));
            toast({ title: 'Success', description: 'Promo code has been deleted.' });
            setPromoCodeToDelete(null);
        } catch (error: any) {
            toast({ title: 'Error', description: error.message || 'Failed to delete promo code.', variant: 'destructive' });
            setPromoCodeToDelete(null);
        }
    });
  }
  
  const handleEditClick = (promoCode: PromoCode) => {
    setEditingPromoCode(promoCode);
    editForm.reset(promoCode);
  };

  return (
    <>
        <h1 className="text-3xl font-bold font-headline mb-4">Promo Codes</h1>
        <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2">
            <Card>
            <CardHeader>
                <CardTitle>Existing Promo Codes</CardTitle>
                <CardDescription>
                Manage your promotional codes and discounts.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading && (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center">
                        <Skeleton className="h-8 w-full" />
                        </TableCell>
                    </TableRow>
                    )}
                    {!loading && promoCodes?.map(code => (
                    <TableRow key={code.id}>
                        <TableCell className="font-medium">
                            <Badge>{code.code}</Badge>
                        </TableCell>
                        <TableCell><Badge variant="secondary">{code.discountType}</Badge></TableCell>
                        <TableCell>{code.discountType === 'fixed' ? `₹${code.value.toFixed(2)}` : `${code.value}%`}</TableCell>
                        <TableCell className="text-right space-x-2">
                             <Button variant="ghost" size="icon" onClick={() => handleEditClick(code)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setPromoCodeToDelete(code.id)} disabled={isPending}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                    {!loading && promoCodes?.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No promo codes found. Add one to get started.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            </CardContent>
            </Card>
        </div>

        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Add New Code</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Promo Code</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., SUMMER10" {...field} />
                            </FormControl>
                            <FormDescription>Uppercase letters and numbers only.</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Discount Value</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="discountType"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Discount Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select discount type" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" disabled={isPending} className="w-full">
                        {isPending ? 'Adding...' : 'Add Promo Code'}
                        </Button>
                    </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
        </div>
        <Dialog open={!!editingPromoCode} onOpenChange={(open) => !open && setEditingPromoCode(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Promo Code: {editingPromoCode?.code}</DialogTitle>
                </DialogHeader>
                <Form {...editForm}>
                    <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={editForm.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Promo Code</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormDescription>Uppercase letters and numbers only.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={editForm.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount Value</FormLabel>
                                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={editForm.control}
                            name="discountType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={isPending}>{isPending ? 'Saving...' : 'Save Changes'}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

        <AlertDialog open={!!promoCodeToDelete} onOpenChange={(open) => !open && setPromoCodeToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the promo code.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                    {isPending ? 'Deleting...' : 'Continue'}
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}

    
