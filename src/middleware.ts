import { NextRequest, NextResponse } from 'next/server';
// import { isValidPassword } from './lib/isValidPassword';

export async function middleware(req: NextRequest) {
  const isAuthenticated = await checkAuthentication(req);

  if (!isAuthenticated) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic' },
    });
  }
}

async function checkAuthentication(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  if (authHeader === null) {
    return false;
  }
  const [username, password] = getCredentials(authHeader);
  console.log("entered password===>", username, password);
  console.log("process.env.ADMIN_USERNAME===>", process.env.ADMIN_USERNAME);
  console.log("process.env.ADMIN_PASSWORD===>", process.env.ADMIN_PASSWORD);
  return username === process.env.ADMIN_USERNAME && password, process.env.ADMIN_PASSWORD
}

function getCredentials(authHeader: string) {
  return Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
}

export const config = {
  matcher: '/admin/:path*',
};
