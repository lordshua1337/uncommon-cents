export interface RegulatoryBasis {
  authority: string;
  reference: string;
  url: string;
}

export interface FraudDefense {
  id: string;
  number: number;
  title: string;
  tagline: string;
  threat: string;
  action: string[];
  whyItWorks: string;
  regulatoryBasis: RegulatoryBasis[];
}

export const fraudDefenses: FraudDefense[] = [
  {
    id: "credit-freeze",
    number: 1,
    title: "Freeze Your Credit, Not Your Lifestyle",
    tagline:
      "Makes it harder for identity thieves to open new accounts in your name.",
    threat: "Identity theft via new account fraud",
    action: [
      "Freeze credit at all three bureaus (Equifax, Experian, TransUnion)",
      "Keep PINs stored securely -- you'll need them to temporarily lift for legitimate applications",
      "Also freeze child credit files if applicable",
    ],
    whyItWorks:
      "Blocks the most common identity theft vector -- fraudulent new account opening.",
    regulatoryBasis: [
      {
        authority: "FTC",
        reference: "Credit Freezes and Fraud Alerts",
        url: "https://consumer.ftc.gov/articles/credit-freezes-and-fraud-alerts",
      },
    ],
  },
  {
    id: "phishing-resistant-mfa",
    number: 2,
    title: "Phishing-Resistant MFA, Not Just a Text Code",
    tagline: "SMS codes are a fallback, not a primary defense.",
    threat: "Account takeover via phishing, SIM swap, or code interception",
    action: [
      "Use FIDO2/WebAuthn hardware keys (YubiKey, etc.) for high-value accounts",
      "Use authenticator apps (TOTP) as secondary tier",
      "Treat SMS 2FA as last resort only",
    ],
    whyItWorks:
      "Hardware-bound authentication can't be phished remotely -- attacker needs physical possession.",
    regulatoryBasis: [
      {
        authority: "CISA",
        reference: "Implementing Phishing-Resistant MFA",
        url: "https://www.cisa.gov/sites/default/files/publications/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf",
      },
    ],
  },
  {
    id: "phone-lockdown",
    number: 3,
    title: "Lock Down Your Phone Number Like a House Key",
    tagline:
      "SIM swapping lets attackers hijack your number and intercept SMS codes.",
    threat: "SIM swap / port-out fraud leading to account takeover",
    action: [
      "Set carrier account PIN (not just device PIN)",
      "Enable port-out lock/freeze with your carrier",
      "Use a separate number for financial accounts if possible",
      "Move high-value 2FA off SMS entirely",
    ],
    whyItWorks:
      "Carrier-level PIN + port lock prevents unauthorized number transfer.",
    regulatoryBasis: [
      {
        authority: "FCC",
        reference: "SIM Swap and Port-Out Fraud Rules",
        url: "https://docs.fcc.gov/public/attachments/DOC-398483A1.pdf",
      },
    ],
  },
  {
    id: "sacrificial-card",
    number: 4,
    title: "Your Online Spend Card Should Be a Sacrificial Shield",
    tagline:
      "Reduce blast radius -- limit what any single compromise can cost you.",
    threat: "Online card theft / merchant data breach",
    action: [
      "Use a separate credit card for online purchases with low limit or virtual card numbers",
      "Prefer credit over debit online -- Regulation Z limits unauthorized credit liability to $50 max",
      "Debit risk is higher -- Regulation E has tiered liability that can exceed $50 if reporting is delayed",
      "Never use primary debit card for online transactions",
    ],
    whyItWorks:
      "Breach of the sacrificial card has limited blast radius. Credit card dispute protections are stronger than debit.",
    regulatoryBasis: [
      {
        authority: "CFPB",
        reference: "Regulation Z -- Unauthorized Use Liability",
        url: "https://www.consumerfinance.gov/rules-policy/regulations/1026/12",
      },
      {
        authority: "CFPB",
        reference: "Regulation E -- Unauthorized EFT Liability",
        url: "https://www.consumerfinance.gov/rules-policy/regulations/1005/6",
      },
    ],
  },
  {
    id: "push-alerts",
    number: 5,
    title: "Push Alerts for Everything -- Then Actually Look",
    tagline: "Fraud is a time game. Sooner you detect, smaller the loss.",
    threat: "Delayed fraud detection leading to compounding losses",
    action: [
      "Enable push notifications for ALL financial accounts (every transaction)",
      'Review alerts same-day, not "when you get to it"',
      "Reg Z gives a 60-day window to assert billing errors -- but faster is always better",
      "Set up low-threshold alerts ($1+ transactions) not just large ones",
    ],
    whyItWorks:
      "Rapid detection collapses the fraud timeline before cascading damage occurs.",
    regulatoryBasis: [
      {
        authority: "CFPB",
        reference: "Regulation Z -- Billing Error Resolution (60-day window)",
        url: "https://www.consumerfinance.gov/rules-policy/regulations/1026/13",
      },
    ],
  },
  {
    id: "family-safe-phrase",
    number: 6,
    title: "Family Safe-Phrase to Defeat AI Voice Scams",
    tagline:
      "A low-tech, high-power authentication layer that AI can't guess from your social media.",
    threat: "AI voice cloning used in family emergency scam calls",
    action: [
      "Establish a verbal safe-phrase known only to family members",
      "Practice using it so it feels natural under stress",
      "If anyone calls claiming emergency and can't provide the phrase, assume scam",
      "Change the phrase periodically",
    ],
    whyItWorks:
      "Scammers can clone voice from short audio clips. They can't clone a secret passphrase.",
    regulatoryBasis: [
      {
        authority: "FTC",
        reference: "AI-Enhanced Family Emergency Schemes",
        url: "https://consumer.ftc.gov/consumer-alerts/2023/03/scammers-use-ai-enhance-their-family-emergency-schemes",
      },
    ],
  },
  {
    id: "encrypted-app-red-flag",
    number: 7,
    title: "Never Move to Encrypted Apps Because Someone Tells You To",
    tagline:
      "'Move to Signal/Telegram now' from an unknown contact is a red flag, not a convenience.",
    threat:
      "Social engineering via platform migration to avoid detection",
    action: [
      "Treat any request to move conversation to secondary platform as a red flag",
      "Verify identity through a separate, known channel before any platform switch",
      "FBI has flagged this as a specific tactic used by impersonators",
    ],
    whyItWorks:
      "Scammers push to encrypted apps to escape platform monitoring and create urgency/isolation.",
    regulatoryBasis: [
      {
        authority: "FBI",
        reference: "Malicious Messaging Campaign -- AI Vishing/Smishing",
        url: "https://www.ic3.gov/PSA/2025/PSA250515",
      },
      {
        authority: "FBI",
        reference: "Senior Officials Impersonation Alert",
        url: "https://www.fbi.gov/investigate/cyber/alerts/2025/senior-us-officials-continue-to-be-impersonated-in-malicious-messaging-campaign",
      },
    ],
  },
  {
    id: "no-go-payments",
    number: 8,
    title: "Build a No-Go Payment List",
    tagline:
      "If someone demands crypto, gift cards, wire, or 'urgent' weirdness -- assume scam until proven otherwise.",
    threat: "Fraud via irreversible payment rails",
    action: [
      "Hard rule: NEVER pay via cryptocurrency, gift cards, or wire transfer based on unsolicited requests",
      "Any 'urgent' payment demand is a scam signal, not a reason to rush",
      "FBI IC3 repeatedly flags these payment rails as primary fraud vectors",
    ],
    whyItWorks:
      "These payment methods are chosen by scammers specifically because they are hard/impossible to reverse.",
    regulatoryBasis: [
      {
        authority: "FBI",
        reference: "IC3 Annual Internet Crime Report",
        url: "https://www.fbi.gov/news/press-releases/fbi-releases-annual-internet-crime-report",
      },
    ],
  },
  {
    id: "recovery-rails",
    number: 9,
    title: "Use Official Recovery Rails Immediately",
    tagline: "Speed matters because fraud cascades.",
    threat:
      "Delayed response allowing fraud to spread across accounts/services",
    action: [
      "If something feels off, act immediately -- don't 'wait and see'",
      "File with FTC IdentityTheft.gov for structured remediation steps",
      "Place fraud alerts and/or credit freezes",
      "Contact affected financial institutions directly using numbers from official statements (not from suspicious communications)",
    ],
    whyItWorks:
      "Structured rapid response limits cascade damage across connected accounts.",
    regulatoryBasis: [
      {
        authority: "FTC",
        reference: "Identity Theft Recovery Resources",
        url: "https://consumer.ftc.gov/identity-theft-and-online-security/identity-theft",
      },
    ],
  },
  {
    id: "data-minimization",
    number: 10,
    title: "Practice Data Minimization Like a Security Engineer",
    tagline: "Segment your identity and reduce exposed surfaces.",
    threat: "Broad identity exposure enabling multi-vector attacks",
    action: [
      "Separate email addresses for financial accounts vs general use vs social media",
      "Separate phone numbers for financial accounts if possible",
      "Unique passwords per service (password manager required)",
      "Least-privilege access -- don't give apps/services more data than they need",
      "FTC guidance on segmenting access maps directly to personal security",
    ],
    whyItWorks:
      "Segmentation means compromise of one surface doesn't cascade to others. This is enterprise security thinking applied to personal life.",
    regulatoryBasis: [
      {
        authority: "FTC",
        reference: "Security Through Data Management and Segmentation",
        url: "https://www.ftc.gov/policy/advocacy-research/tech-at-ftc/2024/12/lenses-security-preventing-mitigating-digital-security-risks-through-data-management-software",
      },
    ],
  },
];

export function getFraudDefenseById(id: string): FraudDefense | undefined {
  return fraudDefenses.find((d) => d.id === id);
}
