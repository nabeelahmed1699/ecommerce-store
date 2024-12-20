import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import db from '@/db/db';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import React from 'react';

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { priceInCents: true },
    _count: true,
  });
  return {
    amount: (data._sum.priceInCents || 0) / 100,
    noOfSales: data._count,
  };
}

async function getUsersData() {
  const [usersCount, orderData] = await Promise.all([db.user.count(), db.order.aggregate({ _sum: { priceInCents: true } })]);

  return {
    usersCount,
    averageValuePerUser: usersCount === 0 ? 0 : (orderData._sum.priceInCents || 0) / usersCount / 100,
  };
}

async function getProductData() {
  const [activeProducts, inactiveProducts] = await Promise.all([
    db.product.count({ where: { isAvailabelForPurchase: true } }),
    db.product.count({ where: { isAvailabelForPurchase: false } }),
  ]);
  return { activeProducts, inactiveProducts };
}
const AdminDashboard = async () => {
  const [salesData, usersData, productsData] = await Promise.all([getSalesData(), getUsersData(),getProductData()]);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      <DashboardCard title='Sales' subtitle={`${formatNumber(salesData.noOfSales)} Orders`} body={formatCurrency(salesData.noOfSales)} />
      <DashboardCard
        title='Customers'
        subtitle={`${formatCurrency(usersData.averageValuePerUser)} Average`}
        body={formatNumber(usersData.usersCount)}
      />
      <DashboardCard
        title='Active Products'
        subtitle={`${formatNumber(productsData.inactiveProducts)} Inactive`}
        body={formatNumber(productsData.activeProducts)}
      />
    </div>
  );
};

export default AdminDashboard;

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};

function DashboardCard(props: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{props.body}</p>
      </CardContent>
    </Card>
  );
}
