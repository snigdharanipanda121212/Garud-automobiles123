'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Eye, X, Calendar, CheckCircle2 } from 'lucide-react';
import { getGallery, fetchGallery, GalleryItem } from '@/lib/store';

interface LiveGallerySectionProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  showViewAllButton?: boolean;
}

export default function LiveGallerySection({
  title = 'Live Showroom & Delivery Stream',
  subtitle = 'Official live photos, customer handovers, and vehicle arrivals posted directly from our Bijipur, Brahmapur dealership.',
  limit,
  showViewAllButton = false,
}: LiveGallerySectionProps) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  useEffect(() => {
    // Initial load from local cache
    const initial = getGallery();
    setGalleryItems(initial);

    // Sync from server so any admin updates are live for everyone
    fetchGallery().then((items) => {
      if (items && items.length > 0) {
        setGalleryItems(items);
      }
    });
  }, []);

  const categories = ['All', 'Showroom', 'Customer Delivery', 'Vehicle Arrival', 'Service Center', 'Customization'];

  const filteredItems = galleryItems.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const displayItems = limit ? filteredItems.slice(0, limit) : filteredItems;

  return (
    <section id="gallery-section" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-3 h-3" />
              Verified Dealership Stream
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
              ● Live Updates
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            {title}
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
            {subtitle}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-black font-extrabold shadow-md'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-850 border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Photos */}
      {displayItems.length === 0 ? (
        <div className="bg-zinc-950/40 border border-dashed border-zinc-900 rounded-3xl p-12 text-center">
          <Camera className="w-10 h-10 mx-auto text-zinc-700 mb-3" />
          <p className="text-zinc-400 text-sm font-semibold">No photos found in this category.</p>
          <button
            onClick={() => setSelectedCategory('All')}
            className="text-xs text-amber-500 font-mono mt-2 hover:underline cursor-pointer font-bold"
          >
            Show all photos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="group bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-amber-500/5"
            >
              <div>
                {/* Photo Media Container */}
                <div className="relative aspect-[16/10] bg-zinc-900 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-black/80 backdrop-blur-md border border-amber-500/40 text-amber-400 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>

                  {/* Click to Zoom Overlay Icon */}
                  <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur text-white text-[11px] font-mono px-3 py-1.5 rounded-lg border border-zinc-700 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow">
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>View Photo</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <h3 className="text-white font-bold text-base group-hover:text-amber-400 transition leading-snug">
                    {item.title}
                  </h3>

                  {item.caption && (
                    <p className="text-zinc-400 text-xs leading-relaxed font-sans line-clamp-2">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Meta Footer */}
              <div className="px-5 pb-4 pt-2 border-t border-zinc-900/80 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-zinc-600" />
                  {new Date(item.createdDate).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  Dealership Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show View All button if on homepage with a limit */}
      {showViewAllButton && galleryItems.length > (limit || 6) && (
        <div className="mt-12 text-center">
          <a
            href="/gallery"
            className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-amber-400 hover:text-amber-300 font-mono text-xs px-6 py-3.5 rounded-xl border border-zinc-800 transition shadow"
          >
            <span>Browse Complete Live Photo Stream ({galleryItems.length} Photos)</span>
            <Camera className="w-3.5 h-3.5 text-amber-500" />
          </a>
        </div>
      )}

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-zinc-950 border border-zinc-850 rounded-3xl overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col"
          >
            {/* Close button */}
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute right-4 top-4 z-20 bg-black/80 hover:bg-black text-white p-2 rounded-full border border-zinc-700 transition cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Canvas */}
            <div className="relative aspect-[16/10] w-full bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Description Sheet */}
            <div className="p-6 sm:p-7 space-y-3 bg-zinc-950 border-t border-zinc-900">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase">
                  {activePhoto.category}
                </span>
                <span className="text-zinc-500 text-xs font-mono">
                  Posted: {new Date(activePhoto.createdDate).toLocaleDateString()}
                </span>
                <span className="text-emerald-400 text-xs font-mono font-bold ml-auto flex items-center gap-1">
                  ● Verified Official Garud Automobiles Update
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-white tracking-tight">
                {activePhoto.title}
              </h3>

              {activePhoto.caption && (
                <p className="text-zinc-300 text-sm leading-relaxed font-sans">
                  {activePhoto.caption}
                </p>
              )}

              <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-500 font-mono border-t border-zinc-900">
                <span>Location: Bijipur Main Road Showroom & Service Yard, Brahmapur</span>
                <button
                  onClick={() => setActivePhoto(null)}
                  className="bg-zinc-900 hover:bg-zinc-850 text-white px-4 py-1.5 rounded-lg border border-zinc-800 transition cursor-pointer text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
