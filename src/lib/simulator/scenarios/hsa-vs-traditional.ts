// HSA vs Traditional Insurance Scenario

import type { ScenarioDefinition, SimulatorResult } from "../types";

function futureValue(pv: number, rate: number, years: number): number {
  return pv * Math.pow(1 + rate / 100, years);
}

export const hsaVsTraditional: ScenarioDefinition = {
  slug: "hsa-vs-traditional",
  title: "HSA vs Traditional Insurance",
  subtitle: "High-deductible with HSA or traditional insurance plan?",
  description:
    "A High Deductible Health Plan (HDHP) with an HSA offers a triple tax advantage: tax-deductible contributions, tax-free growth, and tax-free withdrawals for medical expenses. Compare it against a traditional plan with lower deductibles but higher premiums.",
  category: "insurance",
  inputs: [
    {
      id: "hdpPremium",
      label: "HDHP Monthly Premium",
      type: "currency",
      min: 0,
      max: 2000,
      step: 25,
      defaultValue: 200,
    },
    {
      id: "tradPremium",
      label: "Traditional Monthly Premium",
      type: "currency",
      min: 0,
      max: 2000,
      step: 25,
      defaultValue: 450,
    },
    {
      id: "hsaContribution",
      label: "Annual HSA Contribution",
      type: "currency",
      min: 0,
      max: 8300,
      step: 100,
      defaultValue: 4150,
      hint: "2024 individual max: $4,150",
    },
    {
      id: "expectedMedical",
      label: "Expected Annual Medical Costs",
      type: "currency",
      min: 0,
      max: 20000,
      step: 250,
      defaultValue: 2000,
    },
    {
      id: "taxBracket",
      label: "Tax Bracket",
      type: "percent",
      min: 10,
      max: 37,
      step: 1,
      defaultValue: 24,
    },
    {
      id: "yearsToRetirement",
      label: "Years to Retirement",
      type: "years",
      min: 1,
      max: 40,
      step: 1,
      defaultValue: 25,
    },
  ],
  relatedConcepts: ["hsa", "health-insurance", "tax-advantaged-accounts"],

  compute(values: Record<string, number>): SimulatorResult {
    const hdpPremium = values.hdpPremium * 12;
    const tradPremium = values.tradPremium * 12;
    const hsaContrib = values.hsaContribution;
    const medical = values.expectedMedical;
    const taxRate = values.taxBracket / 100;
    const years = values.yearsToRetirement;
    const growthRate = 7;

    // HDHP + HSA
    const premiumSavings = tradPremium - hdpPremium; // annual savings
    const hsaTaxSavings = hsaContrib * taxRate; // tax deduction value
    const hsaInvestable = hsaContrib - medical; // what stays invested (if paying medical out of pocket)
    const investablePerYear = Math.max(0, hsaInvestable);

    // Compound HSA investments over time
    let hsaBalance = 0;
    for (let y = 0; y < years; y++) {
      hsaBalance = (hsaBalance + investablePerYear) * (1 + growthRate / 100);
    }

    const totalHdpCost = hdpPremium * years + medical * years;
    const totalHsaTaxSavings = hsaTaxSavings * years;
    const hsaNetBenefit = hsaBalance + totalHsaTaxSavings + premiumSavings * years;

    // Traditional plan
    const tradCopay = Math.min(medical * 0.2, 1000); // assume 20% copay up to max
    const totalTradCost = tradPremium * years + tradCopay * years;
    const tradNetBenefit = 0; // no investment component

    const advantage = hsaNetBenefit - (totalTradCost - totalHdpCost);
    const winner = advantage > 500 ? "A" : advantage < -500 ? "B" : "tie";

    return {
      optionA: {
        label: "HDHP + HSA",
        description: "Lower premiums, invest the savings, triple tax advantage",
        futureValue: hsaBalance,
        taxCost: 0,
        netBenefit: hsaNetBenefit,
        details: [
          `Annual premium: $${hdpPremium.toLocaleString()}`,
          `Premium savings vs traditional: $${premiumSavings.toLocaleString()}/yr`,
          `HSA contribution: $${hsaContrib.toLocaleString()}/yr`,
          `Annual tax savings: $${Math.round(hsaTaxSavings).toLocaleString()}`,
          `HSA balance at retirement: $${Math.round(hsaBalance).toLocaleString()}`,
          `Total tax savings (${years}yr): $${Math.round(totalHsaTaxSavings).toLocaleString()}`,
        ],
      },
      optionB: {
        label: "Traditional Plan",
        description: "Higher premiums, lower deductible, no investment benefit",
        futureValue: 0,
        taxCost: 0,
        netBenefit: -totalTradCost,
        details: [
          `Annual premium: $${tradPremium.toLocaleString()}`,
          `Estimated copays: $${Math.round(tradCopay).toLocaleString()}/yr`,
          `Total cost (${years}yr): $${Math.round(totalTradCost).toLocaleString()}`,
          `Tax advantages: None`,
          `Investment growth: None`,
        ],
      },
      verdict:
        winner === "A"
          ? `The HDHP + HSA wins by $${Math.round(Math.abs(advantage)).toLocaleString()} over ${years} years. The triple tax advantage and investment growth compound significantly.`
          : winner === "B"
            ? `The traditional plan wins by $${Math.round(Math.abs(advantage)).toLocaleString()}. Your medical costs are high enough that the lower deductible saves more than the HSA grows.`
            : "Both plans are roughly equivalent at these numbers.",
      winner,
      caveat:
        "HSA wins big when you can afford to pay medical costs out-of-pocket and let the HSA invest. After 65, HSA funds can be used for any purpose (taxed like traditional IRA). If you expect major medical events, the traditional plan's lower deductible provides peace of mind.",
      relatedConcepts: ["hsa", "health-insurance"],
    };
  },
};
