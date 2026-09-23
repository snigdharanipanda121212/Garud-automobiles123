import { NextRequest, NextResponse } from 'next/server';
import { getServerVehicles, saveServerVehicle, deleteServerVehicle } from '@/lib/server-store';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { Vehicle } from '@/lib/store';

// GET: Publicly accessible by all website visitors
export async function GET() {
  try {
    const vehicles = await getServerVehicles();
    return NextResponse.json({ success: true, vehicles });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch vehicles catalog.' },
      { status: 500 }
    );
  }
}

// POST: Add or save vehicle. PROTECTED - Only Admin account
export async function POST(req: NextRequest) {
  const isAdmin = verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Only logged-in admin account can add or post vehicle images.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const vehicle: Vehicle = body.vehicle || body;

    if (!vehicle || !vehicle.name || !vehicle.category) {
      return NextResponse.json(
        { success: false, error: 'Vehicle name and category are required.' },
        { status: 400 }
      );
    }

    // Default id if not provided
    if (!vehicle.id) {
      vehicle.id = 'ev-' + Date.now().toString(36);
    }

    const updated = await saveServerVehicle(vehicle);
    return NextResponse.json({ success: true, vehicles: updated, vehicle });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to save vehicle.' },
      { status: 500 }
    );
  }
}

// PUT: Update vehicle. PROTECTED - Only Admin account
export async function PUT(req: NextRequest) {
  const isAdmin = verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Only logged-in admin account can update vehicles or images.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const vehicle: Vehicle = body.vehicle || body;

    if (!vehicle || !vehicle.id) {
      return NextResponse.json(
        { success: false, error: 'Vehicle ID is required for update.' },
        { status: 400 }
      );
    }

    const updated = await saveServerVehicle(vehicle);
    return NextResponse.json({ success: true, vehicles: updated, vehicle });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to update vehicle.' },
      { status: 500 }
    );
  }
}

// DELETE: Remove vehicle. PROTECTED - Only Admin account
export async function DELETE(req: NextRequest) {
  const isAdmin = verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Only logged-in admin account can remove vehicles.' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Vehicle ID parameter is required.' },
        { status: 400 }
      );
    }

    const updated = await deleteServerVehicle(id);
    return NextResponse.json({ success: true, vehicles: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to delete vehicle.' },
      { status: 500 }
    );
  }
}
