import type { AssetName } from "./assets";
import type { VideoName } from "./videos";
import type { Tool } from "@/components/ToolIcon";

/* ------------------------------------------------------------------
   Every project on the site lives here. To add or edit a project,
   change this file: the home page, the work page and the case study
   pages all read from it. Projects show in this order.
   ------------------------------------------------------------------ */

export type Category = "Freelance" | "Jabrni" | "Amana Homes" | "Quotify" | "Personal & Uni";

export const CATEGORIES: { name: Category; color: string; dates: string }[] = [
  { name: "Freelance", color: "#e173ae", dates: "Aug 2026 – Present" },
  { name: "Jabrni", color: "#f3c11b", dates: "Mar 2026 – Aug 2026" },
  { name: "Amana Homes", color: "#b83244", dates: "2025 – 2026" },
  { name: "Quotify", color: "#e77f23", dates: "2025 – 2026" },
  { name: "Personal & Uni", color: "#518c2d", dates: "2023 – 2025" },
];

export type Block =
  | { type: "text"; body: string[] }
  | { type: "image"; asset: AssetName; alt: string; span?: "full" | "half" | "third" | "twoThirds"; bg?: string; pad?: boolean }
  | { type: "compare"; before: { asset: AssetName; alt: string; text?: string }; after: { asset: AssetName; alt: string; text?: string } }
  /** A screen recording of a live site, in a browser window or a phone */
  | { type: "video"; name: VideoName; frame: "browser" | "phone"; alt: string; span?: "full" | "half" | "third" | "twoThirds"; bg?: string }
  /** A grid of small vector elements on coloured tiles */
  | { type: "elements"; bg: string; items: { asset: AssetName; label: string }[] };

export type Project = {
  slug: string;
  title: string;
  /** Short label shown on cards, e.g. "Website" */
  type: string;
  client: string;
  category: Category;
  year: string;
  role: string[];
  tools: Tool[];
  /** Main colour used for the card and the case study header */
  color: string;
  /** Text colour on top of `color` */
  ink: string;
  /** Card + case study cover. `video` plays a screen recording instead of the still image. */
  cover: { asset: AssetName; fit?: "cover" | "contain"; bg?: string; video?: VideoName };
  /** Web address shown in the browser frame of website videos */
  siteUrl?: string;
  links?: { label: string; href: string }[];
  featured?: boolean;
  blocks: Block[];
};

export const PROJECTS: Project[] = [
  {
    slug: "cloud-castle",
    title: "Cloud Castle",
    type: "Website",
    client: "Cloud Castle",
    category: "Freelance",
    year: "2026",
    role: ["Website design", "Development", "Brand elements"],
    tools: ["figma"],
    color: "#7c53e8",
    ink: "#ffffff",
    cover: { asset: "cc-web-home", video: "cc-desktop" },
    siteUrl: "cloudcastle.co",
    featured: true,
    blocks: [
      {
        type: "text",
        body: [
          "A new storefront for Cloud Castle, a women's fashion label. The site is a castle you climb down through: sky and clouds, a balcony railing, the pearl room of products, the founder's two arches, another balcony, the newsletter, and the plum foundations in the footer.",
          "Designed in Figma and built as a custom storefront, with Shopify handling products and checkout.",
        ],
      },
      { type: "image", asset: "cc-web-shop", alt: "Shop page", span: "half" },
      { type: "image", asset: "cc-web-product", alt: "Product page", span: "half" },
      { type: "video", name: "cc-mobile", frame: "phone", alt: "Scrolling the homepage on a phone", span: "third", bg: "#b9a4f0" },
      { type: "image", asset: "cc-mob-shop", alt: "Shop on mobile", span: "third", bg: "#b9a4f0", pad: true },
      { type: "image", asset: "cc-mob-product", alt: "Product page on mobile", span: "third", bg: "#b9a4f0", pad: true },
      { type: "image", asset: "cc-web-about", alt: "Our Story page", span: "full" },
      {
        type: "text",
        body: ["New brand elements for the site: balcony railings and balusters, pointed and round arches, oval frames, sparkles, the castle outline that frames every page, and the scalloped footer."],
      },
      {
        type: "elements",
        bg: "linear-gradient(#c8b8f3, #7c53e8)",
        items: [
          { asset: "cc-el-railing", label: "Railing" },
          { asset: "cc-el-baluster", label: "Baluster" },
          { asset: "cc-el-arch-pointed", label: "Pointed arch" },
          { asset: "cc-el-arch-round", label: "Arch" },
          { asset: "cc-el-oval-ring", label: "Oval frame" },
          { asset: "cc-el-sparkle-big", label: "Sparkle" },
          { asset: "cc-el-castle-outline", label: "Castle outline" },
          { asset: "cc-el-footer-scallop", label: "Footer" },
        ],
      },
    ],
  },
  {
    slug: "b1-properties-social-system",
    title: "B1 Properties",
    type: "Instagram · Interim designer",
    client: "B1 Properties",
    category: "Freelance",
    year: "2026",
    role: ["Interim design support", "Instagram templates", "Website audit"],
    tools: ["figma"],
    color: "#111110",
    ink: "#ecedd8",
    cover: { asset: "s03-posts" },
    featured: true,
    blocks: [
      {
        type: "text",
        body: [
          "B1 Properties is a Dubai luxury real estate brokerage selling some of the city's most exclusive addresses, from signature villas on Palm Jumeirah to branded residences like Bvlgari Mansions on Jumeirah Bay Island.",
          "I was brought on as interim design support while they hired a graphic designer, to elevate their branding as their in-house designer was leaving. Their existing templates were consistent, but they'd started to feel outdated and didn't read as recognizably B1. There was also a functional gap: no carousel format existed, and nothing was editable, so every new post needed a designer to build it from scratch.",
        ],
      },
      { type: "image", asset: "s18-grid", alt: "Moodboard: colour and texture, white space, masking, geometric shapes", span: "full", bg: "#111110", pad: true },
      {
        type: "text",
        body: [
          "In under a week, I designed a new set of Figma templates across multiple formats, including carousels, and made them fully editable so their team could keep the brand running without a full-time designer. For the visual direction, I looked to architecture: B1's own logo already features an arch, so I pulled that shape through as a recurring element across the templates, tying the new system back to both their brand mark and the architectural character of the properties they sell.",
          "The result is a template system that reads as more recognizably B1, covers more content types than before, and doesn't depend on a designer to keep running.",
          "Alongside the posts, carousels and Stories, I put together a playbook covering eight UAE occasions, audited the live website against reference sites and helped redesign its weakest elements, and produced a design assessment for Bvlgari Mansions with a mood board, color and type system, and five layouts.",
        ],
      },
      { type: "image", asset: "s03-posts", alt: "Static posts and stories", span: "full", bg: "#111110", pad: true },
      { type: "image", asset: "s10-a", alt: "Carousel", span: "half" },
      { type: "image", asset: "s10-b", alt: "Carousel", span: "half" },
      { type: "image", asset: "s10-c", alt: "Carousel", span: "half" },
      { type: "image", asset: "s10-d", alt: "Carousel", span: "half" },
      { type: "image", asset: "s08-top", alt: "Holiday Instagram stories", span: "full", bg: "#111110", pad: true },
      { type: "image", asset: "s08-bottom", alt: "More holiday Instagram stories", span: "full", bg: "#111110", pad: true },
    ],
  },
  {
    slug: "b1-company-profile",
    title: "B1 Company Profile",
    type: "Company profile",
    client: "B1 Properties",
    category: "Freelance",
    year: "2026",
    role: ["Editorial design"],
    tools: ["figma"],
    color: "#9cc3e0",
    ink: "#111110",
    cover: { asset: "s05-new" },
    blocks: [
      {
        type: "compare",
        before: {
          asset: "s05-old",
          alt: "Old B1 company profile pages",
          text: "The old B1 Properties company profile didn't match the brand's ultra-luxury positioning at a design level. Pages leaned on dense paragraphs, small decorative line motifs that felt like leftover template flourishes, and photography boxed into standard blocks instead of leading the page.",
        },
        after: {
          asset: "s05-new",
          alt: "New B1 company profile pages",
          text: "The new profile breaks the same content into shorter, more scannable passages and lets photography lead each page. Bold pull quotes give key statements, like the CEO's message, real weight, and B1's own arch motif now runs through the design as large architectural shapes behind key photography, instead of the small line work before. The result reads as premium and considered rather than templated.",
        },
      },
    ],
  },
  {
    slug: "theorem-partners",
    title: "Theorem Partners",
    type: "Brand identity",
    client: "Theorem Partners",
    category: "Freelance",
    year: "2026",
    role: ["Logo", "Brand identity", "Mini style guide"],
    tools: ["figma", "illustrator"],
    color: "#08322b",
    ink: "#c4b29e",
    cover: { asset: "s02-logo", fit: "contain", bg: "#08322b" },
    featured: true,
    blocks: [
      {
        type: "text",
        body: [
          "Theorem Partners needed a brand identity built from scratch for a UAE/London executive recruitment firm working with senior clients, the kind of positioning that couldn't get away with generic recruiter branding like arrows and people icons.",
          "Rather than default to those clichés, I explored a mathematical visual language, working through monograms and non-text marks built around mathematical elements, since executive search is fundamentally precision work: matching the right person to the right role. That concept carried through the full identity.",
          "I presented several directions so the client could give feedback early, then delivered the logo and mini style guide working solo and directly with the founder. This project later extended into designing creatives for his tailoring company.",
        ],
      },
      { type: "image", asset: "s02-spiral", alt: "Golden-ratio spiral construction", span: "third", bg: "#08322b", pad: true },
      { type: "image", asset: "s06-bigp", alt: "TP monogram", span: "twoThirds", bg: "#e9d7c3", pad: true },
      { type: "image", asset: "s06-white", alt: "Logo on white", span: "half", bg: "#e9d7c3", pad: true },
      { type: "image", asset: "s06-green", alt: "Logo on green", span: "half", bg: "#e9d7c3", pad: true },
      { type: "image", asset: "s06-wine", alt: "Logo on wine", span: "half", bg: "#e9d7c3", pad: true },
      { type: "image", asset: "s06-black", alt: "Logo on black", span: "half", bg: "#e9d7c3", pad: true },
      { type: "image", asset: "s06-mark", alt: "Monogram on white", span: "half", bg: "#e9d7c3", pad: true },
      { type: "image", asset: "s06-grid", alt: "Monogram clear-space grid", span: "half", bg: "#e9d7c3", pad: true },
    ],
  },
  {
    slug: "marco-oro",
    title: "Marco Oro",
    type: "Print",
    client: "Marco Oro Tailoring",
    category: "Freelance",
    year: "2026",
    role: ["Business card", "Roll-up banner", "Brochure"],
    tools: ["illustrator"],
    color: "#f9f3e7",
    ink: "#1e1e1e",
    cover: { asset: "s07-cards", fit: "contain", bg: "#e8dcc4" },
    blocks: [
      {
        type: "text",
        body: [
          "Marco Oro came through the same client relationship as Theorem Partners. The existing branding materials a business card, and roll-up banner, weren't actually print-ready, so this was a redesign rather than a from-scratch build: I got them production-ready while slightly elevating the brand along the way.",
          "Since tailoring calls for a different register than executive recruitment, warmer and more tactile than the precision-driven identity I built for Theorem, that shift carried through the redesigned set so the brand felt consistent whether someone was holding the business card or standing in front of the banner at a fitting.",
        ],
      },
      { type: "image", asset: "s07-logo", alt: "Marco Oro logo", span: "full", bg: "#f9f3e7", pad: true },
      { type: "image", asset: "s07-banner", alt: "Roll-up banner", span: "third", bg: "#e8dcc4", pad: true },
      { type: "image", asset: "s07-cards", alt: "Business cards, front and back", span: "twoThirds", bg: "#e8dcc4", pad: true },
    ],
  },
  {
    slug: "jabrni-brand-identity",
    title: "Jabrni",
    type: "Brand identity",
    client: "Jabrni",
    category: "Jabrni",
    year: "2026",
    role: ["Brand identity", "Logo system", "Stationery", "Social media"],
    tools: ["figma", "motion"],
    color: "#141211",
    ink: "#ecedd8",
    cover: { asset: "s24-grid" },
    featured: true,
    blocks: [
      {
        type: "text",
        body: [
          "Jabrni begins with a simple idea: talk to me.",
          "Every project starts with a conversation. An understanding of what the client needs and what stands in their way.",
          "Jabrni exists to make digital work feel less scattered. Brands often rely on too many tools, too many platforms, and too many disconnected workflows. Jabrni brings these pieces together into a single, coherent system.",
          "From websites to social media to AI automation, each solution is shaped around the client.",
          "Logo and icon system with service sub-logos, a warm gradient visual language, stationery and business cards, and social templates carrying the system into practice. Delivered with brand guidelines covering logo usage, contrast rules, and colour boundaries so the identity holds up without me in the room.",
        ],
      },
      { type: "image", asset: "s24-grid", alt: "Jabrni moodboard and brand imagery", span: "full" },
      { type: "image", asset: "s24-a", alt: "Jabrni logo variations", span: "half" },
      { type: "image", asset: "s24-b", alt: "Jabrni website header", span: "half" },
      { type: "image", asset: "s20-a", alt: "Jabrni icon usage", span: "half" },
      { type: "image", asset: "s20-b", alt: "Jabrni sub-logos", span: "half" },
      { type: "image", asset: "s20-letter", alt: "Jabrni letterhead", span: "third", bg: "#1b1816", pad: true },
      { type: "image", asset: "s20-grads", alt: "Jabrni gradient system", span: "third", bg: "#1b1816", pad: true },
      { type: "image", asset: "s20-cards", alt: "Jabrni business cards", span: "third", bg: "#1b1816", pad: true },
      { type: "image", asset: "s01-feed-a", alt: "Instagram post: Who are we?", span: "third", bg: "#1b1816", pad: true },
      { type: "image", asset: "s01-feed-b", alt: "Instagram post: recent client work", span: "third", bg: "#1b1816", pad: true },
      { type: "image", asset: "s01-reel", alt: "Instagram reel", span: "third", bg: "#1b1816", pad: true },
    ],
  },
  {
    slug: "sidani-art",
    title: "SIDANI.ART",
    type: "Website",
    client: "Nemr Sidani",
    category: "Jabrni",
    year: "2026",
    role: ["Visual identity", "Web design"],
    tools: ["figma"],
    color: "#e6dcd4",
    ink: "#191717",
    cover: { asset: "s19-b" },
    blocks: [
      {
        type: "text",
        body: [
          "For this multimedia artist's portfolio website, I started with a bold, colorful direction. Since his work leans heavily on doodles and sketches, I built the landing experience as an \"artist's table,\" sketches, notes, and photos scattered across a desk, so scrolling in felt like peeking straight into his sketchbook.",
          "He wanted something more refined instead, closer to a gallery, so I pivoted the whole direction: a minimal, gallery-style layout built from his references, framed pieces on clean walls, generous whitespace, and micro-animations layered throughout to keep it from feeling static.",
          "The final site has a gallery-led homepage that puts the work first, a categorised browse structure across drawings, paintings, studies and prints, and a scrapbook-styled About page built to feel handmade rather than corporate.",
        ],
      },
      { type: "image", asset: "s19-a", alt: "First direction: the artist's table", span: "third" },
      { type: "image", asset: "s19-b", alt: "Final direction: gallery-style homepage", span: "twoThirds" },
    ],
  },
  {
    slug: "cemex",
    title: "Cemex",
    type: "PDF redesign · Booth",
    client: "Cemex",
    category: "Jabrni",
    year: "2026",
    role: ["Service manifesto redesign", "Exhibition booth", "Campaign visual"],
    tools: ["figma", "illustrator"],
    color: "#0000b3",
    ink: "#ecedd8",
    cover: { asset: "s23-main" },
    featured: true,
    blocks: [
      {
        type: "compare",
        before: {
          asset: "s21-l1",
          alt: "Original Cemex document",
          text: "The original Cemex document felt scattered: text out of alignment, tables that didn't hold together.",
        },
        after: {
          asset: "s21-r1",
          alt: "Redesigned Cemex service manifesto",
          text: "I rebuilt it from the ground up, working closely against Cemex's strict brand guidelines through several rounds of revisions to get every detail right. The result is clean, properly aligned, and visually cohesive, with icon-driven flows for ordering and billing, real UAE project photography like the One&Only Zabeel build, and scale callouts on project volumes in m³. I also designed matching signage as part of the same engagement.",
        },
      },
      { type: "image", asset: "s21-r2", alt: "Our commitment to excellence spread", span: "third" },
      { type: "image", asset: "s21-r4", alt: "Quality guarantee spread", span: "third" },
      { type: "image", asset: "s21-r5", alt: "Cemex in UAE spread", span: "third" },
      { type: "text", body: ["Also produced an irregular-format exhibition booth and the Falcon Cement campaign visual. One of five repeat engagements for Cemex."] },
      { type: "image", asset: "s23-main", alt: "Booth graphic: Enabling you to build sustainably", span: "twoThirds" },
      { type: "image", asset: "s23-photo", alt: "The team at the finished booth", span: "third" },
    ],
  },
  {
    slug: "sandspire-website",
    title: "Sandspire Website",
    type: "Website · Earlier version",
    client: "Sandspire",
    category: "Jabrni",
    year: "2026",
    role: ["Web design"],
    tools: ["figma"],
    color: "#1b1816",
    ink: "#ecedd8",
    cover: { asset: "s28-hero" },
    blocks: [
      { type: "text", body: ["An earlier version of the Sandspire website, before it was redesigned."] },
      { type: "image", asset: "s28-long-a", alt: "Selected work page, desktop", span: "twoThirds" },
      { type: "image", asset: "s28-long-b", alt: "Selected work page, mobile", span: "third" },
    ],
  },
  {
    slug: "ai-concept-renders",
    title: "AI Concept Renders",
    type: "AI renders",
    client: "In Design Interiors · wasl",
    category: "Jabrni",
    year: "2026",
    role: ["AI imagery"],
    tools: ["photoshop", "gemini"],
    color: "#c7a78c",
    ink: "#1e1e1e",
    cover: { asset: "s27-new" },
    blocks: [
      {
        type: "compare",
        before: { asset: "s27-old", alt: "Original office photos" },
        after: { asset: "s27-new", alt: "AI concept renders" },
      },
    ],
  },
  {
    slug: "amana-homes-campaigns",
    title: "Amana Homes",
    type: "Social media · Ads",
    client: "Amana Homes Real Estate",
    category: "Amana Homes",
    year: "2025–2026",
    role: ["Creative Marketing & Media Intern", "Social media", "Meta ads", "Print"],
    tools: ["figma", "photoshop", "gemini"],
    color: "#f1e8d6",
    ink: "#1e1e1e",
    cover: { asset: "s29-main" },
    links: [{ label: "instagram.com/amanahomes_realestate", href: "https://www.instagram.com/amanahomes_realestate/" }],
    featured: true,
    blocks: [
      {
        type: "text",
        body: [
          "Owned brand, content and growth for a boutique Dubai real estate brokerage. Grew LinkedIn from 0 to 600+ and Instagram from 20 to 200+ with a consistent content calendar, ran paid Meta campaigns and creative for 10+ campaigns across Instagram, LinkedIn, TikTok and WhatsApp, and designed luxury property branding, bilingual advertising, brochures and sales collateral.",
        ],
      },
      { type: "image", asset: "s26-top", alt: "JVC off-plan investment carousel", span: "full" },
      { type: "image", asset: "s26-bottom", alt: "Live in sync with nature carousel", span: "full" },
      { type: "image", asset: "s29-main", alt: "Property ads, flyers and brochure pages", span: "full" },
      {
        type: "text",
        body: [
          "An agent's WhatsApp message, a price and a single phone photo, isn't something you can send to a prospective tenant. I extended the shot for a stronger composition and built it into a branded flyer with pricing, agent contact, and a photo gallery, ready to go out immediately.",
        ],
      },
      { type: "image", asset: "s35-whatsapp", alt: "The agent's WhatsApp message and phone photo", span: "half", bg: "#e8dcc4", pad: true },
      { type: "image", asset: "s35-flyer", alt: "Branded flyer", span: "half", bg: "#e8dcc4", pad: true },
      {
        type: "text",
        body: [
          "Binghatti's villa community pre-launch called for a 'mysterious animals in nature' theme. I built a moody, nature-led poster for their 'Live In Sync With Nature' campaign to match that direction.",
        ],
      },
      { type: "image", asset: "s35-poster", alt: "Binghatti Live In Sync With Nature poster", span: "half", bg: "#1d2a1c", pad: true },
    ],
  },
  {
    slug: "amana-notion-hq",
    title: "Marketing HQ",
    type: "Notion workspace",
    client: "Amana Homes Real Estate",
    category: "Amana Homes",
    year: "2025",
    role: ["Workflow design"],
    tools: ["notion"],
    color: "#2b2b2b",
    ink: "#ecedd8",
    cover: { asset: "s22-a" },
    blocks: [
      {
        type: "text",
        body: [
          "Created a Teamspace-based Notion workspace designed as a marketing ops hub. An HQ dashboard embeds database views for filming/posting calendars, thematic planning, tasks, docs/assets, and content ideas. Structured schemas + multiple views + reusable templates run the workflow, with links out to Figma and social channels.",
        ],
      },
      { type: "image", asset: "s22-a", alt: "Marketing Department HQ dashboard", span: "full" },
      { type: "image", asset: "s22-b", alt: "Task board", span: "full" },
    ],
  },
  {
    slug: "quotify",
    title: "Quotify",
    type: "Website · Brand · UI/UX",
    client: "Quotify (co-founder)",
    category: "Quotify",
    year: "2025–2026",
    role: ["Website", "Brand identity", "UI/UX", "Marketing assets", "IEEE paper co-author"],
    tools: ["figma"],
    color: "#3883de",
    ink: "#ffffff",
    cover: { asset: "q-web-home", video: "q-desktop" },
    siteUrl: "quotifyx.app",
    links: [
      { label: "quotifyx.app", href: "https://quotifyx.app" },
      { label: "IEEE paper", href: "https://doi.org/10.1109/SRC70627.2026.11550518" },
      { label: "Figma file", href: "https://www.figma.com/design/KIcdq0vEgaxPtfCzZyFrgf/Quotify?node-id=72-54&t=L7yFbnEJP4vwKRka-1" },
    ],
    featured: true,
    blocks: [
      {
        type: "text",
        body: [
          "Quotify is an AI-powered platform I co-founded, and my role was owning the design and creative side end to end. That meant the brand identity, all the UI/UX and front-end work for the product itself, and any physical creative we needed along the way, merch, poster printing, whatever came up.",
          "Treating design as core to the product rather than an afterthought meant the brand stayed consistent whether someone was using the product or reading up something we'd printed for the final presentation.",
        ],
      },
      { type: "image", asset: "q-web-pricing", alt: "Pricing page", span: "twoThirds" },
      { type: "video", name: "q-mobile", frame: "phone", alt: "Scrolling quotifyx.app on a phone", span: "third", bg: "#3883de" },
      { type: "image", asset: "s31-a", alt: "Dashboard", span: "half" },
      { type: "image", asset: "s31-b", alt: "Clients table", span: "half" },
      { type: "image", asset: "s31-imac", alt: "Login screen on an iMac", span: "half", bg: "#5cb4f3", pad: true },
      { type: "image", asset: "s15-main", alt: "Research poster", span: "half", bg: "#5cb4f3", pad: true },
      { type: "image", asset: "s32-main", alt: "Brand sheet: type, logos, colours and tone", span: "full" },
      { type: "image", asset: "s32-a", alt: "T-shirt merch", span: "half" },
      { type: "image", asset: "s32-b", alt: "The team in branded t-shirts", span: "half" },
      { type: "image", asset: "s09-main", alt: "Instagram campaign posts", span: "full", bg: "#56adf0", pad: true },
    ],
  },
  {
    slug: "tremo",
    title: "Tremo",
    type: "Mobile app · Research",
    client: "ISDIA 2026 · \u201cMobile Spiralometry Application Integrating Gamification and Accessibility for Parkinson's Symptom Tracking\u201d",
    category: "Personal & Uni",
    year: "2026",
    role: ["Product design", "Research paper"],
    tools: ["figma"],
    color: "#20837c",
    ink: "#ffffff",
    cover: { asset: "s34-app" },
    blocks: [
      {
        type: "text",
        body: [
          "I designed and built Tremo, a mobile app that turns a known clinical hand-tremor test into something people with Parkinson's can actually use on their own.",
          "It's built accessibility-first, with a simple interface for people with reduced dexterity, gamification to keep the test from feeling like a chore, and voice input so typing isn't a barrier. It tracks tremor severity over time, and became a research paper I co-authored and presented at ISDIA 2026.",
        ],
      },
      { type: "image", asset: "s34-app", alt: "App screens: spiral test, results and profile", span: "full" },
      { type: "image", asset: "s34-cert", alt: "ISDIA 2026 certificate of appreciation", span: "half" },
    ],
  },
  {
    slug: "interiorly-vr",
    title: "Interiorly",
    type: "VR UI",
    client: "University project",
    category: "Personal & Uni",
    year: "2025",
    role: ["VR UI design"],
    tools: ["figma"],
    color: "#deba38",
    ink: "#1e1e1e",
    cover: { asset: "s30-b" },
    links: [{ label: "FigJam board", href: "https://www.figma.com/board/zYPDKy1Hj6fSRqhZvLXwuX/388-Project?node-id=0-1&t=lZCwJQ9BnPQPcNei-1" }],
    blocks: [
      { type: "image", asset: "s30-a", alt: "Sketches and user flow", span: "full" },
      { type: "image", asset: "s30-b", alt: "Welcome tutorial prompt", span: "third" },
      { type: "image", asset: "s30-c", alt: "Furniture placement", span: "third" },
      { type: "image", asset: "s30-d", alt: "Movement tutorial panel", span: "third" },
    ],
  },
  {
    slug: "timetable-designer",
    title: "Timetable Designer",
    type: "Figma template",
    client: "Figma Community",
    category: "Personal & Uni",
    year: "2024",
    role: ["Figma template"],
    tools: ["figma"],
    color: "#3883de",
    ink: "#ecedd8",
    cover: { asset: "s04-timetable", fit: "contain", bg: "#deba38" },
    links: [{ label: "Figma Community", href: "https://www.figma.com/community/file/1493878128049841938" }],
    blocks: [
      {
        type: "text",
        body: [
          "Born from the inconvenience of the university default timetable view.",
          "Uses auto layouts and pre-formed time slots to allow you to literally “build” your timetable.",
        ],
      },
      { type: "image", asset: "s04-timetable", alt: "Timetable Designer", span: "full", bg: "#deba38", pad: true },
    ],
  },
  {
    slug: "uowd-clubs",
    title: "UOWD Clubs",
    type: "Posters · Social media",
    client: "UOWD E-Sports Club · Women in STEM Society",
    category: "Personal & Uni",
    year: "2023–2025",
    role: ["Posters", "Social media", "Signage"],
    tools: ["canva"],
    color: "#deba38",
    ink: "#1e1e1e",
    cover: { asset: "s13-grid" },
    links: [{ label: "instagram.com/esportsclubuowd", href: "https://www.instagram.com/esportsclubuowd/" }],
    blocks: [
      {
        type: "text",
        body: [
          "Designing for these two clubs is where my graphic design journey started.",
          "For Esports, I kept one consistent brand identity across Instagram, then broke from it for event posters and signage, going flashy with game character art and bold effects built to grab attention.",
          "For Women in STEM Society, I went softer: beige and pink tones inspired by the books we featured in our weekly recommendations, which shaped the club's editorial feel overall.",
          "These aren't my strongest pieces today, but I keep them in my portfolio to show where the work began and how far it's come.",
        ],
      },
      { type: "image", asset: "s13-grid", alt: "E-sports and Women in STEM posters", span: "full", bg: "#3883de", pad: true },
    ],
  },
];

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);

export const categoryColor = (c: Category) => CATEGORIES.find((x) => x.name === c)?.color ?? "#ecedd8";

export const CONTACT_EMAIL = "alisabakhareva2902@gmail.com";
