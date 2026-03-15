// Stage 4: You Buy a House -- stage-specific lesson content

import type { StageLessonContent } from "../types";

// ls-4-01: Quick Win
export const whatYouCanAfford: StageLessonContent = {
  body: `The bank will tell you that you can afford a $600,000 house. The bank is not your friend. The bank wants to lend you as much as possible because that's how they make money. Their "pre-approval" is a maximum, not a recommendation.

**What the bank uses:** The 43% DTI rule. Your total monthly debt payments (including the new mortgage, car loans, student loans, credit cards) cannot exceed 43% of your gross monthly income. If you make $120,000/year ($10,000/month gross), you can technically take on $4,300/month in total debt payments.

**What you should use:** The 28/36 rule. Housing costs (mortgage principal, interest, property taxes, insurance) should not exceed 28% of gross income. Total debt payments should not exceed 36% of gross income.

On $120,000/year: 28% = $2,800/month on housing. 36% = $3,600/month on all debt.

**The number most people forget:** The true cost of homeownership is not the mortgage payment. It's mortgage + property taxes + homeowner's insurance + HOA (if applicable) + maintenance. Budget 1-2% of the home's value annually for maintenance alone. On a $400,000 home: $4,000 to $8,000/year in maintenance costs that your landlord used to pay.

**The real question is not "can I afford the payment?" It's "can I afford the payment AND still save for retirement AND maintain an emergency fund AND not feel house-poor?"**

House-poor: technically making the mortgage payment each month while having no financial flexibility, no savings growth, and no ability to handle any other expense without going into debt. This is an extremely common trap.

A useful stress test: what happens to this house if one income disappears? If you're a dual-income household, can you cover the mortgage on one salary? If not, you may be over-leveraged.

The conservative rule that saves marriages: buy a house you can afford on one income.`,
  keyTakeaways: [
    "Bank pre-approval is a maximum, not a recommendation -- use the 28/36 rule instead of the bank's 43% DTI limit",
    "True housing cost = mortgage + property taxes + insurance + HOA + ~1-2% annual maintenance",
    "House-poor is real: technically affording payments while having no financial flexibility or savings",
    "Stress test: can you cover the mortgage on one income if a job is lost?",
    "The most important number is not the purchase price -- it's the all-in monthly cost",
  ],
  actionItem:
    "Calculate your 28% and 36% limits based on your gross monthly income. Then look at any house you're considering: add mortgage payment + estimated property taxes (1-2% of purchase price annually / 12) + insurance (~$150-200/month). Does it fit inside 28%? That's your real budget.",
};

// ls-4-08: Closing Costs and Hidden Expenses
export const closingCostsHiddenExpenses: StageLessonContent = {
  body: `Nobody talks about closing costs until you're sitting at the table ready to sign. By then it's too late to be surprised. These costs are real, they are significant, and they are mostly non-negotiable.

**Typical closing costs: 2-5% of the loan amount**

On a $400,000 purchase with 20% down ($320,000 loan):
- 2% closing costs = $6,400
- 5% closing costs = $16,000

The actual items that make up closing costs:

**Loan origination fees**: 0.5-1% of the loan amount. The lender's cut for processing your mortgage.

**Appraisal**: $400-$700. Required by your lender to confirm the house is worth what you're paying.

**Title insurance**: $1,000-$3,500. Protects against historical ownership disputes. Usually required.

**Home inspection**: $300-$600. NOT optional. A good inspector finds $5,000-$50,000 in issues. The worst deals you'll ever make is skipping this.

**Property taxes (prepaid)**: Typically 2-3 months of property taxes paid upfront into escrow.

**Homeowner's insurance (prepaid)**: First year's premium due at closing.

**Attorney fees** (in some states): $500-$1,500.

**Escrow fees**: $500-$2,000.

**The hidden $20K nobody budgets for:**
- Moving costs: $2,000-$10,000 depending on distance and volume
- Immediate repairs (the ones you knew about from inspection): $3,000-$15,000
- New furniture for a larger space: $5,000-$20,000
- Appliances if not included: $2,000-$8,000
- Landscaping if the yard is a disaster: $1,000-$5,000
- Window treatments: $500-$3,000

The total "buying the house" cost -- down payment + closing + move-in -- is almost always 10-15% more than first-time buyers expect. Budget for this explicitly, not vaguely.

**Negotiating closing costs**: Some closing costs are negotiable. Shop multiple lenders (their origination fees vary). In a buyer's market, you can ask the seller to pay some closing costs as a concession. Get a Loan Estimate from multiple lenders and compare line by line.`,
  keyTakeaways: [
    "Closing costs run 2-5% of loan amount -- budget $6,000-$16,000 on a $320,000 loan",
    "Never skip the home inspection -- a $500 inspection can reveal $30,000 in problems",
    "Budget explicitly for moving, immediate repairs, furniture, and appliances -- easily another $10,000-$20,000",
    "Shop multiple lenders for closing costs -- origination fees vary significantly between banks",
    "Ask sellers for closing cost concessions in a buyer's market -- it's a common and legitimate negotiating tool",
  ],
  actionItem:
    "Get a Loan Estimate from two different lenders for your target purchase price. Compare the closing cost line items side by side. Ask each lender which fees are negotiable. Save the difference in your house fund.",
  proTip:
    "The home inspection report is your negotiating weapon. Every significant issue found is an opportunity to request a price reduction or repair credit from the seller. Don't let inspectors scare you off a good house -- use their findings to negotiate.",
};

// ls-4-10: Boss Lesson
export const homeownerFirstYearPlaybook: StageLessonContent = {
  body: `You closed. You have keys. You are house-poor in the best possible way. Here's what to do in year one to make sure the biggest purchase of your life pays off.

**Month 1: The Basics**
- Change the locks. The sellers gave keys to their dog walker, their in-laws, their neighbor, and possibly several real estate agents. Cost: $100-$200.
- Set up automatic mortgage payment. Missing a payment hurts your credit and starts a late-fee cascade.
- Find your circuit breaker panel, water shutoff valve, and gas shutoff. Know how to use each before you need to.
- File for homestead exemption if your state offers it. In Texas, this can save $400-$1,500/year on property taxes. Deadline is typically April 30 of the first year.

**Month 2-3: Financial Setup**
- Open a dedicated home maintenance savings account. Auto-transfer 1-1.5% of your home's value annually, divided monthly. On a $400,000 home: $333-$500/month.
- Review your homeowner's insurance. First-year policies are often expensive because you're a new customer. Get competing quotes after year one.
- Understand your escrow account. Your lender collects property taxes and insurance through escrow and pays them on your behalf. Review the escrow analysis they'll send annually.

**Month 4-12: Maintenance and Optimization**
- Service your HVAC system. A $100 annual tune-up prevents a $5,000 emergency repair.
- Clean your gutters in fall and spring. Blocked gutters cause foundation damage over time.
- Test every smoke detector and CO detector. Replace batteries.
- Document major systems: note the age of your water heater, HVAC, roof, and appliances. Knowing when things were installed tells you when to budget for replacement.

**Tax Benefits (first tax season)**
- Mortgage interest is deductible if you itemize -- relevant if your total itemized deductions exceed the standard deduction ($14,600 single / $29,200 married filing jointly in 2024)
- Property taxes are deductible up to $10,000 (SALT cap)
- Most first-time homeowners don't exceed the standard deduction until they have a large mortgage and high property taxes

**The long game**: A house is not primarily an investment -- it's a place to live that builds equity over time. The real financial benefit of homeownership is forced savings (equity) and inflation protection on housing costs. Don't obsess over appreciation -- focus on the quality of life and the discipline of maintenance.`,
  keyTakeaways: [
    "Change the locks immediately -- the previous owners distributed keys widely",
    "Save 1-1.5% of home value annually for maintenance in a dedicated account",
    "File for homestead exemption if your state offers it -- deadlines are often April 30 of your first year",
    "Service your HVAC annually -- $100 prevents a $5,000 emergency",
    "Mortgage interest is only deductible if your total itemized deductions exceed the standard deduction",
  ],
  actionItem:
    "This week: Find your circuit breaker, water shutoff, and gas shutoff. Take photos and label them in your phone. Open a dedicated home maintenance savings account and set up a monthly auto-transfer of 1% of your home's value divided by 12.",
  proTip:
    "Build a home file: physical folder or cloud folder with every receipt for home improvements, warranties for appliances, and the inspection report. You'll need this when you sell (capital improvements reduce your taxable gain) and when systems break (warranty is only useful if you can find it).",
};
