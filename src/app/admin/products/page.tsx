import React from 'react';
import PageHeader from '../_components/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import db from '@/db/db';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import { CheckCircle2, EllipsisVertical, XCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ActiveToggleDropdownItem, DeleteDropdownItem } from './_componentws/ProductActions';

const AdminProductsPage = () => {
  return (
    <>
      <div className='flex justify-between items-center gap-4'>
        <PageHeader>Products</PageHeader>
        <Button asChild>
          <Link href={'/admin/products/new'}>Add Product</Link>
        </Button>
      </div>
      <ProductsTable />
    </>
  );
};

export default AdminProductsPage;

function getProducts() {
  return db.product.findMany({
    select: {
      name: true,
      id: true,
      priceInCents: true,
      isAvailabelForPurchase: true,
      _count: { select: { orders: true } },
    },
    orderBy: { name: 'asc' },
  });
}
async function ProductsTable() {
  const products = await getProducts();
  if (products.length <= 0) return <p className='text-lg'>No products found</p>;
  return (
    <Table>
      <TableCaption></TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>
            <span className='sr-only'>Available for Purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Order</TableHead>
          <TableHead>
            <span className='sr-only'>Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => {
          return (
            <TableRow key={product.id}>
              <TableCell>
                {product.isAvailabelForPurchase ? (
                  <>
                    <CheckCircle2 />
                    <span className='sr-only'>Availabel</span>
                  </>
                ) : (
                  <>
                    <XCircle className='stroke-destructive'/>
                    <span className='sr-only'>Unavailable</span>
                  </>
                )}
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{formatCurrency(product.priceInCents)}</TableCell>
              <TableCell>{formatNumber(product._count.orders)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <a download href={`/admin/products/${product.id}/download`}>
                        Download
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <ActiveToggleDropdownItem id={product.id} isAvailableForPurchase={product.isAvailabelForPurchase} />
                    <DropdownMenuSeparator />
                    <DeleteDropdownItem id={product.id} disabled={product._count.orders > 0} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
