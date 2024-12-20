import db from '@/db/db';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

import fs from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  // Fetch product details from the database
  const product = await db.product.findUnique({
    where: { id },
    select: { name: true, filePath: true },
  });

  // If the product is not found, return a 404
  if (product === null) return notFound();

  try {
    // Get file metadata
    const { size } = await fs.stat(product.filePath);
    const file = await fs.readFile(product.filePath);
    const extension = path.extname(product.filePath).slice(1); // Extract file extension

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
      'Content-Disposition': `attachment; filename="${product.name}.${extension}"`,
      'Content-Length': size.toString(),
    });

    // Respond with the file and appropriate headers
    return new NextResponse(file, { headers });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
