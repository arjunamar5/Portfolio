"use client";

import React, { useCallback, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { TourRail } from "@/components/TourRail";
import { ProblemToProduct } from "@/components/ProblemToProduct";
import { ProjectsShowcase } from "@/components/ProjectsShowcase";
import { Research } from "@/components/Research";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ResumeModal } from "@/components/ResumeModal";
import { Preloader } from "@/components/Preloader";
import { ScrollProgress, BackToTop, CursorFx } from "@/components/ScrollFx";

export default function Home() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const reveal = useCallback(() => setReady(true), []);
  const openResume = useCallback(() => setIsResumeOpen(true), []);
  const closeResume = useCallback(() => setIsResumeOpen(false), []);

  return (
    <main className="min-h-screen bg-void text-bone relative">
      <Preloader onReveal={reveal} />
      <CursorFx />
      <ScrollProgress />
      <Navbar onOpenResume={openResume} />
      <TourRail />

      <Hero onOpenResume={openResume} ready={ready} />
      <About />
      <ProblemToProduct />
      <ProjectsShowcase />
      <Research />
      <Skills />
      <Contact onOpenResume={openResume} />

      <Footer />

      <BackToTop />
      <ResumeModal isOpen={isResumeOpen} onClose={closeResume} />
    </main>
  );
}
