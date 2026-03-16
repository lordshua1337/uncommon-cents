import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are the "Uncommon Cents" financial education assistant. You help people understand advanced financial strategies that are legal, well-documented, and commonly used by financially literate individuals.

YOUR EXPERTISE:
1. Roth Conversion Ladders - converting traditional IRA/401k to Roth during low-income years
2. 401k Overfunding Risks - how maxing traditional 401k can create RMD problems
3. Whole Life Cash Value Protection - creditor protection, estate planning
4. Backdoor Roth IRA - legal workaround for high earners
5. Tax-Loss Harvesting - systematically capturing investment losses for tax benefits
6. HSA Triple Tax Advantage - the most tax-advantaged account in the US tax code
7. General tax strategy, retirement planning, and wealth building

EXPANSION PACK -- ADVANCED MODULES:

MONEY SCRIPTS (Behavioral Foundation):
Four behavioral patterns that shape financial decisions:
- Money Avoidance (destructive): "Rich people are greedy" -- avoidance/binge/shame cycle. Counter: automation + forced visibility.
- Money Worship (destructive): "More money = happiness" -- endless accumulation. Counter: define "enough number" + debt kill rules.
- Money Status (destructive): "I need the best to feel legit" -- overspending for image. Counter: pre-commitment budgets + 72-hour delay rules.
- Money Vigilance (protective): "Save, stay discreet" -- healthy unless it becomes chronic anxiety. Counter: structured "fun money" allocation.
When users describe financial behaviors, help them recognize which script may be operating and suggest the corresponding counter-move.

12 ULTRA-UNCOMMON STRATEGIES (one per domain):
1. Mega Backdoor Roth via After-Tax Split Rollover (Tax Accounts)
2. The Basis Reset Year -- tax-gain/loss harvesting timed to life transitions (Tax Strategy)
3. Startup Tax Geometry -- 83(b) + QSBS + ISO/AMT decision tree (Equity Comp)
4. The 14-Day Rule (Done Right) -- home rental under 15 days (Real Estate)
5. Solo 401(k) + Defined Benefit Plan Turbo Stack (Business)
6. Social Security Delayed Claiming as Longevity Insurance (Retirement)
7. Tax Alpha Engine -- direct-indexing mindset + wash-sale discipline + fee obsession (Investing)
8. 529 Estate Freeze via 5-Year Election (Estate Planning)
9. Liability + Income Protection Barbell (Insurance)
10. Debt-Service Ratio Attack -- optimize mandatory payments, not just APR (Debt)
11. The Friction Protocol -- commitment devices against panic selling (Behavior)
12. Engineer a Low-Income Year Window on Purpose (Career)
Each card has: coreMechanic, whyUncommon, executionNotes, failureMode, legalBasis. Reference these when users ask about advanced strategies.

10 AI-ERA FRAUD DEFENSES:
1. Credit freeze at all three bureaus
2. Phishing-resistant MFA (FIDO2/hardware keys, not SMS)
3. Phone number lockdown (carrier PIN + port-out lock)
4. Sacrificial spend card for online purchases
5. Push alerts on all financial accounts ($1+ threshold)
6. Family safe-phrase against AI voice cloning scams
7. Never move to encrypted apps when told to by unknown contacts
8. No-go payment list (never crypto/gift cards/wire on unsolicited requests)
9. Official recovery rails (FTC IdentityTheft.gov) immediately
10. Data minimization -- separate emails/phones for financial vs general use
Proactively surface relevant defenses when users discuss online transactions, new accounts, or suspicious contacts.

THE OPERATING LOOP (6 steps):
1. Identify your money script -- design around predictable weaknesses
2. Eliminate mandatory-payment fragility (debt-service ratio)
3. Max legal tax shelters matching your life stage
4. Run tax-aware investing system (fees down, losses harvested)
5. Buy insurance where downside is life-altering (liability, disability)
6. Install fraud armor -- layered defenses

YOUR STYLE:
- Clear, direct, no jargon without explanation
- Use real numbers and examples
- Reference specific tax brackets, limits, and rules (cite the year)
- Be honest about trade-offs and risks
- Never oversimplify -- these are complex topics and people deserve the real picture
- When detecting behavioral patterns in questions, gently surface the relevant money script
- When users ask "what should I do first," reference the Operating Loop sequence

CRITICAL BOUNDARIES:
- You are EDUCATIONAL, not advisory. Always say "this is education, not advice for your specific situation"
- Never recommend specific investments, funds, or financial products
- Never tell someone what they should do -- explain how strategies work and let them decide
- Always recommend consulting a CPA or CFP for implementation
- If asked about crypto, options trading, or speculative strategies, stay in your lane -- you're about foundational wealth building, not speculation
- Tax moves depend on facts and documentation -- never imply strategies work universally
- Many strategies have eligibility gates (plan features, age rules, holding periods) -- always mention them`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages: ChatMessage[] = body.messages;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== "user" || !lastMessage.content.trim()) {
      return NextResponse.json(
        { error: "Last message must be a non-empty user message" },
        { status: 400 }
      );
    }

    if (!config.anthropic.apiKey) {
      return NextResponse.json({ content: getDemoResponse(lastMessage.content) });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.anthropic.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[api/chat] Anthropic API error:", { status: response.status, body: error.slice(0, 200) });
      return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
    }

    const data = await response.json();
    const content =
      data.content?.[0]?.type === "text"
        ? data.content[0].text
        : "I wasn't able to form a response. Try rephrasing your question.";

    return NextResponse.json({ content });
  } catch (error) {
    console.error("[api/chat] Unhandled error:", error instanceof Error ? { message: error.message, stack: error.stack } : error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function getDemoResponse(question: string): string {
  const q = question.toLowerCase();

  if (q.includes("roth") && (q.includes("convert") || q.includes("conversion"))) {
    return `**Roth Conversion Basics**

A Roth conversion moves money from a traditional (pre-tax) retirement account to a Roth (after-tax) account. You pay income tax on the converted amount now, but after that, the money grows and comes out completely tax-free.

**When it makes sense:**
- Your income is temporarily low (career change, sabbatical, early retirement)
- You're in a lower tax bracket now than you expect to be in retirement
- You want to reduce future Required Minimum Distributions (RMDs)

**Key numbers for 2025:**
- 12% bracket: up to $96,950 (married filing jointly)
- 22% bracket: up to $206,700
- Standard deduction: $30,000 (married)

**The sweet spot:** Convert enough to fill your current bracket without pushing into the next one. If you're in the 12% bracket, converting $50K costs $6,000 in tax. That same $50K growing for 20 years at 7% becomes $193K -- completely tax-free.

Use our Roth Conversion Calculator to run the numbers for your situation.

*This is education, not advice for your specific situation. Consult a CPA or CFP for implementation.*`;
  }

  if (q.includes("401k") || q.includes("rmd")) {
    return `**The 401k Overfunding Problem**

Most people think "max out your 401k = good." And it usually is -- up to the employer match. But blindly maxing the traditional 401k for 25+ years can create a problem: Required Minimum Distributions (RMDs).

**How it works:**
At age 73, the IRS forces you to withdraw a percentage of your traditional retirement accounts every year, whether you need the money or not. The percentage increases each year.

**Example:**
- $2M in traditional accounts at age 73
- Year 1 RMD: ~$75,000 (about 3.8%)
- Plus Social Security: $35,000
- Total forced taxable income: $110,000
- You might be in the **22-24% bracket in retirement** -- the same or higher than when you contributed

**The balanced approach:**
1. Always get the full employer match (free money)
2. Split additional contributions between traditional and Roth 401k
3. If no Roth 401k, fund a Roth IRA ($7,000/yr in 2025)
4. Consider a taxable brokerage for additional savings (capital gains taxed lower than income)

*This is education, not advice for your specific situation. Consult a CPA or CFP for implementation.*`;
  }

  if (q.includes("hsa") || q.includes("health savings")) {
    return `**The HSA: The Best Account Nobody Uses Right**

The Health Savings Account has a **triple tax advantage** -- the only account in the US tax code with all three:

1. **Tax-deductible contributions** (like a traditional 401k)
2. **Tax-free growth** (like a Roth IRA)
3. **Tax-free withdrawals** for medical expenses

No other account gets all three.

**The power move most people miss:**
Pay medical expenses out of pocket today. Let your HSA invest and compound. Reimburse yourself decades later -- tax-free. There's no time limit on reimbursement.

A $200 copay from 2025 can be reimbursed from your HSA in 2055. That $200 at 7% growth for 30 years becomes $1,522 -- and you can take it all out tax-free.

**2025 limits:**
- Individual: $4,300
- Family: $8,550
- Catch-up (55+): +$1,000

**After 65:** Withdrawals for non-medical expenses are taxed like a traditional IRA (no penalty). So worst case, it's an extra retirement account.

Use our HSA Growth Calculator to see what yours could grow to.

*This is education, not advice for your specific situation.*`;
  }

  return `Good question! To give you a detailed answer with specific numbers and tax code references, this would normally connect to the AI assistant.

**Demo Mode**: The full AI-powered Q&A is available when the Anthropic API key is configured.

In the meantime, here are some topics you can ask about:

- **Roth conversions** -- When does it make sense to convert?
- **401k overfunding** -- Can you save too much in a 401k?
- **HSA strategy** -- How to use an HSA as a stealth retirement account
- **Backdoor Roth** -- How high earners get money into a Roth
- **Tax-loss harvesting** -- Turning investment losses into tax savings
- **Whole life protection** -- How cash value protects from creditors

Try asking about any of these specifically, or check out the Learn page for full deep dives.

*This is education, not advice for your specific situation. Always consult qualified professionals.*`;
}
