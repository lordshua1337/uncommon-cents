// Roth Conversion Scenario -- should you convert traditional IRA to Roth?

import type { ScenarioDefinition, SimulatorResult } from "../types";

function futureValue(pv: number, rate: number, years: number): number {
  return pv * Math.pow(1 + rate / 100, years);
}

export const rothConversion: ScenarioDefinition = {
  slug: "roth-conversion",
  title: "Roth Conversion",
  subtitle: "Convert traditional IRA to Roth now or keep tax-deferred?",
  description:
    "Compare the long-term outcome of paying taxes now (Roth conversion) vs. paying taxes later in retirement. The answer depends on your current vs. future tax bracket and time horizon.",
  category: "tax",
  inputs: [
    {
      id: "balance",
      label: "IRA Balance",
      type: "currency",
      min: 10000,
      max: 2000000,
      step: 10000,
      defaultValue: 200000,
    },
    {
      id: "conversionAmount",
      label: "Conversion Amount",
      type: "currency",
      min: 5000,
      max: 2000000,
      step: 5000,
      defaultValue: 50000,
    },
    {
      id: "currentBracket",
      label: "Current Tax Bracket",
      type: "percent",
      min: 10,
      max: 37,
      step: 1,
      defaultValue: 24,
    },
    {
      id: "retirementBracket",
      label: "Expected Retirement Bracket",
      type: "percent",
      min: 10,
      max: 37,
      step: 1,
      defaultValue: 22,
    },
    {
      id: "yearsToRetirement",
      label: "Years to Retirement",
      type: "years",
      min: 1,
      max: 40,
      step: 1,
      defaultValue: 20,
    },
    {
      id: "growthRate",
      label: "Annual Growth Rate",
      type: "percent",
      min: 1,
      max: 15,
      step: 0.5,
      defaultValue: 7,
    },
  ],
  relatedConcepts: ["roth-ira", "traditional-ira", "tax-brackets", "roth-conversion-ladder"],

  compute(values: Record<string, number>): SimulatorResult {
    const balance = values.balance;
    const conversion = Math.min(values.conversionAmount, balance);
    const currentRate = values.currentBracket;
    const retireRate = values.retirementBracket;
    const years = values.yearsToRetirement;
    const growth = values.growthRate;

    // Option A: Convert now (Roth)
    const taxNow = conversion * (currentRate / 100);
    const rothBalance = futureValue(conversion, growth, years);
    const rothTaxAtWithdrawal = 0; // Roth is tax-free
    const rothNet = rothBalance;

    // Option B: Keep traditional
    const tradBalance = futureValue(conversion, growth, years);
    const tradTaxAtWithdrawal = tradBalance * (retireRate / 100);
    const tradNet = tradBalance - tradTaxAtWithdrawal;

    const winner = rothNet - taxNow > tradNet ? "A" : rothNet - taxNow < tradNet ? "B" : "tie";
    const advantage = Math.abs((rothNet - taxNow) - tradNet);

    return {
      optionA: {
        label: "Convert to Roth",
        description: "Pay taxes now, grow tax-free, withdraw tax-free",
        futureValue: rothBalance,
        taxCost: taxNow,
        netBenefit: rothNet - taxNow,
        details: [
          `Tax cost today: $${taxNow.toLocaleString()}`,
          `Future value (${years}yr): $${Math.round(rothBalance).toLocaleString()}`,
          `Tax at withdrawal: $0 (Roth is tax-free)`,
          `Net after all taxes: $${Math.round(rothNet - taxNow).toLocaleString()}`,
        ],
      },
      optionB: {
        label: "Keep Traditional",
        description: "No tax now, grow tax-deferred, pay taxes on withdrawal",
        futureValue: tradBalance,
        taxCost: tradTaxAtWithdrawal,
        netBenefit: tradNet,
        details: [
          `Tax cost today: $0`,
          `Future value (${years}yr): $${Math.round(tradBalance).toLocaleString()}`,
          `Tax at withdrawal (${retireRate}%): $${Math.round(tradTaxAtWithdrawal).toLocaleString()}`,
          `Net after all taxes: $${Math.round(tradNet).toLocaleString()}`,
        ],
      },
      verdict:
        winner === "A"
          ? `Converting to Roth saves you $${Math.round(advantage).toLocaleString()} over ${years} years. The higher your growth rate and time horizon, the more Roth wins.`
          : winner === "B"
            ? `Keeping the Traditional IRA saves you $${Math.round(advantage).toLocaleString()}. Your retirement bracket is low enough that deferring taxes wins.`
            : "Both options produce roughly the same result at these tax rates.",
      winner,
      caveat:
        "This assumes constant tax rates. Real tax policy changes, RMDs, Social Security taxation, and state taxes can shift the answer. Partial conversions over multiple years often beat a single large conversion.",
      relatedConcepts: ["roth-ira", "traditional-ira", "tax-brackets"],
    };
  },
};
