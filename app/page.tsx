"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { ProjectsShowcase } from "@/components/ProjectsShowcase";
import { Research } from "@/components/Research";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ResumeModal } from "@/components/ResumeModal";

export default function Home() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <main className="min-h-screen bg-void text-bone relative">
      <Navbar onOpenResume={() => setIsResumeOpen(true)} />

      <Hero onOpenResume={() => setIsResumeOpen(true)} />
      <About />
      <ProjectsShowcase />
      <Research />
      <Skills />
      <Contact onOpenResume={() => setIsResumeOpen(true)} />

      <Footer />

      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </main>
  );
}
