import { formatCurrency, formatDate } from '@/lib/formatters';
import { Order, Product } from '@prisma/client';
import { Button, Column, Img, Row, Section, Text } from '@react-email/components';
import React from 'react';

interface OrderInformationProps {
  Order: Partial<Order>;
  product: Partial<Product>;
  downloadVerificationId: string;
}
const OrderInformation = ({ Order, product, downloadVerificationId }: OrderInformationProps) => {
  const url = 'http://localhost:3000';
  return (
    <>
      <Section>
        <Row>
          <Column>
            <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap'>Order ID</Text>
            <Text className='mb-0 mr-4'>{Order.id}</Text>
          </Column>
          <Column>
            <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap'>Purchase On</Text>
            <Text className='mb-0 mr-4'>{Order.createdAt ? formatDate(Order.createdAt) : ''}</Text>
          </Column>
          <Column>
            <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap'>Price Paid</Text>
            <Text className='mb-0 mr-4'>{Order.priceInCents ? formatCurrency(Order.priceInCents) : 0}</Text>
          </Column>
        </Row>
      </Section>
      <Section className='border border-solid border-gray-500 rounded-lg p-4 md:p-6 py-4'>
        <Img src={`${url}${product.imagePath}`} alt='Product Image' width={'100%'} />
        <Row className='mt-8'>
          <Column className='align-bottom'>
            <Text className='text-lg font-bold m-0 mr-4'>{product.name}</Text>
          </Column>
          <Column align='right'>
            <Button href={`${url}/products/download/${downloadVerificationId}`} className='bg-black text-white px-6 py-4 rounded text-lg'>
              Download
            </Button>
          </Column>
          <Row>
            <Column>
              <Text className='text-gray-500 mb-0'>{product.description}</Text>
            </Column>
          </Row>
        </Row>
      </Section>
    </>
  );
};

export default OrderInformation;
