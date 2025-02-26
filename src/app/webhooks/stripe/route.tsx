import db from '@/db/db';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import React from 'react';
import PurchaseReceipt from '@/email/PurchaseReceipt';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const event = stripe.webhooks.constructEvent(
    payload,
    req.headers.get('stripe-signature') as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  if (event.type === 'charge.succeeded') {
    const charge = event.data.object;
    const productId = charge.metadata.productId;
    const email = charge.billing_details.email;
    const pricePaidInCents = charge.amount;

    const product = await db.product.findUnique({ where: { id: productId } });
    if (product === null || email === null) return new NextResponse('Bad Request', { status: 400 });

    const userFields: Prisma.UserCreateInput = {
      email,
      orders: { create: [{ productId, priceInCents: pricePaidInCents, email }] },
    };

    const { orders } = await db.user.upsert({
      where: { email },
      create: userFields,
      update: userFields,
      select: { orders: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    const downloadVerification = await db.downlooadVerification.create({
      data: { productId, expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24) },
    });
    

    // Send the email
    await resend.emails.send({
      from: `Support <${process.env.RESEND_EMAIL}>`,
      to: email,
      subject: 'Order Confirmation',
      react: <PurchaseReceipt product={product} order={orders[0]} downloadVerificationId={downloadVerification.id} />, // Pass HTML content instead of React component
    });
  }

  return new NextResponse('OK');
}
