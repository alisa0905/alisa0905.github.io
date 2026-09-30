# Alisa Bakhareva: Portfolio

> Brand designer in Dubai: brand identity, social media, UI/UX and print. Lives at **alisabakhareva.me**.

## Brand Identity
- **Personality:** playful, colourful, confident, hand-made. Taken straight from Alisa's Figma/PDF portfolio.
- **Colours:** sky `#7cb9e4`, blue `#3883de`, green `#518c2d`, red `#b83244`, orange `#de7315`, pink `#e173ae`, mustard `#deba38`, sunny yellow `#f3c11b`, cream `#ecedd8`, ink `#1e1e1e`, paper background `#f6f3ea`.
- **Fonts:** Londrina Solid (big titles), Figtree (UI and labels), Author (longer body text).
- **Signature details:** wavy blobs, five-petal flowers that spin, curved titles. All of them are real vector art exported from the Figma file.

## Pages
- **Home** (`/`): orange hero ("Hi! I'm Alisa.") with her photo, pink blob and flower. Then a skills ribbon, Selected work (Cloud Castle first, full width), "Who am I?" (bio, experience, publications with the IEEE paper link, education, toolbox), and a scrolling client ribbon.
- **Work** (`/work`): all 17 projects with filter chips: Jabrni, Freelance, Amana Homes, Quotify, Personal & Uni.
- **Case studies** (`/work/[project]`): one page per project, with a coloured header, client/year/role/tools, cover image, story text, image galleries, before/after comparisons and a "Next project" link. Cloud Castle has a browser window that scrolls through the whole homepage on hover, plus a grid of the brand elements Alisa designed.
- **Contact** (`/contact`): enquiry form (name, email, company, services, timeline, message). Sending opens the visitor's email app, addressed to alisabakhareva2902@gmail.com. No account needed.

## Components
- **Header** (`components/SiteHeader.tsx`): floating pill with Alisa's full name, Home, Work, About and a "Let's talk" button. Turns solid when you scroll. Has a menu on phones.
- **Footer** (`components/SiteFooter.tsx`): big "Let's talk →", email, location and links.
- **Project card** (`components/ProjectCard.tsx`): image tile, category chip, title and summary, with hover animation.
- **Case study layout** (`components/CaseBlocks.tsx`): turns each project's content list into text sections, image grids and before/after blocks.
- **Extras:** click any case-study image to zoom it full screen (`Lightbox`). Smooth scrolling (`SmoothScroll`). A flower cursor on desktop (`Cursor`). Scroll-in animations (`Reveal` plus the CSS in `app/globals.css`).

## How to Customize
- **Edit, add or reorder projects:** everything lives in `lib/projects.ts`. Each project has a title, client, category, year, role, tools, colours, summary, cover image and a list of content blocks. Set `featured: true` to show it on the home page. The order on the home page is set at the top of `app/page.tsx`.
- **Add images:** put them in `public/work/` and add their size to `lib/assets.ts`.
- **Change the contact email:** `CONTACT_EMAIL` at the bottom of `lib/projects.ts`.
- **Change colours:** the palette is at the top of `app/globals.css`.

## Writing style
- No taglines or invented subheadings (inspired by lukebaffait.fr). Cards show just the title, a short type ("Website", "Brand identity") and the year. Case studies use only Alisa's own words.

## Things to double-check
- **B1 Company Profile, Cemex and the AI renders** are filed under *Jabrni*; the B1 Instagram system is under *Freelance* (per the CV). Move any of them in `lib/projects.ts` if needed.
- **Cloud Castle text** is based on the notes in the Cloud Castle website project. Rewrite it in your own words if you like.
- **Mystery icons:** two round blue icons from the Figma toolbox are labelled "Motion design" and "Automation", and one is labelled "Zoho". Rename them in `components/ToolIcon.tsx`.

## Where the live site lives
- **GitHub repo:** [alisa0905.github.io](https://github.com/alisa0905/alisa0905.github.io) — this is what powers **alisabakhareva.me**.
- **How updates go live:** when changes are pushed to the `main` branch on that repo, GitHub automatically builds the site and publishes it (see `.github/workflows/deploy.yml`).
- **Ship Studio copy:** the same project also lives in [portfolio](https://github.com/alisa0905/portfolio) for editing in Ship Studio.

## Recent Changes
- 2026-09-30: Moved the full site into the **alisa0905.github.io** repo so **alisabakhareva.me** serves this portfolio. Added automatic publishing and kept the custom domain (`CNAME`).
- 2026-09-30: Built the multi-page website (Home, Work, 17 case studies, Contact) from the 36-page Figma portfolio. Added Cloud Castle from the PDFs in Downloads. Set the site up for alisabakhareva.me.
- 2026-09-30: Cloud Castle now leads, shown as a website project (real screenshots of the storefront plus the brand elements). Removed all invented taglines and subheadings. Full name in the header. Phone preview enabled on the local Wi-Fi.
- 2026-09-30: Updated from the new CV: title is now Brand Designer, Jabrni ended Aug 2026, education added, B1 Instagram moved to Freelance. Quotify now shows the live site (quotifyx.app) and links to the IEEE paper.
