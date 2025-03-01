import React from 'react';
import PageHeader from '../../../_components/PageHeader';
import ProductForm from '../../new/_components/ProductForm';
import db from '@/db/db';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

const EditProductPage = async ({ params }: EditProductPageProps) => {
  const { id } = await params;
  console.log(id);
  const product = await db.product.findUnique({ where: { id } });
  console.log(product);
  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} />
    </>
  );
};

export default EditProductPage;
