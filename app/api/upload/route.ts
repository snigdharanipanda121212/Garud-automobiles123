import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { verifyAdminRequest } from '@/lib/admin-auth';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg'
};

export async function POST(req: NextRequest) {
  // CRITICAL SECURITY: Only authenticated admin account can upload or update images
  const isAdmin = verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Only logged-in admin account can post or update images.' },
      { status: 401 }
    );
  }

  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });

    const contentType = req.headers.get('content-type') || '';

    // Handle Multipart Form Data (standard file upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No image file provided in request.' },
          { status: 400 }
        );
      }

      // 15MB file size limit
      if (file.size > 15 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: 'Image file exceeds maximum 15MB size limit.' },
          { status: 400 }
        );
      }

      const mimeType = file.type.toLowerCase();
      const ext = ALLOWED_MIME_TYPES[mimeType] || 'jpg';
      const cleanFileName = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, cleanFileName);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await fs.writeFile(filePath, buffer);

      const publicUrl = `/uploads/${cleanFileName}`;

      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename: cleanFileName,
        size: file.size,
        type: mimeType
      });
    }

    // Handle JSON payload with base64 data URL
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const dataUrl = body.dataUrl || body.image;

      if (!dataUrl || typeof dataUrl !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Invalid image data string provided.' },
          { status: 400 }
        );
      }

      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return NextResponse.json(
          { success: false, error: 'Invalid Base64 image format.' },
          { status: 400 }
        );
      }

      const mimeType = matches[1].toLowerCase();
      const ext = ALLOWED_MIME_TYPES[mimeType] || 'jpg';
      const buffer = Buffer.from(matches[2], 'base64');

      const cleanFileName = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, cleanFileName);

      await fs.writeFile(filePath, buffer);

      const publicUrl = `/uploads/${cleanFileName}`;

      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename: cleanFileName
      });
    }

    return NextResponse.json(
      { success: false, error: 'Unsupported Content-Type. Please send multipart/form-data or JSON.' },
      { status: 400 }
    );
  } catch (err: any) {
    console.error('Image upload failed:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Server image upload processing failed.' },
      { status: 500 }
    );
  }
}
