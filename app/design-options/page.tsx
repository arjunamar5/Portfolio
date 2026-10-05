import type { Metadata } from "next";
import { AboutBento } from "@/components/options/AboutBento";
import { AboutWrapped } from "@/components/options/AboutWrapped";
import { AboutBadge } from "@/components/options/AboutBadge";
import { AboutStatement } from "@/components/options/AboutStatement";
import { AboutParticles } from "@/components/options/AboutParticles";
import { WhatIDoBento } from "@/components/options/WhatIDoBento";
import { WhatIDoSlider } from "@/components/options/WhatIDoSlider";
import { WhatIDoEditorial } from "@/components/options/WhatIDoEditorial";
import { ProjectsStack } from "@/components/options/ProjectsStack";
import { ProjectsIndex } from "@/components/options/ProjectsIndex";
import { ProjectsBento } from "@/components/options/ProjectsBento";

// Review page for the redesign options — not linked from the site.
export const metadata: Metadata = { title: "Design options", robots: { index: false, follow: false } };

const OPTIONS = [
  { id: "opt-1a", label: "About · Idea 1 — About bento", C: AboutBento },
  { id: "opt-1b", label: "About · Idea 2 — Arjun, wrapped", C: AboutWrapped },
  { id: "opt-1c", label: "About · Idea 3 — Lanyard badge", C: AboutBadge },
  { id: "opt-1d", label: "About · Idea 4 — Interactive statement", C: AboutStatement },
  { id: "opt-1e", label: "About · Idea 5 — Particle name", C: AboutParticles },
  { id: "opt-2a", label: "What I do · Option A — Capability bento", C: WhatIDoBento },
  { id: "opt-2b", label: "What I do · Option B — Drag to transform", C: WhatIDoSlider },
  { id: "opt-2c", label: "What I do · Option C — Editorial statement", C: WhatIDoEditorial },
  { id: "opt-3a", label: "Projects · Option A — Stacked showcase cards", C: ProjectsStack },
  { id: "opt-3b", label: "Projects · Option B — Project index + live preview", C: ProjectsIndex },
  { id: "opt-3c", label: "Projects · Option C — Bento gallery", C: ProjectsBento },
];

export default function DesignOptions() {
  return (
    <main className="bg-void">
      {OPTIONS.map(({ id, label, C }) => (
        <div key={id} id={id} className="relative border-t-4 border-accent/40">
          <div className="absolute top-0 left-0 z-20 rounded-br-2xl bg-accent px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-white">{label}</div>
          <C />
        </div>
      ))}
    </main>
  );
}
