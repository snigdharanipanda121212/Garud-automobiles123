import fs from 'fs/promises';
import path from 'path';
import { Vehicle, SEED_VEHICLES } from './store';

export interface GalleryItem {
  id: string;
  title: string;
  caption?: string;
  imageUrl: string;
  category: 'Showroom' | 'Customer Delivery' | 'Vehicle Arrival' | 'Service Center' | 'Customization';
  createdDate: string;
  postedBy?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const VEHICLES_FILE = path.join(DATA_DIR, 'vehicles.json');
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json');

export const SEED_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Garud Automobiles Main Showroom Entrance',
    caption: 'Official dealership facility at Bijipur Main Rd, near Vegetables Market, Sundar Nagar, Brahmapur.',
    imageUrl: '/vehicles/erickshaw_passenger.jpg',
    category: 'Showroom',
    createdDate: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    postedBy: 'Admin'
  },
  {
    id: 'gal-2',
    title: 'Customer Delivery: Garud Cargo Loader 750',
    caption: 'Handed over high-torque commercial cargo loader to local wholesale distributor in Ganjam.',
    imageUrl: '/vehicles/cargo_loader_blue.jpg',
    category: 'Customer Delivery',
    createdDate: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    postedBy: 'Admin'
  },
  {
    id: 'gal-3',
    title: 'Custom Fabricated Mobile Food Van',
    caption: 'Custom stainless-steel prep counters and 220V inverter system deployed for local vendor.',
    imageUrl: '/vehicles/ev_food_van.jpg',
    category: 'Customization',
    createdDate: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    postedBy: 'Admin'
  },
  {
    id: 'gal-4',
    title: 'Smart Battery Diagnostics & Maintenance Bay',
    caption: 'Certified technicians performing high-precision BMS and lithium active cell tests.',
    imageUrl: '/vehicles/ev_lithium_pack.jpg',
    category: 'Service Center',
    createdDate: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    postedBy: 'Admin'
  }
];

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // directory exists or created
  }
}

// In-memory caches to prevent redundant disk reads on hot paths
let vehiclesCache: Vehicle[] | null = null;
let galleryCache: GalleryItem[] | null = null;

export async function getServerVehicles(): Promise<Vehicle[]> {
  if (vehiclesCache) return vehiclesCache;
  await ensureDataDir();
  try {
    const raw = await fs.readFile(VEHICLES_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      vehiclesCache = parsed;
      return parsed;
    }
  } catch {
    // If file does not exist or corrupted, write seed vehicles
  }

  vehiclesCache = SEED_VEHICLES;
  try {
    await fs.writeFile(VEHICLES_FILE, JSON.stringify(SEED_VEHICLES, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to seed vehicles file:', err);
  }
  return SEED_VEHICLES;
}

export async function saveServerVehicle(vehicle: Vehicle): Promise<Vehicle[]> {
  const current = await getServerVehicles();
  const index = current.findIndex(v => v.id === vehicle.id);
  if (index > -1) {
    current[index] = vehicle;
  } else {
    current.push(vehicle);
  }
  vehiclesCache = [...current];
  await ensureDataDir();
  await fs.writeFile(VEHICLES_FILE, JSON.stringify(current, null, 2), 'utf-8');
  return current;
}

export async function deleteServerVehicle(id: string): Promise<Vehicle[]> {
  const current = await getServerVehicles();
  const filtered = current.filter(v => v.id !== id);
  vehiclesCache = [...filtered];
  await ensureDataDir();
  await fs.writeFile(VEHICLES_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return filtered;
}

export async function getServerGallery(): Promise<GalleryItem[]> {
  if (galleryCache) return galleryCache;
  await ensureDataDir();
  try {
    const raw = await fs.readFile(GALLERY_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      galleryCache = parsed;
      return parsed;
    }
  } catch {
    // If file doesn't exist, initialize with seed gallery
  }

  galleryCache = SEED_GALLERY;
  try {
    await fs.writeFile(GALLERY_FILE, JSON.stringify(SEED_GALLERY, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to seed gallery file:', err);
  }
  return SEED_GALLERY;
}

export async function saveServerGalleryItem(item: GalleryItem): Promise<GalleryItem[]> {
  const current = await getServerGallery();
  const index = current.findIndex(g => g.id === item.id);
  if (index > -1) {
    current[index] = item;
  } else {
    current.unshift(item); // Newest first
  }
  galleryCache = [...current];
  await ensureDataDir();
  await fs.writeFile(GALLERY_FILE, JSON.stringify(current, null, 2), 'utf-8');
  return current;
}

export async function deleteServerGalleryItem(id: string): Promise<GalleryItem[]> {
  const current = await getServerGallery();
  const filtered = current.filter(g => g.id !== id);
  galleryCache = [...filtered];
  await ensureDataDir();
  await fs.writeFile(GALLERY_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return filtered;
}
