export interface SkillCategory {
  title: string;
  skills: { name: string; icon?: string; tag?: string; level?: string }[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
  techStack: string[];
  /** Project block this role produced — the timeline links to it instead of repeating its details. */
  projectId?: string;
}

export interface ProjectCaseStudy {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  tagline: string;
  /** Two or three plain lines on what the project does (used on the compact cards). */
  summary?: string;
  description: string;
  confidentialityTag: "Private Client Project" | "Official Academic Project" | "Client Project";
  problemStatement?: string;
  objectives?: string[];
  architectureOverview?: string;
  techStack: { category: string; items: string[] }[];
  keyFeatures: { title: string; description: string; icon?: string }[];
  developmentJourney?: string;
  challengesAndSolutions?: { challenge: string; solution: string }[];
  impactMetrics: { label: string; value: string }[];
  codeSnippet?: { title: string; language: string; code: string };
  databaseSchema?: { title: string; description: string; tables: { name: string; fields: string[] }[] };
  visualType: "mri-viewer" | "study-saas" | "court-booking" | "travel-concierge" | "residence-hub" | "quickpark-iot" | "cloud-aws";
  /** Muted per-project accent used sparingly in the case study (badges, icon tint). */
  accent: string;
  /** Short category label shown as the card's eyebrow. */
  sceneLabel: string;
  /** Index string like "01", used for case-study pagination. */
  index: string;
  engineeringDecisions?: { decision: string; reasoning: string }[];
  keyLearnings?: string[];
  /** Featured projects get the large alternating showcase layout; others get the compact card grid. */
  featured?: boolean;
  /** Real product screenshots, in /public. Falls back to an abstract mockup when omitted. */
  images?: string[];
  /** Pill tags shown under a featured project; defaults to its tech stack. */
  chips?: string[];
  /** What changed for the people using it — shown as a before/after board. */
  impact?: {
    headline: string;
    rows: { area: string; before: string; after: string }[];
    /** Optional relative growth bar (e.g. enquiries before vs after). */
    growth?: { label: string; before: number; after: number; note: string };
  };
}

export interface ResearchPaper {
  id: string;
  title: string;
  conference?: string;
  year?: string;
  abstract?: string;
  technologies: string[];
  link?: string;
}

export const PORTFOLIO_DATA = {
  personal: {
    name: "Arjun R Amarnath",
    title: "Full-Stack & AI/ML Developer",
    location: "Coimbatore, India",
    email: "arjunamarnath1008@gmail.com",
    linkedin: "https://linkedin.com/in/arjun-r-amarnath",
    github: "https://github.com/arjunamar5",
    resumeUrl: "/Arjun_R_Amarnath_Resume.pdf",
    bioShort: "Computer Science graduate building full-stack products and LLM-powered applications — from RAG systems to cloud-deployed platforms used by real businesses.",
    summary:
      "Computer Science graduate with hands-on experience in full-stack development and AI/ML, with a focus on LLM-powered applications and RAG systems. Experienced in Python, React.js, AWS, Ollama, and retrieval-augmented generation, with experience building and deploying real-world web and AI applications.",
    bioLong: `I'm a Computer Science graduate with hands-on experience in full-stack development and AI/ML, with a focus on LLM-powered applications and retrieval-augmented generation (RAG). I work across Python, React.js, Node.js, AWS and Ollama, and I've built and deployed production platforms that real businesses run on every day.

I enjoy exploring how different technologies come together to solve meaningful problems — from booking engines and multi-branch management platforms to medical-imaging AI with explainable, locally-run GenAI assistants. Beyond development, I've served as President of the Computer Society of India (ASEB Chapter) at my university.`,
    education: {
      institution: "Amrita Vishwa Vidyapeetham",
      degree: "B.Tech in Computer Science and Engineering",
      period: "Sept 2022 – Aug 2026",
      detail: "CGPA: 8.26",
    },
    typingTitles: [
      "Full-Stack Developer",
      "AI / ML Developer",
      "LLM & RAG Builder",
      "Cloud Enthusiast"
    ],
    focusAreas: ["Full-Stack Development", "AI / ML", "LLMs & RAG", "Computer Vision", "Cloud (AWS)"],
    leadership: {
      role: "President",
      organization: "Computer Society of India (ASEB)",
      description:
        "Led the CSI team in organizing and executing technical events and coding competitions, overseeing task delegation and coordination while fostering effective teamwork and communication.",
    },
    researchNote: "8 papers accepted/published in Scopus-indexed international conferences, including IEEE and Springer.",
  },

  skills: [
    {
      title: "Languages",
      skills: [{ name: "Java" }, { name: "Python" }, { name: "SQL" }, { name: "JavaScript" }, { name: "TypeScript" }],
    },
    {
      title: "Frontend",
      skills: [
        { name: "HTML" }, { name: "CSS" }, { name: "React.js" }, { name: "Next.js" }, { name: "Tailwind CSS" },
      ],
    },
    {
      title: "Backend",
      skills: [{ name: "Node.js" }, { name: "Express.js" }, { name: "Flask" }, { name: "Supabase" }],
    },
    {
      title: "Database",
      skills: [{ name: "MySQL" }, { name: "MongoDB" }, { name: "PostgreSQL" }],
    },
    {
      title: "AI-ML & GenAI",
      skills: [
        { name: "YOLO" }, { name: "OpenCV" }, { name: "LLMs" }, { name: "RAG" }, { name: "Ollama" }, { name: "PyTorch" },
      ],
    },
    {
      title: "Cloud Technologies",
      skills: [
        { name: "AWS" }, { name: "Docker" },
      ],
    },
    {
      title: "Version Control",
      skills: [{ name: "Git" }, { name: "GitHub" }],
    },
  ] as SkillCategory[],

  experience: [
    {
      id: "cue-court-coffee",
      company: "Cue Court Coffee",
      role: "Full-Stack Developer",
      period: "May 2026 – Jun 2026",
      location: "Coimbatore, India",
      highlights: [
        "Developed a full-stack booking platform with automated WhatsApp bookings, real-time court blocking, and centralized slot tracking.",
        "Automated billing with court add-ons, food orders, and membership-based pricing, reducing manual billing effort.",
        "Built CueBot, an AI-powered analytics assistant for instant natural-language insights into revenue, bookings, customers, and sales.",
      ],
      techStack: ["React.js", "Node.js", "Express.js", "PostgreSQL", "WhatsApp Cloud API", "Tailwind CSS", "Chart.js"],
      projectId: "project-3-cue-court-coffee",
    },
    {
      id: "perfect-study-space",
      company: "Perfect Study Space",
      role: "Full-Stack Developer",
      period: "Jun 2026 – Jul 2026",
      location: "Coimbatore, India",
      highlights: [
        "Developed a multi-branch management platform supporting 3 branches, 5 staff, and 300+ student profiles, centralizing daily operations.",
        "Automated student registration, attendance, fee management, seat allocation, and notifications, reducing manual administrative work.",
        "Developed and deployed the organization website, increasing daily student enquiries by 50% across 3 branches.",
      ],
      techStack: ["Next.js", "TypeScript", "Node.js", "MongoDB", "Supabase", "Tailwind CSS", "Docker"],
      projectId: "project-2-perfect-study-space",
    },
  ] as ExperienceItem[],

  projects: [
    {
      id: "project-1-brain-tumor-detection",
      title: "AI-Powered Brain Tumor Detection & Clinical Decision Support System",
      shortTitle: "Brain Tumor AI",
      category: "Medical Artificial Intelligence",
      tagline: "Multimodal AI system that classifies, localizes, and segments brain abnormalities in MRI scans — with explainable heatmaps and a local RAG clinical assistant.",
      summary: "Finds, outlines and explains brain abnormalities in MRI scans, with a private, local RAG assistant for clinical questions.",
      description: "Combines CNN, EfficientNet, YOLO, and U-Net for MRI classification, localization, and segmentation. Grad-CAM makes every prediction explainable, and a local RAG-based GenAI assistant running on Ollama retrieves relevant context to generate natural-language clinical insights — without patient data ever leaving the machine.",
      confidentialityTag: "Official Academic Project",
      problemStatement: "Diagnostic errors and time lag in radiologic scan evaluation can delay urgent neurosurgical interventions. Traditional deep neural networks act as 'black boxes', lacking clinical explainability and real-time medical guidelines contextualization.",
      objectives: [
        "Achieve >98% accuracy in multi-class brain tumor classification (Glioma, Meningioma, Pituitary, Normal).",
        "Generate precise pixel-level lesion boundary masks using fine-tuned U-Net architecture.",
        "Provide radiologist-facing Grad-CAM heatmaps for transparent clinical diagnostic explainability.",
        "Integrate a privacy-first Local RAG assistant for instant clinical query answers without cloud data leaks."
      ],
      architectureOverview: "DICOM/PNG Scans -> Preprocessing Pipeline -> EfficientNet/YOLO Multi-Class Classifier -> U-Net Pixel Segmentation -> Grad-CAM Heatmap Generation -> Local Vector DB (FAISS/Chroma) + Llama-3 Clinical RAG Agent -> Interactive Radiologist Workstation UI.",
      techStack: [
        { category: "AI & ML", items: ["Python", "PyTorch", "CNN", "EfficientNet", "YOLO", "U-Net", "Grad-CAM", "OpenCV"] },
        { category: "GenAI", items: ["Ollama", "RAG"] },
        { category: "Backend", items: ["Flask"] }
      ],
      keyFeatures: [
        { title: "MRI Classification", description: "CNN and EfficientNet models classify brain abnormalities from MRI scans." },
        { title: "YOLO Localization", description: "Bounding-box localization of the abnormal region on each scan." },
        { title: "U-Net Segmentation", description: "Pixel-level segmentation masks outlining the lesion boundary." },
        { title: "Grad-CAM + Local RAG", description: "Explainable heatmaps plus an Ollama-powered RAG assistant for natural-language clinical insights." }
      ],
      developmentJourney: "Developed through extensive iteration on 10,000+ DICOM brain MRI images. Implemented transfer learning with EfficientNet for initial screening, then paired it with a custom U-Net for dense segmentation. Integrated Grad-CAM to allow clinicians to inspect activation heatmaps before validating diagnoses.",
      challengesAndSolutions: [
        { challenge: "Model hallucination and black-box reluctance from medical practitioners.", solution: "Implemented Grad-CAM visualization layer overlaying exact tensor activation maps directly onto MRI slices." },
        { challenge: "HIPAA compliance and cloud data security concerns.", solution: "Engineered 100% local RAG workflow utilizing Ollama and local vector indices on workstation GPUs." }
      ],
      impactMetrics: [
        { label: "Classify · Localize · Segment", value: "3-in-1" },
        { label: "Explainable predictions", value: "Grad-CAM" },
        { label: "Local RAG assistant", value: "Ollama" }
      ],
      impact: {
        headline: "From a black-box guess to an explainable, private second opinion.",
        rows: [
          { area: "Explainability", before: "Black-box prediction", after: "Grad-CAM heatmap shows why" },
          { area: "Workflow", before: "Separate tool per task", after: "One pipeline: classify → segment" },
          { area: "Privacy", before: "Scans sent to cloud AI", after: "Runs fully local on Ollama" },
          { area: "Context", before: "Manual literature lookup", after: "RAG answers in plain language" }
        ]
      },
      codeSnippet: {
        title: "Grad_CAM_Explainer.py",
        language: "python",
        code: `class GradCAMExplainer:
    def __init__(self, model, target_layer):
        self.model = model.eval()
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None
        self._register_hooks()

    def _register_hooks(self):
        def forward_hook(module, input, output):
            self.activations = output.detach()
        def backward_hook(module, grad_in, grad_out):
            self.gradients = grad_out[0].detach()

        self.target_layer.register_forward_hook(forward_hook)
        self.target_layer.register_full_backward_hook(backward_hook)

    def generate_heatmap(self, input_tensor, class_idx):
        output = self.model(input_tensor)
        self.model.zero_grad()
        loss = output[0, class_idx]
        loss.backward()

        weights = torch.mean(self.gradients, dim=[2, 3], keepdim=True)
        cam = torch.sum(weights * self.activations, dim=1, keepdim=True)
        cam = F.relu(cam)
        cam = F.interpolate(cam, size=input_tensor.shape[2:], mode='bilinear', align_corners=False)
        return (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)`
      },
      databaseSchema: {
        title: "Scan & Diagnostic DB Schema",
        description: "PostgreSQL relational schema storing patient MRI session metadata, segmentation JSON coordinates, and Grad-CAM confidence vectors.",
        tables: [
          { name: "mri_scans", fields: ["id (UUID)", "patient_hash (VARCHAR)", "scan_url (TEXT)", "modality (T1/T2/FLAIR)", "created_at (TIMESTAMP)"] },
          { name: "ai_diagnoses", fields: ["id (UUID)", "scan_id (FK)", "classification (ENUM)", "confidence (FLOAT)", "tumor_area_sqmm (FLOAT)"] },
          { name: "gradcam_overlays", fields: ["id (UUID)", "diagnosis_id (FK)", "heatmap_matrix_json (TEXT)", "activated_nodes (INT[])"] }
        ]
      },
      visualType: "mri-viewer",
      accent: "#4FBDB6",
      sceneLabel: "Medical Vision",
      index: "01",
      engineeringDecisions: [
        { decision: "Paired a classifier with a dedicated segmentation model instead of one network doing both.", reasoning: "EfficientNet handles fast multi-class screening while a separate U-Net focuses purely on pixel-accurate tumor boundaries — better accuracy on each task than a single combined model." },
        { decision: "Ran the RAG assistant fully on local infrastructure.", reasoning: "Medical query data can't leave the workstation, so retrieval and generation both run locally instead of calling a hosted LLM API." }
      ],
      keyLearnings: [
        "Explainability isn't optional in medical AI — Grad-CAM overlays were what actually earned trust from clinicians reviewing the tool, not the accuracy number alone.",
        "Segmentation and classification benefit from being solved as separate, focused problems rather than one end-to-end model."
      ],
      featured: true
    },

    {
      id: "project-2-perfect-study-space",
      title: "Perfect Study Space - Multi-Tenant SaaS Platform",
      shortTitle: "Perfect Study Space",
      category: "Multi-Tenant SaaS Platform",
      tagline: "Multi-branch study center platform managing registration, memberships, attendance, and seat allocation — with role-based analytics and a staff CRM for lead tracking.",
      summary: "One platform for three study-centre branches: seats, memberships, attendance, fees and a CRM for every enquiry.",
      description: "A commercial SaaS platform built for educational hubs and coworking study centers. Handles student registration, memberships, attendance, seat allocation, walk-ins, trial sessions, waitlists, fees, and notifications, with role-based access and real-time branch analytics for staff and owners. Website enquiries are automatically captured into a staff CRM dashboard for lead tracking and follow-up.",
      confidentialityTag: "Private Client Project",
      problemStatement: "Multi-branch study facilities struggled with fragmented paper logbooks, manual membership billing reconciliation, high member churn, and lack of real-time seat occupancy insights across locations.",
      objectives: [
        "Implement secure multi-tenant data architecture allowing localized branch administration.",
        "Automate member subscription billing with dynamic plan pricing and WhatsApp renewal notifications.",
        "Provide real-time live seat map and hardware attendance synchronization.",
        "Build a CRM pipeline for lead conversion and automated member engagement."
      ],
      architectureOverview: "Client App (Next.js) -> API Gateway -> Node.js Express Microservices -> Tenant Middleware -> MongoDB Cluster (Branch Collections) + Supabase Auth & Realtime.",
      techStack: [
        { category: "Frontend", items: ["Next.js", "React.js", "TypeScript", "Tailwind CSS"] },
        { category: "Backend", items: ["Supabase", "WebSockets"] },
        { category: "Integrations", items: ["WhatsApp Cloud API", "Razorpay / Stripe", "Chart.js"] }
      ],
      keyFeatures: [
        { title: "Multi-Branch Switcher", description: "Centralized administration with instant branch switching and isolated tenant reporting." },
        { title: "Membership Control", description: "Manage plans, renewals, and payment status for every member with automated WhatsApp/SMS reminders." },
        { title: "CRM", description: "Centralized customer relationship management across every branch, from enquiry to conversion." },
        { title: "Lead Management", description: "Website enquiries are captured automatically and routed to staff for follow-up and conversion tracking." }
      ],
      developmentJourney: "Built from scratch to support multi-branch expansion. Designed custom tenant resolution middleware that automatically scopes DB queries by Tenant ID, guaranteeing zero cross-branch data leaks while sharing unified infrastructure.",
      challengesAndSolutions: [
        { challenge: "Handling concurrency during peak morning check-ins.", solution: "Implemented Redis cached seat state with atomic counter locks preventing double desk assignments." },
        { challenge: "Member churn due to forgotten renewals.", solution: "Automated a 3-stage WhatsApp reminder sequence with instant 1-click renewal links." }
      ],
      impactMetrics: [
        { label: "Branches", value: "3" },
        { label: "Student profiles", value: "300+" },
        { label: "Daily enquiries", value: "+50%" }
      ],
      impact: {
        headline: "Three branches, one system — and 50% more enquiries every day.",
        rows: [
          { area: "Operations", before: "Branches run separately", after: "One platform, 3 branches" },
          { area: "Records", before: "Paper logbooks", after: "300+ profiles, centralized" },
          { area: "Admin", before: "Manual fees & seating", after: "Automated end-to-end" },
          { area: "Enquiries", before: "Walk-ins & calls", after: "+50% daily via website" }
        ],
        growth: { label: "Daily student enquiries", before: 100, after: 150, note: "after the new website launched" }
      },
      visualType: "study-saas",
      accent: "#38BDF8",
      sceneLabel: "Multi-Tenant SaaS",
      index: "02",
      engineeringDecisions: [
        { decision: "Scoped every database query through tenant-resolution middleware rather than separate databases per branch.", reasoning: "Kept infrastructure simple to operate while still guaranteeing branches can't see each other's data." },
        { decision: "Cached seat state in Redis with atomic counters.", reasoning: "Peak check-in windows created race conditions on desk assignment that plain database writes weren't fast enough to prevent." }
      ],
      keyLearnings: [
        "Multi-tenancy is mostly a data-modeling and middleware problem, not an infrastructure one — shared infrastructure with strict scoping was simpler to operate than isolated databases per branch.",
        "Automated reminders only help retention if they're timed and channel-matched to how members actually respond — WhatsApp outperformed email here."
      ],
      featured: true
    },

    {
      id: "project-3-cue-court-coffee",
      title: "CueCourtOS - Enterprise Sports Facility Platform",
      shortTitle: "CueCourtOS",
      category: "Enterprise Sports Venue Management",
      tagline: "Full-stack sports venue platform automating court bookings, food ordering, billing, and memberships — with CueBot, an AI assistant delivering live business analytics.",
      summary: "A venue system for courts, café and memberships, with WhatsApp bookings and CueBot, an AI that answers business questions.",
      description: "An end-to-end venue management system for sports complexes handling customer registration, court bookings, food ordering, billing, and memberships. Customers book courts directly through WhatsApp with automated confirmations and bill notifications, while CueBot — an AI-powered assistant — gives staff live insights into revenue, bookings, sports performance, food sales, customers, and memberships.",
      confidentialityTag: "Private Client Project",
      problemStatement: "Sports complexes suffer revenue loss due to double-booked courts, disconnected cafe operations, slow manual court tab settlements, and phone-based booking friction.",
      objectives: [
        "Engineer a court reservation engine with dynamic slot locking during checkout.",
        "Unify court booking accounts with the cafe Point-of-Sale (POS) system.",
        "Deploy CueBot AI on WhatsApp for automatic instant slot booking via natural text.",
        "Provide venue owners with real-time hourly occupancy & revenue intelligence."
      ],
      architectureOverview: "Customer Mobile Web / WhatsApp -> Webhook Ingress -> Node.js Booking Engine -> PostgreSQL Transactional Engine -> Cafe POS Terminal -> Real-Time WebSocket Board.",
      techStack: [
        { category: "Full Stack", items: ["React.js", "PostgreSQL", "Tailwind CSS"] },
        { category: "AI & Messaging", items: ["WhatsApp Cloud API", "AI Chatbot"] }
      ],
      keyFeatures: [
        { title: "Court Booking Matrix", description: "Interactive timeline grid for court slot selection, lighting controls, and equipment rentals." },
        { title: "Integrated Food Ordering & Billing", description: "Players order food & drinks straight to their court tab, billed automatically at checkout." },
        { title: "CueBot — AI Business Analyst", description: "An AI-powered assistant giving staff live insights on revenue, bookings, sports performance, food sales, customers, and memberships." },
        { title: "Revenue & Peak Analytics", description: "Deep visual analytics highlighting peak play hours, court utilization %, and cafe sales." }
      ],
      developmentJourney: "Collaborated directly with facility managers to identify operational bottlenecks. Built a fast, low-latency POS interface for cafe staff synchronized with the main court reservation database via WebSockets.",
      challengesAndSolutions: [
        { challenge: "Concurrent booking attempts on popular evening slots.", solution: "Built 5-minute temporary slot locks in Redis with automatic expiration if payment is unfulfilled." },
        { challenge: "High latency in WhatsApp bot responses.", solution: "Optimized NLP intent parsing to respond in under 400ms with interactive WhatsApp list buttons." }
      ],
      impactMetrics: [
        { label: "Automated bookings", value: "WhatsApp" },
        { label: "Court blocking", value: "Real-time" },
        { label: "AI analytics assistant", value: "CueBot" }
      ],
      impact: {
        headline: "Bookings, billing and business insight — now on autopilot.",
        rows: [
          { area: "Bookings", before: "Phone calls & notebooks", after: "Automated on WhatsApp" },
          { area: "Court slots", before: "Double-booking risk", after: "Blocked in real time" },
          { area: "Billing", before: "Manual tab tallying", after: "Auto-billed with add-ons" },
          { area: "Insights", before: "No live view", after: "Instant answers from CueBot" }
        ]
      },
      visualType: "court-booking",
      accent: "#D97A52",
      sceneLabel: "Venue Platform",
      index: "03",
      engineeringDecisions: [
        { decision: "Used short-lived Redis locks on a slot instead of locking it at click time.", reasoning: "Reserves the slot only until payment completes, so an abandoned checkout doesn't block a popular evening slot indefinitely." },
        { decision: "Kept the booking bot's intent parsing lightweight rather than a full LLM round-trip.", reasoning: "WhatsApp users expect a near-instant reply — sub-400ms responses mattered more than open-ended conversation." }
      ],
      keyLearnings: [
        "Temporary locks with automatic expiry solved double-booking more cleanly than trying to validate at final submit.",
        "For a transactional bot like this, response latency is part of the UX — a slower but 'smarter' model would have hurt conversion."
      ],
      featured: true
    },

    {
      id: "project-7-alpenglow-global",
      title: "AlpenGlow Global - Travel Storefront with COMPASS AI Concierge",
      shortTitle: "AlpenGlow Global",
      category: "Travel · AI Concierge",
      tagline: "A boutique travel agency's storefront with COMPASS, an AI concierge that turns a few quick questions into a personalized itinerary.",
      summary: "A travel agency's site with COMPASS, an AI concierge that turns a few questions into a personalised trip plan.",
      description: "AlpenGlow makes trip planning simpler from the first idea to the final itinerary. Visitors explore destinations, ask Compass for personalized travel recommendations, or describe exactly what they're looking for through Plan Your Trip — building a journey around their interests, budget, dates, and travel style, with the assistance they need to turn their plans into a real trip.",
      confidentialityTag: "Client Project",
      techStack: [],
      chips: ["COMPASS AI", "Plan Your Trip", "Itineraries", "Collections", "Offer campaigns", "Lead routing", "Journal"],
      keyFeatures: [
        { title: "COMPASS — AI trip concierge", description: "Personalized travel recommendations from a few quick questions." },
        { title: "Plan Your Trip requests", description: "Interests, budget, dates, and travel style captured in one flow." },
        { title: "Destination collections", description: "Curated destinations and packages to explore." },
        { title: "Lead routing to sales", description: "Trip requests handed straight to the sales team." }
      ],
      problemStatement: "Turning a vague travel idea into a real itinerary is slow and overwhelming — too many destinations, budgets, dates and travel styles to weigh before anyone talks to an agent.",
      impactMetrics: [
        { label: "Destination collections", value: "4" },
        { label: "Curated packages", value: "6+" },
        { label: "Industry recognitions", value: "4" }
      ],
      impact: {
        headline: "From a vague idea to a ready itinerary — and a warm lead for sales.",
        rows: [
          { area: "Discovery", before: "Endless browsing", after: "Compass suggests where to go" },
          { area: "Planning", before: "Scattered requirements", after: "Budget, dates & style in one flow" },
          { area: "Itinerary", before: "Built by hand, later", after: "Personalized plan, instantly" },
          { area: "Sales", before: "Enquiries handled ad hoc", after: "Leads routed to sales" }
        ]
      },
      visualType: "travel-concierge",
      accent: "#FB923C",
      sceneLabel: "Travel · AI Concierge",
      index: "07",
      featured: true
    },

    {
      id: "project-4-residence-hub",
      title: "Residence Hub - Residential Community Management Platform",
      shortTitle: "Residence Hub",
      category: "Residential Community Management",
      tagline: "Centralized apartment platform digitizing resident management, maintenance requests, complaint escalation, and billing ops.",
      summary: "One app for apartment communities: maintenance tickets, digital gate passes and fee payments, tracked end to end.",
      description: "A modern property management platform that simplifies operations for gated communities, apartment complexes, and resident associations. Features maintenance ticket workflows, digital gate passes, maintenance fee ledgers, and resident communications.",
      confidentialityTag: "Private Client Project",
      problemStatement: "Apartment communities struggle with unorganized resident maintenance complaints, manual paper receipt maintenance tracking, delayed vendor resolution, and poor resident communication.",
      objectives: [
        "Digitize the complete maintenance request lifecycle with SLA status tracking.",
        "Provide automated monthly maintenance fee invoicing and digital payment reconciliation.",
        "Implement role-based access control (RBAC) for Residents, Admins, and Field Technicians.",
        "Enable instant broadcast announcements and digital notice board notifications."
      ],
      architectureOverview: "Resident PWA / Admin Dashboard -> Express API Server -> Role-Based Middleware -> PostgreSQL DB + Amazon S3 (Attachments/Receipts) -> Firebase Cloud Messaging.",
      techStack: [
        { category: "Frontend", items: ["React.js", "TypeScript", "Tailwind CSS", "Lucide React"] },
        { category: "Backend", items: ["Node.js", "Express.js", "PostgreSQL", "Prisma ORM", "AWS S3"] }
      ],
      keyFeatures: [
        { title: "Maintenance SLA Tracker", description: "Interactive Kanban board for tracking repair tickets from creation to technician sign-off." },
        { title: "Automated Dues Ledger", description: "Generates monthly society maintenance dues and tracks payment status in real time." },
        { title: "Resident Directory & Gate Pass", description: "Secure resident portal for vehicle registration and digital visitor passes." },
        { title: "Community Notice Board", description: "Broadcast platform with push notifications for urgent building updates." }
      ],
      developmentJourney: "Focused heavily on UI accessibility and simple, high-contrast layouts so elderly residents and maintenance staff could navigate ticket tracking effortlessly.",
      challengesAndSolutions: [
        { challenge: "Unclear complaint details causing multiple technician trips.", solution: "Added mandatory photo upload & category selection with automated technician dispatch rules." },
        { challenge: "Tracking cash vs online payment reconciliations.", solution: "Built an admin reconciliation dashboard with double-entry ledger verification." }
      ],
      impactMetrics: [
        { label: "Units Onboarded", value: "1,200+" },
        { label: "Maintenance SLA Resolution", value: "94% on-time" },
        { label: "Ticket Resolution Speed", value: "3x Faster" },
        { label: "Fee Collection Efficiency", value: "98%" }
      ],
      visualType: "residence-hub",
      accent: "#D4AD82",
      sceneLabel: "Community OS",
      index: "04",
      engineeringDecisions: [
        { decision: "Made photo upload and category selection mandatory before a ticket can be submitted.", reasoning: "Vague complaints were causing repeat technician visits — forcing structured input up front cut down on wasted trips." },
        { decision: "Prioritized high-contrast, simple layouts over dense information density.", reasoning: "A meaningful share of residents and maintenance staff are less comfortable with software, so legibility mattered more than showing everything at once." }
      ],
      keyLearnings: [
        "Accessibility isn't a nice-to-have for a resident-facing tool — it directly determines whether people actually use it instead of falling back to phone calls.",
        "Structured intake forms reduce downstream support load more effectively than better ticket-routing logic."
      ]
    },

    {
      id: "project-5-quickpark",
      title: "QuickPark - IoT Smart Parking Management System",
      shortTitle: "QuickPark",
      category: "IoT & Hardware Automation Platform",
      tagline: "IoT parking system integrating ESP32 microcontrollers, IR sensors, servo barrier gates, and Flask web app for live slot booking.",
      summary: "Smart parking with live free-slot detection, online booking and an ESP32 barrier gate that opens for booked cars.",
      description: "An end-to-end hardware-software smart parking solution. Combines physical ESP32 microcontrollers, infrared vehicle detection sensors, and automated servo barrier gates with a live Flask web dashboard for real-time slot monitoring, online booking, and dynamic tariff billing.",
      confidentialityTag: "Official Academic Project",
      problemStatement: "Urban parking facilities suffer from traffic congestion caused by drivers hunting for open spots, unauthorized parking, slow manual gate checking, and unmonitored revenue leakage.",
      objectives: [
        "Connect ESP32 microcontrollers over Wi-Fi HTTP to report IR sensor slot status in real time.",
        "Build a live interactive parking lot map showing real-time Occupied vs Available spaces.",
        "Generate unique Booking Authentication IDs for instant automated servo barrier opening.",
        "Calculate automatic parking duration tariffs upon vehicle exit."
      ],
      architectureOverview: "IR Sensors -> ESP32 Microcontroller -> Wi-Fi HTTP Protocol -> Flask REST Backend -> Centralized SQL Database -> React Live Parking Lot Map & Barrier Servo Motor Actuator.",
      techStack: [
        { category: "Hardware & Embedded", items: ["ESP32 Wi-Fi", "IR Obstacle Sensors", "SG90 Servo Motors", "C/C++ Arduino IDE"] },
        { category: "Backend & Systems", items: ["Python Flask", "SQLite / PostgreSQL", "REST HTTP API", "JSON Protocol"] },
        { category: "Web Frontend", items: ["React.js", "Tailwind CSS", "Canvas Animations", "WebSockets"] }
      ],
      keyFeatures: [
        { title: "Live Slot Monitoring Map", description: "Interactive visual map updating slot status (Green = Free, Red = Occupied) within 200ms." },
        { title: "Online Reservation & QR Pass", description: "Users reserve slot in advance, receiving a unique Booking ID to trigger entry." },
        { title: "ESP32 Servo Barrier Gate", description: "Automated barrier gate opens only when valid Booking ID or RFID scan is verified." },
        { title: "Automated Billing & Parking Timer", description: "Tracks exact arrival timestamp and calculates automated duration fee upon departure." }
      ],
      developmentJourney: "Engineered both physical hardware circuitry and web software. Tuned ESP32 Wi-Fi reconnect handling and debounced IR sensor signals to avoid false occupancy triggers from sunlight or fleeting obstructions.",
      challengesAndSolutions: [
        { challenge: "Wi-Fi signal drops causing microcontrollers to miss slot state updates.", solution: "Programmed robust auto-reconnect loops and local EEPROM state queuing on ESP32 chips." },
        { challenge: "Race condition when multiple users attempt to reserve the same slot simultaneously.", solution: "Used strict database transaction isolation locks during reservation requests." }
      ],
      impactMetrics: [
        { label: "Hardware Sensor Latency", value: "<150ms" },
        { label: "Slot Search Time Reduction", value: "75%" },
        { label: "Gate Authentication Speed", value: "<0.8s" },
        { label: "Sensor Accuracy", value: "99.4%" }
      ],
      codeSnippet: {
        title: "ESP32_Slot_Controller.ino",
        language: "cpp",
        code: `#include <WiFi.h>
#include <HTTPClient.h>
#include <ESP32Servo.h>

const char* ssid = "PARK_NET_GUEST";
const char* password = "SecurePassword123";
const char* serverUrl = "http://192.168.1.100:5000/api/v1/slot-update";

const int IR_SENSOR_PIN = 14;
const int SERVO_PIN = 18;
Servo barrierServo;
bool lastSlotState = false; // false = free, true = occupied

void setup() {
  Serial.begin(115200);
  pinMode(IR_SENSOR_PIN, INPUT);
  barrierServo.attach(SERVO_PIN);
  barrierServo.write(0); // Gate Closed
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); }
}

void loop() {
  bool currentSlotState = (digitalRead(IR_SENSOR_PIN) == LOW);
  if (currentSlotState != lastSlotState) {
    lastSlotState = currentSlotState;
    sendSlotUpdate(1, currentSlotState);
  }
  delay(200);
}

void sendSlotUpdate(int slotId, bool isOccupied) {
  if(WiFi.status() == WL_CONNECTED){
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    String jsonPayload = "{\"slot_id\":" + String(slotId) + ",\"is_occupied\":" + String(isOccupied ? "true":"false") + "}";
    int httpResponseCode = http.POST(jsonPayload);
    http.end();
  }
}`
      },
      visualType: "quickpark-iot",
      accent: "#8FBF6E",
      sceneLabel: "IoT Hardware",
      index: "05",
      engineeringDecisions: [
        { decision: "Debounced IR sensor readings and added Wi-Fi auto-reconnect with local state queuing on the ESP32.", reasoning: "Raw sensor input triggered false occupancy changes from sunlight and brief obstructions, and dropped Wi-Fi would otherwise silently lose slot updates." },
        { decision: "Enforced transaction isolation locks on reservation writes.", reasoning: "Two users could hit 'reserve' on the same slot within the same window — the database needed to be the source of truth for who won, not the client." }
      ],
      keyLearnings: [
        "In IoT projects, the hardware layer is usually the least reliable part of the stack — debouncing and reconnect handling mattered more than any web-app optimization.",
        "Building the sensor circuitry myself made it much easier to reason about failure modes on the software side."
      ]
    },

    {
      id: "project-6-itconnect",
      title: "ITConnect - Cloud-Native Event Management Platform",
      shortTitle: "ITConnect",
      category: "Cloud-Native & Distributed Systems",
      tagline: "Scalable cloud platform for webinars, hackathons, and technical events deployed with microservices on AWS EC2 & Docker.",
      summary: "A cloud platform for hackathons and webinars, run as Docker microservices on AWS so it stays up when traffic spikes.",
      description: "A high-concurrency cloud-native event hosting platform built for hackathons, webinars, technical workshops, and developer conferences. Deployed using containerized microservices on AWS infrastructure with automated health monitoring, load balancing, and secure cloud storage.",
      confidentialityTag: "Official Academic Project",
      problemStatement: "Traditional monolith event websites suffer severe downtime during peak hackathon registration launches and webinar streaming bursts, leading to database deadlocks and failed user signups.",
      objectives: [
        "Architect a microservices layout isolating Auth, Event Catalog, Registrations, and Media Storage.",
        "Containerize services with Docker for consistent multi-environment deployments.",
        "Deploy on AWS EC2 behind API Gateway & Application Load Balancers for high availability.",
        "Set up AWS CloudWatch & CloudTrail for real-time monitoring and security audit logs."
      ],
      architectureOverview: "Client Web App -> AWS API Gateway -> AWS ALB -> EC2 Cluster (Docker Containers: Auth, Event, Notification Microservices) -> Amazon RDS PostgreSQL + Amazon S3 Bucket -> AWS SNS & CloudWatch Monitoring.",
      techStack: [
        { category: "Cloud & DevOps", items: ["AWS EC2", "AWS S3", "AWS API Gateway", "AWS CloudWatch", "AWS CloudTrail", "AWS VPC", "AWS SNS"] },
        { category: "Containerization", items: ["Docker", "Docker Compose", "Nginx Load Balancer"] },
        { category: "Core Services", items: ["Node.js", "Express.js", "PostgreSQL", "Redis", "TypeScript"] }
      ],
      keyFeatures: [
        { title: "Hackathon & Workshop Engine", description: "Supports multi-track event scheduling, team submissions, and real-time live leaderboards." },
        { title: "Docker Microservices Architecture", description: "Decoupled microservices running in isolated Docker containers with automated restarts." },
        { title: "AWS Cloud Infrastructure", description: "Leverages VPC private subnets, Security Groups, IAM policies, and S3 asset storage." },
        { title: "CloudWatch Real-Time Monitoring", description: "Configured alarms for CPU spikes, memory limits, and automated SNS email notifications." }
      ],
      developmentJourney: "Designed with cloud-native principles. Broken down into 4 core microservices: Auth-Service, Event-Service, Ticket-Service, and Notification-Service communicating via REST and Redis Pub/Sub.",
      challengesAndSolutions: [
        { challenge: "Sudden traffic spikes of 5,000+ concurrent users during hackathon deadline submissions.", solution: "Deployed Redis caching layer and auto-scaling container replicas behind Nginx load balancers." },
        { challenge: "Cross-microservice state synchronization.", solution: "Implemented asynchronous message publishing via AWS SNS for event notifications and email confirmations." }
      ],
      impactMetrics: [
        { label: "Peak Uptime", value: "99.98%" },
        { label: "Concurrent Users Handled", value: "10,000+" },
        { label: "Deployment Build Time", value: "<3 mins" },
        { label: "API Response Latency", value: "<45ms" }
      ],
      visualType: "cloud-aws",
      accent: "#6C93D9",
      sceneLabel: "Cloud Infrastructure",
      index: "06",
      engineeringDecisions: [
        { decision: "Split the platform into four independent microservices (Auth, Event, Ticket, Notification) instead of one monolith.", reasoning: "Registration bursts during hackathon deadlines were causing monolith-style deadlocks — isolating the write-heavy paths let each service scale and fail independently." },
        { decision: "Put a Redis caching layer and auto-scaling replicas behind an Nginx load balancer.", reasoning: "Needed to absorb sudden concurrency spikes (5,000+ users near submission deadlines) without over-provisioning EC2 capacity permanently." }
      ],
      keyLearnings: [
        "Breaking a monolith into services paid off specifically at the traffic spikes it was designed for — the cost is more moving parts to monitor day-to-day.",
        "CloudWatch alarms are only useful if someone's actually looking at them — wiring them to SNS notifications made monitoring proactive instead of reactive."
      ]
    }
  ] as ProjectCaseStudy[],

  research: [
    {
      id: "research-1",
      title: "QuickPark: Efficient Parking with Real-Time Pre-booking",
      conference: "Scopus-Indexed International Conference",
      technologies: ["IoT", "Real-Time Systems"],
    },
    {
      id: "research-2",
      title: "Implementation of CPU Scheduling Algorithms Using Data Structures",
      conference: "Scopus-Indexed International Conference",
      technologies: ["Operating Systems", "Data Structures", "Algorithms"],
    },
    {
      id: "research-3",
      title: "SmartHoneypot: Honeypot System for Lightweight Cyber Threat Detection and Behavior Analysis",
      conference: "Scopus-Indexed International Conference",
      technologies: ["Cybersecurity", "Threat Detection"],
    },
    {
      id: "research-4",
      title: "Validation of ARM Processor Instructions Using Deterministic Finite Automata",
      conference: "Scopus-Indexed International Conference",
      technologies: ["Computer Architecture", "DFA", "Formal Verification"],
    }
  ] as ResearchPaper[]
};
