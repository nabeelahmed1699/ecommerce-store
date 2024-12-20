import { ProductCardSkeleton } from '@/components/ProductCard';
import React, { Suspense } from 'react';
import { ProductSuspence } from '../page';
import db from '@/db/db';
import { cache } from '@/lib/cache';

const getProducts = cache(() => {
  return db.product.findMany({ where: { isAvailabelForPurchase: true }, orderBy: { name: 'asc' } });
}, ['/products', 'getProducts']);

const Products = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      <Suspense
        fallback={
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        }
      >
        <ProductSuspence productFetcher={getProducts} />
      </Suspense>
    </div>
  );
};

export default Products;
