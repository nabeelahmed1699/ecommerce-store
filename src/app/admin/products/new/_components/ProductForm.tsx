'use client';

import React, { useActionState, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/formatters';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { addProduct, editProduct } from '@/app/admin/_actions/products';
import { useFormStatus } from 'react-dom';
import { Product } from '@prisma/client';
import Image from 'next/image';

interface ProductFormProps {
  product: Product | null;
}

const ProductForm = ({ product }: ProductFormProps) => {
  const [priceInCents, setPriceInCents] = useState<number | undefined>(product?.priceInCents);
  const [errors, action] = useActionState(product === null ? addProduct : editProduct.bind(null, product.id), {});
  return (
    <form action={action} className='space-y-8'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input id='name' name='name' type='text' required defaultValue={product?.name} />
        <p className='text-destructive'>{errors.name ? errors.name : ''}</p>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='priceInCents'>Price Int Cents</Label>
        <Input
          id='priceInCents'
          name='priceInCents'
          type='number'
          value={priceInCents}
          onChange={(e) => setPriceInCents(Number(e.target.value) || undefined)}
          defaultValue={product?.priceInCents}
          required
        />
        <div className='text-muted-foreground'>{formatCurrency((priceInCents || 0) / 100)}</div>
        <p className='text-destructive'>{errors.priceInCents ? errors.priceInCents : ''}</p>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='description'>Description</Label>
        <Textarea id='description' name='description' required defaultValue={product?.description} />
        <p className='text-destructive'>{errors.description ? errors.description : ''}</p>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='file'>File</Label>
        <Input id='file' name='file' type='file' required={product === null} />
        {product !== null && <span className='text-sm text-muted-foreground'>{product.filePath}</span>}
        <p className='text-destructive'>{errors.file ? errors.file : ''}</p>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='image'>Image</Label>
        <Input id='image' name='image' type='file' required={product === null} />
        {product !== null && <Image src={product.imagePath} alt='Product Image' height={400} width={400} />}
        <p className='text-destructive'>{errors.image ? errors.image : ''}</p>
      </div>
      <SubmitButton />
    </form>
  );
};

export default ProductForm;

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type='submit'>{pending ? 'Saving...' : 'Save'}</Button>;
}
