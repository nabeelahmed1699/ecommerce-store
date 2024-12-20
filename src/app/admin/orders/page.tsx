import db from '@/db/db';
import React from 'react';
import PageHeader from '../_components/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVerticalIcon } from 'lucide-react';
import { DeleteDropdownItem } from './_components/OrdersActions';

async function getOrders() {
  return db.order.findMany({
    select: {
      id: true,
      priceInCents: true,
      product: { select: { name: true } },
      user: { select: { email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

const Orders = () => {
  return (
    <>
      <PageHeader>Customers</PageHeader>
      <OrdersTable />
    </>
  );
};

export default Orders;

async function OrdersTable() {
  const orders = await getOrders();
  console.log(orders);
  if (orders.length === 0) return <p>No Sales found</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Price Paid</TableHead>
          <TableHead className='w-0'>
            <span className='sr-only'>Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          return (
            <TableRow key={order.id}>
              <TableCell>{order.product.name}</TableCell>
              <TableCell>{order.user.email}</TableCell>
              <TableCell>{formatCurrency(order.priceInCents / 100)}</TableCell>
              <TableCell className='text-center'>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVerticalIcon />
                    <span className='sr-only'>Actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DeleteDropdownItem disabled={false} id={order.id} />
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
