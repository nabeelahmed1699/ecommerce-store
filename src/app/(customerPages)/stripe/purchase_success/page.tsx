import { Button } from '@/components/ui/button';
import db from '@/db/db';
import { formatCurrency } from '@/lib/formatters';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface PurchaseSuccessPageProps {
  searchParams: { payment_intent: string } 
}
const PurchaseSuccessPage = async ({ searchParams }: PurchaseSuccessPageProps) => {
  const { payment_intent } = await searchParams;
  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

  if (!paymentIntent.metadata.productId) return notFound();
  const product = await db.product.findUnique({ where: { id: paymentIntent.metadata.productId } });
  if (product === null) return notFound();
  const isSuccess = paymentIntent.status === 'succeeded';

  return (
    <div className='max-w-5xl w-full mx-auto space-y-8'>
      <h1 className='text-4xl font-bold'>{isSuccess ? 'Success!' : 'Error!'}</h1>
      <div className='flex gap-4 items-center'>
        <div className='flex-shrink-0 aspect-video relative w-1/3'>
          <Image src={product.imagePath} alt={product.name} fill />
        </div>
        <div>
          <div className='text-lg'>{formatCurrency(product.priceInCents)}</div>
          <h1 className='text-2xl font-bold'>{product.name}</h1>
          <div className='line-clamp-3 text-muted-foreground'>{product.description}</div>
          <Button className='mt-4' size={'lg'} asChild>
            {isSuccess ? (
              <a href={`/products/download/${await createDownloadVerificationId(product.id)}`}>Download</a>
            ) : (
              <Link href={`/products/${product.id}/purchase`}>Try Again</Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccessPage;

async function createDownloadVerificationId(productId: string) {
  return (await db.downlooadVerification.create({ data: { productId, expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24) } })).id;
}
