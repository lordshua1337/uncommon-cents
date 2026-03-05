// Tax-Loss Harvesting Scenario

import type { ScenarioDefinition, SimulatorResult } from "../types";

function futureValue(pv: number, rate: number, years: number): number {
  return pv * Math.pow(1 + rate / 100, years);
}

export const taxLossHarvest: ScenarioDefinition = {
  slug: "tax-loss-harvest",
  title: "Tax-Loss Harvesting",
  subtitle: "Sell losers to offset gains -- how much does it actually save?",
  description:
    "Tax-loss harvesting means selling investments at a loss to offset capital gains taxes. You reinvest in a similar (but not identical) asset to maintain market exposure. Compare harvesting losses now vs. holding through the downturn.",
  category: "tax",
  inputs: [
    {
      id: "unrealizedLoss",
      label: "Unrealized Loss",
      type: "currency",
      min: 1000,
      max: 200000,
      step: 1000,
      defaultValue: 15000,
      hint: "Current paper loss on position",
    },
    {
      id: "capitalGains",
      label: "Capital Gains This Year",
      type: "currency",
      min: 0,
      max: 500000,
      step: 1000,
      defaultValue: 20000,
    },
    {
      id: "taxBracket",
      label: "Income Tax Bracket",
      type: "percent",
      min: 10,
      max: 37,
      step: 1,
      defaultValue: 24,
    },
    {
      id: "capitalGainsRate",
      label: "Capital Gains Tax Rate",
      type: "percent",
      min: 0,
      max: 23.8,
      step: 0.1,
      defaultValue: 15,
      hint: "Long-term CG rate (0%, 15%, or 20% + 3.8% NIIT)",
    },
    {
      id: "yearsHolding",
      label: "Years Until You Sell",
      type: "years",
      min: 1,
      max: 30,
      step: 1,
      defaultValue: 10,
    },
    {
      id: "expectedReturn",
      label: "Expected Annual Return",
      type: "percent",
      min: 1,
      max: 15,
      step: 0.5,
      defaultValue: 8,
    },
  ],
  relatedConcepts: ["tax-loss-harvesting", "capital-gains-tax", "wash-sale-rule"],

  compute(values: Record<string, number>): SimulatorResult {
    const loss = values.unrealizedLoss;
    const gains = values.capitalGains;
    const incomeTaxRate = values.taxBracket / 100;
    const cgRate = values.capitalGainsRate / 100;
    const years = values.yearsHolding;
    const returnRate = values.expectedReturn;

    // Option A: Harvest the loss now
    const offsetableGains = Math.min(loss, gains);
    const gainsAfterOffset = gains - offsetableGains;
    const excessLoss = loss - offsetableGains;
    const incomeOffset = Math.min(excessLoss, 3000); // $3k ordinary income offset

    const taxSavedOnGains = offsetableGains * cgRate;
    const taxSavedOnIncome = incomeOffset * incomeTaxRate;
    const totalTaxSavedNow = taxSavedOnGains + taxSavedOnIncome;
    const carryforward = excessLoss - incomeOffset;

    // Reinvest at lower cost basis (cost basis resets lower after harvest)
    const reinvestedAmount = loss; // same dollar amount reinvested
    const futureGrowth = futureValue(reinvestedAmount, returnRate, years);
    // Future tax when selling (entire position is gain since basis is lower)
    const futureTaxOnHarvested = futureGrowth * cgRate;

    const netBenefitA = totalTaxSavedNow + futureValue(totalTaxSavedNow, returnRate, years) - futureTaxOnHarvested;

    // Option B: Hold through -- don't harvest
    const futureGrowthHold = futureValue(reinvestedAmount, returnRate, years);
    // Only pay tax on the growth above original cost basis
    const futureTaxOnHeld = Math.max(0, (futureGrowthHold - reinvestedAmount + loss)) * cgRate;
    const taxOnCurrentGains = gains * cgRate;

    const netBenefitB = -taxOnCurrentGains;

    const taxDifference = totalTaxSavedNow;
    const winner = totalTaxSavedNow > 100 ? "A" : "tie";

    return {
      optionA: {
        label: "Harvest Losses Now",
        description: "Sell losers, offset gains, reinvest in similar assets",
        futureValue: futureGrowth,
        taxCost: futureTaxOnHarvested,
        netBenefit: totalTaxSavedNow,
        details: [
          `Losses harvested: $${loss.toLocaleString()}`,
          `Gains offset: $${offsetableGains.toLocaleString()} (saving $${Math.round(taxSavedOnGains).toLocaleString()})`,
          incomeOffset > 0 ? `Income offset ($3k max): $${incomeOffset.toLocaleString()} (saving $${Math.round(taxSavedOnIncome).toLocaleString()})` : "",
          `Total tax saved this year: $${Math.round(totalTaxSavedNow).toLocaleString()}`,
          carryforward > 0 ? `Loss carryforward: $${carryforward.toLocaleString()} (use in future years)` : "",
          `Note: cost basis resets lower on reinvested shares`,
        ].filter(Boolean),
      },
      optionB: {
        label: "Hold Through",
        description: "Don't sell, wait for recovery, pay full taxes on gains",
        futureValue: futureGrowthHold,
        taxCost: taxOnCurrentGains,
        netBenefit: -taxOnCurrentGains,
        details: [
          `Capital gains tax owed: $${Math.round(taxOnCurrentGains).toLocaleString()}`,
          `No losses harvested`,
          `Position may recover to original cost basis`,
          `Future tax only on gains above original basis`,
        ],
      },
      verdict:
        winner === "A"
          ? `Harvesting saves $${Math.round(totalTaxSavedNow).toLocaleString()} in taxes this year. Reinvesting that savings compounds to $${Math.round(futureValue(totalTaxSavedNow, returnRate, years)).toLocaleString()} over ${years} years.`
          : "The tax savings are minimal at these numbers. Consider transaction costs and wash sale timing.",
      winner,
      caveat:
        "Watch the wash sale rule: you cannot buy a 'substantially identical' security within 30 days before or after the sale. Buy a similar (but not identical) ETF instead. Harvesting defers taxes but doesn't eliminate them -- your new cost basis is lower, so you'll pay more later. Best for high-income years.",
      relatedConcepts: ["tax-loss-harvesting", "capital-gains-tax", "wash-sale-rule"],
    };
  },
};
