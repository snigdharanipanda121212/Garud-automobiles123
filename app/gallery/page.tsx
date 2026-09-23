'use client';

import React from 'react';
import LiveGallerySection from '@/components/LiveGallerySection';
import { Camera, ShieldCheck, MapPin, Phone, MessageSquare } from 'lucide-react';
import { useEnquiry } from '@/hooks/use-enquiry';

export default function GalleryPage() {
  const { openEnquiry } = useEnquiry();

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Header */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-zinc-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            <span>Official Showroom Updates</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
            Dealership Photos & Delivery Stream
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
            Explore live photo updates from our showroom floor at Sundar Nagar, customer deliveries across Ganjam district, custom cargo fabrication work, and newly arrived EV models.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-zinc-500">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              Bijipur Main Rd, Brahmapur
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              100% Genuine Dealership Photos
            </span>
          </div>
        </div>
      </section>

      {/* Main Live Gallery */}
      <LiveGallerySection
        title="Live Photo Stream"
        subtitle="All photos are updated in real-time by the authorized dealership management."
      />

      {/* Direct Contact CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          See a Model You Like in Our Photos?
        </h2>
        <p className="text-zinc-400 text-sm max-w-xl mx-auto">
          Contact our team to check current depot availability, discuss custom dimensions, or schedule an in-person test drive.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => openEnquiry('Photo Gallery Enquiry')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold px-7 py-3.5 rounded-xl text-xs uppercase tracking-wider font-mono cursor-pointer transition hover:brightness-110"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send Vehicle Enquiry</span>
          </button>
          <a
            href="tel:+918950977904"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-850 text-amber-400 font-mono font-bold px-7 py-3.5 rounded-xl border border-zinc-800 text-xs uppercase tracking-wider transition"
          >
            <Phone className="w-4 h-4" />
            <span>Call +91 89509 77904</span>
          </a>
        </div>
      </section>
    </div>
  );
}
