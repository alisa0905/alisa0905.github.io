import { LINKEDIN_URL } from "@/lib/projects";

/**
 * Everything on the CV page (/cv). Edit the text here.
 * Wrap words in **double stars** to make them bold.
 */

export type CvEntry = {
  title: string;
  subtitle: string;
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
      title: "Jabrni",
      subtitle: "Product Designer",
      dates: "Mar 2026 - Aug 2026 (6 months)",
      href: "https://www.jabrni.com/",
      bullets: [
        "Delivered **15+ branding, web, and marketing** projects for businesses across construction, technology, food & beverage, and personal brands, including 5 repeat engagements for Cemex.",
        "Maintained **long-term client relationships** by delivering consistent, high-quality creative solutions.",
      ],
    },
    {
      title: "Amana Homes Real Estate",
      subtitle: "Marketing Intern",
      dates: "Jul 2025 - Mar 2026 (9 months)",
      href: "https://www.linkedin.com/company/amana-homes-real-estate/home/",
      bullets: [
        "Built Amana’s social presence, growing **LinkedIn from 0 to 600+** and **Instagram from 20 to 200+** followers.",
        "Designed luxury real estate sales collateral and bilingual advertising campaigns.",
        "Produced creative for **10+ marketing campaigns** across Meta, email, and WhatsApp.",
      ],
    },
    {
      title: "UOWD Clubs",
      subtitle: "Graphic Designer",
      dates: "Jan 2024 - Oct 2025 (1.8 years)",
      href: "https://www.instagram.com/uowdwomeninstem/",
      bullets: [
        "Designed **branding for 20+ university events** across 3 university clubs (Women in STEM, E-Sports, Anime Club) reaching 300+ attendees.",
      ],
    },
  ] satisfies CvEntry[],

  projects: [
    {
      title: "Cloud Castle Website",
      subtitle: "Freelance Project",
      dates: "Sep 2026",
      href: "https://cloudcastle.co/",
      bullets: [
        "Redesigned a fashion brand’s website from a stock Shopify template into a custom, castle-themed storefront that reflects the brand, designing every page, component and accessibility setting.",
      ],
    },
    {
      title: "B1 Properties Instagram",
      subtitle: "Freelance Project",
      dates: "Aug 2026",
      href: "https://www.instagram.com/b1properties/?hl=en",
      bullets: [
        "Designed Instagram creatives in multiple variations for B1 Properties, a Dubai luxury real estate brokerage.",
      ],
    },
    {
      title: "Quotify",
      subtitle: "Academic Project & Publication",
      dates: "Sep 2025 - May 2026",
      href: "https://quotifyx.app/",
      bullets: [
        "Created the brand identity, UI/UX, and marketing assets for an AI-powered call-to-quotation platform; co-authored an IEEE published research paper.",
      ],
    },
  ] satisfies CvEntry[],

  tools: [
    "Figma",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Adobe Lightroom",
    "Adobe Premiere Pro",
    "Meta Business Suite",
    "Canva",
    "CapCut",
  ],

  skills: [
    "Social Media Design",
    "Print Design",
    "Interaction Design",
    "Visual Design",
    "Communication and Collaboration",
    "Adaptability and Continuous Learning",
  ],

  education: {
    title: "University of Wollongong in Dubai",
    // Spelled out so hiring software matches "Bachelor" and "Computer Science".
    subtitle: "Bachelor of Computer Science with Distinction",
    dates: "Sep 2023 - May 2026",
    href: "https://www.uowdubai.ac.ae/",
  },

  additional: ["UAE Driving License", "Family-sponsored Golden Visa", "English (C1), Russian (Native)"],
};
