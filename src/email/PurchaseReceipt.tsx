import React, { FC } from 'react';
import { Body, Container, Head, Heading, Html, Preview, Tailwind } from '@react-email/components';
import { Order, Product } from '@prisma/client';
import OrderInformation from './_components/OrderInformation';

interface PurchaseReceiptProps {
  product: Partial<Product>;
  order: Partial<Order>;
  downloadVerificationId: string;
}

interface PurchaseReceiptComponent extends FC<PurchaseReceiptProps> {
  PreviewProps?: PurchaseReceiptProps;
}

const PurchaseReceipt: PurchaseReceiptComponent = ({ product, order }: PurchaseReceiptProps) => {
  return (
    <Html>
      <Preview>Dowload {product.name ? product?.name : ''} and view reciept</Preview>
      <Tailwind>
        <Head />
        <Body className='font-sans bg-white'>
          <Container className='max-w-2xl mx-auto p-4'>
            <Heading>Purchase Reciept</Heading>
            <OrderInformation Order={order} product={product} downloadVerificationId='' />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

PurchaseReceipt.PreviewProps = {
  product: {
    name: 'Product Name',
    id: '1',
    description: 'Product Description',
    imagePath: '/products/9a8d5d4a-e950-4138-a1d8-71ae2ee45259-wallpaperflare.com_wallpaper (1).jpg',
  },
  order: {
    id: '1',
    createdAt: new Date(),
    priceInCents: 1000,
  },
  downloadVerificationId: '1',
} satisfies PurchaseReceiptProps;

export default PurchaseReceipt;
