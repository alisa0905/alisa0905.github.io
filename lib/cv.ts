import { LINKEDIN_URL } from "@/lib/projects";

/**
 * Everything on the CV page (/cv). Edit the text here.
 * Wrap words in **double stars** to make them bold.
 * Write [label](https://link) to make a bold, underlined link.
 */

export type CvEntry = {
  title: string;
  subtitle: string;
  location?: string;
  dates: string;
  href: string;
  bullets: string[];
};

export const CV = {
  name: "Alisa Bakhareva",
  role: "Brand Designer",
  location: "Dubai, UAE",
  email: "alisabakhareva2902@gmail.com",
  phone: "+971 55 769 0154",
  linkedin: LINKEDIN_URL,
  portfolio: "https://alisabakhareva.me/",

  experience: [
    {
      title: "Freelance",
      subtitle: "Brand Designer",
      location: "Dubai, UAE",
      dates: "Aug 2026 - Present",
      href: "https://alisabakhareva.me/work",
      bullets: [
        "Brand identities, social creative and websites for **4 clients** in real estate, fashion and food & bev.",
        "[Cloud Castle:](https://cloudcastle.co/) turned a stock Shopify template into a custom, castle-themed storefront, designing every page, component and accessibility setting. Live now.",
        "[B1 Properties:](https://www.instagram.com/b1properties/) 2 months of Instagram creatives, in multiple variations, for a luxury real estate brokerage. Approved with minimal revisions.",
      ],
    },
    {
      title: "Jabrni",
      subtitle: "Product Designer (Web & Branding)",
      location: "Dubai, UAE",
      dates: "Mar 2026 - Aug 2026",
      href: "https://www.jabrni.com/",
      bullets: [
        "Designed all **15+ projects** the company delivered, mostly web design, plus brand identity, document redesigns and shirt designs.",
        "Delivered **5 repeat engagements for Cemex** and worked with a developer on web projects.",
      ],
    },
    {
      title: "Amana Homes Real Estate",
      subtitle: "Creative Marketing Intern",
      location: "Dubai, UAE",
      dates: "Jul 2025 - Mar 2026",
      href: "https://www.linkedin.com/company/amana-homes-real-estate/home/",
      bullets: [
        "Designed luxury real estate collateral and creative for **10+ bilingual (Arabic and English) campaigns**.",
        "Grew **LinkedIn from 0 to 600+** followers and **Instagram from 20 to 200+**.",
      ],
    },
    {
      title: "UOWD Clubs",
      subtitle: "Graphic Designer",
      location: "Dubai, UAE",
      dates: "Jan 2024 - Oct 2025",
      href: "https://www.instagram.com/uowdwomeninstem/",
      bullets: ["Branding for **20+ events** across 3 clubs (Women in STEM, E-Sports, Anime Club), reaching 300+ attendees."],
    },
  ] satisfies CvEntry[],

  education: {
    title: "University of Wollongong in Dubai",
    // Spelled out so hiring software matches "Bachelor" and "Computer Science".
    subtitle: "Bachelor of Computer Science with Distinction",
    dates: "Sep 2023 - May 2026",
    href: "https://www.uowdubai.ac.ae/",
  },

  projects: [
    {
      title: "Quotify",
      subtitle: "Design Co-founder",
      dates: "Sep 2025 - May 2026",
      href: "https://quotifyx.app/",
      bullets: [
        "Brand identity, UI/UX and marketing assets for an AI-powered call-to-quotation platform. Co-authored an **IEEE-published research paper**.",
      ],
    },
  ] satisfies CvEntry[],

  skills: [
    "Brand identity",
    "Web design",
    "UI/UX design",
    "Social media design",
    "Print design",
    "Visual design",
    "Paid social ads",
  ],

  // "Adobe" kept in front so hiring software matches either way people search.
  tools: [
    "Figma",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Adobe Lightroom",
    "Adobe Premiere Pro",
    "Canva",
    "CapCut",
    "Meta Business Suite",
  ],

  languages: ["English (C1)", "Russian (Native)"],

  additional: ["UAE Driving License", "UAE Golden Visa"],
};
