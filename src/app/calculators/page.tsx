"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpDown,
  Heart,
  Calculator,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function RothConversionCalc() {
  const [balance, setBalance] = useState(500000);
  const [conversionAmount, setConversionAmount] = useState(50000);
  const [currentBracket, setCurrentBracket] = useState(22);
  const [retirementBracket, setRetirementBracket] = useState(24);
  const [yearsToRetirement, setYearsToRetirement] = useState(20);
  const [growthRate, setGrowthRate] = useState(7);

  const taxNow = conversionAmount * (currentBracket / 100);
  const futureValue =
    conversionAmount * Math.pow(1 + growthRate / 100, yearsToRetirement);
  const taxLater = futureValue * (retirementBracket / 100);
  const taxSavings = taxLater - taxNow;
  const remainingBalance = balance - conversionAmount;
  const remainingFV =
    remainingBalance * Math.pow(1 + growthRate / 100, yearsToRetirement);
  const rothFV = futureValue;

  return (
    <div style={{ background: "#FFFDF8", border: "1px solid #D4CFC4", borderRadius: "0.875rem", boxShadow: "0 2px 12px rgba(15,23,42,0.07), 0 1px 4px rgba(15,23,42,0.05)", padding: "1.5rem" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 flex items-center justify-center" style={{ background: "#FAF3E6", borderRadius: "0.625rem" }}>
          <ArrowUpDown className="w-5 h-5 text-accent" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Roth Conversion Calculator</h3>
          <p className="text-xs text-text-muted">
            See if converting makes sense for you
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Traditional IRA Balance
          </label>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Amount to Convert
          </label>
          <input
            type="number"
            value={conversionAmount}
            onChange={(e) => setConversionAmount(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Current Tax Bracket (%)
          </label>
          <input
            type="number"
            value={currentBracket}
            onChange={(e) => setCurrentBracket(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Expected Retirement Bracket (%)
          </label>
          <input
            type="number"
            value={retirementBracket}
            onChange={(e) => setRetirementBracket(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Years to Retirement
          </label>
          <input
            type="number"
            value={yearsToRetirement}
            onChange={(e) => setYearsToRetirement(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Annual Growth Rate (%)
          </label>
          <input
            type="number"
            value={growthRate}
            onChange={(e) => setGrowthRate(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
      </div>

      {/* Results */}
      <div className="calc-result-panel space-y-3" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", color: "#FAF8F4", borderRadius: "0.75rem", padding: "1.25rem" }}>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Tax paid on conversion now</span>
          <span className="font-medium text-red">{formatCurrency(taxNow)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">
            Converted amount grows to (tax-free)
          </span>
          <span className="font-medium text-accent">
            {formatCurrency(rothFV)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">
            Tax you&apos;d pay on that in retirement
          </span>
          <span className="font-medium text-red">
            {formatCurrency(taxLater)}
          </span>
        </div>
        <hr className="border-accent/20" />
        <div className="flex justify-between text-sm">
          <span className="font-semibold">
            {taxSavings > 0 ? "Net tax savings" : "Net tax cost"}
          </span>
          <span
            className={`font-semibold ${taxSavings > 0 ? "text-accent" : "text-red"}`}
          >
            {formatCurrency(Math.abs(taxSavings))}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Remaining traditional FV</span>
          <span className="font-medium">{formatCurrency(remainingFV)}</span>
        </div>
      </div>

      <p className="text-xs text-text-muted mt-3">
        Simplified estimate. Does not account for state taxes, IRMAA, or NIIT.
        Consult a tax professional.
      </p>
    </div>
  );
}

function HSAGrowthCalc() {
  const [annualContribution, setAnnualContribution] = useState(8550);
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [growthRate, setGrowthRate] = useState(7);
  const [taxRate, setTaxRate] = useState(24);

  const years = retirementAge - currentAge;
  let totalContributions = 0;
  let balance = 0;

  for (let i = 0; i < years; i++) {
    balance = (balance + annualContribution) * (1 + growthRate / 100);
    totalContributions += annualContribution;
  }

  const taxFreeGrowth = balance - totalContributions;
  const taxSavingsOnContributions = totalContributions * (taxRate / 100);
  const taxSavingsOnGrowth = taxFreeGrowth * (taxRate / 100);
  const totalTaxBenefit = taxSavingsOnContributions + taxSavingsOnGrowth;

  return (
    <div style={{ background: "#FFFDF8", border: "1px solid #D4CFC4", borderRadius: "0.875rem", boxShadow: "0 2px 12px rgba(15,23,42,0.07), 0 1px 4px rgba(15,23,42,0.05)", padding: "1.5rem" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 flex items-center justify-center" style={{ background: "#FAF3E6", borderRadius: "0.625rem" }}>
          <Heart className="w-5 h-5 text-accent" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-lg font-semibold">HSA Growth Calculator</h3>
          <p className="text-xs text-text-muted">
            See the power of the triple tax advantage
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Annual Contribution
          </label>
          <input
            type="number"
            value={annualContribution}
            onChange={(e) => setAnnualContribution(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Current Age
          </label>
          <input
            type="number"
            value={currentAge}
            onChange={(e) => setCurrentAge(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Retirement Age
          </label>
          <input
            type="number"
            value={retirementAge}
            onChange={(e) => setRetirementAge(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Expected Growth Rate (%)
          </label>
          <input
            type="number"
            value={growthRate}
            onChange={(e) => setGrowthRate(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Your Tax Rate (%)
          </label>
          <input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Years of Growth
          </label>
          <div className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm text-text-muted">
            {years} years
          </div>
        </div>
      </div>

      <div className="calc-result-panel space-y-3" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", color: "#FAF8F4", borderRadius: "0.75rem", padding: "1.25rem" }}>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Total contributions</span>
          <span className="font-medium">{formatCurrency(totalContributions)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Tax-free growth</span>
          <span className="font-medium text-accent">
            {formatCurrency(taxFreeGrowth)}
          </span>
        </div>
        <hr className="border-accent/20" />
        <div className="flex justify-between text-sm">
          <span className="font-semibold">Total HSA balance at retirement</span>
          <span className="font-semibold text-accent">
            {formatCurrency(balance)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">
            Tax savings on contributions
          </span>
          <span className="font-medium text-accent">
            {formatCurrency(taxSavingsOnContributions)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Tax savings on growth</span>
          <span className="font-medium text-accent">
            {formatCurrency(taxSavingsOnGrowth)}
          </span>
        </div>
        <hr className="border-accent/20" />
        <div className="flex justify-between text-sm">
          <span className="font-semibold">Total tax benefit</span>
          <span className="font-semibold text-accent">
            {formatCurrency(totalTaxBenefit)}
          </span>
        </div>
      </div>

      <p className="text-xs text-text-muted mt-3">
        Assumes contributions are invested (not spent on medical bills), and
        medical expenses are paid out of pocket. All growth is tax-free.
      </p>
    </div>
  );
}

function CompoundInterestCalc() {
  const [principal, setPrincipal] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualRate, setAnnualRate] = useState(7);
  const [years, setYears] = useState(30);

  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;
  const totalContributions = principal + monthlyContribution * totalMonths;

  let futureValue = principal;
  for (let i = 0; i < totalMonths; i++) {
    futureValue = (futureValue + monthlyContribution) * (1 + monthlyRate);
  }

  const totalInterest = futureValue - totalContributions;
  const doublingYears = annualRate > 0 ? 72 / annualRate : 0;

  return (
    <div style={{ background: "#FFFDF8", border: "1px solid #D4CFC4", borderRadius: "0.875rem", boxShadow: "0 2px 12px rgba(15,23,42,0.07), 0 1px 4px rgba(15,23,42,0.05)", padding: "1.5rem" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 flex items-center justify-center" style={{ background: "#FAF3E6", borderRadius: "0.625rem" }}>
          <DollarSign className="w-5 h-5 text-accent" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Compound Interest Calculator</h3>
          <p className="text-xs text-text-muted">
            See how time and consistency build wealth
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Starting Amount
          </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Monthly Contribution
          </label>
          <input
            type="number"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Annual Return (%)
          </label>
          <input
            type="number"
            value={annualRate}
            onChange={(e) => setAnnualRate(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Time Horizon (years)
          </label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
      </div>

      <div className="calc-result-panel space-y-3" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", color: "#FAF8F4", borderRadius: "0.75rem", padding: "1.25rem" }}>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Total contributions</span>
          <span className="font-medium">{formatCurrency(totalContributions)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Interest earned</span>
          <span className="font-medium text-accent">
            {formatCurrency(totalInterest)}
          </span>
        </div>
        <hr className="border-accent/20" />
        <div className="flex justify-between text-sm">
          <span className="font-semibold">Future value</span>
          <span className="font-semibold text-accent">
            {formatCurrency(futureValue)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Rule of 72: money doubles every</span>
          <span className="font-medium">{doublingYears.toFixed(1)} years</span>
        </div>
      </div>

      <p className="text-xs text-text-muted mt-3">
        Assumes annual compounding. Real returns vary year to year. Past
        performance does not guarantee future results.
      </p>
    </div>
  );
}

function BuyVsRentCalc() {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [mortgageRate, setMortgageRate] = useState(6.5);
  const [monthlyRent, setMonthlyRent] = useState(2000);
  const [homeAppreciation, setHomeAppreciation] = useState(3);
  const [investmentReturn, setInvestmentReturn] = useState(7);
  const [years, setYears] = useState(10);

  const downPayment = homePrice * (downPaymentPct / 100);
  const loanAmount = homePrice - downPayment;
  const monthlyMortgageRate = mortgageRate / 100 / 12;
  const totalPayments = 30 * 12;
  const monthlyMortgage =
    monthlyMortgageRate > 0
      ? (loanAmount *
          (monthlyMortgageRate * Math.pow(1 + monthlyMortgageRate, totalPayments))) /
        (Math.pow(1 + monthlyMortgageRate, totalPayments) - 1)
      : loanAmount / totalPayments;

  const monthlyPropertyTax = (homePrice * 0.012) / 12;
  const monthlyInsurance = (homePrice * 0.005) / 12;
  const monthlyMaintenance = (homePrice * 0.01) / 12;
  const totalMonthlyOwning =
    monthlyMortgage + monthlyPropertyTax + monthlyInsurance + monthlyMaintenance;

  const homeValueAtEnd =
    homePrice * Math.pow(1 + homeAppreciation / 100, years);
  const totalPaidOwning = totalMonthlyOwning * years * 12;

  const monthlySavings = totalMonthlyOwning - monthlyRent;
  let investedSavings = 0;
  const monthlyInvRate = investmentReturn / 100 / 12;

  if (monthlySavings > 0) {
    let investedDown = downPayment;
    for (let i = 0; i < years * 12; i++) {
      investedDown = investedDown * (1 + monthlyInvRate);
      investedSavings =
        (investedSavings + monthlySavings) * (1 + monthlyInvRate);
    }
    investedSavings += investedDown;
  } else {
    let investedDown = downPayment;
    for (let i = 0; i < years * 12; i++) {
      investedDown = investedDown * (1 + monthlyInvRate);
    }
    investedSavings = investedDown;
  }

  const totalPaidRenting = monthlyRent * years * 12;

  // Remaining mortgage balance after N years of payments
  const paymentsMade = years * 12;
  const remainingLoan =
    monthlyMortgageRate > 0
      ? loanAmount *
        (Math.pow(1 + monthlyMortgageRate, totalPayments) -
          Math.pow(1 + monthlyMortgageRate, paymentsMade)) /
        (Math.pow(1 + monthlyMortgageRate, totalPayments) - 1)
      : loanAmount * ((totalPayments - paymentsMade) / totalPayments);

  const buyNetWealth = homeValueAtEnd - remainingLoan;
  const rentNetWealth = investedSavings;

  return (
    <div style={{ background: "#FFFDF8", border: "1px solid #D4CFC4", borderRadius: "0.875rem", boxShadow: "0 2px 12px rgba(15,23,42,0.07), 0 1px 4px rgba(15,23,42,0.05)", padding: "1.5rem" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 flex items-center justify-center" style={{ background: "#FAF3E6", borderRadius: "0.625rem" }}>
          <Calculator className="w-5 h-5 text-accent" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Buy vs Rent Calculator</h3>
          <p className="text-xs text-text-muted">
            Compare the real cost of owning vs renting
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Home Price
          </label>
          <input
            type="number"
            value={homePrice}
            onChange={(e) => setHomePrice(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Down Payment (%)
          </label>
          <input
            type="number"
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Mortgage Rate (%)
          </label>
          <input
            type="number"
            value={mortgageRate}
            onChange={(e) => setMortgageRate(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Monthly Rent
          </label>
          <input
            type="number"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Home Appreciation (%/yr)
          </label>
          <input
            type="number"
            value={homeAppreciation}
            onChange={(e) => setHomeAppreciation(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Time Horizon (years)
          </label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-accent-bg rounded-lg p-3">
          <p className="text-xs text-text-muted mb-1">Monthly cost (owning)</p>
          <p className="text-lg font-semibold">{formatCurrency(totalMonthlyOwning)}</p>
          <p className="text-[10px] text-text-muted mt-1">
            Mortgage + tax + insurance + maintenance
          </p>
        </div>
        <div className="bg-surface-alt rounded-lg p-3">
          <p className="text-xs text-text-muted mb-1">Monthly cost (renting)</p>
          <p className="text-lg font-semibold">{formatCurrency(monthlyRent)}</p>
          <p className="text-[10px] text-text-muted mt-1">
            Difference invested at {investmentReturn}%
          </p>
        </div>
      </div>

      <div className="calc-result-panel space-y-3" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", color: "#FAF8F4", borderRadius: "0.75rem", padding: "1.25rem" }}>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Home value after {years}yr</span>
          <span className="font-medium">{formatCurrency(homeValueAtEnd)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Total paid (owning)</span>
          <span className="font-medium text-red">{formatCurrency(totalPaidOwning)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Total paid (renting)</span>
          <span className="font-medium text-red">{formatCurrency(totalPaidRenting)}</span>
        </div>
        <hr className="border-accent/20" />
        <div className="flex justify-between text-sm">
          <span className="font-semibold">Buy: estimated net wealth</span>
          <span className="font-semibold">{formatCurrency(buyNetWealth)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-semibold">Rent + invest: net wealth</span>
          <span className="font-semibold">{formatCurrency(rentNetWealth)}</span>
        </div>
        <hr className="border-accent/20" />
        <div className="flex justify-between text-sm">
          <span className="font-semibold">
            {buyNetWealth > rentNetWealth ? "Buying wins by" : "Renting wins by"}
          </span>
          <span className="font-semibold text-accent">
            {formatCurrency(Math.abs(buyNetWealth - rentNetWealth))}
          </span>
        </div>
      </div>

      <p className="text-xs text-text-muted mt-3">
        Simplified model. Does not account for closing costs, rent increases,
        mortgage interest deduction, or opportunity cost of maintenance time.
      </p>
    </div>
  );
}

// IRS Uniform Lifetime Table (simplified - common ages)
const RMD_FACTORS: Record<number, number> = {
  72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0,
  79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0,
  86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8,
  93: 10.1, 94: 9.5, 95: 8.9,
};

function OverfundingCalc() {
  const [currentAge, setCurrentAge] = useState(35);
  const [currentBalance, setCurrentBalance] = useState(150000);
  const [annualContribution, setAnnualContribution] = useState(23500);
  const [employerMatch, setEmployerMatch] = useState(6000);
  const [growthRate, setGrowthRate] = useState(7);
  const [retirementAge, setRetirementAge] = useState(65);
  const [ssIncome, setSsIncome] = useState(30000);

  const rmdStartAge = 73;
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const yearsToRmd = Math.max(0, rmdStartAge - currentAge);

  // Project balance at RMD start age
  let balanceAtRmd = currentBalance;
  for (let i = 0; i < yearsToRmd; i++) {
    const contribution = i < yearsToRetirement ? annualContribution + employerMatch : 0;
    balanceAtRmd = (balanceAtRmd + contribution) * (1 + growthRate / 100);
  }

  // Project balance at retirement (for context)
  let balanceAtRetirement = currentBalance;
  for (let i = 0; i < yearsToRetirement; i++) {
    balanceAtRetirement = (balanceAtRetirement + annualContribution + employerMatch) * (1 + growthRate / 100);
  }

  // Calculate RMDs from age 73-95
  const rmdSchedule: { age: number; balance: number; rmd: number; taxableIncome: number; bracket: string }[] = [];
  let runningBalance = balanceAtRmd;

  for (let age = rmdStartAge; age <= 95; age++) {
    const factor = RMD_FACTORS[age] || 8.9;
    const rmd = runningBalance / factor;
    const taxableIncome = rmd + ssIncome;

    // 2025 single brackets (simplified)
    let bracket = "10%";
    if (taxableIncome > 609350) bracket = "37%";
    else if (taxableIncome > 243725) bracket = "35%";
    else if (taxableIncome > 191950) bracket = "32%";
    else if (taxableIncome > 100525) bracket = "24%";
    else if (taxableIncome > 47150) bracket = "22%";
    else if (taxableIncome > 11600) bracket = "12%";

    rmdSchedule.push({ age, balance: runningBalance, rmd, taxableIncome, bracket });
    // After RMD, remaining balance continues to grow
    runningBalance = (runningBalance - rmd) * (1 + growthRate / 100);
  }

  const firstRmd = rmdSchedule[0];
  const peakRmd = rmdSchedule.reduce((max, r) => (r.rmd > max.rmd ? r : max), rmdSchedule[0]);
  const totalRmdTax = rmdSchedule.reduce((sum, r) => {
    const rate = parseFloat(r.bracket) / 100;
    return sum + r.rmd * rate;
  }, 0);

  const isOverfunded = firstRmd && parseFloat(firstRmd.bracket) >= 24;

  return (
    <div style={{ background: "#FFFDF8", border: "1px solid #D4CFC4", borderRadius: "0.875rem", boxShadow: "0 2px 12px rgba(15,23,42,0.07), 0 1px 4px rgba(15,23,42,0.05)", padding: "1.5rem" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 flex items-center justify-center" style={{ background: "#FAF3E6", borderRadius: "0.625rem" }}>
          <AlertTriangle className="w-5 h-5 text-warning" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-lg font-semibold">401(k) Overfunding Calculator</h3>
          <p className="text-xs text-text-muted">
            Will your RMDs push you into a higher bracket?
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Current Age
          </label>
          <input
            type="number"
            value={currentAge}
            onChange={(e) => setCurrentAge(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Current 401(k) Balance
          </label>
          <input
            type="number"
            value={currentBalance}
            onChange={(e) => setCurrentBalance(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Annual Employee Contribution
          </label>
          <input
            type="number"
            value={annualContribution}
            onChange={(e) => setAnnualContribution(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Annual Employer Match
          </label>
          <input
            type="number"
            value={employerMatch}
            onChange={(e) => setEmployerMatch(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Expected Growth Rate (%)
          </label>
          <input
            type="number"
            value={growthRate}
            onChange={(e) => setGrowthRate(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Planned Retirement Age
          </label>
          <input
            type="number"
            value={retirementAge}
            onChange={(e) => setRetirementAge(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs text-text-muted mb-1">
            Expected Social Security / Pension Income
          </label>
          <input
            type="number"
            value={ssIncome}
            onChange={(e) => setSsIncome(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
      </div>

      {/* Warning flag */}
      {isOverfunded && (
        <div className="bg-red/10 border border-red/20 rounded-lg p-3 mb-4">
          <p className="text-sm text-red font-medium">
            Warning: Your projected RMDs may push you into the {firstRmd.bracket} bracket or higher.
          </p>
          <p className="text-xs text-text-secondary mt-1">
            Consider splitting future contributions between Traditional and Roth 401(k),
            or doing Roth conversions in early retirement before RMDs begin.
          </p>
        </div>
      )}

      <div className="calc-result-panel space-y-3 mb-4" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", color: "#FAF8F4", borderRadius: "0.75rem", padding: "1.25rem" }}>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Balance at retirement (age {retirementAge})</span>
          <span className="font-medium">{formatCurrency(balanceAtRetirement)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Balance at RMD start (age 73)</span>
          <span className="font-medium">{formatCurrency(balanceAtRmd)}</span>
        </div>
        <hr className="border-accent/20" />
        {firstRmd && (
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">First RMD (age 73)</span>
            <span className="font-medium text-accent">{formatCurrency(firstRmd.rmd)}</span>
          </div>
        )}
        {firstRmd && (
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Total taxable income at 73</span>
            <span className={`font-medium ${isOverfunded ? "text-red" : ""}`}>
              {formatCurrency(firstRmd.taxableIncome)} ({firstRmd.bracket} bracket)
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Peak RMD (age {peakRmd.age})</span>
          <span className="font-medium text-accent">{formatCurrency(peakRmd.rmd)}</span>
        </div>
        <hr className="border-accent/20" />
        <div className="flex justify-between text-sm">
          <span className="font-semibold">Est. total tax on RMDs (73-95)</span>
          <span className="font-semibold text-red">{formatCurrency(totalRmdTax)}</span>
        </div>
      </div>

      {/* RMD Schedule Preview */}
      <div className="mb-4">
        <p className="text-xs text-text-muted mb-2 font-medium uppercase tracking-wider">
          RMD Schedule (first 10 years)
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-text-muted border-b border-border">
                <th className="text-left py-2 pr-3">Age</th>
                <th className="text-right py-2 px-3">Balance</th>
                <th className="text-right py-2 px-3">RMD</th>
                <th className="text-right py-2 pl-3">Bracket</th>
              </tr>
            </thead>
            <tbody>
              {rmdSchedule.slice(0, 10).map((row) => (
                <tr key={row.age} className="border-b border-border-light">
                  <td className="py-1.5 pr-3 text-text-secondary">{row.age}</td>
                  <td className="py-1.5 px-3 text-right font-mono">{formatCurrency(row.balance)}</td>
                  <td className="py-1.5 px-3 text-right font-mono text-accent">{formatCurrency(row.rmd)}</td>
                  <td className={`py-1.5 pl-3 text-right font-mono ${parseFloat(row.bracket) >= 24 ? "text-red" : ""}`}>
                    {row.bracket}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-text-muted">
        Uses IRS Uniform Lifetime Table. Assumes single filer, 2025 brackets.
        Does not account for state taxes, IRMAA, or NIIT. Consult a tax professional.
      </p>
    </div>
  );
}

function TaxLossHarvestingCalc() {
  const [lossAmount, setLossAmount] = useState(10000);
  const [gainsToOffset, setGainsToOffset] = useState(15000);
  const [ordinaryIncome, setOrdinaryIncome] = useState(100000);
  const [filingStatus, setFilingStatus] = useState<"single" | "married">("single");
  const [stateRate, setStateRate] = useState(5);

  // Federal LTCG rate based on income + filing status
  const ltcgThresholds =
    filingStatus === "single"
      ? { zero: 47025, fifteen: 518900 }
      : { zero: 94050, fifteen: 583750 };

  let fedLtcgRate = 20;
  if (ordinaryIncome <= ltcgThresholds.zero) fedLtcgRate = 0;
  else if (ordinaryIncome <= ltcgThresholds.fifteen) fedLtcgRate = 15;

  // NIIT (3.8%) applies above $200K single / $250K married
  const niitThreshold = filingStatus === "single" ? 200000 : 250000;
  const niitApplies = ordinaryIncome + gainsToOffset > niitThreshold;
  const niitRate = niitApplies ? 3.8 : 0;

  const totalCapGainRate = fedLtcgRate + niitRate + stateRate;

  // How losses apply
  const gainsOffset = Math.min(lossAmount, gainsToOffset);
  const remainingLoss = lossAmount - gainsOffset;
  const ordinaryDeduction = Math.min(remainingLoss, 3000);
  const carryforward = remainingLoss - ordinaryDeduction;

  // Tax savings
  const capitalGainsSaved = gainsOffset * (totalCapGainRate / 100);

  // Marginal ordinary rate (simplified 2025 brackets)
  let marginalRate = 10;
  if (filingStatus === "single") {
    if (ordinaryIncome > 609350) marginalRate = 37;
    else if (ordinaryIncome > 243725) marginalRate = 35;
    else if (ordinaryIncome > 191950) marginalRate = 32;
    else if (ordinaryIncome > 100525) marginalRate = 24;
    else if (ordinaryIncome > 47150) marginalRate = 22;
    else if (ordinaryIncome > 11600) marginalRate = 12;
  } else {
    if (ordinaryIncome > 731200) marginalRate = 37;
    else if (ordinaryIncome > 487450) marginalRate = 35;
    else if (ordinaryIncome > 383900) marginalRate = 32;
    else if (ordinaryIncome > 201050) marginalRate = 24;
    else if (ordinaryIncome > 94300) marginalRate = 22;
    else if (ordinaryIncome > 23200) marginalRate = 12;
  }

  const ordinaryDeductionSaved = ordinaryDeduction * ((marginalRate + stateRate) / 100);
  const totalSaved = capitalGainsSaved + ordinaryDeductionSaved;
  const yearsOfCarryforward = carryforward > 0 ? Math.ceil(carryforward / 3000) : 0;

  return (
    <div style={{ background: "#FFFDF8", border: "1px solid #D4CFC4", borderRadius: "0.875rem", boxShadow: "0 2px 12px rgba(15,23,42,0.07), 0 1px 4px rgba(15,23,42,0.05)", padding: "1.5rem" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 flex items-center justify-center" style={{ background: "#FAF3E6", borderRadius: "0.625rem" }}>
          <ArrowUpDown className="w-5 h-5 text-accent" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Tax-Loss Harvesting Calculator</h3>
          <p className="text-xs text-text-muted">
            How much can harvested losses save you?
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Harvested Losses ($)
          </label>
          <input
            type="number"
            value={lossAmount}
            onChange={(e) => setLossAmount(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Realized Capital Gains ($)
          </label>
          <input
            type="number"
            value={gainsToOffset}
            onChange={(e) => setGainsToOffset(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Ordinary Income ($)
          </label>
          <input
            type="number"
            value={ordinaryIncome}
            onChange={(e) => setOrdinaryIncome(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">Filing Status</label>
          <select
            value={filingStatus}
            onChange={(e) => setFilingStatus(e.target.value as "single" | "married")}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          >
            <option value="single">Single</option>
            <option value="married">Married Filing Jointly</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs text-text-muted mb-1">
            State Tax Rate (%)
          </label>
          <input
            type="number"
            value={stateRate}
            onChange={(e) => setStateRate(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
      </div>

      <div className="calc-result-panel space-y-3 mb-4" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", color: "#FAF8F4", borderRadius: "0.75rem", padding: "1.25rem" }}>
        <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
          How Your {formatCurrency(lossAmount)} Loss Gets Applied
        </p>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Offsets capital gains</span>
          <span className="font-medium">{formatCurrency(gainsOffset)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Deducts from ordinary income</span>
          <span className="font-medium">{formatCurrency(ordinaryDeduction)}</span>
        </div>
        {carryforward > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">
              Carried forward (~{yearsOfCarryforward} yrs at $3K/yr)
            </span>
            <span className="font-medium">{formatCurrency(carryforward)}</span>
          </div>
        )}
        <hr className="border-accent/20" />
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">
            Cap gains tax rate (fed {fedLtcgRate}%{niitApplies ? " + 3.8% NIIT" : ""} + {stateRate}% state)
          </span>
          <span className="font-medium">{totalCapGainRate.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Capital gains tax saved</span>
          <span className="font-medium text-accent">{formatCurrency(capitalGainsSaved)}</span>
        </div>
        {ordinaryDeduction > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">
              Ordinary income tax saved ({marginalRate}% + {stateRate}%)
            </span>
            <span className="font-medium text-accent">{formatCurrency(ordinaryDeductionSaved)}</span>
          </div>
        )}
        <hr className="border-accent/20" />
        <div className="flex justify-between text-sm">
          <span className="font-semibold">Total tax saved this year</span>
          <span className="font-semibold text-accent">{formatCurrency(totalSaved)}</span>
        </div>
      </div>

      <p className="text-xs text-text-muted">
        Losses offset gains dollar-for-dollar, then up to $3,000 against ordinary income.
        Excess carries forward indefinitely. Watch wash-sale rules: no repurchase of
        substantially identical securities within 30 days.
      </p>
    </div>
  );
}

function MarginalVsEffectiveCalc() {
  const [income, setIncome] = useState(95000);
  const [filingStatus, setFilingStatus] = useState<"single" | "married">("single");

  const brackets =
    filingStatus === "single"
      ? [
          { min: 0, max: 11600, rate: 10 },
          { min: 11600, max: 47150, rate: 12 },
          { min: 47150, max: 100525, rate: 22 },
          { min: 100525, max: 191950, rate: 24 },
          { min: 191950, max: 243725, rate: 32 },
          { min: 243725, max: 609350, rate: 35 },
          { min: 609350, max: Infinity, rate: 37 },
        ]
      : [
          { min: 0, max: 23200, rate: 10 },
          { min: 23200, max: 94300, rate: 12 },
          { min: 94300, max: 201050, rate: 22 },
          { min: 201050, max: 383900, rate: 24 },
          { min: 383900, max: 487450, rate: 32 },
          { min: 487450, max: 731200, rate: 35 },
          { min: 731200, max: Infinity, rate: 37 },
        ];

  const breakdown = brackets
    .filter((b) => income > b.min)
    .map((b) => {
      const taxableInBracket = Math.min(income, b.max) - b.min;
      const taxInBracket = taxableInBracket * (b.rate / 100);
      return { ...b, taxableInBracket, taxInBracket };
    });

  const totalTax = breakdown.reduce((sum, b) => sum + b.taxInBracket, 0);
  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;
  const marginalRate =
    breakdown.length > 0 ? breakdown[breakdown.length - 1].rate : 10;

  return (
    <div style={{ background: "#FFFDF8", border: "1px solid #D4CFC4", borderRadius: "0.875rem", boxShadow: "0 2px 12px rgba(15,23,42,0.07), 0 1px 4px rgba(15,23,42,0.05)", padding: "1.5rem" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 flex items-center justify-center" style={{ background: "#FAF3E6", borderRadius: "0.625rem" }}>
          <Calculator className="w-5 h-5 text-accent" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Marginal vs Effective Tax Rate</h3>
          <p className="text-xs text-text-muted">
            Your top bracket is NOT what you actually pay
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Taxable Income ($)
          </label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">Filing Status</label>
          <select
            value={filingStatus}
            onChange={(e) => setFilingStatus(e.target.value as "single" | "married")}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
          >
            <option value="single">Single</option>
            <option value="married">Married Filing Jointly</option>
          </select>
        </div>
      </div>

      <div className="bg-accent-bg rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-center flex-1">
            <p className="text-2xl font-mono font-bold text-accent">
              {marginalRate}%
            </p>
            <p className="text-xs text-text-muted">Marginal Rate</p>
            <p className="text-[10px] text-text-muted">(your top bracket)</p>
          </div>
          <div className="text-text-muted text-xl">vs</div>
          <div className="text-center flex-1">
            <p className="text-2xl font-mono font-bold text-green">
              {effectiveRate.toFixed(1)}%
            </p>
            <p className="text-xs text-text-muted">Effective Rate</p>
            <p className="text-[10px] text-text-muted">(what you actually pay)</p>
          </div>
        </div>

        <hr className="border-accent/20 mb-3" />

        <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
          Bracket Breakdown
        </p>
        <div className="space-y-2">
          {breakdown.map((b) => (
            <div key={b.rate} className="flex items-center gap-3">
              <div className="w-10 text-right text-xs font-mono text-text-muted">
                {b.rate}%
              </div>
              <div className="flex-1 bg-surface-alt rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-accent/60 rounded-full"
                  style={{
                    width: `${Math.min(100, (b.taxableInBracket / income) * 100)}%`,
                  }}
                />
              </div>
              <div className="w-20 text-right text-xs font-mono">
                {formatCurrency(b.taxInBracket)}
              </div>
            </div>
          ))}
        </div>

        <hr className="border-accent/20 my-3" />
        <div className="flex justify-between text-sm">
          <span className="font-semibold">Total Federal Tax</span>
          <span className="font-semibold text-accent">{formatCurrency(totalTax)}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-text-secondary">Take-home (before state/FICA)</span>
          <span className="font-medium">{formatCurrency(income - totalTax)}</span>
        </div>
      </div>

      <p className="text-xs text-text-muted">
        2025 federal brackets. Does not include standard deduction (subtract ~$15,700
        single / ~$31,400 MFJ from gross income first), FICA (7.65%), state taxes,
        or AMT. Your effective rate is always lower than your marginal rate because
        only the income WITHIN each bracket is taxed at that rate.
      </p>
    </div>
  );
}

function BackdoorRothCalc() {
  const [annualContribution, setAnnualContribution] = useState(7000);
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);
  const [growthRate, setGrowthRate] = useState(7);
  const [existingTraditionalIRA, setExistingTraditionalIRA] = useState(0);

  const years = Math.max(0, retirementAge - currentAge);
  const futureValue =
    annualContribution *
    ((Math.pow(1 + growthRate / 100, years) - 1) / (growthRate / 100));

  const hasProRataIssue = existingTraditionalIRA > 0;
  const proRataTaxablePercent = hasProRataIssue
    ? (existingTraditionalIRA /
        (existingTraditionalIRA + annualContribution)) *
      100
    : 0;

  const taxFreeSavings = futureValue * 0.22;

  return (
    <div style={{ background: "#FFFDF8", border: "1px solid #D4CFC4", borderRadius: "0.875rem", boxShadow: "0 2px 12px rgba(15,23,42,0.07), 0 1px 4px rgba(15,23,42,0.05)", padding: "1.5rem" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 flex items-center justify-center" style={{ background: "#FAF3E6", borderRadius: "0.625rem" }}>
          <ArrowUpDown className="w-5 h-5 text-accent" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Backdoor Roth IRA Calculator</h3>
          <p className="text-xs text-text-muted">
            The workaround for high-income earners
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-xs text-text-muted block mb-1">
            Annual Contribution (${annualContribution.toLocaleString()})
          </label>
          <input
            type="range"
            min={1000}
            max={8000}
            step={500}
            value={annualContribution}
            onChange={(e) => setAnnualContribution(Number(e.target.value))}
            className="w-full accent-[var(--color-accent)]"
          />
          <div className="flex justify-between text-[10px] text-text-muted mt-0.5">
            <span>$1,000</span>
            <span>$7,000 (2025 limit)</span>
            <span>$8,000 (50+ catch-up)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-text-muted block mb-1">
              Current Age
            </label>
            <input
              type="number"
              min={18}
              max={80}
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="w-full bg-surface-alt rounded-lg px-3 py-2 text-sm border border-border-light"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-1">
              Retirement Age
            </label>
            <input
              type="number"
              min={18}
              max={100}
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
              className="w-full bg-surface-alt rounded-lg px-3 py-2 text-sm border border-border-light"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-text-muted block mb-1">
            Expected Growth Rate ({growthRate}%)
          </label>
          <input
            type="range"
            min={3}
            max={12}
            step={0.5}
            value={growthRate}
            onChange={(e) => setGrowthRate(Number(e.target.value))}
            className="w-full accent-[var(--color-accent)]"
          />
        </div>

        <div>
          <label className="text-xs text-text-muted block mb-1">
            Existing Traditional IRA Balance ({formatCurrency(existingTraditionalIRA)})
          </label>
          <input
            type="range"
            min={0}
            max={500000}
            step={5000}
            value={existingTraditionalIRA}
            onChange={(e) =>
              setExistingTraditionalIRA(Number(e.target.value))
            }
            className="w-full accent-[var(--color-accent)]"
          />
          <p className="text-[10px] text-text-muted mt-0.5">
            $0 = clean backdoor. Any balance triggers pro-rata rule.
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="bg-surface-alt rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-text-muted">Years of Contributions</p>
            <p className="text-lg font-semibold font-mono">{years}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Total Contributed</p>
            <p className="text-lg font-semibold font-mono">
              {formatCurrency(annualContribution * years)}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Projected Roth Value</p>
            <p className="text-lg font-semibold font-mono text-accent">
              {formatCurrency(futureValue)}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Tax-Free Growth</p>
            <p className="text-lg font-semibold font-mono text-accent">
              {formatCurrency(futureValue - annualContribution * years)}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex justify-between text-sm">
            <span>Estimated tax saved at 22%</span>
            <span className="font-semibold text-accent">
              {formatCurrency(taxFreeSavings)}
            </span>
          </div>
        </div>
      </div>

      {/* Pro-rata warning */}
      {hasProRataIssue && (
        <div className="mt-4 bg-red/5 border border-red/10 rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-semibold text-red mb-1">
              Pro-Rata Rule Warning
            </p>
            <p className="text-xs text-text-secondary leading-relaxed">
              You have {formatCurrency(existingTraditionalIRA)} in Traditional IRA
              balances. The IRS will treat{" "}
              {proRataTaxablePercent.toFixed(0)}% of your conversion as taxable.
              To do a clean Backdoor Roth, roll your existing Traditional IRA
              into your employer 401(k) first (if your plan allows incoming
              rollovers).
            </p>
          </div>
        </div>
      )}

      {!hasProRataIssue && (
        <div className="mt-4 bg-accent-bg border border-accent/10 rounded-lg p-3 flex items-start gap-2">
          <Heart className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="text-xs text-text-secondary leading-relaxed">
            No existing Traditional IRA balance -- your Backdoor Roth conversion
            will be clean and essentially tax-free. Contribute after-tax to
            Traditional IRA, convert immediately to Roth.
          </p>
        </div>
      )}

      <p className="text-xs text-text-muted mt-4">
        Assumes annual contributions at the start of each year with consistent
        growth. The Backdoor Roth is a legal strategy for high earners above the
        Roth IRA income limit ($161K single / $240K married in 2025). Consult a
        CPA for your specific situation.
      </p>
    </div>
  );
}

function DCAvsLumpSumCalc() {
  const [totalAmount, setTotalAmount] = useState(60000);
  const [dcaMonths, setDcaMonths] = useState(12);
  const [annualReturn, setAnnualReturn] = useState(10);
  const [annualVolatility, setAnnualVolatility] = useState(15);

  const monthlyReturn = annualReturn / 100 / 12;
  const monthlyContribution = totalAmount / dcaMonths;

  // Lump sum: invested immediately, grows for full period
  const lumpSumFinal = totalAmount * Math.pow(1 + monthlyReturn, dcaMonths);

  // DCA: monthly contributions each growing for remaining months
  let dcaFinal = 0;
  for (let i = 0; i < dcaMonths; i++) {
    const monthsRemaining = dcaMonths - i;
    dcaFinal += monthlyContribution * Math.pow(1 + monthlyReturn, monthsRemaining);
  }

  const lumpSumGain = lumpSumFinal - totalAmount;
  const dcaGain = dcaFinal - totalAmount;
  const difference = lumpSumGain - dcaGain;
  const lumpSumWins = difference > 0;

  // Rough downside scenario: -1 standard deviation
  const downReturn = (annualReturn - annualVolatility) / 100 / 12;
  const lumpSumDown = totalAmount * Math.pow(1 + downReturn, dcaMonths);
  let dcaDown = 0;
  for (let i = 0; i < dcaMonths; i++) {
    dcaDown += monthlyContribution * Math.pow(1 + downReturn, dcaMonths - i);
  }

  return (
    <div style={{ background: "#FFFDF8", border: "1px solid #D4CFC4", borderRadius: "0.875rem", boxShadow: "0 2px 12px rgba(15,23,42,0.07), 0 1px 4px rgba(15,23,42,0.05)", padding: "1.5rem" }}>
      <div className="flex items-center gap-2 mb-1 text-accent">
        <ArrowUpDown className="w-4 h-4" strokeWidth={1.5} />
        <p className="text-xs uppercase tracking-widest font-medium">
          DCA vs. Lump Sum
        </p>
      </div>
      <h3 className="text-lg font-semibold mb-4">
        Should You Invest All at Once or Spread It Out?
      </h3>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-xs text-text-muted block mb-1">
            Total Amount to Invest: {formatCurrency(totalAmount)}
          </label>
          <input
            type="range"
            min={5000}
            max={500000}
            step={5000}
            value={totalAmount}
            onChange={(e) => setTotalAmount(Number(e.target.value))}
            className="w-full accent-accent"
          />
        </div>
        <div>
          <label className="text-xs text-text-muted block mb-1">
            DCA Period: {dcaMonths} months
          </label>
          <input
            type="range"
            min={3}
            max={36}
            step={1}
            value={dcaMonths}
            onChange={(e) => setDcaMonths(Number(e.target.value))}
            className="w-full accent-accent"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-text-muted block mb-1">
              Expected Annual Return: {annualReturn}%
            </label>
            <input
              type="range"
              min={0}
              max={20}
              step={1}
              value={annualReturn}
              onChange={(e) => setAnnualReturn(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-1">
              Annual Volatility: {annualVolatility}%
            </label>
            <input
              type="range"
              min={5}
              max={40}
              step={1}
              value={annualVolatility}
              onChange={(e) => setAnnualVolatility(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`rounded-lg p-3 border ${lumpSumWins ? "border-accent/20 bg-accent-bg" : "border-border-light bg-surface-alt"}`}>
          <p className="text-xs text-text-muted mb-1">Lump Sum Growth</p>
          <p className={`text-lg font-semibold ${lumpSumWins ? "text-accent" : ""}`}>
            {formatCurrency(lumpSumGain)}
          </p>
          <p className="text-xs text-text-muted">
            Final: {formatCurrency(lumpSumFinal)}
          </p>
        </div>
        <div className={`rounded-lg p-3 border ${!lumpSumWins ? "border-accent/20 bg-accent-bg" : "border-border-light bg-surface-alt"}`}>
          <p className="text-xs text-text-muted mb-1">DCA Growth</p>
          <p className={`text-lg font-semibold ${!lumpSumWins ? "text-accent" : ""}`}>
            {formatCurrency(dcaGain)}
          </p>
          <p className="text-xs text-text-muted">
            Final: {formatCurrency(dcaFinal)}
          </p>
        </div>
      </div>

      <div className={`rounded-lg p-3 text-center ${lumpSumWins ? "bg-accent-bg border border-accent/10" : "bg-surface-alt border border-border-light"}`}>
        <p className="text-sm font-semibold">
          {lumpSumWins
            ? `Lump Sum wins by ${formatCurrency(difference)}`
            : `DCA wins by ${formatCurrency(Math.abs(difference))}`}
        </p>
        <p className="text-xs text-text-muted mt-1">
          In a normal market, lump sum wins ~65% of the time
        </p>
      </div>

      {/* Downside scenario */}
      <div className="mt-4 bg-red/5 border border-red/10 rounded-lg p-3">
        <p className="text-xs font-semibold text-red mb-2">
          Bad Year Scenario (-1 Std Dev)
        </p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-text-muted">Lump Sum</p>
            <p className="font-mono font-medium">
              {formatCurrency(lumpSumDown - totalAmount)}
            </p>
          </div>
          <div>
            <p className="text-text-muted">DCA</p>
            <p className="font-mono font-medium">
              {formatCurrency(dcaDown - totalAmount)}
            </p>
          </div>
        </div>
        <p className="text-xs text-text-muted mt-2">
          DCA reduces downside in bad markets by averaging your entry price
        </p>
      </div>

      <p className="text-xs text-text-muted mt-4">
        Historical data shows lump sum investing beats DCA about two-thirds of
        the time because markets trend upward. DCA&apos;s advantage is
        psychological -- it reduces regret if markets drop right after you invest.
        The &quot;best&quot; strategy is the one you&apos;ll actually execute.
      </p>
    </div>
  );
}

function EmergencyFundCalc() {
  const [monthlyExpenses, setMonthlyExpenses] = useState(4000);
  const [currentSavings, setCurrentSavings] = useState(5000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [targetMonths, setTargetMonths] = useState(6);

  const targetAmount = monthlyExpenses * targetMonths;
  const gap = Math.max(0, targetAmount - currentSavings);
  const monthsToGoal = monthlyContribution > 0 ? Math.ceil(gap / monthlyContribution) : Infinity;
  const coverageMonths = monthlyExpenses > 0 ? currentSavings / monthlyExpenses : 0;
  const progressPct = Math.min(100, (currentSavings / targetAmount) * 100);

  return (
    <div style={{ background: "#FFFDF8", border: "1px solid #D4CFC4", borderRadius: "0.875rem", boxShadow: "0 2px 12px rgba(15,23,42,0.07), 0 1px 4px rgba(15,23,42,0.05)", padding: "1.5rem" }}>
      <h3 className="text-lg font-semibold mb-1">Emergency Fund</h3>
      <p className="text-sm text-text-muted mb-5">
        How long until you have a real safety net?
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-xs text-text-muted">
            Monthly Expenses: ${monthlyExpenses.toLocaleString()}
          </label>
          <input
            type="range"
            min={1000}
            max={15000}
            step={250}
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
            className="w-full accent-accent"
          />
        </div>
        <div>
          <label className="text-xs text-text-muted">
            Current Savings: ${currentSavings.toLocaleString()}
          </label>
          <input
            type="range"
            min={0}
            max={100000}
            step={500}
            value={currentSavings}
            onChange={(e) => setCurrentSavings(Number(e.target.value))}
            className="w-full accent-accent"
          />
        </div>
        <div>
          <label className="text-xs text-text-muted">
            Monthly Contribution: ${monthlyContribution.toLocaleString()}
          </label>
          <input
            type="range"
            min={0}
            max={3000}
            step={50}
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            className="w-full accent-accent"
          />
        </div>
        <div>
          <label className="text-xs text-text-muted">
            Target: {targetMonths} months of expenses
          </label>
          <input
            type="range"
            min={3}
            max={12}
            step={1}
            value={targetMonths}
            onChange={(e) => setTargetMonths(Number(e.target.value))}
            className="w-full accent-accent"
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-text-muted mb-1">
          <span>${currentSavings.toLocaleString()} saved</span>
          <span>${targetAmount.toLocaleString()} target</span>
        </div>
        <div className="w-full bg-surface-alt rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-300"
            style={{
              width: `${progressPct}%`,
              background:
                progressPct >= 100
                  ? "var(--color-green, #16a34a)"
                  : progressPct >= 50
                    ? "var(--color-accent)"
                    : "var(--color-accent, #CA8A04)",
            }}
          />
        </div>
        <p className="text-xs text-text-muted mt-1 text-center">
          {progressPct.toFixed(0)}% funded
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-alt rounded-lg p-3">
          <p className="text-xs text-text-muted">Current Coverage</p>
          <p className="text-lg font-bold font-mono text-accent">
            {coverageMonths.toFixed(1)} mo
          </p>
        </div>
        <div className="bg-surface-alt rounded-lg p-3">
          <p className="text-xs text-text-muted">Gap to Fill</p>
          <p className="text-lg font-bold font-mono">
            ${gap.toLocaleString()}
          </p>
        </div>
        <div className="bg-surface-alt rounded-lg p-3 col-span-2">
          <p className="text-xs text-text-muted">Time to Fully Funded</p>
          <p className="text-lg font-bold font-mono text-accent">
            {gap === 0
              ? "Already there"
              : monthsToGoal === Infinity
                ? "Start contributing"
                : `${monthsToGoal} months`}
          </p>
        </div>
      </div>

      <p className="text-xs text-text-muted mt-4 leading-relaxed">
        Most experts recommend 3-6 months of expenses. Self-employed or single-income
        households should aim for 6-12 months. Keep it in a high-yield savings account --
        accessible but not too accessible.
      </p>
    </div>
  );
}

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-secondary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Home
        </Link>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-accent mb-2">
            <Calculator className="w-4 h-4" strokeWidth={1.5} />
            <p className="text-xs uppercase tracking-widest font-medium">
              Calculators
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
            Run Your Numbers
          </h1>
          <p className="text-text-secondary leading-relaxed">
            Strategies are only useful when you see how they apply to your
            specific situation. Plug in your numbers.
          </p>
        </div>

        <div className="space-y-8">
          <RothConversionCalc />
          <BackdoorRothCalc />
          <OverfundingCalc />
          <MarginalVsEffectiveCalc />
          <TaxLossHarvestingCalc />
          <HSAGrowthCalc />
          <CompoundInterestCalc />
          <DCAvsLumpSumCalc />
          <EmergencyFundCalc />
          <BuyVsRentCalc />
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-surface-alt rounded-lg px-4 py-2.5 text-sm text-text-muted">
            <DollarSign className="w-4 h-4" strokeWidth={1.5} />
            More coming: Social Security Timing, Asset Location, IRMAA Planning
          </div>
        </div>
      </div>
    </div>
  );
}
