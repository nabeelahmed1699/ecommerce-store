import Nav, { NavLink } from '@/components/Nav';

export const dynamic = 'force-dynamic';

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Nav className='justify-between'>
        <div className='flex gap-4'>
          <NavLink href={'/'}>Home</NavLink>
          <NavLink href={'/products'}>Products</NavLink>
          <NavLink href={'/orders'}>My Orders</NavLink>
        </div>
        <a href='https://github.com/nabeelahmed1699/ecommerce-store' target='_blank' rel=''className='p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground'>
          Github
        </a>
      </Nav>
      <div className='container mx-auto p-6'>{children}</div>;
    </>
  );
};

export default Layout;
