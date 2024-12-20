import { NextRequest, NextResponse } from 'next/server';
import { isValidPassword } from './lib/isValidPassword';

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
  console.log(username, password)
  return username === process.env.ADMIN_USERNAME && await isValidPassword(password, process.env.HASHED_ADMIN_PASSWORD as string)
}

function getCredentials(authHeader: string) {
  return Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
}

export const config = {
  matcher: '/admin/:path*',
};
