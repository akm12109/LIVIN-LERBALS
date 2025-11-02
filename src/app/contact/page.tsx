
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Mail,
  PhoneCall,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const inquirySchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("A valid email is required."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

const faqItems = [
  {
    question: 'What are the shipping options?',
    answer:
      'We offer standard and express shipping. Standard shipping takes 5-7 business days, while express shipping takes 2-3 business days. Shipping costs are calculated at checkout.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'We have a 30-day return policy. If you are not satisfied with your purchase, you can return it for a full refund or exchange. Please visit our returns page for more details.',
  },
  {
    question: 'Are your products organic?',
    answer:
      'Many of our products are made with organic ingredients. Please check the product description and ingredient list for specific details on each product.',
  },
  {
    question: 'Do you offer international shipping?',
    answer:
      'Yes, we ship to most countries worldwide. International shipping rates and times vary depending on the destination. Please proceed to checkout to see the options for your country.',
  },
];

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
  });
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const firestore = useFirestore();

  const onSubmit: SubmitHandler<InquiryFormValues> = (data) => {
    if (!firestore) {
      toast({ title: 'Error', description: 'Database not connected.', variant: 'destructive' });
      return;
    }

    startTransition(async () => {
      try {
        await addDoc(collection(firestore, 'inquiries'), {
          ...data,
          productName: 'General Inquiry',
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Message Sent!', description: "Thank you for contacting us. We'll be in touch soon." });
        reset();
      } catch (error: any) {
        toast({ title: 'Error', description: error.message || "Failed to send message.", variant: 'destructive' });
      }
    });
  };

  return (
    <div className="bg-background text-foreground">
      <div className="page-header-banner py-16 mb-12">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary inline-block pb-2 border-b-4 border-secondary">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to help. Reach out to us with any questions or feedback.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Our team will get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Input placeholder="Your Name" {...register('name')} />
                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Input type="email" placeholder="Your Email" {...register('email')} />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Textarea placeholder="Your Message" rows={5} {...register('message')} />
                    {errors.message && <p className="text-sm text-destructive mt-1">{errors.message.message}</p>}
                  </div>
                  <Button className="w-full" type="submit" disabled={isPending}>
                    {isPending ? 'Submitting...' : 'Submit'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full h-16 text-base" asChild>
                 <a href="mailto:info@livinsourcesindia.com">
                  <Mail className="mr-2" /> Mail Us
                </a>
              </Button>
              <Button variant="secondary" className="w-full h-16 text-base">
                <PhoneCall className="mr-2" /> Request a Call Back
              </Button>
            </div>
          </div>

          <div>
            <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              Join the Conversation
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
              Have a question? Ask our community of fellow nature lovers in the forums.
            </p>
          </div>
          <Card className="bg-muted/50">
            <CardContent className="p-8 flex flex-col items-center text-center">
                <MessageSquare size={48} className="text-primary mb-4" />
                <p className="text-lg text-muted-foreground mb-6">
                    Check out our community forum to ask questions, share your experiences, and get advice from others.
                </p>
                <Button asChild size="lg">
                    <Link href="/community">
                        Visit the Community Forum <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
