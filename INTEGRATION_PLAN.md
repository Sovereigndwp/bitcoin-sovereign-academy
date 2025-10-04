# MCP Agent Kit → Bitcoin Sovereign Academy Integration Plan

**Date**: 2025-10-03
**Source Repo**: `mcp-agent-kit`
**Target Repo**: `bitcoin-sovereign-academy`

---

## Overview

This document outlines the integration of new features from `mcp-agent-kit` into the main `bitcoin-sovereign-academy` course platform.

## Recent Additions to MCP Agent Kit (Ready for Integration)

### 1. ✅ Privacy-Compliant Analytics System
**Files**:
- `mcp-agent-kit/src/utils/event-tracking.ts`
- `mcp-agent-kit/src/utils/ab-testing.ts`
- `mcp-agent-kit/docs/EVENT_TRACKING_GUIDE.md`
- `mcp-agent-kit/docs/AB_TESTING_GUIDE.md`

**Features**:
- Plausible Analytics integration (GDPR compliant)
- A/B testing framework (localStorage-based)
- Event tracking for learning analytics
- Auto-tracking (outbound links, videos, interactions)

**Integration Target**: `bitcoin-sovereign-academy/analytics/`

---

### 2. ✅ Persona Selector System
**Files**:
- `mcp-agent-kit/src/utils/persona-selector.ts`
- `mcp-agent-kit/exports/integrated_systems_demo/persona_selector.html`

**Features**:
- 8 user personas (Student, Parent, Policymaker, Educator, Entrepreneur, Investor, Developer, Journalist)
- Personalized learning paths
- Content format preferences
- Interactive UI with localStorage persistence

**Integration Target**: `bitcoin-sovereign-academy/js/` + new page in root

---

### 3. ✅ Certification Engine
**Files**:
- `mcp-agent-kit/src/utils/certification-engine.ts`
- `mcp-agent-kit/exports/integrated_systems_demo/certificate.html`
- `mcp-agent-kit/exports/integrated_systems_demo/verify_certificate.html`

**Features**:
- Certificate issuance (5 types, 5 levels)
- SHA-256 verification
- Professional certificate templates
- Public verification page
- QR code support

**Integration Target**: New `/certificates/` directory

---

### 4. ✅ White-Label System
**Files**:
- `mcp-agent-kit/src/utils/white-label.ts`
- `mcp-agent-kit/exports/integrated_systems_demo/.env.oakwood-high`
- `mcp-agent-kit/exports/integrated_systems_demo/oakwood-theme.css`

**Features**:
- Multi-tenant support
- Custom branding (logo, colors, typography)
- Feature flags per tenant
- Environment configuration generation
- Localization

**Integration Target**: `bitcoin-sovereign-academy/css/` + new `/tenants/` directory

---

## Integration Steps

### Phase 1: Copy Utility Files
```bash
# From mcp-agent-kit to bitcoin-sovereign-academy

# 1. Create utils directory
mkdir -p bitcoin-sovereign-academy/js/utils/

# 2. Copy TypeScript utilities (need to compile or convert)
cp mcp-agent-kit/src/utils/event-tracking.ts bitcoin-sovereign-academy/js/utils/
cp mcp-agent-kit/src/utils/ab-testing.ts bitcoin-sovereign-academy/js/utils/
cp mcp-agent-kit/src/utils/persona-selector.ts bitcoin-sovereign-academy/js/utils/
cp mcp-agent-kit/src/utils/certification-engine.ts bitcoin-sovereign-academy/js/utils/
cp mcp-agent-kit/src/utils/white-label.ts bitcoin-sovereign-academy/js/utils/

# 3. Copy documentation
cp mcp-agent-kit/docs/EVENT_TRACKING_GUIDE.md bitcoin-sovereign-academy/docs/
cp mcp-agent-kit/docs/AB_TESTING_GUIDE.md bitcoin-sovereign-academy/docs/
cp mcp-agent-kit/docs/GAPS_RESOLVED.md bitcoin-sovereign-academy/docs/
```

### Phase 2: Integrate Analytics into Main Site

**Update**: `bitcoin-sovereign-academy/index.html`

```html
<!-- Add to <head> -->
<script defer data-domain="bitcoinsovereign.academy"
        src="https://plausible.io/js/script.js"></script>

<!-- Add event tracking -->
<script src="js/utils/event-tracking.js"></script>
<script src="js/utils/ab-testing.js"></script>
```

**Update**: `bitcoin-sovereign-academy/analytics/index.html`
- Replace with new analytics dashboard
- Show real-time events from Plausible

### Phase 3: Add Persona Selector

**Create**: `bitcoin-sovereign-academy/choose-path.html`
```html
<!-- New landing page for persona selection -->
<!DOCTYPE html>
<html>
<head>
    <title>Choose Your Learning Path - Bitcoin Sovereign Academy</title>
    <link rel="stylesheet" href="css/brand.css">
</head>
<body>
    <div id="persona-selector-container"></div>
    <script src="js/utils/persona-selector.js"></script>
    <script>
        document.getElementById('persona-selector-container').innerHTML =
            personaSelector.generatePersonaSelectorHTML();
    </script>
</body>
</html>
```

**Update**: `bitcoin-sovereign-academy/index.html`
- Add link to persona selector on homepage
- Track persona selection events

### Phase 4: Add Certification System

**Create**: `bitcoin-sovereign-academy/certificates/` directory
```
certificates/
├── index.html              (certificate dashboard)
├── verify.html            (verification page)
├── templates/
│   ├── course-completion.html
│   └── skill-mastery.html
└── js/
    └── certificate-manager.js
```

**Update**: Course completion flows
- Issue certificate on course completion
- Add "Earn Certificate" CTAs
- Add certificate gallery to user profile

### Phase 5: Implement White-Labeling

**Create**: `bitcoin-sovereign-academy/tenants/` directory
```
tenants/
├── default/
│   ├── .env
│   └── theme.css
├── school/
│   ├── .env
│   └── theme.css
└── enterprise/
    ├── .env
    └── theme.css
```

**Update**: Build system
- Auto-detect tenant from domain
- Apply tenant-specific branding
- Load tenant configuration

---

## File Mapping

### From mcp-agent-kit → To bitcoin-sovereign-academy

| Source | Target | Purpose |
|--------|--------|---------|
| `src/utils/event-tracking.ts` | `js/utils/event-tracking.js` | Event tracking |
| `src/utils/ab-testing.ts` | `js/utils/ab-testing.js` | A/B testing |
| `src/utils/persona-selector.ts` | `js/persona-selector.js` | Persona system |
| `src/utils/certification-engine.ts` | `certificates/js/engine.js` | Certificates |
| `src/utils/white-label.ts` | `tenants/white-label.js` | Multi-tenant |
| `exports/integrated_systems_demo/*.html` | Various | Templates |
| `docs/*.md` | `docs/` | Documentation |

---

## Feature Integration Checklist

### Analytics & Tracking
- [ ] Add Plausible script to all HTML pages
- [ ] Implement event tracking on key actions
- [ ] Add A/B test to homepage CTA
- [ ] Create analytics dashboard page
- [ ] Track course progress events
- [ ] Track assessment completion

### Persona System
- [ ] Create `/choose-path.html` page
- [ ] Add persona selector to onboarding flow
- [ ] Personalize content recommendations
- [ ] Adjust difficulty based on persona
- [ ] Track persona selection analytics

### Certification
- [ ] Create `/certificates/` directory structure
- [ ] Build certificate issuance flow
- [ ] Create verification page
- [ ] Design certificate templates
- [ ] Add certificate showcase to profile
- [ ] Implement certificate sharing

### White-Label
- [ ] Create tenant configuration system
- [ ] Build tenant auto-detection
- [ ] Create tenant-specific themes
- [ ] Generate `.env` files for tenants
- [ ] Test multi-tenant functionality

### Documentation
- [ ] Copy integration guides to docs/
- [ ] Update README with new features
- [ ] Create user-facing help docs
- [ ] Document API endpoints (if any)

---

## Testing Plan

### 1. Analytics Testing
```javascript
// Test event tracking
window.bitcoinAcademyTracker.track('Test_Event', { test: true });

// Test A/B assignment
localStorage.getItem('btc_academy_ab_tests');

// Verify Plausible events
// Check: https://plausible.io/bitcoinsovereign.academy
```

### 2. Persona Testing
- Select each persona
- Verify localStorage persistence
- Check content personalization
- Test analytics tracking

### 3. Certificate Testing
- Complete a course
- Issue certificate
- Verify certificate
- Test tamper detection
- Test certificate sharing

### 4. White-Label Testing
- Test domain detection
- Verify theme application
- Check feature flags
- Test multi-language

---

## Deployment Strategy

### Development
1. Copy files to bitcoin-sovereign-academy
2. Convert TypeScript to JavaScript if needed
3. Test locally with `./start-local.sh`
4. Fix any integration issues

### Staging
1. Deploy to test subdomain
2. Run full integration tests
3. Verify analytics tracking
4. Test all personas and certificates

### Production
1. Deploy to bitcoinsovereign.academy
2. Monitor analytics for errors
3. Track adoption metrics
4. Collect user feedback

---

## Current Status

### ✅ Completed in mcp-agent-kit
- Event tracking system
- A/B testing framework
- Persona selector (8 personas)
- Certification engine (5 types, 5 levels)
- White-label system (multi-tenant)
- Complete documentation
- Integration demo

### 🔄 Pending in bitcoin-sovereign-academy
- Copy utility files
- Integrate into main site
- Add new pages (persona selector, certificates)
- Update existing pages
- Test integration
- Deploy to production

---

## Notes

1. **TypeScript Compilation**: The mcp-agent-kit files are TypeScript. They need to be:
   - Compiled to JavaScript, OR
   - Converted to vanilla JavaScript, OR
   - Use a build system in bitcoin-sovereign-academy

2. **Dependencies**: Check if any npm packages need to be installed in bitcoin-sovereign-academy

3. **Environment Variables**: Configure Plausible domain and other settings

4. **Privacy**: All systems are GDPR-compliant by default

5. **Performance**: All client-side processing, minimal impact

---

## Success Metrics

After integration, track:
- [ ] Analytics events firing correctly
- [ ] A/B tests running and tracked
- [ ] Persona selections being stored
- [ ] Certificates being issued
- [ ] Multi-tenant themes working
- [ ] No performance degradation
- [ ] User engagement improvements

---

## Questions to Answer

1. Should we compile TypeScript or convert to JavaScript?
2. Do we need a build system in bitcoin-sovereign-academy?
3. Which tenant should be the default?
4. What personas are most important for initial launch?
5. What certificates should we issue first?

---

## Next Steps

1. **Immediate**: Copy utility files to bitcoin-sovereign-academy
2. **Week 1**: Integrate analytics and persona selector
3. **Week 2**: Add certification system
4. **Week 3**: Implement white-labeling
5. **Week 4**: Full testing and deployment
