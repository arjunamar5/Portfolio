"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

interface ImageLightboxProps {
  images: string[];
  title: string;
  startIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Full-size viewer for a project's screenshots — no chrome, no panel, just
 * the image itself (thin border, generous size) so nothing competes with
 * actually reading it. Close is a single floating cross; arrows/dots only
 * appear when there's more than one shot to page through.
 */
export function ImageLightbox({ images, title, startIndex, isOpen, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) setIndex(startIndex);
  }, [isOpen, startIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, images.length, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[95] bg-void/92 backdrop-blur-xl p-4 sm:p-10 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative inline-flex max-w-[95vw] max-h-[92vh]"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={images[index]}
                src={images[index]}
                alt={`${title} screenshot ${index + 1} of ${images.length}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="block max-w-[95vw] max-h-[92vh] w-auto h-auto object-contain rounded-lg border border-line-strong shadow-2xl"
              />
            </AnimatePresence>

            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-2 right-2 w-8 h-8 rounded-full glass flex items-center justify-center text-bone hover:border-accent hover:text-accent transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
                  aria-label="Previous screenshot"
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass flex items-center justify-center text-bone hover:border-accent hover:text-accent transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIndex((i) => (i + 1) % images.length)}
                  aria-label="Next screenshot"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass flex items-center justify-center text-bone hover:border-accent hover:text-accent transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex items-center gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      aria-label={`Go to screenshot ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === index ? "w-6 bg-accent" : "w-1.5 bg-bone/40 hover:bg-bone/70"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
