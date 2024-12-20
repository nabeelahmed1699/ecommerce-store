'use client';

import { Product } from '@prisma/client';
import React, { FormEvent, useState } from 'react';
import { Elements, LinkAuthenticationElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Image from 'next/image';
import { formatCurrency } from '@/lib/formatters';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { userOrderExists } from '@/app/_actions/order';

interface CheckoutFormProps {
  clientSecret: string;
  product: Product;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

const CheckoutForm = ({ clientSecret, product }: CheckoutFormProps) => {
  return (
    <>
      <div className='max-w-5xl w-full mx-auto space-y-8'>
        <div className='flex gap-4 items-center'>
          <div className='flex-shrink-0 aspect-video relative w-1/3'>
            <Image src={product.imagePath} alt={product.name} fill />
          </div>
          <div>
            <div className='text-lg'>{formatCurrency(product.priceInCents)}</div>
            <h1 className='text-2xl font-bold'>{product.name}</h1>
            <div className='line-clamp-3 text-muted-foreground'>{product.description}</div>
          </div>
        </div>
        <Elements options={{ clientSecret }} stripe={stripePromise}>
          <Form priceInCents={product.priceInCents} productId={product.id} />
        </Elements>
      </div>
    </>
  );
};

export default CheckoutForm;

 function Form({ priceInCents, productId }: { priceInCents: number; productId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState('');

  const handleSubmit = async  (event: FormEvent) => {
    event.preventDefault();
    if (stripe === null || elements === null || email === '') return;
    setIsLoading(true);

    const order = await userOrderExists (email, productId);
    if (order) {
      setError("You have already purchased this product. Try downloading it from the My Order page")
      return;
    }
    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase_success`,
        },
      })
      .then(({ error }) => {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setError(error.message);
        } else {
          setError('An Unknown error accured!');
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {error && <CardDescription className='text-destructive'>{error}</CardDescription>}
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <div className='mt-4'>
            <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button className='w-full' size={'lg'} disabled={stripe === null || elements === null || isLoading}>
            {isLoading ? 'Purchasing...' : 'Purchase'}-{formatCurrency(priceInCents / 100)}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
