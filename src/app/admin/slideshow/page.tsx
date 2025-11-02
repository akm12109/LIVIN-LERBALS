
'use client';

import { useMemo, useTransition, useState } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import type { HeroSlide } from '@/lib/types';
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
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
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
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit } from 'lucide-react';
import Image from 'next/image';

const slideSchema = z.object({
  heading: z.string().min(5, 'Heading must be at least 5 characters.'),
  button: z.object({
    text: z.string().min(3, 'Button text is required.'),
    href: z.string().min(1, 'Button link is required.'),
  }),
  image: z.object({
    src: z.string().url('Must be a valid URL.'),
    hint: z.string().min(2, 'Image hint is required.'),
  }),
});

export default function AdminSlideshowPage() {
  const firestore = useFirestore();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [slideToDelete, setSlideToDelete] = useState<string | null>(null);

  const slidesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'heroSlides'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: slides, loading } = useCollection<HeroSlide>(slidesQuery);

  const form = useForm<z.infer<typeof slideSchema>>({
    resolver: zodResolver(slideSchema),
    defaultValues: {
      heading: '',
      button: { text: '', href: '' },
      image: { src: 'https://picsum.photos/seed/new-slide/1800/1200', hint: '' },
    },
  });

  const editForm = useForm<z.infer<typeof slideSchema>>({
    resolver: zodResolver(slideSchema),
  });

  const onSubmit = (values: z.infer<typeof slideSchema>) => {
     if (!firestore) {
      toast({ title: 'Error', description: 'Firestore not available.', variant: 'destructive' });
      return;
    }
    startTransition(async () => {
      try {
        await addDoc(collection(firestore, 'heroSlides'), {
          ...values,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Success', description: 'New slide has been added.' });
        form.reset();
      } catch (error: any) {
        toast({ title: 'Error', description: error.message || 'Failed to add slide.', variant: 'destructive' });
      }
    });
  };
  
  const onEditSubmit = (values: z.infer<typeof slideSchema>) => {
    if (!firestore || !editingSlide) return;
    startTransition(async () => {
      try {
        const docRef = doc(firestore, 'heroSlides', editingSlide.id);
        await updateDoc(docRef, { ...values, updatedAt: serverTimestamp() });
        toast({ title: 'Success', description: 'Slide updated successfully.' });
        setEditingSlide(null);
      } catch (error: any) {
        toast({ title: 'Error', description: error.message || 'Failed to update slide.', variant: 'destructive' });
      }
    });
  };

  const handleDelete = () => {
    if (!firestore || !slideToDelete) return;
    startTransition(async () => {
        try {
            await deleteDoc(doc(firestore, 'heroSlides', slideToDelete));
            toast({ title: 'Success', description: 'Slide has been deleted.' });
            setSlideToDelete(null);
        } catch(error: any) {
            toast({ title: 'Error', description: error.message || 'Failed to delete slide.', variant: 'destructive' });
            setSlideToDelete(null);
        }
    });
  }

  const handleEditClick = (slide: HeroSlide) => {
    setEditingSlide(slide);
    editForm.reset(slide);
  };

  return (
    <>
      <h1 className="text-3xl font-bold font-headline mb-4">Slideshow Management</h1>
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Slides</CardTitle>
              <CardDescription>
                Manage the slides on your homepage hero section.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              {loading && <Skeleton className="h-32 w-full" />}
              {!loading && slides?.map(slide => (
                <Card key={slide.id} className="flex items-center gap-4 p-4">
                  <Image src={slide.image.src} alt={slide.heading} width={120} height={80} className="rounded-md object-cover aspect-[3/2]" />
                  <div className="flex-grow">
                      <p className="font-bold">{slide.heading}</p>
                      <p className="text-sm text-muted-foreground">{slide.button.text} -> {slide.button.href}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(slide)}>
                      <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setSlideToDelete(slide.id)} disabled={isPending}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </Card>
              ))}
               {!loading && slides?.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                    <p>No slides found. Add one to get started.</p>
                </div>
               )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
                <CardTitle>Add New Slide</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="heading"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heading</FormLabel>
                        <FormControl>
                          <Input placeholder="The Essence of Nature" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image.src"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://picsum.photos/..." {...field} />
                        </FormControl>
                        <FormDescription>Use a service like Picsum or Unsplash.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image.hint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image AI Hint</FormLabel>
                        <FormControl>
                          <Input placeholder="green leaves" {...field} />
                        </FormControl>
                        <FormDescription>One or two keywords for AI.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="button.text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Text</FormLabel>
                        <FormControl>
                          <Input placeholder="Explore Now" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="button.href"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Link</FormLabel>
                        <FormControl>
                          <Input placeholder="/liv-plus-care" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? 'Adding...' : 'Add Slide'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={!!editingSlide} onOpenChange={(open) => !open && setEditingSlide(null)}>
        <DialogContent>
            <DialogHeader><DialogTitle>Edit Slide: {editingSlide?.heading}</DialogTitle></DialogHeader>
            <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
                    <FormField control={editForm.control} name="heading" render={({ field }) => (<FormItem><FormLabel>Heading</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={editForm.control} name="image.src" render={({ field }) => (<FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={editForm.control} name="image.hint" render={({ field }) => (<FormItem><FormLabel>Image AI Hint</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={editForm.control} name="button.text" render={({ field }) => (<FormItem><FormLabel>Button Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={editForm.control} name="button.href" render={({ field }) => (<FormItem><FormLabel>Button Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                        <Button type="submit" disabled={isPending}>{isPending ? 'Saving...' : 'Save Changes'}</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!slideToDelete} onOpenChange={(open) => !open && setSlideToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the slide.
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

    
