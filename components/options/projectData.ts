import { PORTFOLIO_DATA, ProjectCaseStudy } from "@/data/portfolio-data";

export const FEATURED_IDS = ["project-3-cue-court-coffee", "project-2-perfect-study-space", "project-7-alpenglow-global", "project-1-brain-tumor-detection"];
const all = PORTFOLIO_DATA.projects;
export const FEATURED = FEATURED_IDS.map((id) => all.find((p) => p.id === id)).filter((p): p is ProjectCaseStudy => Boolean(p));
export const MORE = all.filter((p) => !FEATURED_IDS.includes(p.id));
export const ALL = [...FEATURED, ...MORE];

export const isAcademic = (p: ProjectCaseStudy) => p.id === "project-1-brain-tumor-detection";
export const isLive = (p: ProjectCaseStudy) => FEATURED_IDS.includes(p.id) && !isAcademic(p);
export const kindOf = (p: ProjectCaseStudy) => (isLive(p) ? "Live client" : isAcademic(p) ? "Academic" : "Project");
export const roleOf = (p: ProjectCaseStudy) => PORTFOLIO_DATA.experience.find((e) => e.projectId === p.id);
export const numericMetrics = (p: ProjectCaseStudy) => p.impactMetrics.filter((m) => /^\+?\d+(\.\d+)?[%+]?$/.test(m.value));
/** Short "what changed" lines: impact rows when we have them, otherwise key features. */
export const wins = (p: ProjectCaseStudy, n = 3) => (p.impact?.rows.map((r) => r.after) ?? p.keyFeatures.map((k) => k.title)).slice(0, n);
/** One headline badge per project. */
export const badgeOf = (p: ProjectCaseStudy) => {
  const m = numericMetrics(p).find((x) => x.value.includes("%")) ?? numericMetrics(p)[0];
  return m ? `${m.value} ${m.label.toLowerCase()}` : wins(p, 1)[0];
};
export const blurb = (p: ProjectCaseStudy) => p.summary ?? p.tagline;
