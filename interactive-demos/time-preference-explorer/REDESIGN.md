# Time Preference Explorer - Redesign Specification

## Executive Summary

**Current Problem**: The existing demo is Bitcoin-maximalist propaganda that uses hindsight bias and false dichotomies to "teach" that Bitcoin is always the right choice.

**Solution**: Transform it into a genuinely educational tool that:
1. Presents realistic financial scenarios across life stages
2. Includes multiple investment options (stocks, bonds, real estate, Bitcoin, gold, etc.)
3. Shows real trade-offs with fees, taxes, and risk
4. Personalizes based on user's age, income, and risk tolerance
5. Teaches actual time preference concepts, not just "buy Bitcoin"

---

## New Structure

### **Tab 1: Your Financial Journey** (Personalized Life-Stage Scenarios)

#### **Step 1: Choose Your Profile**
- Age range (18-25, 26-35, 36-50, 51-65, 65+)
- Income level (Student, Entry-level, Mid-career, High-earner, Retired)
- Risk tolerance (Conservative, Moderate, Aggressive)
- Time horizon (Short <5yr, Medium 5-15yr, Long >15yr)

#### **Step 2: Face Realistic Scenarios** (5 scenarios tailored to profile)

**Example Scenarios:**

**Scenario A: Young Professional (Age 28, $75k salary)**
*You just received a $10,000 bonus. How do you allocate it?*

**Options:**
1. **High Time Preference**: Vacation + new furniture ($10k spent)
   - Immediate enjoyment
   - $0 future value

2. **Moderate Time Preference**: 50/50 split
   - $5k emergency fund (high-yield savings 4.5%)
   - $5k invested (60/40 stocks/bonds)
   - 10-year outcome: ~$11,200 after inflation

3. **Low Time Preference**: 80/20 save/spend
   - $8k invested (diversified portfolio)
   - $2k for immediate wants
   - 10-year outcome: ~$15,800 (real growth)

4. **Ultra-Low + High Risk**: All in growth assets
   - $8k stocks/index funds
   - $2k Bitcoin
   - 10-year outcome: Best case $24k, Worst case $6k
   - Shows volatility risk

**After each choice**, show:
- Net worth after 5, 10, 20 years
- Trade-offs made
- Life flexibility (emergency fund = freedom)
- Alternative scenarios if market crashes

---

**Scenario B: Parent (Age 35, $120k household income)**
*Your child needs $2,000 for summer enrichment. You have $50k in investments. What do you do?*

**Options:**
1. **Sell investments immediately**
   - Pay capital gains tax (15-20%)
   - Actual cost: $2,350 after taxes
   - Opportunity cost over 13 years (until college): $6,200

2. **Use credit card, pay off over 6 months**
   - Interest cost: $180
   - Keep investments growing
   - 13-year outcome: Investments now worth $10,500 more

3. **Skip the program, save money**
   - $0 cost
   - But: potential lost experience for child
   - Shows non-financial trade-offs

4. **Reallocate budget**
   - Cut discretionary spending for 4 months
   - $0 debt, $0 investment sale
   - Delayed gratification in daily life

**Outcome shows:**
- Financial cost of each option
- Non-financial considerations (child's development)
- Emergency fund importance
- Debt vs investment sale trade-offs

---

**Scenario C: Mid-Career (Age 45, $180k salary)**
*You have $100k saved. Housing prices are high. Do you:*

**Options:**
1. **Buy house now** (20% down = $100k)
   - $500k house @ 6.5% mortgage
   - Monthly payment: $2,528
   - 20-year outcome: $240k equity (if 3% appreciation)
   - Opportunity cost: Lost $180k in investment growth

2. **Invest $100k, keep renting** ($2,200/mo rent)
   - Portfolio grows to $280k in 20 years (7% avg return)
   - Rent increases to $3,500/mo
   - More flexibility, less stability

3. **Hybrid: 50/50 split**
   - $50k down payment (10% down on $500k house)
   - $50k invested
   - Balanced approach: Some equity, some liquidity
   - Higher mortgage payment ($2,845/mo) due to PMI

4. **Wait 2 years, save more**
   - Continue renting, save aggressively
   - Risk: Housing prices increase 8%
   - Benefit: Larger down payment, avoid PMI
   - Shows patience vs timing risk

**Outcome shows:**
- Real estate vs stock returns (historical data)
- Transaction costs (6% selling fees, closing costs)
- Liquidity vs stability
- Geographic mobility considerations

---

**Scenario D: Approaching Retirement (Age 58, $1.2M saved)**
*Market just dropped 15%. Do you:*

**Options:**
1. **Panic sell, go to cash**
   - Lock in losses
   - Miss recovery
   - Historical outcome: -35% real value over 10yr (inflation + opportunity cost)

2. **Hold steady, stick to plan**
   - Rebalance 60/40 stocks/bonds
   - Historical outcome: Recovery in 18 months
   - Retirement on track

3. **Buy the dip (if you have cash)**
   - Add $50k from emergency fund
   - Risky if job loss
   - High reward if market recovers

4. **Shift to conservative allocation**
   - Move to 40/60 stocks/bonds
   - Lower risk, lower return
   - May need to work 2 more years

**Outcome shows:**
- Sequence of returns risk
- Emotional decision-making costs
- Importance of asset allocation
- Safe withdrawal rates

---

**Scenario E: Student (Age 21, $5k saved)**
*You have $5,000. Do you:*

**Options:**
1. **Spend on experience** (Study abroad, conference)
   - $0 financial return
   - High experiential/network value
   - Shows non-financial time preference

2. **Pay down student loans** ($30k @ 6% interest)
   - Save $1,800 in interest over 10 years
   - Guaranteed 6% "return"
   - Less financial stress

3. **Start investing** (Roth IRA)
   - 40-year compound growth
   - $5k → $70k by retirement (7% real return)
   - Time is your biggest asset

4. **Build emergency fund**
   - Financial security
   - Prevents debt spiral
   - Enables risk-taking in career

**Outcome shows:**
- Power of compound interest
- Debt vs investment priority
- Non-financial ROI (experiences, education)
- Opportunity cost of spending

---

### **Tab 2: Asset Comparison Tool** (Reality-Based Historical Data)

**Compare across multiple assets:**
- ✅ S&P 500 / Total Stock Market
- ✅ Bonds (10-year Treasury)
- ✅ Real Estate (Case-Shiller Index)
- ✅ Gold
- ✅ Bitcoin
- ✅ High-Yield Savings
- ✅ I-Bonds
- ✅ Cash

**Features:**
1. **Select timeframe**: 1970-2024 (any start/end year)
2. **Include real costs**:
   - Capital gains tax (0-37% depending on bracket)
   - Transaction fees (0.1-2%)
   - Expense ratios (index funds: 0.03%, managed funds: 1%)
   - Real estate costs (6% selling fee, property tax, maintenance)

3. **Show volatility**:
   - Year-by-year returns
   - Worst drawdown period
   - Recovery time
   - Risk-adjusted returns (Sharpe ratio)

4. **Realistic scenarios**:
   - "What if you needed cash in 2008?" (forced selling at bottom)
   - "What if you invested at peak?" (DCA vs lump sum)
   - "What if you rebalanced annually?" (portfolio management)

**Example Output:**

```
$10,000 invested in 2015 → 2025 (10 years)

Asset          | Nominal    | After Tax | After Fees | Real Value | Volatility | Max Drawdown
---------------|------------|-----------|------------|------------|------------|-------------
S&P 500        | $32,400    | $27,900   | $27,650    | $23,100    | 18%        | -34% (2020)
Total Bond     | $11,200    | $10,100   | $10,050    | $8,200     | 5%         | -12% (2022)
Real Estate    | $18,500    | $15,200   | $13,800    | $11,400    | 8%         | -15% (2020)
Gold           | $12,800    | $11,500   | $11,400    | $9,500     | 16%        | -22% (2021)
Bitcoin        | $180,000   | $142,000  | $140,000   | $117,000   | 73%        | -84% (2018)
Cash           | $10,000    | $10,000   | $10,000    | $7,800     | 0%         | 0%

Notes:
- Bitcoin: Extreme volatility. Would you have held through -84% crash?
- S&P 500: Required holding through 3 corrections >20%
- Bonds: Negative real returns after recent inflation
- Diversified 60/40: $22,400 real value, 12% volatility, -28% max drawdown
```

---

### **Tab 3: Risk & Life Event Simulator**

**Interactive tool that shows:**

**Your Inputs:**
- Age, income, expenses
- Current savings
- Risk tolerance
- Goals (retirement, house, education)

**Life Event Simulations:**
1. **Job loss** (6 months unemployed)
   - How does each portfolio handle it?
   - Importance of emergency fund
   - Forced liquidation at bad time

2. **Medical emergency** ($25k unexpected cost)
   - HSA benefits
   - Insurance gap
   - Debt vs investment sale

3. **Market crash** (2008-style -50%)
   - Portfolio value drop
   - Recovery timeline
   - Rebalancing opportunities

4. **Inflation spike** (2021-2023 style)
   - Real wage decrease
   - Asset performance
   - TIPS/I-Bonds value

5. **Opportunity** (Start business, real estate deal)
   - Liquidity needs
   - Risk/reward
   - Portfolio flexibility

**Output:**
- Success rate across 1,000 simulations
- Recommended asset allocation
- Emergency fund size
- Insurance needs
- Concrete actions

---

## Educational Improvements

### **What This New Version Teaches:**

✅ **Real time preference**: Delayed gratification across life stages, not just "buy Bitcoin"
✅ **Diversification**: Why you need multiple asset classes
✅ **Risk management**: Volatility, drawdowns, recovery time
✅ **Realistic planning**: Taxes, fees, emergency funds, life events
✅ **Trade-offs**: Every choice has costs and benefits
✅ **Personalization**: Different strategies for different life stages
✅ **Nuance**: No "right answer" - depends on goals, risk tolerance, timeline

### **What It Stops Doing:**

❌ Bitcoin maximalism
❌ Hindsight bias (presenting past data as future certainty)
❌ False dichotomies
❌ Ignoring risk and volatility
❌ Oversimplification
❌ Propaganda masquerading as education

---

## Technical Implementation Notes

### **Data Sources:**
- S&P 500: Robert Shiller's data (since 1871)
- Real Estate: Case-Shiller Home Price Index
- Bonds: 10-year Treasury rates
- Gold: LBMA PM Fix
- Bitcoin: CoinGecko API (historical)
- Inflation: CPI data from FRED
- Tax rates: Current federal brackets

### **Calculation Engine:**
```javascript
function calculateRealReturn(investment) {
  const nominal = calculateNominalReturn(investment);
  const afterTax = applyCapitalGainsTax(nominal, investment.taxRate);
  const afterFees = applyFees(afterTax, investment.fees);
  const realValue = adjustForInflation(afterFees, investment.years);

  return {
    nominal,
    afterTax,
    afterFees,
    realValue,
    volatility: calculateVolatility(investment),
    maxDrawdown: calculateMaxDrawdown(investment)
  };
}
```

### **Scenario Engine:**
```javascript
function generateScenarios(userProfile) {
  const scenarios = scenarioDatabase.filter(s =>
    s.ageRange.includes(userProfile.age) &&
    s.incomeLevel === userProfile.income
  );

  return scenarios.map(s => ({
    ...s,
    options: s.options.map(opt => ({
      ...opt,
      outcomes: simulateOutcomes(opt, userProfile)
    }))
  }));
}
```

---

## Success Metrics

**Educational Value:**
- Users can articulate trade-offs between options
- Users understand risk vs return
- Users can plan for their specific life stage
- Users grasp concept of opportunity cost

**Engagement:**
- Complete all 5 scenarios (>80% completion rate)
- Use asset comparison tool (>60%)
- Run life event simulations (>40%)
- Share results or return to tool (>20%)

**Behavioral Change:**
- Post-survey: "Did this change how you think about saving?" (Target: >70% yes)
- Action taken: "Did you adjust your investments?" (Target: >30%)

---

## Next Steps

1. **Approve design approach** ✅ Waiting for user feedback
2. **Build scenario database** (50+ realistic scenarios across life stages)
3. **Implement calculation engine** (with real historical data)
4. **Create personalization logic** (user profiling system)
5. **Design new UI** (maintain brand consistency)
6. **Write educational content** (explain each outcome)
7. **Add reflection prompts** (Socratic method)
8. **Test with real users** (iterate based on feedback)

---

## Alignment with Project Values

✅ **Truth over trust**: Real data, realistic assumptions, honest trade-offs
✅ **Education through experience**: Interactive scenarios, not lectures
✅ **Financial sovereignty**: Empowering informed decisions, not prescribing Bitcoin
✅ **Socratic method**: Ask questions, reveal consequences, let users discover
✅ **Privacy**: No tracking, all calculations client-side
✅ **Accessibility**: Works for all life stages and risk tolerances

---

**This redesign transforms the tool from Bitcoin propaganda into genuine financial education.**
