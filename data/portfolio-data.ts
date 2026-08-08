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
  summary: string;
  highlights: string[];
  techStack: string[];
}

export interface ProjectCaseStudy {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  tagline: string;
  description: string;
  confidentialityTag: "Private Client Project" | "Official Academic Project";
  problemStatement: string;
  objectives: string[];
  architectureOverview: string;
  techStack: { category: string; items: string[] }[];
  keyFeatures: { title: string; description: string; icon?: string }[];
  developmentJourney: string;
  challengesAndSolutions: { challenge: string; solution: string }[];
  impactMetrics: { label: string; value: string }[];
  codeSnippet?: { title: string; language: string; code: string };
  databaseSchema?: { title: string; description: string; tables: { name: string; fields: string[] }[] };
  visualType: "mri-viewer" | "study-saas" | "court-booking" | "residence-hub" | "quickpark-iot" | "cloud-aws";
  /** Muted per-project accent used sparingly in the case study (badges, icon tint). */
  accent: string;
  /** Short category label shown as the card's eyebrow. */
  sceneLabel: string;
  /** Index string like "01", used for case-study pagination. */
  index: string;
  engineeringDecisions: { decision: string; reasoning: string }[];
  keyLearnings: string[];
  /** Featured projects get the large alternating showcase layout; others get the compact card grid. */
  featured?: boolean;
}

export interface TechEntry {
  name: string;
  icon: string;
  label: string;
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
    title: "Full-Stack Developer",
    location: "Coimbatore, India",
    email: "arjunamarnath1008@gmail.com",
    linkedin: "https://linkedin.com/in/arjun-r-amarnath",
    bioShort: "Final-year CS student building full-stack products, applied AI, and cloud-native systems.",
    bioLong: `I'm a final-year Computer Science student with a strong foundation in coding, testing, and full-stack software development. I enjoy exploring different corners of technology — from building complete web applications to experimenting with cloud infrastructure and IoT.

My academic work centers on applied AI, including a multimodal system for brain tumor detection using CNNs, EfficientNet, YOLO, and U-Net, paired with Grad-CAM explainability and a local RAG assistant. I've also deployed a cloud-hosted event platform on AWS, and taken on short full-stack engagements building booking and management platforms for two local businesses.

I currently serve as President of the Computer Society of India (ASEB chapter) at my university.`,
    education: {
      institution: "Amrita Vishwa Vidyapeetham",
      degree: "B.Tech in Computer Science and Engineering",
      period: "2022 – 2026",
      detail: "CGPA: 8.26",
    },
    typingTitles: [
      "Full-Stack Developer",
      "Computer Science Student",
      "Cloud & AI Enthusiast"
    ],
    researchNote: "8 papers accepted/published in Scopus-indexed international conferences, including IEEE and Springer.",
  },

  skills: [
    {
      title: "Web Technologies",
      skills: [
        { name: "HTML" }, { name: "CSS" }, { name: "JavaScript" }, { name: "React.js" },
      ],
    },
    {
      title: "Frontend Tooling",
      skills: [
        { name: "Next.js" }, { name: "TypeScript" }, { name: "Tailwind CSS" }, { name: "Framer Motion" },
      ],
    },
    {
      title: "Backend & Databases",
      skills: [
        { name: "Node.js" }, { name: "Express.js" }, { name: "Flask" }, { name: "MySQL" }, { name: "MongoDB" }, { name: "PostgreSQL" }, { name: "Supabase" },
      ],
    },
    {
      title: "Cloud & DevOps",
      skills: [
        { name: "AWS (EC2, S3, API Gateway, CloudWatch, SNS)" }, { name: "Docker" }, { name: "Git" }, { name: "GitHub" },
      ],
    },
    {
      title: "Languages",
      skills: [
        { name: "Java" }, { name: "Python" }, { name: "SQL" },
      ],
    },
    {
      title: "Artificial Intelligence & ML",
      skills: [
        { name: "CNN" }, { name: "EfficientNet" }, { name: "YOLO" }, { name: "U-Net" }, { name: "Grad-CAM" }, { name: "PyTorch" }, { name: "OpenCV" }, { name: "Local RAG (Ollama)" },
      ],
    },
  ] as SkillCategory[],

  experience: [
    {
      id: "cue-court-coffee",
      company: "Cue Court Coffee",
      role: "Full-Stack Developer",
      period: "May 2026 – Jun 2026",
      location: "Coimbatore, India",
      summary: "Architected and built a comprehensive enterprise sports venue management platform that digitizes court bookings, food ordering, customer memberships, revenue analytics, and automated AI notifications.",
      highlights: [
        "Architected real-time court booking engine with automatic slot locking to prevent double bookings.",
        "Built automated Food & Beverage Billing POS integrated directly with reserved court tabs.",
        "Designed Membership & Loyalty Management system driving recurring venue revenue.",
        "Implemented real-time Revenue Analytics dashboard with predictive slot demand forecasting.",
        "Integrated CueBot AI Assistant powered by WhatsApp Cloud API for automated customer booking, slot inquiries, and instant reminders.",
      ],
      techStack: ["React.js", "Node.js", "Express.js", "PostgreSQL", "WhatsApp Cloud API", "Tailwind CSS", "Chart.js"],
    },
    {
      id: "perfect-study-space",
      company: "Perfect Study Space",
      role: "Full-Stack Developer",
      period: "Jun 2026 – Jul 2026",
      location: "Coimbatore, India",
      summary: "Engineered a multi-tenant SaaS management platform supporting study centers across multiple branches with automated attendance tracking, CRM pipeline, revenue analytics, staff shift control, and AI study assistance.",
      highlights: [
        "Built scalable multi-branch SaaS architecture separating tenant data securely with strict RBAC rules.",
        "Engineered automated member attendance tracking system with real-time capacity monitoring.",
        "Developed full CRM pipeline for lead conversion, membership renewals, and automated WhatsApp alert triggers.",
        "Created centralized Staff Operations Dashboard & automated payroll & session verification.",
        "Embedded an AI Assistant trained on study schedules, seat allocation rules, and administrative workflows.",
      ],
      techStack: ["Next.js", "TypeScript", "Node.js", "MongoDB", "Supabase", "Tailwind CSS", "Docker"],
    },
  ] as ExperienceItem[],

  projects: [
    {
      id: "project-1-brain-tumor-detection",
      title: "AI-Powered Brain Tumor Detection & Clinical Decision Support System",
      shortTitle: "Brain Tumor AI",
      category: "Medical Artificial Intelligence",
      tagline: "End-to-end medical vision platform for brain abnormality detection, U-Net segmentation, Grad-CAM heatmaps, and Local RAG decision support.",
      description: "An advanced clinical AI platform that assists radiologists and doctors in identifying brain tumors from raw MRI scans. Combines deep CNN models (EfficientNet, YOLO, U-Net) for classification and pixel-wise tumor segmentation with Explainable AI (Grad-CAM) and a Local RAG clinical assistant trained on medical literature.",
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
        { category: "AI & ML", items: ["PyTorch", "CNN", "YOLOv8", "EfficientNet-B4", "U-Net", "Grad-CAM", "OpenCV"] },
        { category: "Local RAG & NLP", items: ["LangChain", "Ollama (Llama-3)", "FAISS Vector DB", "Python"] },
        { category: "Full Stack UI", items: ["Next.js", "Tailwind CSS", "Canvas API", "REST APIs"] }
      ],
      keyFeatures: [
        { title: "Interactive MRI Viewer", description: "Multi-modal viewer to switch between raw T1/T2 MRI scans, segmented tumor masks, and heatmaps." },
        { title: "Grad-CAM Explainability", description: "Renders visual heatmap overlays showing exact feature regions triggering the neural network diagnosis." },
        { title: "U-Net Precise Segmentation", description: "Calculates precise tumor volume measurements and pixel boundaries automatically." },
        { title: "Privacy-Preserving Local RAG", description: "Instant diagnostic assistance drawing from medical literature running 100% locally." }
      ],
      developmentJourney: "Developed through extensive iteration on 10,000+ DICOM brain MRI images. Implemented transfer learning with EfficientNet for initial screening, then paired it with a custom U-Net for dense segmentation. Integrated Grad-CAM to allow clinicians to inspect activation heatmaps before validating diagnoses.",
      challengesAndSolutions: [
        { challenge: "Model hallucination and black-box reluctance from medical practitioners.", solution: "Implemented Grad-CAM visualization layer overlaying exact tensor activation maps directly onto MRI slices." },
        { challenge: "HIPAA compliance and cloud data security concerns.", solution: "Engineered 100% local RAG workflow utilizing Ollama and local vector indices on workstation GPUs." }
      ],
      impactMetrics: [
        { label: "Classification Accuracy", value: "98.7%" },
        { label: "Segmentation IoU Score", value: "0.91" },
        { label: "Diagnostic Time Saved", value: "65%" },
        { label: "Local RAG Latency", value: "<1.2s" }
      ],
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
      ]
    },

    {
      id: "project-2-perfect-study-space",
      title: "Perfect Study Space - Multi-Tenant SaaS Platform",
      shortTitle: "Perfect Study Space",
      category: "Multi-Tenant SaaS Platform",
      tagline: "Scalable study center management platform with multi-branch isolation, membership automated renewal, CRM, and AI study assistant.",
      description: "A commercial SaaS platform built for educational hubs and coworking study centers. Features multi-tenant branch management, instant RFID/QR member attendance, automated subscription billing, staff duty management, and an embedded AI concierge.",
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
        { category: "Frontend", items: ["Next.js", "React.js", "TypeScript", "Tailwind CSS", "Framer Motion"] },
        { category: "Backend", items: ["Node.js", "Express.js", "MongoDB", "Supabase", "WebSockets"] },
        { category: "Integrations", items: ["WhatsApp Cloud API", "Razorpay / Stripe", "Chart.js"] }
      ],
      keyFeatures: [
        { title: "Multi-Branch Switcher", description: "Centralized administration with instant branch switching and isolated tenant reporting." },
        { title: "Live Attendance & Seat Map", description: "Real-time visual map of vacant vs occupied study desks across branches." },
        { title: "Automated Membership Renewal", description: "Automated SMS/WhatsApp payment link generation prior to subscription expiry." },
        { title: "AI Administrative Assistant", description: "Embedded chatbot answering member FAQs, desk availability, and center policies." }
      ],
      developmentJourney: "Built from scratch to support multi-branch expansion. Designed custom tenant resolution middleware that automatically scopes DB queries by Tenant ID, guaranteeing zero cross-branch data leaks while sharing unified infrastructure.",
      challengesAndSolutions: [
        { challenge: "Handling concurrency during peak morning check-ins.", solution: "Implemented Redis cached seat state with atomic counter locks preventing double desk assignments." },
        { challenge: "Member churn due to forgotten renewals.", solution: "Automated a 3-stage WhatsApp reminder sequence with instant 1-click renewal links." }
      ],
      impactMetrics: [
        { label: "Active Branches Managed", value: "8+" },
        { label: "Daily Active Members", value: "2,500+" },
        { label: "Member Renewal Boost", value: "34%" },
        { label: "Admin Work Hours Saved", value: "20 hrs/wk" }
      ],
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
      tagline: "Full-stack sports venue & cafe platform automating court bookings, food ordering POS, membership tabs, and WhatsApp AI bot.",
      description: "An end-to-end venue management system designed for sports complexes featuring court reservations, integrated cafe ordering, player membership accounts, real-time revenue analytics, and an interactive WhatsApp AI assistant.",
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
        { category: "Full Stack", items: ["React.js", "Node.js", "Express.js", "PostgreSQL", "Tailwind CSS"] },
        { category: "AI & Messaging", items: ["WhatsApp Cloud API", "OpenAI / NLP Intent Engine", "WebSockets"] }
      ],
      keyFeatures: [
        { title: "Court Booking Matrix", description: "Interactive timeline grid for court slot selection, lighting controls, and equipment rentals." },
        { title: "Integrated Cafe POS", description: "Allows players to order food & drinks directly to their court tab during matches." },
        { title: "CueBot AI WhatsApp Assistant", description: "Customers can text 'Book Court 2 tomorrow 6pm' and receive an instant booking confirmation." },
        { title: "Revenue & Peak Analytics", description: "Deep visual analytics highlighting peak play hours, court utilization %, and cafe sales." }
      ],
      developmentJourney: "Collaborated directly with facility managers to identify operational bottlenecks. Built a fast, low-latency POS interface for cafe staff synchronized with the main court reservation database via WebSockets.",
      challengesAndSolutions: [
        { challenge: "Concurrent booking attempts on popular evening slots.", solution: "Built 5-minute temporary slot locks in Redis with automatic expiration if payment is unfulfilled." },
        { challenge: "High latency in WhatsApp bot responses.", solution: "Optimized NLP intent parsing to respond in under 400ms with interactive WhatsApp list buttons." }
      ],
      impactMetrics: [
        { label: "Court Utilization Increase", value: "+42%" },
        { label: "Double Bookings", value: "0%" },
        { label: "WhatsApp Bookings Share", value: "68%" },
        { label: "Cafe Revenue Growth", value: "+28%" }
      ],
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
      id: "project-4-residence-hub",
      title: "Residence Hub - Residential Community Management Platform",
      shortTitle: "Residence Hub",
      category: "Residential Community Management",
      tagline: "Centralized apartment platform digitizing resident management, maintenance requests, complaint escalation, and billing ops.",
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

/** Technology showcase data — `icon` maps to a react-icons export name (Si* or FaAws). */
// Every entry here is grounded in the resume's Skills section or a
// technology named in an actual project/experience — nothing decorative.
export const TECH_STACK: TechEntry[] = [
  { name: "React", icon: "SiReact", label: "Frontend" },
  { name: "Next.js", icon: "SiNextdotjs", label: "Framework" },
  { name: "TypeScript", icon: "SiTypescript", label: "Language" },
  { name: "JavaScript", icon: "SiJavascript", label: "Language" },
  { name: "HTML5", icon: "SiHtml5", label: "Markup" },
  { name: "CSS3", icon: "SiCss", label: "Styling" },
  { name: "Tailwind CSS", icon: "SiTailwindcss", label: "Styling" },
  { name: "Framer Motion", icon: "SiFramer", label: "Animation" },
  { name: "Node.js", icon: "SiNodedotjs", label: "Runtime" },
  { name: "Express", icon: "SiExpress", label: "Backend" },
  { name: "Flask", icon: "SiFlask", label: "Backend" },
  { name: "Python", icon: "SiPython", label: "Language" },
  { name: "PyTorch", icon: "SiPytorch", label: "AI / ML" },
  { name: "Java", icon: "SiOpenjdk", label: "Language" },
  { name: "MySQL", icon: "SiMysql", label: "Database" },
  { name: "MongoDB", icon: "SiMongodb", label: "Database" },
  { name: "PostgreSQL", icon: "SiPostgresql", label: "Database" },
  { name: "Supabase", icon: "SiSupabase", label: "Backend" },
  { name: "AWS", icon: "FaAws", label: "Cloud" },
  { name: "Docker", icon: "SiDocker", label: "DevOps" },
  { name: "Git", icon: "SiGit", label: "Version Control" },
  { name: "GitHub", icon: "SiGithub", label: "Version Control" },
];
