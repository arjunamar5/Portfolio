"use client";

import React, { useEffect, useState } from "react";
import { ImageLightbox } from "./ImageLightbox";

function Chrome({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-line bg-panel-2/60 shrink-0">
      <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
      <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
      <span className="ml-2 text-xs text-faint truncate">{label}</span>
    </div>
  );
}

/** Skeleton content — an honest abstraction, used only when no real screenshot exists. */
function SkeletonBody({ accent }: { accent: string }) {
  const bars = [40, 65, 50, 85, 70, 55, 90];
  return (
    <div className="p-5 space-y-4" style={{ ["--accent" as any]: accent }}>
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-lg bg-panel-2 p-3 space-y-2">
            <div className="h-1.5 w-8 rounded-full bg-bone/15" />
            <div className="h-2.5 w-12 rounded-full bg-bone/25" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-panel-2/70 p-3 space-y-2.5">
          <div className="h-1.5 w-14 rounded-full bg-bone/15 mb-1" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-2 rounded-full bg-bone/10" style={{ width: `${85 - i * 12}%` }} />
          ))}
        </div>

        <div className="rounded-lg bg-panel-2/70 p-3 flex flex-col">
          <div className="h-1.5 w-14 rounded-full bg-bone/15 mb-3" />
          <div className="flex-1 flex items-end gap-1.5">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm"
                style={{ height: `${h}%`, background: "color-mix(in srgb, var(--accent) 55%, transparent)" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface FrameSpec {
  src: string;
  label: string;
  className: string;
  crisp?: boolean;
}

function Frame({ src, label, className, crisp }: FrameSpec) {
  return (
    <div
      className={`absolute rounded-2xl bg-panel overflow-hidden ${
        crisp ? `${glowClass} animate-float-slow` : "border border-line-strong blur-[1px]"
      } ${className}`}
    >
      <Chrome label={label} />
      <div className="h-[calc(100%-40px)]">
        <img src={src} alt={`${label} screenshot`} className="w-full h-full object-cover object-top" />
      </div>
    </div>
  );
}

/**
 * Wraps a preview mockup to make it feel openable: click/Enter opens the
 * full-size lightbox. The neon glow border on the mockup itself (see
 * `glowClass` below) intensifies on hover as the only affordance — no
 * overlay or label, so the screenshot stays fully visible.
 */
function GalleryTrigger({
  onOpen,
  label,
  children,
}: {
  onOpen: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      aria-label={label}
      className="group/gallery relative cursor-pointer rounded-2xl focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent focus-visible:outline-offset-4"
    >
      {children}
    </div>
  );
}

/** Blue neon ring that intensifies on hover — the shared "openable screenshot" look. */
const glowClass = "shadow-glow-sm group-hover/gallery:shadow-glow transition-shadow duration-300";

/**
 * A single full-clarity frame that cross-fades between two (or more) real
 * screenshots on a timer — used instead of the blurred fan-of-frames
 * treatment when we only have a couple of shots but still want to show
 * more than one. The frame's aspect ratio is matched to the screenshots'
 * own dimensions so nothing gets cropped or upscaled soft.
 */
function ImageCycle({
  images,
  title,
  ratio,
  intervalMs = 5000,
}: {
  images: string[];
  title: string;
  ratio: string;
  intervalMs?: number;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % images.length), intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  return (
    <div className={`relative rounded-2xl bg-panel overflow-hidden animate-float-slow ${glowClass}`}>
      <Chrome label={`${title} Preview`} />
      <div className="relative" style={{ aspectRatio: ratio }}>
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${title} product screenshot ${i + 1} of ${images.length}`}
            className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000 ease-in-out"
            style={{ opacity: i === active ? 1 : 0 }}
          />
        ))}

        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === active ? "w-4 bg-bone/85" : "w-1.5 bg-bone/35"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * "Dashboard preview" mockup used on featured project showcases. Renders
 * real product screenshots when available — a single frame, a layered
 * pair, or a fanned three-up collage so different tabs/pages of the
 * product are visible at once — falling back to an honest skeleton
 * abstraction when there's nothing to show yet. Floats gently on an
 * ambient loop so the section feels alive while scrolling past it. Any
 * real screenshot is openable — hover to see the affordance, click to
 * view it full-size in a lightbox.
 */
export function DashboardPreview({
  title,
  accent,
  images,
  className = "",
}: {
  title: string;
  accent: string;
  images?: string[];
  className?: string;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openAt = (i: number) => {
    setLightboxIndex(i);
    setLightboxOpen(true);
  };

  const glow = (
    <div
      className="pointer-events-none absolute -inset-6 opacity-[0.16] blur-2xl"
      style={{ ["--accent" as any]: accent, background: "radial-gradient(50% 50% at 50% 30%, var(--accent), transparent 70%)" }}
    />
  );

  let visual: React.ReactNode;

  if (!images || images.length === 0) {
    visual = (
      <div className="relative rounded-2xl border border-line-strong bg-panel overflow-hidden animate-float-slow">
        <Chrome label={`${title} Dashboard Preview`} />
        <SkeletonBody accent={accent} />
      </div>
    );
  } else if (images.length === 1) {
    visual = (
      <GalleryTrigger onOpen={() => openAt(0)} label="View screenshot">
        <div className={`relative rounded-2xl bg-panel overflow-hidden animate-float-slow ${glowClass}`}>
          <Chrome label={`${title} Preview`} />
          <div className="aspect-[21/10]">
            <img src={images[0]} alt={`${title} product screenshot`} className="w-full h-full object-cover object-top" />
          </div>
        </div>
      </GalleryTrigger>
    );
  } else if (images.length === 2) {
    visual = (
      <GalleryTrigger onOpen={() => openAt(0)} label="View screenshots">
        <ImageCycle images={images} title={title} ratio="2.14 / 1" />
      </GalleryTrigger>
    );
  } else {
    // Three or more — only the first three are used, fanned so each tab/page peeks out.
    const [front, middle, back] = images;
    visual = (
      <GalleryTrigger onOpen={() => openAt(0)} label="View screenshots">
        <div className="relative aspect-[3/2] sm:aspect-auto sm:h-[28rem]">
          <Frame src={back} label={`${title} Preview`} className="w-[64%] h-[46%] top-0 left-0 -rotate-6 opacity-45" />
          <Frame
            src={middle}
            label={`${title} Preview`}
            className="w-[70%] h-[50%] top-[15%] left-[18%] rotate-3 opacity-75"
          />
          <Frame src={front} label={`${title} Preview`} className="w-[78%] h-[56%] bottom-0 right-0 -rotate-2" crisp />
        </div>
      </GalleryTrigger>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {glow}
      {visual}
      {images && images.length > 0 && (
        <ImageLightbox
          images={images}
          title={title}
          startIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
