import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import db from '@/db/db';
import { cache } from '@/lib/cache';
import { Product } from '@prisma/client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React, { Suspense } from 'react';

const getPopularProducts = cache(
  () => {
    return db.product.findMany({
      where: { isAvailabelForPurchase: true },
      orderBy: { orders: { _count: 'desc' } },
    });
  },
  ['/', 'getPopularProducts'],
  { revalidate: 60 * 60 * 24 }
);

const getNewestProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailabelForPurchase: true },
    orderBy: { createdAt: 'desc' },
  });
}, ['/', 'getNewestProducts']);

const Home = async () => {
  return (
    <main className='space-y-12'>
      <ProductGridSection productFetcher={getPopularProducts} title='Most Popoular' />
      <ProductGridSection productFetcher={getNewestProducts} title='Newest' />
    </main>
  );
};

export default Home;

interface ProductGridSectionProps {
  productFetcher: () => Promise<Product[]>;
  title: string;
}

function ProductGridSection({ title, productFetcher }: ProductGridSectionProps) {
  return (
    <div className='space-y-4'>
      <div className='flex gap-4'>
        <h2 className='text-3xl font-bold'>{title}</h2>
        <Button variant={'outline'} asChild>
          <Link href={'/products'} className='space-x-2'>
            <span>View All</span>
            <ArrowRight className='size-4' />
          </Link>
        </Button>
      </div>
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
            </>
          }
        >
          <ProductSuspence productFetcher={productFetcher} />
        </Suspense>
      </div>
    </div>
  );
}

export async function ProductSuspence({ productFetcher }: { productFetcher: () => Promise<Product[]> }) {
  return (await productFetcher()).map((product) => {
    return <ProductCard key={product.id} {...product} />;
  });
}
