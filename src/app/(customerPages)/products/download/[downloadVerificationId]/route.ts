import db from '@/db/db';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface Params {
  params: { downloadVerificationId: string };
}

export async function GET(req: NextRequest, { params }: Params) {
  console.log("req",params)

  try {
    const { downloadVerificationId } = await params; 
    const data = await db.downlooadVerification.findUnique({
      where: { id: downloadVerificationId, expiredAt: { gt: new Date() } },
      select: { product: { select: { filePath: true, name: true } } },
    });

    if (!data || !data.product) {
      return NextResponse.redirect(new URL('/products/download/expired', req.url));
    }

    const { filePath, name } = data.product;

    // Get file metadata
    const { size } = await fs.stat(filePath);
    const file = await fs.readFile(filePath);
    const extension = path.extname(filePath).slice(1); // Extract file extension

    // Define appropriate MIME type
    const mimeType =
      {
        pdf: 'application/pdf',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        txt: 'text/plain',
        // Add more MIME types as needed
      }[extension] || 'application/octet-stream';

    // Set headers for file download or preview
    const headers = new Headers({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${name}.${extension}"`,
      'Content-Length': size.toString(),
    });

    // Respond with the file and appropriate headers
    return new NextResponse(file, { headers });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
