# HubSpot Multi-Business Management Strategy
## FSA Business Separation Using Existing Account

## Overview
Leverage your existing HubSpot account to manage FSA institutional clients while maintaining complete separation from Bitcoin Adviser business through strategic use of teams, properties, and email domains.

## Professional Email Setup

### Primary FSA Business Email
**Recommended**: `dalia@sovereigndwp.com`
- More professional than proton.me for B2B institutional sales
- Matches your npm scope (@sovereigndwp/mcp-agent-kit)
- Easy to set up with Google Workspace or Microsoft 365

### Email Domain Setup Process
1. **Register Domain**: sovereigndwp.com (if not already owned)
2. **Email Hosting**: Google Workspace ($6/month) or Microsoft 365 ($5/month)
3. **Professional Setup**:
   - `dalia@sovereigndwp.com` (primary)
   - `support@sovereigndwp.com` (customer service)
   - `info@sovereigndwp.com` (general inquiries)

## HubSpot Account Structure

### User Management Strategy
**Add New User Identity**:
```
Primary User: dalia@thebitcoinadviser.com
- Role: Super Admin (existing business)
- Access: All Bitcoin Adviser data
- Teams: Bitcoin Adviser Team

Secondary User: dalia@sovereigndwp.com  
- Role: Marketing Hub Pro + Sales Hub Pro
- Access: FSA business only
- Teams: FSA Team (separate team)
```

### Team-Based Separation
**Create FSA Team**:
- Team Name: "Financial Sovereignty Academy"
- Members: dalia@sovereigndwp.com (primary), any future FSA staff
- Permissions: Access only to FSA-tagged contacts, deals, companies

**Maintain Bitcoin Adviser Team**:
- Existing setup unchanged
- No access to FSA data

### Database Segmentation Strategy

#### Contact Properties for Separation
```javascript
// Custom Properties to Add
fsa_business_unit: {
  type: "enumeration",
  options: ["Bitcoin_Adviser", "FSA_Institutional", "FSA_Individual"],
  default: "Bitcoin_Adviser"  // Protects existing data
}

fsa_client_type: {
  type: "enumeration", 
  options: ["Municipal", "Correctional", "Corporate_HR", "Individual_Consumer"],
  required_for: "FSA_Institutional"
}

fsa_deal_size_range: {
  type: "enumeration",
  options: ["Under_25K", "25K_75K", "75K_200K", "200K_500K", "500K_Plus"]
}

fsa_lead_source: {
  type: "enumeration",
  options: ["LinkedIn_Outreach", "Email_Campaign", "Website_Lead", "Referral", "Webinar"]
}
```

#### Automated Tagging System
**Email-Based Auto-Tagging**:
```
Workflow: "Auto-tag FSA Contacts"
Trigger: Contact created via dalia@sovereigndwp.com forms/emails
Action: Set fsa_business_unit = "FSA_Institutional"
Action: Assign to FSA Team
Action: Set contact owner = dalia@sovereigndwp.com
```

### Pipeline Separation

#### FSA Sales Pipeline
```
Pipeline Name: "FSA Institutional Sales"
Stages:
1. Lead Generated (0%)
2. Qualified Lead (10%) 
3. Discovery Call Scheduled (25%)
4. Needs Assessment Complete (40%)
5. Proposal Sent (60%)
6. Contract Review (80%)
7. Closed Won (100%)
8. Closed Lost (0%)

Deal Properties:
- FSA Program Type (Financial Literacy, Reentry, Corporate Wellness)
- Implementation Timeline
- Decision Committee Size
- Budget Approval Process
- Compliance Requirements
```

#### Keep Existing Bitcoin Adviser Pipeline Unchanged

### Marketing Automation Separation

#### FSA Email Sequences
**From: dalia@sovereigndwp.com**
```
Municipal Leader Sequence:
- Subject: "Financial Wellness Programs for [City Name] Citizens"
- Content: Municipality-focused case studies and ROI
- CTA: Book consultation for community financial literacy

Corporate HR Sequence:  
- Subject: "Reduce Employee Financial Stress at [Company]"
- Content: Corporate case studies and turnover reduction data
- CTA: Calculate your employee financial stress costs

Correctional Sequence:
- Subject: "Reentry Financial Education for [Facility Name]"  
- Content: Recidivism reduction and reentry success stories
- CTA: Request reentry program pilot proposal
```

### Form and Landing Page Setup

#### FSA-Specific Forms
**Lead Capture Forms**:
```html
<!-- Municipal Financial Assessment Form -->
<form hubspot-form-id="fsa-municipal-assessment">
  <input name="company" placeholder="Municipality/County Name">
  <input name="title" placeholder="Your Title">
  <input name="population" placeholder="Population Size">
  <select name="budget_range">
    <option>Under $50K</option>
    <option>$50K-$150K</option>
    <option>$150K-$500K</option>
    <option>$500K+</option>
  </select>
  <input name="email" placeholder="Your Work Email">
  <!-- Hidden field to tag as FSA -->
  <input type="hidden" name="fsa_business_unit" value="FSA_Institutional">
  <input type="hidden" name="fsa_client_type" value="Municipal">
</form>
```

#### Landing Pages
**FSA Landing Pages** (hubspot.sovereigndwp.com subdomain):
- `hubspot.sovereigndwp.com/municipal-financial-literacy`
- `hubspot.sovereigndwp.com/corporate-employee-wellness`
- `hubspot.sovereigndwp.com/correctional-reentry-programs`

### Reporting and Analytics Separation

#### FSA Business Dashboard
**Custom Dashboard: "FSA Performance"**
```
Widgets:
- FSA Leads Generated (This Month)
- FSA Deal Pipeline Value
- FSA Email Campaign Performance 
- FSA Website Traffic (by source)
- FSA Customer Acquisition Cost
- FSA Average Deal Size
- FSA Sales Cycle Length
```

#### Filtered Views
**FSA Contact Views**:
- "FSA Municipal Prospects"
- "FSA Corporate HR Leads" 
- "FSA Correctional Decision Makers"
- "FSA Active Opportunities"
- "FSA Closed Won Customers"

### Calendar Integration

#### Separate Meeting Types
**Calendly Integration**:
```
Bitcoin Adviser Meetings:
- Link: calendly.com/dalia-bitcoin-adviser
- Email: dalia@thebitcoinadviser.com
- Meeting Types: Bitcoin consultation, portfolio review

FSA Meetings:  
- Link: calendly.com/dalia-fsa
- Email: dalia@sovereigndwp.com  
- Meeting Types: Financial literacy consultation, institutional demo
```

### Email Signature Separation

#### FSA Email Signature
```html
<div>
<strong>Dalia Platt</strong><br>
Founder & CEO<br>
Financial Sovereignty Academy<br>
<br>
📧 dalia@sovereigndwp.com<br>
📅 <a href="https://calendly.com/dalia-fsa">Schedule a Consultation</a><br>
🌐 <a href="https://financiallysovereign.academy">financiallysovereign.academy</a><br>
<br>
<em>Empowering institutions to build financially sovereign communities</em>
</div>
```

### Data Privacy and Compliance

#### GDPR/Privacy Compliance
**Separate Privacy Policies**:
- Bitcoin Adviser privacy policy (existing)
- FSA privacy policy (new, institutional focus)
- Clear data usage boundaries between businesses

**Contact Consent Management**:
```
Bitcoin Adviser Contacts:
- Consent for: Bitcoin advisory communications
- Cannot receive: FSA institutional marketing

FSA Contacts:
- Consent for: Financial literacy program communications  
- Cannot receive: Bitcoin advisory marketing
```

## Implementation Timeline

### Week 1: Email and Domain Setup
- Register sovereigndwp.com domain
- Set up Google Workspace with professional emails
- Configure email forwarding and signatures

### Week 2: HubSpot User and Team Setup
- Add dalia@sovereigndwp.com as new user
- Create FSA team and assign permissions
- Set up team-based access restrictions

### Week 3: Properties and Pipeline Setup  
- Create FSA custom properties
- Build FSA sales pipeline
- Set up automated tagging workflows

### Week 4: Marketing Assets
- Create FSA email templates and sequences
- Build FSA landing pages and forms
- Set up FSA tracking and analytics

### Week 5: Testing and Launch
- Test all automation workflows
- Verify data separation is working
- Launch first FSA lead generation campaigns

## Cost Analysis

### Additional Costs
**Email/Domain**: $72/year (Google Workspace)
**HubSpot User**: $0 (using existing account capacity)
**Domain Registration**: $15/year
**Calendar Pro**: $10/month (separate Calendly account)

**Total Additional Annual Cost**: $207/year

### Benefits
- **Complete Business Separation**: No data mixing between businesses
- **Professional Credibility**: Dedicated FSA email domain
- **Scalability**: Easy to add FSA team members later
- **Compliance**: Clear data boundaries for privacy regulations
- **Brand Building**: Separate FSA brand identity

## Risk Mitigation

### Data Separation Safeguards
1. **Regular Audits**: Monthly check to ensure no data leakage
2. **Team Permissions**: Quarterly review of user access
3. **Backup Strategy**: Separate data exports for each business
4. **Training**: Clear protocols for managing dual businesses

### Transition Strategy
If FSA grows large enough to need separate HubSpot account:
- Export FSA data using custom properties as filters
- Import to new HubSpot account
- Maintain historical attribution and analytics

This approach gives you complete FSA business management capability while leveraging your existing HubSpot investment and maintaining professional separation between your businesses.