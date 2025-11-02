
'use client';

import { useMemo, useTransition, useState } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import type { CheckoutCharge } from '@/lib/types';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit } from 'lucide-react';

const chargeSchema = z.object({
  name: z.string().min(3, 'Charge name is required'),
  amount: z.coerce.number().min(0, 'Amount must be positive'),
  type: z.enum(['fixed', 'percentage'], { required_error: 'Type is required' }),
});

export default function AdminChargesPage() {
  const firestore = useFirestore();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [editingCharge, setEditingCharge] = useState<CheckoutCharge | null>(null);
  const [chargeToDelete, setChargeToDelete] = useState<string | null>(null);


  const chargesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'checkoutCharges'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: charges, loading } = useCollection<CheckoutCharge>(chargesQuery);

  const form = useForm<z.infer<typeof chargeSchema>>({
    resolver: zodResolver(chargeSchema),
    defaultValues: { name: '', amount: 0, type: 'fixed' },
  });

  const editForm = useForm<z.infer<typeof chargeSchema>>({
    resolver: zodResolver(chargeSchema),
  });

  const onSubmit = (values: z.infer<typeof chargeSchema>) => {
    if (!firestore) {
      toast({ title: 'Error', description: 'Firestore not available.', variant: 'destructive' });
      return;
    }
    startTransition(async () => {
      try {
        await addDoc(collection(firestore, 'checkoutCharges'), {
          ...values,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Success', description: 'New charge has been added.' });
        form.reset();
      } catch (error: any) {
        toast({ title: 'Error', description: error.message || 'Failed to add charge.', variant: 'destructive' });
      }
    });
  };
  
  const onEditSubmit = (values: z.infer<typeof chargeSchema>) => {
    if (!firestore || !editingCharge) return;

    startTransition(async () => {
        try {
            const docRef = doc(firestore, 'checkoutCharges', editingCharge.id);
            await updateDoc(docRef, { ...values, updatedAt: serverTimestamp() });
            toast({ title: 'Success', description: 'Charge updated successfully.' });
            setEditingCharge(null);
        } catch (error: any) {
            toast({ title: 'Error', description: error.message || 'Failed to update charge.', variant: 'destructive' });
        }
    });
  };

  const handleDelete = () => {
    if (!firestore || !chargeToDelete) {
      toast({ title: 'Error', description: 'Firestore not available or no charge selected.', variant: 'destructive' });
      return;
    }
    startTransition(async () => {
        try {
            await deleteDoc(doc(firestore, 'checkoutCharges', chargeToDelete));
            toast({ title: 'Success', description: 'Charge has been deleted.' });
            setChargeToDelete(null);
        } catch (error: any) {
            toast({ title: 'Error', description: error.message || 'Failed to delete charge.', variant: 'destructive' });
            setChargeToDelete(null);
        }
    });
  }

  const handleEditClick = (charge: CheckoutCharge) => {
      setEditingCharge(charge);
      editForm.reset(charge);
  }

  return (
    <>
        <h1 className="text-3xl font-bold font-headline mb-4">Checkout Charges</h1>
        <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2">
            <Card>
            <CardHeader>
                <CardTitle>Current Charges</CardTitle>
                <CardDescription>
                These are the fees and taxes applied to every checkout.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
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
                    {!loading && charges?.map(charge => (
                    <TableRow key={charge.id}>
                        <TableCell className="font-medium">{charge.name}</TableCell>
                        <TableCell><Badge variant="secondary">{charge.type}</Badge></TableCell>
                        <TableCell>{charge.type === 'fixed' ? `₹${charge.amount.toFixed(2)}` : `${charge.amount}%`}</TableCell>
                        <TableCell className="text-right space-x-2">
                             <Button variant="ghost" size="icon" onClick={() => handleEditClick(charge)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setChargeToDelete(charge.id)} disabled={isPending}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                     {!loading && charges?.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No charges found. Add one to get started.
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
                <CardTitle>Add New Charge</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Charge Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., GST" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Amount / Percentage</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select charge type" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                            <SelectItem value="percentage">Percentage</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? 'Adding...' : 'Add Charge'}
                    </Button>
                </form>
                </Form>
            </CardContent>
            </Card>
        </div>
        </div>
        <Dialog open={!!editingCharge} onOpenChange={(open) => !open && setEditingCharge(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Charge: {editingCharge?.name}</DialogTitle>
                </DialogHeader>
                <Form {...editForm}>
                    <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={editForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Charge Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={editForm.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount / Percentage</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={editForm.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                                            <SelectItem value="percentage">Percentage</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

        <AlertDialog open={!!chargeToDelete} onOpenChange={(open) => !open && setChargeToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the charge.
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
