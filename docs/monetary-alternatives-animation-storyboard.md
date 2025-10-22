# Monetary Alternatives: 3-Minute Intro Animation Storyboard

## Overview
**Duration:** 3 minutes
**Style:** Clean, minimal 2D animation with icons and transitions
**Tone:** Educational, neutral, comparative
**Target Audience:** Sovereign Path Stage 3 learners
**Voiceover:** Optional (can work as silent animation with text)

---

## Scene 1: The Digital Money Landscape (0:00 - 0:30)

### Visual
- Start with physical cash bills fading/transitioning into digital pixels
- Four distinct digital money icons appear in a circle:
  - 🏛️ (Government building - CBDCs)
  - 💵 (Dollar sign - Stablecoins)
  - 🏢 (Corporate building - Corporate Coins)
  - ₿ (Bitcoin symbol)

### Text Overlay
"As money goes digital, different systems are emerging..."

### Animation Details
- Smooth fade-in of each icon (0.5s delay between each)
- Icons pulse gently
- Background: Dark with subtle grid pattern
- Color coding appears: Blue (CBDC), Green (Stablecoins), Purple (Corporate), Orange (Bitcoin)

---

## Scene 2: CBDCs - Government Digital Currency (0:30 - 1:00)

### Visual
- Zoom into the 🏛️ icon
- Central bank building in center
- Lines connecting to citizen icons in a hub-and-spoke pattern
- Eye icon appears above showing monitoring

### Key Points (animated text appearing sequentially)
1. "Issued by central banks"
2. "Full transaction visibility"
3. "Programmable features"
4. "Real-world: China's Digital Yuan, Bahamas Sand Dollar"

### Animation Details
- Data flows from central bank to citizens
- Small transaction notifications appear with checkmarks
- Eye icon blinks occasionally
- Color theme: Blue (#3b82f6)

---

## Scene 3: Stablecoins - Private Digital Dollars (1:00 - 1:30)

### Visual
- Zoom into the 💵 icon
- Company logo in center (generic)
- Dollar bills in a vault on one side
- Blockchain network on the other
- Balance scale showing 1:1 peg

### Key Points (animated text appearing sequentially)
1. "Issued by private companies"
2. "Pegged to fiat currency (usually $1 = 1 token)"
3. "Backed by reserves"
4. "Real-world: USDT, USDC, DAI"

### Animation Details
- Money flows in and tokens flow out
- Blockchain visualization with connected nodes
- Scale balances perfectly
- Color theme: Green (#10b981)

---

## Scene 4: Corporate Coins - Platform Money (1:30 - 2:00)

### Visual
- Zoom into the 🏢 icon
- Tech platform interface surrounding center
- Closed loop showing money only works within ecosystem
- Shopping cart, game controller, streaming icons

### Key Points (animated text appearing sequentially)
1. "Created by tech platforms"
2. "Works only in their ecosystem"
3. "Rewards and loyalty programs"
4. "Examples: Amazon Coins, Airline Miles"

### Animation Details
- Coins bounce around but can't escape the platform boundary
- Icons for different services light up when coins are spent
- Invisible wall animation when trying to leave platform
- Color theme: Purple (#8b5cf6)

---

## Scene 5: Bitcoin - Open Protocol (2:00 - 2:30)

### Visual
- Zoom into the ₿ icon
- Distributed network of nodes (no center)
- Mathematical formulas floating around
- "21M" cap prominently displayed
- Open padlock symbol

### Key Points (animated text appearing sequentially)
1. "No central issuer"
2. "Fixed supply: 21 million"
3. "Global permissionless access"
4. "Operates via mathematical rules"

### Animation Details
- Nodes pulse in sync showing consensus
- Transactions flow peer-to-peer (no intermediary)
- Counter showing "21,000,000 MAX" with lock icon
- Color theme: Orange (#f7931a)

---

## Scene 6: The Comparison (2:30 - 2:50)

### Visual
- Split screen showing all four systems side by side
- Five comparison dimensions appear as rows:
  - 👁️ Privacy (dots: 0/5, 2/5, 1/5, 4/5)
  - 🚪 Access (Who controls entry?)
  - 🔒 Control (Who makes rules?)
  - 📈 Supply (Unlimited vs Fixed)
  - 🛡️ Censorship Resistance

### Animation Details
- Each system's dots fill in sequentially
- Highlighting differences with subtle glow
- Bitcoin's 5/5 on fixed supply and censorship resistance
- CBDCs' 0/5 on privacy stands out

---

## Scene 7: The Choice (2:50 - 3:00)

### Visual
- Four paths extend from viewer's perspective
- Each path lit in its system's color
- Question appears in center: "Which trade-offs matter most to you?"

### Final Text
"Explore the full comparison →"
[CTA button appears: "Start Learning"]

### Animation Details
- Paths pulse invitingly
- Soft ambient glow
- Fade to module start screen

---

## Technical Specifications

### Dimensions
- 1920x1080 (16:9 for web)
- 1080x1920 (9:16 vertical for mobile/social)

### Animation Software Recommendations
- **After Effects** (professional)
- **Lottie** (web-optimized)
- **Canva Video** (quick/easy)
- **Figma + Principle** (interactive prototype)

### Color Palette
```css
CBDCs:     #3b82f6 (Blue)
Stablecoins: #10b981 (Green)
Corporate:   #8b5cf6 (Purple)
Bitcoin:     #f7931a (Orange)
Background:  #1a1a1a (Dark)
Text:        #e0e0e0 (Light Gray)
Accents:     #d4af37 (Gold)
```

### Typography
- **Headings:** Inter Bold, 48px
- **Body:** Inter Regular, 24px
- **Captions:** Inter Medium, 18px

---

## Audio/Voiceover Script (Optional)

### Narration Text
```
"As money becomes digital, we face a choice.

Central banks are creating digital currencies with programmable features and full monitoring.

Private companies offer stablecoins - digital tokens backed by traditional money.

Tech platforms build closed payment systems within their ecosystems.

And Bitcoin operates as an open protocol with no central controller.

Each system makes different trade-offs between convenience, privacy, and control.

Which path will you choose?"
```

### Music
- Ambient electronic background
- Tempo: 90-100 BPM
- Mood: Thoughtful, exploratory, neutral
- No lyrics

---

## Export Formats

1. **Web (Primary)**
   - Format: MP4 (H.264)
   - Resolution: 1920x1080
   - Framerate: 30fps
   - Bitrate: 5Mbps

2. **Mobile Optimized**
   - Format: MP4 (H.264)
   - Resolution: 1080x1920
   - Framerate: 30fps
   - Bitrate: 3Mbps

3. **Lottie JSON** (for interactive web)
   - Scalable vector animation
   - Smaller file size
   - Better performance

---

## Implementation Notes

### Auto-play Behavior
- Video should auto-play when module loads (muted by default)
- Click to unmute
- Replay button at the end
- "Skip Intro" button in top-right corner

### Accessibility
- Closed captions for all voiceover
- Alt text for key visual elements
- Transcript available as text below video
- Can be experienced without sound

### Integration Points
- Embedded at top of `/paths/sovereign/stage-3/monetary-alternatives.html`
- Also available as standalone intro in hero section
- Can be embedded in social media shares

---

## Production Timeline Estimate

| Phase | Duration | Notes |
|-------|----------|-------|
| Script finalization | 1 day | Based on this storyboard |
| Asset creation | 2 days | Icons, illustrations, transitions |
| Animation | 3-4 days | After Effects/Lottie |
| Voiceover recording | 1 day | If needed |
| Audio mixing | 1 day | Music + VO |
| Review & revisions | 1-2 days | Feedback integration |
| **Total** | **9-11 days** | From start to final export |

---

## Budget Estimate (if outsourcing)

- **Freelance Animator:** $500-1500
- **Voiceover Artist:** $100-300
- **Music Licensing:** $50-200 (or use royalty-free)
- **Total:** $650-2000

### DIY Options
- **Canva Video:** Free-$120/year (easiest)
- **After Effects:** $22.99/month (most powerful)
- **Lottie Creator:** Various (web-optimized)

---

## Next Steps

1. ✅ Review and approve storyboard
2. ⏳ Choose production method (DIY vs outsource)
3. ⏳ Create/source visual assets
4. ⏳ Animate scenes according to timing
5. ⏳ Add audio (optional)
6. ⏳ Export in multiple formats
7. ⏳ Integrate into module page
8. ⏳ Test across devices

---

*This storyboard provides a clear blueprint for creating an engaging, educational 3-minute intro that sets the stage for the Monetary Alternatives module without being preachy or controversial.*
