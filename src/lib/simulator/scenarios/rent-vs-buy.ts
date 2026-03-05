// Rent vs Buy Scenario -- is it better to rent and invest or buy a home?

import type { ScenarioDefinition, SimulatorResult } from "../types";

function futureValue(pv: number, rate: number, years: number): number {
  return pv * Math.pow(1 + rate / 100, years);
}

function monthlyMortgage(principal: number, annualRate: number, years: number): number {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export const rentVsBuy: ScenarioDefinition = {
  slug: "rent-vs-buy",
  title: "Rent vs Buy",
  subtitle: "Should you buy a home or rent and invest the difference?",
  description:
    "Compare the total cost of homeownership (mortgage, taxes, maintenance, opportunity cost of down payment) against renting and investing the savings. The answer depends on your local market, how long you stay, and investment returns.",
  category: "investing",
  inputs: [
    {
      id: "homePrice",
      label: "Home Price",
      type: "currency",
      min: 100000,
      max: 2000000,
      step: 25000,
      defaultValue: 400000,
    },
    {
      id: "downPayment",
      label: "Down Payment (%)",
      type: "percent",
      min: 3,
      max: 100,
      step: 1,
      defaultValue: 20,
    },
    {
      id: "mortgageRate",
      label: "Mortgage Rate",
      type: "percent",
      min: 2,
      max: 10,
      step: 0.125,
      defaultValue: 6.5,
    },
    {
      id: "monthlyRent",
      label: "Monthly Rent",
      type: "currency",
      min: 500,
      max: 10000,
      step: 100,
      defaultValue: 2000,
    },
    {
      id: "yearsStaying",
      label: "Years You'll Stay",
      type: "years",
      min: 1,
      max: 30,
      step: 1,
      defaultValue: 7,
    },
    {
      id: "homeAppreciation",
      label: "Home Appreciation Rate",
      type: "percent",
      min: 0,
      max: 10,
      step: 0.5,
      defaultValue: 3,
    },
  ],
  relatedConcepts: ["real-estate-investing", "opportunity-cost", "leverage"],

  compute(values: Record<string, number>): SimulatorResult {
    const price = values.homePrice;
    const downPct = values.downPayment;
    const rate = values.mortgageRate;
    const rent = values.monthlyRent;
    const years = values.yearsStaying;
    const appreciation = values.homeAppreciation;
    const investReturn = 8; // assume market returns
    const propertyTaxRate = 1.1; // national avg
    const maintenanceRate = 1; // 1% of home value per year
    const rentIncrease = 3; // annual rent increase

    const downPaymentAmt = price * (downPct / 100);
    const loanAmount = price - downPaymentAmt;
    const monthly = monthlyMortgage(loanAmount, rate, 30);

    // BUY total costs
    let totalMortgagePaid = 0;
    let totalPropertyTax = 0;
    let totalMaintenance = 0;
    for (let y = 0; y < years; y++) {
      totalMortgagePaid += monthly * 12;
      const currentValue = futureValue(price, appreciation, y);
      totalPropertyTax += currentValue * (propertyTaxRate / 100);
      totalMaintenance += currentValue * (maintenanceRate / 100);
    }

    const homeValueAtSale = futureValue(price, appreciation, years);
    const sellingCosts = homeValueAtSale * 0.06; // 6% realtor fees
    const remainingLoan = loanAmount; // simplified (ignoring amortization for clarity)
    const buyEquity = homeValueAtSale - sellingCosts - remainingLoan + downPaymentAmt;
    const buyCost = totalMortgagePaid + totalPropertyTax + totalMaintenance + downPaymentAmt;
    const buyNet = buyEquity - buyCost + homeValueAtSale;

    // RENT + INVEST total costs
    let totalRentPaid = 0;
    let investmentBalance = downPaymentAmt; // invest the down payment
    for (let y = 0; y < years; y++) {
      const yearRent = rent * 12 * Math.pow(1 + rentIncrease / 100, y);
      totalRentPaid += yearRent;
      const monthlyDiff = monthly + (price * (propertyTaxRate / 100) / 12) + (price * (maintenanceRate / 100) / 12) - (rent * Math.pow(1 + rentIncrease / 100, y));
      if (monthlyDiff > 0) {
        investmentBalance += monthlyDiff * 12;
      }
      investmentBalance *= (1 + investReturn / 100);
    }

    const rentNet = investmentBalance;

    const winner = buyEquity > rentNet ? "A" : buyEquity < rentNet ? "B" : "tie";
    const advantage = Math.abs(buyEquity - rentNet);

    return {
      optionA: {
        label: "Buy the Home",
        description: "Build equity through homeownership",
        futureValue: homeValueAtSale,
        taxCost: totalPropertyTax,
        netBenefit: buyEquity,
        details: [
          `Down payment: $${downPaymentAmt.toLocaleString()}`,
          `Monthly mortgage: $${Math.round(monthly).toLocaleString()}`,
          `Home value in ${years}yr: $${Math.round(homeValueAtSale).toLocaleString()}`,
          `Total property tax: $${Math.round(totalPropertyTax).toLocaleString()}`,
          `Total maintenance: $${Math.round(totalMaintenance).toLocaleString()}`,
          `Estimated equity: $${Math.round(buyEquity).toLocaleString()}`,
        ],
      },
      optionB: {
        label: "Rent & Invest",
        description: "Invest the down payment and monthly savings",
        futureValue: rentNet,
        taxCost: 0,
        netBenefit: rentNet,
        details: [
          `Monthly rent (starting): $${rent.toLocaleString()}`,
          `Total rent over ${years}yr: $${Math.round(totalRentPaid).toLocaleString()}`,
          `Down payment invested: $${downPaymentAmt.toLocaleString()}`,
          `Investment portfolio: $${Math.round(rentNet).toLocaleString()}`,
          `Assumes ${investReturn}% annual market return`,
        ],
      },
      verdict:
        winner === "A"
          ? `Buying wins by $${Math.round(advantage).toLocaleString()} over ${years} years. Longer stays and higher appreciation favor buying.`
          : winner === "B"
            ? `Renting and investing wins by $${Math.round(advantage).toLocaleString()}. The market returns outpace home appreciation at these numbers.`
            : "Both options are roughly equal at these numbers.",
      winner,
      caveat:
        "This model simplifies mortgage amortization and doesn't account for tax deductions (mortgage interest, SALT), PMI, HOA fees, or the emotional value of homeownership. Real estate is hyperlocal -- run this with YOUR numbers.",
      relatedConcepts: ["real-estate-investing", "opportunity-cost"],
    };
  },
};
