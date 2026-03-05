// Debt Payoff Scenario -- avalanche vs snowball vs hybrid

import type { ScenarioDefinition, SimulatorResult } from "../types";

interface DebtItem {
  readonly balance: number;
  readonly rate: number;
  readonly minPayment: number;
}

function simulatePayoff(
  debts: readonly DebtItem[],
  extraMonthly: number,
  strategy: "avalanche" | "snowball"
): { months: number; totalInterest: number } {
  const balances = debts.map((d) => d.balance);
  let totalInterest = 0;
  let months = 0;
  const maxMonths = 600; // 50 year safety cap

  while (balances.some((b) => b > 0) && months < maxMonths) {
    months++;
    let extraLeft = extraMonthly;

    // Pay minimums first
    for (let i = 0; i < balances.length; i++) {
      if (balances[i] <= 0) continue;
      const interest = balances[i] * (debts[i].rate / 100 / 12);
      totalInterest += interest;
      balances[i] += interest;
      const payment = Math.min(debts[i].minPayment, balances[i]);
      balances[i] -= payment;
    }

    // Apply extra payment to target debt
    const targetIdx = strategy === "avalanche"
      ? balances.reduce((best, bal, i) => {
          if (bal <= 0) return best;
          if (best === -1) return i;
          return debts[i].rate > debts[best].rate ? i : best;
        }, -1)
      : balances.reduce((best, bal, i) => {
          if (bal <= 0) return best;
          if (best === -1) return i;
          return bal < balances[best] ? i : best;
        }, -1);

    if (targetIdx >= 0 && extraLeft > 0) {
      const payment = Math.min(extraLeft, balances[targetIdx]);
      balances[targetIdx] -= payment;
    }
  }

  return { months, totalInterest };
}

export const debtPayoff: ScenarioDefinition = {
  slug: "debt-payoff",
  title: "Debt Payoff Strategy",
  subtitle: "Avalanche (highest rate first) vs Snowball (smallest balance first)",
  description:
    "The avalanche method saves the most money by targeting highest-interest debt first. The snowball method gives quick psychological wins by eliminating smallest balances first. Compare both approaches with your actual numbers.",
  category: "debt",
  inputs: [
    {
      id: "debt1Balance",
      label: "Debt 1 Balance",
      type: "currency",
      min: 0,
      max: 200000,
      step: 500,
      defaultValue: 15000,
      hint: "e.g. credit card",
    },
    {
      id: "debt1Rate",
      label: "Debt 1 Interest Rate",
      type: "percent",
      min: 0,
      max: 30,
      step: 0.5,
      defaultValue: 22,
    },
    {
      id: "debt2Balance",
      label: "Debt 2 Balance",
      type: "currency",
      min: 0,
      max: 200000,
      step: 500,
      defaultValue: 8000,
      hint: "e.g. personal loan",
    },
    {
      id: "debt2Rate",
      label: "Debt 2 Interest Rate",
      type: "percent",
      min: 0,
      max: 30,
      step: 0.5,
      defaultValue: 12,
    },
    {
      id: "debt3Balance",
      label: "Debt 3 Balance",
      type: "currency",
      min: 0,
      max: 200000,
      step: 500,
      defaultValue: 25000,
      hint: "e.g. car loan",
    },
    {
      id: "debt3Rate",
      label: "Debt 3 Interest Rate",
      type: "percent",
      min: 0,
      max: 30,
      step: 0.5,
      defaultValue: 6,
    },
    {
      id: "extraPayment",
      label: "Extra Monthly Payment",
      type: "currency",
      min: 50,
      max: 5000,
      step: 50,
      defaultValue: 500,
      hint: "Above minimums",
    },
  ],
  relatedConcepts: ["debt-management", "compound-interest", "behavioral-finance"],

  compute(values: Record<string, number>): SimulatorResult {
    const debts: DebtItem[] = [
      { balance: values.debt1Balance, rate: values.debt1Rate, minPayment: Math.max(25, values.debt1Balance * 0.02) },
      { balance: values.debt2Balance, rate: values.debt2Rate, minPayment: Math.max(25, values.debt2Balance * 0.02) },
      { balance: values.debt3Balance, rate: values.debt3Rate, minPayment: Math.max(25, values.debt3Balance * 0.02) },
    ].filter((d) => d.balance > 0);

    if (debts.length === 0) {
      return {
        optionA: { label: "Avalanche", description: "No debts entered", futureValue: 0, taxCost: 0, netBenefit: 0, details: [] },
        optionB: { label: "Snowball", description: "No debts entered", futureValue: 0, taxCost: 0, netBenefit: 0, details: [] },
        verdict: "Enter at least one debt to compare strategies.",
        winner: "tie",
        caveat: "",
        relatedConcepts: [],
      };
    }

    const extra = values.extraPayment;
    const avalanche = simulatePayoff(debts, extra, "avalanche");
    const snowball = simulatePayoff(debts, extra, "snowball");

    const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
    const interestSaved = snowball.totalInterest - avalanche.totalInterest;
    const monthsSaved = snowball.months - avalanche.months;

    const winner = interestSaved > 50 ? "A" : interestSaved < -50 ? "B" : "tie";

    return {
      optionA: {
        label: "Avalanche Method",
        description: "Pay highest interest rate first -- saves the most money",
        futureValue: 0,
        taxCost: 0,
        netBenefit: -avalanche.totalInterest,
        details: [
          `Total debt: $${totalDebt.toLocaleString()}`,
          `Payoff time: ${avalanche.months} months (${(avalanche.months / 12).toFixed(1)} years)`,
          `Total interest paid: $${Math.round(avalanche.totalInterest).toLocaleString()}`,
          `Extra monthly: $${extra.toLocaleString()}`,
          `Order: highest rate first (${debts.sort((a, b) => b.rate - a.rate).map((d) => `${d.rate}%`).join(" > ")})`,
        ],
      },
      optionB: {
        label: "Snowball Method",
        description: "Pay smallest balance first -- faster psychological wins",
        futureValue: 0,
        taxCost: 0,
        netBenefit: -snowball.totalInterest,
        details: [
          `Total debt: $${totalDebt.toLocaleString()}`,
          `Payoff time: ${snowball.months} months (${(snowball.months / 12).toFixed(1)} years)`,
          `Total interest paid: $${Math.round(snowball.totalInterest).toLocaleString()}`,
          `Extra monthly: $${extra.toLocaleString()}`,
          `Order: smallest balance first (${debts.sort((a, b) => a.balance - b.balance).map((d) => `$${d.balance.toLocaleString()}`).join(" > ")})`,
        ],
      },
      verdict:
        winner === "A"
          ? `Avalanche saves $${Math.round(interestSaved).toLocaleString()} in interest and pays off ${Math.abs(monthsSaved)} months sooner. Math favors avalanche.`
          : winner === "B"
            ? `Snowball costs $${Math.round(Math.abs(interestSaved)).toLocaleString()} more in interest but gives faster wins. If motivation is your challenge, snowball wins.`
            : "Both methods produce similar results with these debts. Choose whichever keeps you motivated.",
      winner,
      caveat:
        "The best debt payoff strategy is the one you stick with. Avalanche is mathematically optimal, but snowball's quick wins help many people stay consistent. The real enemy is minimum-only payments.",
      relatedConcepts: ["debt-management", "compound-interest"],
    };
  },
};
