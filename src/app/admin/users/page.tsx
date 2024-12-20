import db from '@/db/db';
import React from 'react';
import PageHeader from '../_components/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVerticalIcon } from 'lucide-react';
import { DeleteDropdownItem } from './_components/UsersActions';

async function getUsers() {
  return db.user.findMany({
    select: {
      id: true,
      email: true,
      orders: { select: { priceInCents: true } },
    },
  });
}
const Users = () => {
  return (
    <>
      <PageHeader>Customers</PageHeader>
      <UsersTable />
    </>
  );
};

export default Users;

async function UsersTable() {
  const users = await getUsers();
  console.log(users)
  if (users.length === 0) return <p>No Customer found</p>;

  const totalAmount = users.reduce((acc, user) => {
    return acc + user.orders.reduce((acc, order) => acc + order.priceInCents, 0);
  }, 0);
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Value</TableHead>
          <TableHead className='w-0'>
            <span className='sr-only'>Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          return <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{formatNumber(user.orders.length)}</TableCell>
            <TableCell>{formatCurrency(totalAmount)}</TableCell>
            <TableCell className='text-center'>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVerticalIcon />
                  <span className='sr-only'>Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DeleteDropdownItem disabled={false} id={user.id}/>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>;
        })}
      </TableBody>
    </Table>
  );
}
