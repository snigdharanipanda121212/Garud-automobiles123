import { NextRequest, NextResponse } from 'next/server';
import { getServerGallery, saveServerGalleryItem, deleteServerGalleryItem, GalleryItem } from '@/lib/server-store';
import { verifyAdminRequest } from '@/lib/admin-auth';

// GET: Publicly accessible by all website visitors - everyone can see!
export async function GET() {
  try {
    const gallery = await getServerGallery();
    return NextResponse.json({ success: true, gallery });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch dealership gallery photos.' },
      { status: 500 }
    );
  }
}

// POST: Post new photo or update photo. PROTECTED - Only Admin account
export async function POST(req: NextRequest) {
  const isAdmin = verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Only logged-in admin account can post photos to the website.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const item: GalleryItem = body.item || body;

    if (!item || !item.imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL or uploaded image is required to post.' },
        { status: 400 }
      );
    }

    if (!item.title) {
      return NextResponse.json(
        { success: false, error: 'Photo title or caption is required.' },
        { status: 400 }
      );
    }

    const fullItem: GalleryItem = {
      id: item.id || 'gal-' + Date.now().toString(36),
      title: item.title,
      caption: item.caption || '',
      imageUrl: item.imageUrl,
      category: item.category || 'Showroom',
      createdDate: item.createdDate || new Date().toISOString(),
      postedBy: 'Dealership Admin'
    };

    const updated = await saveServerGalleryItem(fullItem);
    return NextResponse.json({ success: true, gallery: updated, item: fullItem });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to post gallery image.' },
      { status: 500 }
    );
  }
}

// DELETE: Delete photo. PROTECTED - Only Admin account
export async function DELETE(req: NextRequest) {
  const isAdmin = verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Only logged-in admin account can delete photos from the website.' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Photo ID parameter is required.' },
        { status: 400 }
      );
    }

    const updated = await deleteServerGalleryItem(id);
    return NextResponse.json({ success: true, gallery: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to remove gallery photo.' },
      { status: 500 }
    );
  }
}
