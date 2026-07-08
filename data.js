// F3 (Faster Financial Facilitation) - Mock Financial Database
// Formatted for standard web imports.

const F3Data = {
  // 1. BANKING CATEGORIES INFO
  bankCategories: {
    PSU: {
      name: "Public Sector Banks (PSU)",
      examples: "SBI, PNB, Bank of Baroda, Canara",
      strengths: "Home loans, trust-sensitive FDs, government schemes, safety"
    },
    Private: {
      name: "Private Banks",
      examples: "HDFC, ICICI, Axis, Kotak, IndusInd",
      strengths: "Digital experience, credit cards, premium banking, fast processing"
    },
    SFB: {
      name: "Small Finance Banks (SFB)",
      examples: "AU, Equitas, Ujjivan, Suryoday, Utkarsh",
      strengths: "Highest FD rates, first-time/thin-file borrowers"
    },
    Foreign: {
      name: "Foreign Banks",
      examples: "Citi, HSBC, Standard Chartered, DBS",
      strengths: "NRE/NRO banking, remittances, forex cards, HNI products"
    },
    Cooperative: {
      name: "Cooperative / RRBs",
      examples: "Regional/urban cooperative banks, Gramin banks",
      strengths: "Local reach, agricultural and rural lending"
    },
    NBFC: {
      name: "NBFCs",
      examples: "Bajaj Finserv, Tata Capital, HDB Financial",
      strengths: "LAP, gold loans, SME/business loans, faster disbursals"
    },
    Digital: {
      name: "Payments / Digital-first",
      examples: "Airtel Payments, Paytm Payments, fintech-partner banks",
      strengths: "UPI-linked remittance, small-ticket micro-savings"
    }
  },

  // 2. FIXED DEPOSITS (Invest -> Fixed Deposits)
  fixedDeposits: [
    {
      bankName: "SBI",
      category: "PSU",
      headlineRate: 6.80,
      seniorRate: 7.30,
      rating: "Sovereign/Highest",
      prematurePenalty: "0.5% - 1.0%",
      dicgcProtected: true,
      minTenureDays: 7,
      maxTenureDays: 3650
    },
    {
      bankName: "PNB",
      category: "PSU",
      headlineRate: 6.75,
      seniorRate: 7.25,
      rating: "Sovereign/Highest",
      prematurePenalty: "1.0%",
      dicgcProtected: true,
      minTenureDays: 7,
      maxTenureDays: 3650
    },
    {
      bankName: "HDFC Bank",
      category: "Private",
      headlineRate: 7.25,
      seniorRate: 7.75,
      rating: "AAA Rated",
      prematurePenalty: "1.0%",
      dicgcProtected: true,
      minTenureDays: 7,
      maxTenureDays: 3650
    },
    {
      bankName: "ICICI Bank",
      category: "Private",
      headlineRate: 7.20,
      seniorRate: 7.70,
      rating: "AAA Rated",
      prematurePenalty: "0.5% - 1.0%",
      dicgcProtected: true,
      minTenureDays: 7,
      maxTenureDays: 3650
    },
    {
      bankName: "Axis Bank",
      category: "Private",
      headlineRate: 7.20,
      seniorRate: 7.70,
      rating: "AAA Rated",
      prematurePenalty: "1.0%",
      dicgcProtected: true,
      minTenureDays: 7,
      maxTenureDays: 3650
    },
    {
      bankName: "AU Small Finance Bank",
      category: "SFB",
      headlineRate: 8.00,
      seniorRate: 8.50,
      rating: "AA+ Rated",
      prematurePenalty: "1.0% (Waived for select tenures)",
      dicgcProtected: true,
      minTenureDays: 7,
      maxTenureDays: 3650
    },
    {
      bankName: "Ujjivan Small Finance Bank",
      category: "SFB",
      headlineRate: 8.25,
      seniorRate: 8.75,
      rating: "AA Rated",
      prematurePenalty: "None after 6 months",
      dicgcProtected: true,
      minTenureDays: 7,
      maxTenureDays: 3650
    },
    {
      bankName: "Suryoday Small Finance Bank",
      category: "SFB",
      headlineRate: 8.50,
      seniorRate: 9.00,
      rating: "A+ Rated",
      prematurePenalty: "1.0%",
      dicgcProtected: true,
      minTenureDays: 7,
      maxTenureDays: 3650
    },
    {
      bankName: "HSBC India",
      category: "Foreign",
      headlineRate: 6.50,
      seniorRate: 7.00,
      rating: "AAA Rated (Global Parent)",
      prematurePenalty: "1.0%",
      dicgcProtected: true,
      minTenureDays: 7,
      maxTenureDays: 3650
    },
    {
      bankName: "DBS Bank India",
      category: "Foreign",
      headlineRate: 7.25,
      seniorRate: 7.75,
      rating: "AAA Rated",
      prematurePenalty: "None",
      dicgcProtected: true,
      minTenureDays: 7,
      maxTenureDays: 3650
    }
  ],

  // 3. MUTUAL FUNDS (Invest -> Mutual Funds)
  mutualFunds: [
    {
      fundName: "SBI Bluechip Fund",
      category: "bank-sponsored",
      goal: "Wealth growth",
      cagr1Yr: 16.5,
      cagr3Yr: 15.2,
      cagr5Yr: 14.8,
      expenseRatio: 0.85,
      riskGrade: "Moderate-High",
      minInvestment: 5000
    },
    {
      fundName: "HDFC Flexi Cap Fund",
      category: "bank-sponsored",
      goal: "Wealth growth",
      cagr1Yr: 18.2,
      cagr3Yr: 17.8,
      cagr5Yr: 16.2,
      expenseRatio: 0.95,
      riskGrade: "High",
      minInvestment: 1000
    },
    {
      fundName: "Parag Parikh Flexi Cap Fund",
      category: "independent",
      goal: "Wealth growth",
      cagr1Yr: 21.4,
      cagr3Yr: 19.5,
      cagr5Yr: 18.7,
      expenseRatio: 0.55,
      riskGrade: "High",
      minInvestment: 1000
    },
    {
      fundName: "Mirae Asset Large Cap Fund",
      category: "independent",
      goal: "Wealth growth",
      cagr1Yr: 15.1,
      cagr3Yr: 14.2,
      cagr5Yr: 13.9,
      expenseRatio: 0.60,
      riskGrade: "Moderate-High",
      minInvestment: 5000
    },
    {
      fundName: "SBI Long Term Equity Fund (ELSS)",
      category: "bank-sponsored",
      goal: "Tax saving",
      cagr1Yr: 17.2,
      cagr3Yr: 16.1,
      cagr5Yr: 15.3,
      expenseRatio: 0.90,
      riskGrade: "High",
      minInvestment: 500
    },
    {
      fundName: "Mirae Asset Tax Saver Fund (ELSS)",
      category: "independent",
      goal: "Tax saving",
      cagr1Yr: 19.1,
      cagr3Yr: 17.5,
      cagr5Yr: 16.8,
      expenseRatio: 0.58,
      riskGrade: "High",
      minInvestment: 500
    },
    {
      fundName: "Quant Tax Plan",
      category: "independent",
      goal: "Tax saving",
      cagr1Yr: 24.3,
      cagr3Yr: 21.5,
      cagr5Yr: 22.1,
      expenseRatio: 0.65,
      riskGrade: "Very High",
      minInvestment: 500
    },
    {
      fundName: "ICICI Prudential Liquid Fund",
      category: "bank-sponsored",
      goal: "Short-term parking",
      cagr1Yr: 6.8,
      cagr3Yr: 5.9,
      cagr5Yr: 5.2,
      expenseRatio: 0.20,
      riskGrade: "Low",
      minInvestment: 99
    },
    {
      fundName: "Nippon India Liquid Fund",
      category: "independent",
      goal: "Short-term parking",
      cagr1Yr: 6.9,
      cagr3Yr: 6.0,
      cagr5Yr: 5.3,
      expenseRatio: 0.18,
      riskGrade: "Low",
      minInvestment: 99
    },
    {
      fundName: "HDFC Retirement Savings Fund",
      category: "bank-sponsored",
      goal: "Retirement",
      cagr1Yr: 14.8,
      cagr3Yr: 13.9,
      cagr5Yr: 13.1,
      expenseRatio: 0.82,
      riskGrade: "Moderate",
      minInvestment: 500
    },
    {
      fundName: "UTI Retirement Benefit Fund",
      category: "independent",
      goal: "Retirement",
      cagr1Yr: 12.2,
      cagr3Yr: 11.5,
      cagr5Yr: 10.8,
      expenseRatio: 0.70,
      riskGrade: "Moderate",
      minInvestment: 500
    }
  ],

  // 4. BONDS (Invest -> Bonds)
  bonds: [
    {
      bondName: "NHAI Tax Free Bonds",
      issuerCategory: "PSU",
      rating: "Sovereign (AAA)",
      ytm: 5.75,
      tenureMonths: 120,
      minInvestment: 10000,
      taxFeature: "Tax-Free Interest Income"
    },
    {
      bondName: "REC Tax Free Bonds",
      issuerCategory: "PSU",
      rating: "Sovereign (AAA)",
      ytm: 5.85,
      tenureMonths: 180,
      minInvestment: 10000,
      taxFeature: "Tax-Free Interest Income"
    },
    {
      bondName: "PFC Capital Gain Bonds (Sec 54EC)",
      issuerCategory: "PSU",
      rating: "AAA Rated",
      ytm: 5.25,
      tenureMonths: 60,
      minInvestment: 20000,
      taxFeature: "Capital Gains Tax Exemption under Sec 54EC"
    },
    {
      bondName: "HDFC Bank Corporate NCD",
      issuerCategory: "Corporate",
      rating: "AAA Rated",
      ytm: 7.85,
      tenureMonths: 36,
      minInvestment: 10000,
      taxFeature: "Taxable Interest"
    },
    {
      bondName: "L&T Finance Corporate NCD",
      issuerCategory: "Corporate",
      rating: "AAA Rated",
      ytm: 8.10,
      tenureMonths: 60,
      minInvestment: 10000,
      taxFeature: "Taxable Interest"
    },
    {
      bondName: "Tata Capital Corporate NCD",
      issuerCategory: "Corporate",
      rating: "AAA Rated",
      ytm: 7.95,
      tenureMonths: 48,
      minInvestment: 10000,
      taxFeature: "Taxable Interest"
    },
    {
      bondName: "Bajaj Finance NCD",
      issuerCategory: "NBFC",
      rating: "AAA Rated",
      ytm: 8.20,
      tenureMonths: 36,
      minInvestment: 10000,
      taxFeature: "Taxable Interest"
    },
    {
      bondName: "Muthoot Finance NCD",
      issuerCategory: "NBFC",
      rating: "AA+ Rated",
      ytm: 8.75,
      tenureMonths: 24,
      minInvestment: 10000,
      taxFeature: "Taxable Interest"
    },
    {
      bondName: "Shriram Finance NCD",
      issuerCategory: "NBFC",
      rating: "AA+ Rated",
      ytm: 8.90,
      tenureMonths: 36,
      minInvestment: 10000,
      taxFeature: "Taxable Interest"
    }
  ],

  // 5. IPO (Invest -> IPO)
  ipos: [
    {
      companyName: "Ola Electric Mobility",
      status: "Open",
      priceBand: "₹72 - ₹76",
      gmpPercent: 12,
      subscriptionTimes: "4.2x",
      closeDate: "Jul 11, 2026",
      minInvestment: 14820,
      lotSize: 195,
      allotmentProb: "Medium (4.2x subscribed)"
    },
    {
      companyName: "Brainbees Solutions (Firstcry)",
      status: "Open",
      priceBand: "₹440 - ₹465",
      gmpPercent: 8,
      subscriptionTimes: "1.1x",
      closeDate: "Jul 10, 2026",
      minInvestment: 14880,
      lotSize: 32,
      allotmentProb: "High (Under-subscribed in retail)"
    },
    {
      companyName: "Swiggy Limited",
      status: "Upcoming",
      priceBand: "₹390 - ₹410",
      gmpPercent: 28,
      subscriptionTimes: "0.0x",
      closeDate: "Jul 18, 2026",
      minInvestment: 14350,
      lotSize: 35,
      allotmentProb: "TBD (Upcoming)"
    },
    {
      companyName: "Tata Autocomp Systems",
      status: "Upcoming",
      priceBand: "₹600 - ₹630",
      gmpPercent: 55,
      subscriptionTimes: "0.0x",
      closeDate: "Jul 22, 2026",
      minInvestment: 14490,
      lotSize: 23,
      allotmentProb: "TBD (Upcoming)"
    },
    {
      companyName: "NTPC Green Energy",
      status: "Upcoming",
      priceBand: "₹102 - ₹108",
      gmpPercent: 42,
      subscriptionTimes: "0.0x",
      closeDate: "Jul 25, 2026",
      minInvestment: 14904,
      lotSize: 138,
      allotmentProb: "TBD (Upcoming)"
    }
  ],

  // 6. CREDIT CARDS (Expenses -> Best CC Selector)
  creditCards: [
    {
      cardName: "Amazon Pay ICICI Card",
      bankName: "ICICI Bank",
      spendCategories: ["Shopping", "General"],
      minIncome: 20000,
      annualFee: 0,
      rewardsSummary: "5% cashback on Amazon (Prime), 3% on Amazon (Non-Prime), 2% on partners, 1% on other spends.",
      reasonToChoose: "No-cost, lifetime free card. Best entry-level card for online shoppers."
    },
    {
      cardName: "SBI Card Elite",
      bankName: "SBI Card",
      spendCategories: ["Shopping", "Travel"],
      minIncome: 120000,
      annualFee: 4999,
      rewardsSummary: "5x Reward points on dining, department stores & grocery; 2 free movie tickets monthly; lounge access.",
      reasonToChoose: "Premium features with high reward rates on milestone spends."
    },
    {
      cardName: "HDFC Regalia Gold",
      bankName: "HDFC Bank",
      spendCategories: ["Travel", "Dining"],
      minIncome: 100000,
      annualFee: 2500,
      rewardsSummary: "4 Reward Points per ₹150; 5x points on partner portals (Myntra, Nykaa); complimentary lounge access.",
      reasonToChoose: "Excellent general-use card for frequent flyers who value luxury dining and travel benefits."
    },
    {
      cardName: "Axis Ace Card",
      bankName: "Axis Bank",
      spendCategories: ["Grocery", "Dining"],
      minIncome: 30000,
      annualFee: 499,
      rewardsSummary: "5% cashback on utility bills, mobile recharges via Google Pay; 2% cashback on other spends; 4% on Zomato/Swiggy.",
      reasonToChoose: "Best utility bill cashback card with a very low annual fee."
    },
    {
      cardName: "Amex Platinum Travel Card",
      bankName: "American Express",
      spendCategories: ["Travel", "Shopping"],
      minIncome: 80000,
      annualFee: 5000,
      rewardsSummary: "Complimentary Indigo vouchers & Taj stay vouchers on meeting annual milestones of ₹1.9L and ₹4L.",
      reasonToChoose: "Best milestone-focused travel card with premium customer support."
    },
    {
      cardName: "Axis Vistara Signature",
      bankName: "Axis Bank",
      spendCategories: ["Travel"],
      minIncome: 80000,
      annualFee: 3000,
      rewardsSummary: "1 CV Point for every ₹200 spent; Complimentary Premium Economy ticket on join and milestone spends.",
      reasonToChoose: "Dedicated to Vistara flyer loyalty, provides immediate travel value."
    },
    {
      cardName: "BPCL SBI Card Octane",
      bankName: "SBI Card",
      spendCategories: ["Fuel"],
      minIncome: 30000,
      annualFee: 1499,
      rewardsSummary: "7.25% value back (25 Reward Points per ₹100) on BPCL fuel; 1% surcharge waiver; 2500 bonus points on joins.",
      reasonToChoose: "Highest value-back card on fuel spends in India."
    }
  ],

  // 7. LOANS DATABASE (Loans -> Home, LAP, LAS, SME)
  loans: [
    // PSU
    {
      bankName: "SBI",
      bankCategory: "PSU",
      baseRate: 8.40,
      processingFeePercent: 0.35,
      processingFeeCap: 10000,
      specialOffer: "0.05% discount for salaried customers with salary accounts in SBI.",
      suitability: "Lowest long-term interest rates. Best for trust-sensitive home loans."
    },
    {
      bankName: "Bank of Baroda",
      bankCategory: "PSU",
      baseRate: 8.45,
      processingFeePercent: 0.40,
      processingFeeCap: 12500,
      specialOffer: "Processing fee waived during festive season.",
      suitability: "Competitive rates, good for home loans and agricultural properties."
    },
    // Private
    {
      bankName: "HDFC Bank",
      bankCategory: "Private",
      baseRate: 8.65,
      processingFeePercent: 0.50,
      processingFeeCap: 15000,
      specialOffer: "Instant in-principle approval online for pre-approved customers.",
      suitability: "Extremely fast loan processing and end-to-end digital tracker."
    },
    {
      bankName: "ICICI Bank",
      bankCategory: "Private",
      baseRate: 8.70,
      processingFeePercent: 0.50,
      processingFeeCap: 15000,
      specialOffer: "No documentation required for pre-approved corporate salary accounts.",
      suitability: "Seamless digital sanctioning, great for credit-history-rich borrowers."
    },
    {
      bankName: "Axis Bank",
      bankCategory: "Private",
      baseRate: 8.75,
      processingFeePercent: 0.50,
      processingFeeCap: 15000,
      specialOffer: "Complementary premium credit card on loan approval.",
      suitability: "High loan-to-value ratio, ideal for premium properties."
    },
    // Small Finance
    {
      bankName: "AU Small Finance Bank",
      bankCategory: "SFB",
      baseRate: 9.25,
      processingFeePercent: 0.75,
      processingFeeCap: 20000,
      specialOffer: "Flexible document checklist for self-employed and cash-salary businesses.",
      suitability: "Best for self-employed, small businessmen, and thin-file borrowers."
    },
    {
      bankName: "Equitas Small Finance Bank",
      bankCategory: "SFB",
      baseRate: 9.50,
      processingFeePercent: 1.00,
      processingFeeCap: 25000,
      specialOffer: "Low processing time, doorstep document collection.",
      suitability: "Tailored for small business loans and regional properties."
    },
    // Foreign
    {
      bankName: "HSBC India",
      bankCategory: "Foreign",
      baseRate: 8.55,
      processingFeePercent: 0.50,
      processingFeeCap: 15000,
      specialOffer: "Overdraft facility linked to NRE/NRO accounts.",
      suitability: "Premium home loans and remittance linking for HNIs/NRIs."
    },
    // NBFC
    {
      bankName: "Bajaj Finserv",
      bankCategory: "NBFC",
      baseRate: 9.20,
      processingFeePercent: 1.00,
      processingFeeCap: 25000,
      specialOffer: "Soft pre-approval in 15 minutes, disbursement in 72 hours.",
      suitability: "Best for quick disbursals of LAP (Loan against property) and gold loans."
    },
    {
      bankName: "Tata Capital",
      bankCategory: "NBFC",
      baseRate: 9.35,
      processingFeePercent: 1.00,
      processingFeeCap: 20000,
      specialOffer: "Customized EMI repayment structures (Step-up / Step-down options).",
      suitability: "High flexibility in business and SME cash flow loans."
    }
  ],

  // 8. INSURANCE / SECURITY
  insurance: {
    Life: [
      { provider: "LIC (Tech Term)", type: "Public", premiumBase: 12000, rating: "5/5 Claims Settled (99.01%)", details: "Traditional trust, high claim settlement ratio, offline support." },
      { provider: "HDFC Life (Click 2 Protect)", type: "Private", premiumBase: 9500, rating: "AAA Rated Claims (98.6%)", details: "Modern custom additions (Accidental Cover, Critical Illness) in minutes." },
      { provider: "ICICI Pru (iProtect Smart)", type: "Private", premiumBase: 9200, rating: "AAA Rated Claims (97.9%)", details: "Excellent digital onboarding, quick claim settlement pledge." }
    ],
    Health: [
      { provider: "Star Health (Assure)", type: "Standalone", premiumBase: 18000, rating: "92% cashless claims", details: "Largest network of hospitals in India, covers major pre-existing conditions." },
      { provider: "Niva Bupa (ReAssure 2.0)", type: "Standalone", premiumBase: 16500, rating: "94% cashless claims", details: "Carry forward unused cover, unlimited restorations of cover." },
      { provider: "HDFC Ergo (Optima Secure)", type: "Private", premiumBase: 19500, rating: "96% cashless claims", details: "Immediate 2x cover from Day 1. Very premium network support." }
    ],
    Vehicle: [
      { provider: "ICICI Lombard (Motor)", type: "Private", premiumBase: 6500, rating: "1-hour survey", details: "Instant video claims, cashless repairs across 5000+ garages." },
      { provider: "Tata AIG (Auto Secure)", type: "Private", premiumBase: 6200, rating: "Depreciation waiver addon", details: "Unique return-to-invoice and zero-depreciation coverage packages." },
      { provider: "United India (Public Motor)", type: "Public", premiumBase: 5800, rating: "Traditional claims", details: "Basic, economical coverage for older vehicles." }
    ],
    Home: [
      { provider: "HDFC Ergo (Home Protect)", type: "Private", premiumBase: 3500, rating: "Fire & Calamity", details: "Comprehensive safety structure and contents coverage." },
      { provider: "SBI General (Home Insurance)", type: "Public", premiumBase: 3000, rating: "Low premium", details: "Economical coverage for self-occupied structures." },
      { provider: "ICICI Lombard (Home Care)", type: "Private", premiumBase: 4200, rating: "All-risk cover", details: "Covers jewellery, electronics, and structural damage in a single policy." }
    ],
    Business: [
      { provider: "Tata AIG (SME Shield)", type: "Private", premiumBase: 12000, rating: "Asset protection", details: "Ideal for shops, warehouses, and offices. Covers fire, theft, and business interruption." },
      { provider: "HDFC Ergo (MyBusiness)", type: "Private", premiumBase: 14000, rating: "Liability inclusion", details: "Cyber liability, employee fidelity, and fire protection customized for startups." },
      { provider: "National Insurance (Shopkeepers)", type: "Public", premiumBase: 9000, rating: "Traditional SME", details: "Economical coverage for traditional physical shops." }
    ],
    Remittance: [
      { provider: "DBS Remit", type: "Bancassurance", premiumBase: 0.50, rating: "Same-day delivery", details: "Zero-fee transfers to select countries with competitive exchange rates." },
      { provider: "Wise (TransferWise)", type: "Private", premiumBase: 0.40, rating: "Mid-Market rate", details: "Transparent flat fees and exact mid-market exchange rate matching." },
      { provider: "State Bank of India (SBI Express)", type: "Public", premiumBase: 0.75, rating: "Deep branch reach", details: "Secure transfers from NRI accounts with massive banking network support." }
    ]
  }
};
