// Early Retirement Scenario -- can you retire at X age?

import type { ScenarioDefinition, SimulatorResult } from "../types";

export const earlyRetirement: ScenarioDefinition = {
  slug: "early-retirement",
  title: "Early Retirement Check",
  subtitle: "Can you retire early? How much do you actually need?",
  description:
    "Use the 4% rule (and its variations) to check if your savings can support early retirement. Compare retiring at your target age vs. working a few more years.",
  category: "retirement",
  inputs: [
    {
      id: "currentAge",
      label: "Current Age",
      type: "number",
      min: 20,
      max: 65,
      step: 1,
      defaultValue: 35,
    },
    {
      id: "targetRetireAge",
      label: "Target Retirement Age",
      type: "number",
      min: 30,
      max: 70,
      step: 1,
      defaultValue: 50,
    },
    {
      id: "currentSavings",
      label: "Current Savings",
      type: "currency",
      min: 0,
      max: 5000000,
      step: 10000,
      defaultValue: 300000,
    },
    {
      id: "annualSavings",
      label: "Annual Savings Rate",
      type: "currency",
      min: 0,
      max: 200000,
      step: 5000,
      defaultValue: 40000,
    },
    {
      id: "annualExpenses",
      label: "Annual Living Expenses",
      type: "currency",
      min: 20000,
      max: 300000,
      step: 5000,
      defaultValue: 60000,
    },
    {
      id: "growthRate",
      label: "Investment Return",
      type: "percent",
      min: 1,
      max: 12,
      step: 0.5,
      defaultValue: 7,
    },
  ],
  relatedConcepts: ["fire-movement", "4-percent-rule", "retirement-planning", "sequence-of-returns"],

  compute(values: Record<string, number>): SimulatorResult {
    const currentAge = values.currentAge;
    const targetAge = values.targetRetireAge;
    const currentSavings = values.currentSavings;
    const annualSavings = values.annualSavings;
    const expenses = values.annualExpenses;
    const growth = values.growthRate;
    const laterAge = Math.min(targetAge + 5, 70);

    const yearsToTarget = Math.max(0, targetAge - currentAge);
    const yearsToLater = Math.max(0, laterAge - currentAge);

    // Project savings at target age
    let balanceAtTarget = currentSavings;
    for (let y = 0; y < yearsToTarget; y++) {
      balanceAtTarget = (balanceAtTarget + annualSavings) * (1 + growth / 100);
    }

    // Project savings at later age
    let balanceAtLater = currentSavings;
    for (let y = 0; y < yearsToLater; y++) {
      balanceAtLater = (balanceAtLater + annualSavings) * (1 + growth / 100);
    }

    // 4% rule: need 25x annual expenses
    const fireNumber = expenses * 25;
    // 3.5% safe withdrawal (more conservative)
    const conservativeNumber = expenses / 0.035;

    const targetGap = fireNumber - balanceAtTarget;
    const laterGap = fireNumber - balanceAtLater;

    const targetReady = balanceAtTarget >= fireNumber;
    const laterReady = balanceAtLater >= fireNumber;

    // Annual income from 4% withdrawal
    const targetIncome = balanceAtTarget * 0.04;
    const laterIncome = balanceAtLater * 0.04;

    const winner = targetReady ? "A" : laterReady ? "B" : "tie";

    return {
      optionA: {
        label: `Retire at ${targetAge}`,
        description: `${yearsToTarget} years of saving, then live off investments`,
        futureValue: balanceAtTarget,
        taxCost: 0,
        netBenefit: targetIncome,
        details: [
          `Projected savings: $${Math.round(balanceAtTarget).toLocaleString()}`,
          `FIRE number (25x expenses): $${fireNumber.toLocaleString()}`,
          targetReady
            ? `Status: FIRE READY -- surplus of $${Math.round(balanceAtTarget - fireNumber).toLocaleString()}`
            : `Gap: need $${Math.round(targetGap).toLocaleString()} more`,
          `Annual withdrawal (4%): $${Math.round(targetIncome).toLocaleString()}/yr`,
          `Monthly income: $${Math.round(targetIncome / 12).toLocaleString()}/mo`,
          targetIncome >= expenses ? "Covers expenses: Yes" : `Covers ${Math.round((targetIncome / expenses) * 100)}% of expenses`,
        ],
      },
      optionB: {
        label: `Retire at ${laterAge}`,
        description: `${yearsToLater} years of saving -- 5 extra years of compounding`,
        futureValue: balanceAtLater,
        taxCost: 0,
        netBenefit: laterIncome,
        details: [
          `Projected savings: $${Math.round(balanceAtLater).toLocaleString()}`,
          `FIRE number (25x expenses): $${fireNumber.toLocaleString()}`,
          laterReady
            ? `Status: FIRE READY -- surplus of $${Math.round(balanceAtLater - fireNumber).toLocaleString()}`
            : `Gap: need $${Math.round(laterGap).toLocaleString()} more`,
          `Annual withdrawal (4%): $${Math.round(laterIncome).toLocaleString()}/yr`,
          `Monthly income: $${Math.round(laterIncome / 12).toLocaleString()}/mo`,
          `Extra savings from 5 more years: $${Math.round(balanceAtLater - balanceAtTarget).toLocaleString()}`,
        ],
      },
      verdict: targetReady
        ? `You can hit your FIRE number by ${targetAge}! Your savings will generate $${Math.round(targetIncome / 12).toLocaleString()}/month at a 4% withdrawal rate.`
        : laterReady
          ? `You'll be FIRE ready by ${laterAge} but not ${targetAge}. Those 5 extra years add $${Math.round(balanceAtLater - balanceAtTarget).toLocaleString()} through compounding.`
          : `Neither timeline reaches your FIRE number of $${fireNumber.toLocaleString()}. Consider increasing savings, reducing expenses, or extending the timeline.`,
      winner,
      caveat:
        "The 4% rule assumes a 30-year retirement. For early retirees (40+ year retirement), consider a 3.5% or 3% withdrawal rate. Healthcare before 65, sequence-of-returns risk, and inflation all affect early retirement feasibility. A flexible withdrawal strategy beats a fixed one.",
      relatedConcepts: ["fire-movement", "4-percent-rule", "retirement-planning"],
    };
  },
};
