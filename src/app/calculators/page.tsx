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
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-surface-alt rounded-lg px-4 py-2.5 text-sm text-text-muted">
            <DollarSign className="w-4 h-4" />
            More calculators coming: Tax-Loss Harvesting, RMD Projections,
            Backdoor Roth
          </div>
        </div>
      </div>
    </div>
  );
}
