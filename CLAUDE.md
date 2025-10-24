- Perfect — here’s your Bitcoin Sovereign Academy Project Memory Sheet
(short, structured, and ready to share in Notion, Google Docs, or GitHub README.md):

⸻

🧠 Bitcoin Sovereign Academy

Project Memory Sheet – Vision, Context, and Development Framework

⸻

🎯 Mission & Core Identity

Goal: Empower individuals to understand and use Bitcoin through interactive learning and real-world simulations.
Tagline: Learn Bitcoin. Achieve Sovereignty.
Essence: Simple. Engaging. Independent.

Core Values:
    •    Truth over trust
    •    Financial sovereignty
    •    Education through experience
    •    Privacy and open access

Voice:
    •    Socratic (ask before telling)
    •    Conversational, visual, and sharp
    •    Avoid jargon and long paragraphs

⸻

🧩 Structure & Learning Framework

Paths

Path    Purpose    Level
Curious    Understand money and Bitcoin fundamentals    Beginner
Builder    Learn tools, Lightning, and practical setups    Intermediate
Sovereign    Deep security, custody, and inheritance mastery    Advanced
Principled    Explore money ethics and philosophy    Reflective
(Optional personas)    Business Owner / Investor / Parent / Developer / Global Citizen    Custom

Each Path has 4 Stages → Each Stage has multiple Modules (5–10 min, interactive).
Modules include Questions → Reflection → Activity → Summary → Next Step.

⸻

🧠 Key Systems

Component    Purpose    Core Files
Onboarding Flow    Identify learner persona    onboarding-flow.js, .css
Dynamic CTA Chips    Show personalized calls-to-action    hero-cta.js, chips.css
Learning Path Engine    Manage progress, checkpoints, and achievements    learning-path.js
Bitcoin Data Fallback    Fetch real-time Bitcoin stats with failover    bitcoin-data-fallback.js
Interactive Demos    Core of hands-on learning    /interactive-demos/*.html
3D Hero Experience    Visual engagement with subtle animation    hero3d.js, .css
Analytics / A/B Logic    Privacy-safe usage tracking    script.js, ab-home.js


⸻

🎨 Branding & Design

Palette:
    •    Orange #f7931a – highlight
    •    Dark Gray #1a1a1a – background
    •    Secondary Dark #2d2d2d
    •    Accent Greens, Purples, Reds per Path (--path-curious, --path-builder, etc.)

Style:
    •    Minimalist, cinematic gradients
    •    Rounded corners, soft shadows
    •    Light motion (respect prefers-reduced-motion)
    •    Icons and buttons consistent with brand colors

⸻

⚙️ Technical Infrastructure
    •    Static Frontend: GitHub Pages → redirects to bitcoinsovereign.academy
    •    Client-side Only: No backend (MCP integration planned)
    •    Data Sources: CoinGecko, Mempool.space, Blockchain.info, Kraken
    •    Privacy: No invasive analytics; only optional Plausible tracking
    •    Accessibility: Keyboard navigation, reduced motion, high contrast

⸻

🧑‍💻 Roles & Responsibilities

Editor:
    •    Simplify and refine content flow
    •    Maintain voice, eliminate redundancy
    •    Add Socratic questions & reflection prompts
    •    Align all lessons to learning outcomes
    •    Oversee localization (Spanish / Colombia focus)

Code Creator:
    •    Keep all JS modular & maintainable
    •    Integrate persona logic across modules
    •    Maintain failover structure for APIs
    •    Document new components in /docs/ or JSON format
    •    Ensure responsive design, fast loading, no layout shifts

⸻

📈 Future Integrations
    •    MCP Agent Kit: Personalized guidance & AI explainers
    •    Progressive Web App: Offline-first learning
    •    Scenario Engine: Interactive labs (e.g., Inflation Lab, Custody Drill)
    •    Gamified Achievements: Badges, XP progress, and shareable certificates

⸻

📋 Notes for New Collaborators
    •    Always check persona context before editing code or text.
    •    Keep all interactivity purposeful — every click should teach something.
    •    Optimize for clarity and performance.
    •    Never add tracking that compromises user privacy.
    •    Document changes in plain English in /docs/changelog.md.

⸻

Would you like me to output this in Markdown format (ready to paste into your GitHub /docs/ folder or Notion page), or as a beautiful branded PDF (with your colors, logo, and headings)?
- remember that The vercel.json configuration had X-Frame-Options: DENY for all pages, which prevented the demos from being embedded in iframes - even on the same
  domain!

  The Solution:
  1. ✅ Added specific header rules for /paths/ (module pages)
  2. ✅ Set X-Frame-Options: SAMEORIGIN (allows same-domain iframe embedding)
  3. ✅ Added frame-src 'self' to Content-Security-Policy
  4. ✅ Kept absolute paths (/interactive-demos/...) which work correctly on Vercel
  5. ✅ Maintained security: only same-origin iframes allowed, external sites still blocked
- Improved Card Structure & Spacing

  - Container: Increased max-width to 1200px, padding to
  3rem 2rem
  - Assessment Form: Increased padding from 2rem to 3rem
  - Station Cards: Increased padding to 2.5rem, added
  box-shadow
  - Score Card: Increased padding to 3rem, added larger
  box-shadow
  - Scenario Boxes: Increased padding to 2.5rem, added
  box-shadow
  - Simulator Boxes: Increased padding to 2.5rem, added
  box-shadow
  - Resource Cards: Increased padding to 1.75rem

  3. Enhanced Form Elements

  - Radio Options:
    - Increased padding to 1.25rem
    - Enhanced hover state with lift effect and glow
    - Better visual feedback on interaction
  - Checkbox Options:
    - Increased padding to 1rem 1.25rem
    - Added hover lift and glow effects
  - Scenario Options:
    - Added explicit text color for readability
    - Improved hover state with slide animation

  4. Improved Interactivity

  - Added subtle transform effects on hover for all
  interactive elements
  - Consistent box-shadow usage across cards (0 4px 12px
  rgba(0, 0, 0, 0.2))
  - Enhanced hover states with brand-colored glows

  5. Mobile Responsiveness

  - Optimized padding for mobile screens (< 768px)
  - Container: 2rem 1.5rem
  - Hero section: 2rem 1.5rem
  - Forms and cards: Reduced padding for smaller screens
  - All grids properly collapse to single column

  6. Platform Consistency

  - Uses brand CSS variables throughout
  - Consistent border-radius (12px-20px depending on
  element size)
  - Proper use of var(--color-brand), var(--color-text),
  var(--color-surface)
  - Orange accent color (#f7931a) consistently applied

  7. Visual Hierarchy

  - Clear distinction between background levels
  - Proper elevation through box-shadows
  - Consistent spacing rhythm (1rem, 1.5rem, 2rem, 3rem)
  - Better breathing room between sections