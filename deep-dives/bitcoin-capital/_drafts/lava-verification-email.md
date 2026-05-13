# Email to Lava — LTV Verification

*Send to: contact@lava.xyz (or via the contact form on lava.xyz). I can't send email from this environment — copy/edit and send from your dalia@thesovereign.academy account.*

---

**Subject:** Quick fact-check on Lava terms for an educational deep dive

---

Hi Lava team,

I'm Dalia, founder of Bitcoin Sovereign Academy (https://bitcoinsovereign.academy). I'm publishing a comparative deep dive on Bitcoin-backed lending platforms, with Lava featured as one of the four structurally distinct archetypes (alongside Ledn, Unchained, and Loan My Coins) — specifically representing the **self-custody DLC-based model**.

The goal is honest structural analysis, not vendor promotion. Each provider gets the same scrutiny: terms table, custody architecture, who it fits, who it doesn't.

I want to make sure the data I publish about Lava is accurate. From my research, I have:

- **Rate structure:** Step-up APR, 5% in month 1 climbing to 11.5% by month 12
- **Custody:** Self-custody via Discreet Log Contracts (DLCs); on-chain settlement; proof of reserves
- **Loan size:** $100 USD minimum, $1B+ ceiling
- **Processing time:** ~400ms typical
- **Term structure:** Open-ended, no required monthly payments
- **Visa card:** Available with up to 5% BTC cashback

The one figure I haven't been able to verify directly from your site is the **LTV**. Third-party comparisons cite **up to 60%**. Before I publish, could you confirm:

1. Is **60% the current maximum LTV**, or has it changed?
2. Are there **tiered LTV options** based on loan amount, term, or risk profile?
3. Anything else about the product structure that should be reflected for accuracy — particularly around the **DLC mechanism**, what happens at term end if a borrower can't repay, and how price-based liquidation works (if it exists)?

The deep dive is currently in drafting; publication target is roughly 4–6 weeks out. Happy to send a draft of the Lava section for fact-check before launch.

Thanks for your time —

Dalia
Founder, Bitcoin Sovereign Academy
dalia@thesovereign.academy
https://bitcoinsovereign.academy

---

## After they respond

Update `data/providers.json` `lava` entry with confirmed/corrected figures. Add new entry to `data/verification-log.json` with date, source (their email), and specific facts confirmed.

If they don't respond within a week, send a follow-up. If still no response, publish with the third-party-sourced figure and explicit "self-verified estimate, awaiting confirmation from Lava" note.
