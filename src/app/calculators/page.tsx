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
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent-bg flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-gold" />
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

      <div className="bg-accent-bg rounded-lg p-4 space-y-3 mb-4">
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
          <OverfundingCalc />
          <HSAGrowthCalc />
          <CompoundInterestCalc />
          <BuyVsRentCalc />
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-surface-alt rounded-lg px-4 py-2.5 text-sm text-text-muted">
            <DollarSign className="w-4 h-4" />
            More coming: Tax-Loss Harvesting, Marginal vs Effective Rate, Backdoor Roth
          </div>
        </div>
      </div>
    </div>
  );
}
