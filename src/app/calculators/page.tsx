"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpDown,
  Heart,
  Calculator,
  DollarSign,
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
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent-bg flex items-center justify-center">
          <ArrowUpDown className="w-5 h-5 text-accent" />
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
      <div className="bg-accent-bg rounded-lg p-4 space-y-3">
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
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent-bg flex items-center justify-center">
          <Heart className="w-5 h-5 text-accent" />
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

      <div className="bg-accent-bg rounded-lg p-4 space-y-3">
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
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent-bg flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-accent" />
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

      <div className="bg-accent-bg rounded-lg p-4 space-y-3">
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
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent-bg flex items-center justify-center">
          <Calculator className="w-5 h-5 text-accent" />
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

      <div className="bg-accent-bg rounded-lg p-4 space-y-3">
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
          <span
            className={`font-semibold ${
              buyNetWealth > rentNetWealth ? "text-accent" : "text-accent"
            }`}
          >
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

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-secondary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </Link>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-accent mb-2">
            <Calculator className="w-4 h-4" />
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
          <HSAGrowthCalc />
          <CompoundInterestCalc />
          <BuyVsRentCalc />
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-surface-alt rounded-lg px-4 py-2.5 text-sm text-text-muted">
            <DollarSign className="w-4 h-4" />
            More coming: Tax-Loss Harvesting, RMD Projections, Backdoor Roth
          </div>
        </div>
      </div>
    </div>
  );
}
