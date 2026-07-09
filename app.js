// F3 (Faster Financial Facilitation) - Core Application Logic

// 1. GLOBAL STATE
const AppState = {
  activeTab: 'invest', // 'invest' | 'expenses' | 'loans' | 'security'
  currentCategory: null, // active category ID (e.g., 'fd', 'home_loan')
  currentStep: 0,
  prefills: {
    amount: null,
    tenure: null,
    seniorCitizen: null,
    payoutType: null,
    bankCategory: [],
    
    // Mutual Funds / Bonds
    goal: null,
    horizon: null,
    riskAppetite: null,
    fundType: null,
    bondRating: null,
    issuerCategory: null,
    
    // Expenses / Profile
    income: null,
    fixedObligations: null,
    savingsGoal: null,
    spendCategories: [],
    cardsHeld: [],
    
    // Trips
    destination: null,
    travelers: null,
    travelStyle: null,
    
    // Loans
    loanAmount: null,
    loanPurpose: null,
    existingBank: null,
    employmentType: null,
    location: null,
    
    // Security
    age: null,
    isSmoker: null,
    familySize: null,
    existingCondition: null,
    city: null,
    vehicleType: null,
    idv: null,
    ncb: null,
    businessType: null,
    employeeCount: null,
    coverType: null,
    remitCorridor: null,
    remitFrequency: null
  },
  
  // Track how many parameters have been saved
  get prefillCount() {
    return Object.values(this.prefills).filter(val => val !== null && (Array.isArray(val) ? val.length > 0 : true)).length;
  }
};

// 2. CATEGORY CONFIGURATIONS & WIZARD STEPS
const CategoryConfig = {
  // --- INVEST TAB ---
  fd: {
    title: "Fixed Deposits",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="12" y1="2" x2="12" y2="22"/></svg>`,
    desc: "Compare post-tax yields across SFBs, PSUs, and Private banks.",
    steps: [
      {
        title: "Investment Size & Period",
        fields: [
          { id: "fd-amount", label: "How much do you want to deposit?", type: "number", prefix: "₹", placeholder: "500000", prefillKey: "amount" },
          { id: "fd-tenure", label: "Tenure (in Years)", type: "range", min: 1, max: 10, step: 1, prefillKey: "tenure" }
        ]
      },
      {
        title: "Citizen Status & Payout Type",
        fields: [
          { 
            id: "fd-senior", 
            label: "Are you a Senior Citizen (60+ years)?", 
            type: "radio", 
            prefillKey: "seniorCitizen",
            options: [{ value: "no", label: "No (General Rate)" }, { value: "yes", label: "Yes (+0.50% Rate)" }]
          },
          {
            id: "fd-payout",
            label: "Interest Payout Preference",
            type: "radio",
            prefillKey: "payoutType",
            options: [{ value: "cumulative", label: "Cumulative (Compounded)", desc: "Grow wealth" }, { value: "payout", label: "Quarterly Payout", desc: "Regular income" }]
          }
        ]
      },
      {
        title: "Bank Categories",
        fields: [
          {
            id: "fd-bank-category",
            label: "Preferred Bank Categories (Select all that apply)",
            type: "checkbox-group",
            prefillKey: "bankCategory",
            options: [
              { value: "PSU", label: "PSU Banks", desc: "SBI, PNB (Safest)" },
              { value: "Private", label: "Private Banks", desc: "HDFC, ICICI" },
              { value: "SFB", label: "Small Finance", desc: "AU, Ujjivan (High yield)" },
              { value: "Foreign", label: "Foreign Banks", desc: "HSBC, DBS" }
            ]
          }
        ]
      }
    ]
  },
  mf: {
    title: "Mutual Funds",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m16 10-4 4-2-2-4 4"/></svg>`,
    desc: "Find the top 3 mutual funds matching your timeline and risk appetite.",
    steps: [
      {
        title: "Financial Goal & Horizon",
        fields: [
          {
            id: "mf-goal",
            label: "What is the primary goal for this investment?",
            type: "radio",
            prefillKey: "goal",
            options: [
              { value: "Wealth growth", label: "Wealth Growth", desc: "Equity focus" },
              { value: "Tax saving", label: "Tax Saving", desc: "ELSS 80C Lock-in" },
              { value: "Short-term parking", label: "Short-Term Parking", desc: "Liquid/Debt focus" },
              { value: "Retirement", label: "Retirement Fund", desc: "Balanced/Asset mix" }
            ]
          },
          { id: "mf-horizon", label: "Investment Horizon (Years)", type: "range", min: 1, max: 15, step: 1, prefillKey: "horizon" }
        ]
      },
      {
        title: "Risk Profile & Mode",
        fields: [
          {
            id: "mf-risk",
            label: "What is your risk appetite?",
            type: "radio",
            prefillKey: "riskAppetite",
            options: [
              { value: "Low", label: "Low Risk", desc: "Capital safety" },
              { value: "Moderate", label: "Moderate Risk", desc: "Balanced growth" },
              { value: "High", label: "High Risk", desc: "Aggressive returns" },
              { value: "Very High", label: "Very High Risk", desc: "Sectors / Smallcaps" }
            ]
          }
        ]
      },
      {
        title: "Fund House AMC Type",
        fields: [
          {
            id: "mf-type",
            label: "Preferred Asset Management Company (AMC)",
            type: "radio",
            prefillKey: "fundType",
            options: [
              { value: "all", label: "Show All", desc: "Compare all AMC styles" },
              { value: "bank-sponsored", label: "Bank-Sponsored", desc: "SBI AMC, HDFC AMC" },
              { value: "independent", label: "Independent AMC", desc: "Quant, Parag Parikh (Often lower expense)" }
            ]
          }
        ]
      }
    ]
  },
  bonds: {
    title: "Bonds",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M16 8h.01M12 12h.01M8 16h.01M12 8h.01M8 12h.01M16 12h.01M12 16h.01"/></svg>`,
    desc: "Fixed income securities mapped by rating and tenure.",
    steps: [
      {
        title: "Capital & Tenure",
        fields: [
          { id: "bond-amount", label: "Investment Amount", type: "number", prefix: "₹", placeholder: "100000", prefillKey: "amount" },
          { id: "bond-tenure", label: "Preferred Tenure (Months)", type: "range", min: 12, max: 180, step: 12, prefillKey: "tenure" }
        ]
      },
      {
        title: "Issuer Type & Safety Limits",
        fields: [
          {
            id: "bond-rating",
            label: "Minimum Credit Rating Required",
            type: "radio",
            prefillKey: "bondRating",
            options: [
              { value: "Sovereign", label: "Sovereign / Govt Only", desc: "No default risk (Tax-free FDs)" },
              { value: "AAA", label: "AAA Rated", desc: "Highest corporate safety" },
              { value: "AA+", label: "AA+ and above", desc: "Premium yield with moderate risk" }
            ]
          },
          {
            id: "bond-issuer",
            label: "Issuer Category",
            type: "radio",
            prefillKey: "issuerCategory",
            options: [
              { value: "all", label: "All Categories" },
              { value: "PSU", label: "Government/PSU Bonds" },
              { value: "Corporate", label: "Private Corporates" },
              { value: "NBFC", label: "NBFCs" }
            ]
          }
        ]
      }
    ]
  },
  ipo: {
    title: "IPOs",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3z"/><path d="M21 9H3M21 15H3M12 3v18"/></svg>`,
    desc: "Currently open and upcoming stock listings, Grey Market Premium, and odds.",
    steps: [
      {
        title: "IPO Application Preferences",
        fields: [
          {
            id: "ipo-category",
            label: "Investor Category",
            type: "radio",
            prefillKey: "employmentType", // maps to a profile category
            options: [{ value: "Retail", label: "Retail Investor (< ₹2 Lakhs)" }, { value: "HNI", label: "HNI (High Net Worth, > ₹2 Lakhs)" }]
          },
          { id: "ipo-budget", label: "Available Budget for IPOs", type: "number", prefix: "₹", placeholder: "15000", prefillKey: "amount" }
        ]
      }
    ]
  },

  // --- EXPENSES TAB ---
  tx_analysis: {
    title: "Statement Upload",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    desc: "Analyze salary bank deposits and expense categories via standard PDF upload.",
    steps: [
      {
        title: "Upload Bank Statement (Simulated)",
        fields: [
          { id: "statement-file", label: "Select Statement File (PDF / CSV)", type: "file", prefillKey: "location" }
        ]
      }
    ]
  },
  cc_selector: {
    title: "Credit Card Matcher",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`,
    desc: "Find the single best credit card tailored to your major spend categories.",
    steps: [
      {
        title: "Spending Patterns",
        fields: [
          {
            id: "cc-spend",
            label: "Select your Top 2 Spend Categories (Select exactly 2)",
            type: "checkbox-group",
            prefillKey: "spendCategories",
            options: [
              { value: "Shopping", label: "Online Shopping", desc: "Amazon, Flipkart" },
              { value: "Travel", label: "Travel & Flights", desc: "Airlines, Hotels" },
              { value: "Dining", label: "Dining & Swiggy/Zomato" },
              { value: "Fuel", label: "Fuel/Petrol spends" },
              { value: "Grocery", label: "Supermarket & Groceries" }
            ]
          }
        ]
      },
      {
        title: "Income Filter",
        fields: [
          { id: "cc-income", label: "Your Monthly Income", type: "number", prefix: "₹", placeholder: "100000", prefillKey: "income" }
        ]
      }
    ]
  },
  trip_planner: {
    title: "Trip Budget Splitter",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>`,
    desc: "Input travel parameters to calculate a target budget and best travel tools.",
    steps: [
      {
        title: "Destination & Timeline",
        fields: [
          { id: "trip-dest", label: "Where are you traveling?", type: "text", placeholder: "Europe, Bali, Goa", prefillKey: "destination" },
          { id: "trip-days", label: "Trip Duration (Days)", type: "number", placeholder: "7", prefillKey: "tenure" }
        ]
      },
      {
        title: "Travelers & Style",
        fields: [
          { id: "trip-travelers", label: "Number of Travelers", type: "number", placeholder: "2", prefillKey: "travelers" },
          {
            id: "trip-style",
            label: "Travel Style Profile",
            type: "radio",
            prefillKey: "travelStyle",
            options: [
              { value: "Budget", label: "Backpacker / Budget", desc: "Hostels & local transit" },
              { value: "Comfort", label: "Mid-Range Comfort", desc: "3-star hotels & flights" },
              { value: "Luxury", label: "Bespoke Luxury", desc: "5-star resorts & fine dining" }
            ]
          }
        ]
      }
    ]
  },
  expense_planner: {
    title: "Expense Allocator",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/><line x1="9" y1="5" x2="9" y2="5.01"/><line x1="9" y1="2" x2="9" y2="3"/></svg>`,
    desc: "Configure standard budgets based on the 50/30/20 cash flow rule.",
    steps: [
      {
        title: "Budget Income & Obligations",
        fields: [
          { id: "budget-income", label: "Monthly Net Income", type: "number", prefix: "₹", placeholder: "100000", prefillKey: "income" },
          { id: "budget-obligations", label: "Monthly Fixed Obligations (EMI, Rent, Bills)", type: "number", prefix: "₹", placeholder: "40000", prefillKey: "fixedObligations" },
          { id: "budget-savings", label: "Target Savings Goal (%)", type: "range", min: 10, max: 70, step: 5, prefillKey: "savingsGoal" }
        ]
      }
    ]
  },

  // --- LOANS TAB ---
  loans: {
    title: "Loan Category Finder",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    desc: "Home Loans, LAP, LAS, and business financing solutions.",
    steps: [
      {
        title: "Loan Amount & Purpose",
        fields: [
          { id: "loan-amount", label: "How much loan principal do you need?", type: "number", prefix: "₹", placeholder: "5000000", prefillKey: "loanAmount" },
          {
            id: "loan-purpose",
            label: "Loan Category Purpose",
            type: "radio",
            prefillKey: "loanPurpose",
            options: [
              { value: "HL / HL Overdraft", label: "Home Loan / Overdraft", desc: "Construct or buy property" },
              { value: "LAP / LAP Overdraft", label: "Loan Against Property", desc: "Unlock commercial assets" },
              { value: "LAS", label: "Loan Against Shares", desc: "Pledge equities & mutual funds" },
              { value: "WC / SME / Agri", label: "Business Working Capital / Agri", desc: "Shop and vendor cash flows" }
            ]
          }
        ]
      },
      {
        title: "Relationships & Employment",
        fields: [
          { id: "loan-bank", label: "Existing Relationship Bank (Optional)", type: "text", placeholder: "HDFC Bank, SBI", prefillKey: "existingBank" },
          {
            id: "loan-employment",
            label: "Employment Type Status",
            type: "radio",
            prefillKey: "employmentType",
            options: [
              { value: "salaried", label: "Salaried Employee", desc: "Fixed monthly payslip" },
              { value: "self-employed", label: "Self-Employed Professional", desc: "ITR files required" },
              { value: "business", label: "Business Owner / Retailer", desc: "GST & Cash flow statements" }
            ]
          }
        ]
      },
      {
        title: "Location & Bank Preference",
        fields: [
          { id: "loan-location", label: "Property / Business City Location", type: "text", placeholder: "Mumbai, Bangalore", prefillKey: "location" },
          {
            id: "loan-category",
            label: "Preferred Bank Category",
            type: "checkbox-group",
            prefillKey: "bankCategory",
            options: [
              { value: "PSU", label: "PSU Banks", desc: "SBI, BoB (Lower rates)" },
              { value: "Private", label: "Private Banks", desc: "HDFC, ICICI (Faster processing)" },
              { value: "SFB", label: "Small Finance Banks", desc: "AU SFB (Flexible credit)" },
              { value: "NBFC", label: "NBFCs", desc: "Bajaj Finserv (Disbursement speed)" }
            ]
          }
        ]
      }
    ]
  },

  // --- SECURITY TAB ---
  life_ins: {
    title: "Life Insurance",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    desc: "Calculate critical term life cover options based on age and dependents.",
    steps: [
      {
        title: "Demographics & Cover",
        fields: [
          { id: "life-age", label: "Your Current Age (Years)", type: "number", placeholder: "30", prefillKey: "age" },
          { id: "life-cover", label: "Life Cover Amount Needed", type: "number", prefix: "₹", placeholder: "10000000", prefillKey: "amount" }
        ]
      },
      {
        title: "Term & Lifestyle Habits",
        fields: [
          { id: "life-term", label: "Term Coverage Duration (Years)", type: "range", min: 10, max: 40, step: 5, prefillKey: "tenure" },
          {
            id: "life-smoker",
            label: "Do you smoke or consume tobacco?",
            type: "radio",
            prefillKey: "isSmoker",
            options: [{ value: "no", label: "No (Lower Term Premiums)" }, { value: "yes", label: "Yes (Standard Rates)" }]
          }
        ]
      }
    ]
  },
  health_ins: {
    title: "Health Insurance",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    desc: "Identify hospital network covers mapped by medical background and city.",
    steps: [
      {
        title: "Family Size details",
        fields: [
          {
            id: "health-family",
            label: "Who is covered in this health plan?",
            type: "radio",
            prefillKey: "familySize",
            options: [
              { value: "Individual", label: "Self Only" },
              { value: "Couple", label: "Self & Spouse" },
              { value: "Family", label: "Self, Spouse + Kids", desc: "Floater Cover" },
              { value: "Parents", label: "Self + Elderly Parents" }
            ]
          },
          { id: "health-age", label: "Age of oldest member (Years)", type: "number", placeholder: "30", prefillKey: "age" }
        ]
      },
      {
        title: "Location & Coverage Details",
        fields: [
          { id: "health-city", label: "Your Residential City (affects room rent limits)", type: "text", placeholder: "Delhi, Pune", prefillKey: "city" },
          { id: "health-cover", label: "Cover Sum Insured", type: "number", prefix: "₹", placeholder: "1000000", prefillKey: "amount" },
          {
            id: "health-conditions",
            label: "Any existing medical conditions (diabetes, BP, asthma)?",
            type: "radio",
            prefillKey: "existingCondition",
            options: [{ value: "no", label: "No Pre-existing Conditions" }, { value: "yes", label: "Yes (Requires medical review)" }]
          }
        ]
      }
    ]
  },
  vehicle_ins: {
    title: "Vehicle Insurance",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
    desc: "Zero-depreciation auto covers mapped by claim logs and registration city.",
    steps: [
      {
        title: "Vehicle & Registration Details",
        fields: [
          {
            id: "vehicle-type",
            label: "Vehicle Type",
            type: "radio",
            prefillKey: "vehicleType",
            options: [{ value: "Car", label: "Private 4-Wheeler Car" }, { value: "Bike", label: "2-Wheeler Motorcycle" }]
          },
          { id: "vehicle-city", label: "Registration City (RTO)", type: "text", placeholder: "Delhi DL-3C, Bangalore KA-51", prefillKey: "city" }
        ]
      },
      {
        title: "Value & Claim Logs",
        fields: [
          { id: "vehicle-idv", label: "Insured Declared Value (IDV of vehicle)", type: "number", prefix: "₹", placeholder: "500000", prefillKey: "idv" },
          {
            id: "vehicle-ncb",
            label: "No-Claim Bonus (NCB) Discount Earned",
            type: "radio",
            prefillKey: "ncb",
            options: [
              { value: "0", label: "0% (Claim made last year)" },
              { value: "20", label: "20% (1 Claim-free year)" },
              { value: "35", label: "35% (3 Claim-free years)" },
              { value: "50", label: "50% (5+ Claim-free years)" }
            ]
          }
        ]
      }
    ]
  },
  home_ins: {
    title: "Home Insurance",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    desc: "Safeguard property structures and indoor contents against hazards.",
    steps: [
      {
        title: "Ownership & Structure Valuation",
        fields: [
          {
            id: "home-type",
            label: "Do you own or rent the property?",
            type: "radio",
            prefillKey: "employmentType",
            options: [{ value: "owner", label: "Own Property (Cover Structure + Contents)" }, { value: "tenant", label: "Rent Property (Cover Contents Only)" }]
          },
          { id: "home-structure-val", label: "Estimated Structure Reconstruction Cost (Owners only)", type: "number", prefix: "₹", placeholder: "4000000", prefillKey: "amount" }
        ]
      },
      {
        title: "Contents & Location Risk",
        fields: [
          { id: "home-contents-val", label: "Estimated Value of Contents (Appliances, Jewellery, Furniture)", type: "number", prefix: "₹", placeholder: "1000000", prefillKey: "fixedObligations" },
          { id: "home-city", label: "Property City (for disaster risk assessment)", type: "text", placeholder: "Chennai", prefillKey: "city" }
        ]
      }
    ]
  },
  business_ins: {
    title: "Business Insurance",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    desc: "Liability, asset fire safeguards, and professional indemnity filters.",
    steps: [
      {
        title: "Business Scale",
        fields: [
          { id: "biz-type", label: "Business Sector / Activity Type", type: "text", placeholder: "Retail, IT Services, Manufacturing", prefillKey: "businessType" },
          { id: "biz-employees", label: "Total Employee Count", type: "number", placeholder: "10", prefillKey: "employeeCount" }
        ]
      },
      {
        title: "Coverage Style",
        fields: [
          {
            id: "biz-cover",
            label: "Cover Type Needed",
            type: "radio",
            prefillKey: "coverType",
            options: [
              { value: "Assets", label: "Asset Fire & Theft", desc: "Warehouse, inventory, machinery" },
              { value: "Liability", label: "Professional Liability", desc: "Lawsuits, cyber breaches" },
              { value: "Both", label: "Commercial Package (Both)", desc: "All-in-one comprehensive cover" }
            ]
          }
        ]
      }
    ]
  },
  remittance: {
    title: "Foreign Remittance",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>`,
    desc: "Real-time global currency corridor exchange rates & platform fees.",
    steps: [
      {
        title: "Remittance Volume & Corridor",
        fields: [
          { id: "remit-corridor", label: "Transfer Direction Corridor", type: "text", placeholder: "INR to USD, USD to INR", prefillKey: "remitCorridor" },
          { id: "remit-amount", label: "Amount to Send", type: "number", prefix: "₹", placeholder: "200000", prefillKey: "amount" }
        ]
      },
      {
        title: "Frequency Settings",
        fields: [
          {
            id: "remit-freq",
            label: "Transfer Frequency Pattern",
            type: "radio",
            prefillKey: "remitFrequency",
            options: [{ value: "one-time", label: "One-Time Transfer" }, { value: "recurring", label: "Recurring Monthly Transfer" }]
          }
        ]
      }
    ]
  }
};

// 3. CORE ROUTING & TAB NAV
function initNavigation() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      AppState.activeTab = tab.dataset.tab;
      AppState.currentCategory = null;
      renderActiveTabContent();
    });
  });
}

function renderActiveTabContent() {
  const container = document.getElementById('app-content');
  updatePrefillStatusBadge();
  
  if (AppState.currentCategory) {
    // We are currently in a wizard flow or results view
    return;
  }
  
  // Render Category Grid
  let html = `
    <div class="category-container">
      <div class="category-title-bar">
        <h2>Select a Category to Start</h2>
      </div>
      <div class="category-grid">
  `;
  
  // Filter categories by active tab
  Object.entries(CategoryConfig).forEach(([key, config]) => {
    let belongsToTab = false;
    if (AppState.activeTab === 'invest' && ['fd', 'mf', 'bonds', 'ipo'].includes(key)) belongsToTab = true;
    if (AppState.activeTab === 'expenses' && ['tx_analysis', 'cc_selector', 'trip_planner', 'expense_planner'].includes(key)) belongsToTab = true;
    if (AppState.activeTab === 'loans' && key === 'loans') belongsToTab = true;
    if (AppState.activeTab === 'security' && ['life_ins', 'health_ins', 'vehicle_ins', 'home_ins', 'business_ins', 'remittance'].includes(key)) belongsToTab = true;
    
    if (belongsToTab) {
      html += `
        <div class="category-card" onclick="startWizard('${key}')" role="button" tabindex="0">
          <div class="category-icon">
            ${config.icon}
          </div>
          <h3>${config.title}</h3>
          <p>${config.desc}</p>
        </div>
      `;
    }
  });
  
  html += `
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

// 4. WIZARD ENGINE
window.startWizard = function(categoryId) {
  AppState.currentCategory = categoryId;
  AppState.currentStep = 0;
  
  renderWizardStep();
};

function renderWizardStep() {
  const container = document.getElementById('app-content');
  const config = CategoryConfig[AppState.currentCategory];
  const step = config.steps[AppState.currentStep];
  const isLastStep = AppState.currentStep === config.steps.length - 1;
  
  // Progress indicators
  let dotsHtml = '';
  config.steps.forEach((s, idx) => {
    let classes = 'dot';
    if (idx === AppState.currentStep) classes += ' active';
    else if (idx < AppState.currentStep) classes += ' completed';
    dotsHtml += `<span class="${classes}"></span>`;
  });
  
  // Generate HTML for each form field
  let fieldsHtml = '';
  step.fields.forEach(field => {
    // Check if there is an active pre-fill value
    let prefillVal = AppState.prefills[field.prefillKey];
    
    // For range types or numbers, fallback if no pre-fill
    let valueAttr = '';
    if (prefillVal !== null) {
      valueAttr = `value="${prefillVal}"`;
    }
    
    fieldsHtml += `<div class="form-group">`;
    fieldsHtml += `<label for="${field.id}">${field.label}</label>`;
    
    // Add special prompt info if prefilled
    if (prefillVal !== null) {
      fieldsHtml += `<p class="field-desc" style="color: var(--color-success); font-weight: 500;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="vertical-align: middle; margin-right: 2px;"><polyline points="20 6 9 17 4 12"/></svg>
        Auto-filled from other tabs
      </p>`;
    }
    
    if (field.type === 'number') {
      fieldsHtml += `
        <div class="input-wrapper">
          ${field.prefix ? `<span class="input-prefix">${field.prefix}</span>` : ''}
          <input type="number" id="${field.id}" class="text-input ${field.prefix ? 'has-prefix' : ''}" ${valueAttr} placeholder="${field.placeholder || ''}" required>
        </div>
      `;
    } else if (field.type === 'text') {
      fieldsHtml += `
        <input type="text" id="${field.id}" class="text-input" ${valueAttr} placeholder="${field.placeholder || ''}" required>
      `;
    } else if (field.type === 'range') {
      const currentVal = prefillVal !== null ? prefillVal : (field.min + field.max) / 2;
      fieldsHtml += `
        <div class="range-container">
          <input type="range" id="${field.id}" min="${field.min}" max="${field.max}" step="${field.step}" value="${currentVal}" oninput="document.getElementById('${field.id}-label').innerText = this.value">
          <div class="range-labels">
            <span>Min: ${field.min}</span>
            <span style="font-weight: 600; color: var(--color-ink-primary);">Current: <span id="${field.id}-label">${currentVal}</span></span>
            <span>Max: ${field.max}</span>
          </div>
        </div>
      `;
    } else if (field.type === 'radio') {
      fieldsHtml += `<div class="chips-grid">`;
      field.options.forEach(opt => {
        const checked = prefillVal === opt.value ? 'checked' : '';
        fieldsHtml += `
          <label class="chip-option">
            <input type="radio" name="${field.id}" value="${opt.value}" ${checked} required>
            <span class="chip-label">
              ${opt.label}
              ${opt.desc ? `<span class="desc">${opt.desc}</span>` : ''}
            </span>
          </label>
        `;
      });
      fieldsHtml += `</div>`;
    } else if (field.type === 'checkbox-group') {
      fieldsHtml += `<div class="chips-grid">`;
      field.options.forEach(opt => {
        // prefillVal for checkbox-group is an array
        const checked = Array.isArray(prefillVal) && prefillVal.includes(opt.value) ? 'checked' : '';
        fieldsHtml += `
          <label class="chip-option">
            <input type="checkbox" name="${field.id}" value="${opt.value}" ${checked}>
            <span class="chip-label">
              ${opt.label}
              ${opt.desc ? `<span class="desc">${opt.desc}</span>` : ''}
            </span>
          </label>
        `;
      });
      fieldsHtml += `</div>`;
    } else if (field.type === 'file') {
      fieldsHtml += `
        <div class="calc-card" style="text-align: center; border: 2px dashed var(--color-paper-border); cursor: pointer;" onclick="simulateStatementUpload()">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 8px; color: var(--color-ink-secondary);"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
          <p style="font-weight: 600; margin-bottom: 4px;">Click to select or Drop PDF / CSV Statement</p>
          <p style="font-size: 12px; color: var(--color-ink-muted);">Simulated transaction extraction engine</p>
          <div id="upload-status" style="margin-top: 12px; font-weight: 500; display: none;"></div>
        </div>
      `;
    }
    
    fieldsHtml += `</div>`;
  });
  
  let headerTitle = config.title;
  if (AppState.currentCategory === 'loans') {
    // Customize loan title based on selected purpose
    const loanPurpose = AppState.prefills.loanPurpose || '';
    if (loanPurpose) headerTitle = loanPurpose;
  }
  
  let html = `
    <div class="flow-wizard">
      <div class="wizard-header">
        <button class="back-btn" onclick="wizardBack()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <span class="wizard-title">${headerTitle} Setup</span>
        <button class="btn-skip" onclick="skipWizard()">Skip &amp; Show Top 3</button>
      </div>
      
      <div class="progress-dots">
        ${dotsHtml}
      </div>
      
      <form id="wizard-form" onsubmit="handleWizardSubmit(event)">
        ${fieldsHtml}
        
        <div class="wizard-footer">
          <button type="button" class="btn btn-secondary" onclick="cancelWizard()">Cancel</button>
          <button type="submit" class="btn btn-primary">
            ${isLastStep ? 'Get Ranked Options' : 'Next Step'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </form>
    </div>
  `;
  
  container.innerHTML = html;
}

window.cancelWizard = function() {
  AppState.currentCategory = null;
  renderActiveTabContent();
};

window.wizardBack = function() {
  if (AppState.currentStep > 0) {
    AppState.currentStep--;
    renderWizardStep();
  } else {
    cancelWizard();
  }
};

window.skipWizard = function() {
  // Use fallbacks for required inputs if missing and show results
  const config = CategoryConfig[AppState.currentCategory];
  
  // Set defaults for any missing pre-fills in the current wizard
  config.steps.forEach(step => {
    step.fields.forEach(field => {
      if (AppState.prefills[field.prefillKey] === null) {
        if (field.type === 'number') AppState.prefills[field.prefillKey] = parseInt(field.placeholder) || 100000;
        else if (field.type === 'range') AppState.prefills[field.prefillKey] = (field.min + field.max) / 2;
        else if (field.type === 'radio') AppState.prefills[field.prefillKey] = field.options[0].value;
        else if (field.type === 'checkbox-group') AppState.prefills[field.prefillKey] = [field.options[0].value];
      }
    });
  });
  
  showResults();
};

window.handleWizardSubmit = function(event) {
  event.preventDefault();
  
  // Save step data to AppState.prefills
  const config = CategoryConfig[AppState.currentCategory];
  const step = config.steps[AppState.currentStep];
  
  step.fields.forEach(field => {
    const el = document.getElementById(field.id);
    
    if (field.type === 'number') {
      AppState.prefills[field.prefillKey] = parseFloat(el.value);
    } else if (field.type === 'text') {
      AppState.prefills[field.prefillKey] = el.value;
    } else if (field.type === 'range') {
      AppState.prefills[field.prefillKey] = parseInt(el.value);
    } else if (field.type === 'radio') {
      const checkedRadio = document.querySelector(`input[name="${field.id}"]:checked`);
      if (checkedRadio) {
        AppState.prefills[field.prefillKey] = checkedRadio.value;
      }
    } else if (field.type === 'checkbox-group') {
      const checkedBoxes = document.querySelectorAll(`input[name="${field.id}"]:checked`);
      const vals = Array.from(checkedBoxes).map(box => box.value);
      AppState.prefills[field.prefillKey] = vals;
    }
  });
  
  // Navigate
  if (AppState.currentStep < config.steps.length - 1) {
    AppState.currentStep++;
    renderWizardStep();
  } else {
    showResults();
  }
};

// 5. TRANSACTION STATEMENT UPLOAD SIMULATOR
window.simulateStatementUpload = function() {
  const statusDiv = document.getElementById('upload-status');
  statusDiv.style.display = 'block';
  statusDiv.style.color = 'var(--color-ink-secondary)';
  statusDiv.innerHTML = `<span style="font-weight: 500;">Reading statement file...</span>`;
  
  setTimeout(() => {
    statusDiv.innerHTML = `<span style="font-weight: 500;">Analyzing transactional salary deposits...</span>`;
    
    setTimeout(() => {
      // Pre-fill realistic values based on a standard IT professional statement
      AppState.prefills.income = 165000; // 1.65L net salary
      AppState.prefills.fixedObligations = 55000; // 55k obligations
      AppState.prefills.existingBank = "HDFC Bank";
      AppState.prefills.spendCategories = ["Shopping", "Dining"];
      AppState.prefills.city = "Bangalore";
      AppState.prefills.amount = 500000; // pre-fill some FD surplus
      AppState.prefills.loanAmount = 4500000; // pre-fill home loan
      
      statusDiv.style.color = 'var(--color-success)';
      statusDiv.innerHTML = `
        <div style="text-align: left; padding: 12px; background-color: var(--color-lime-light); border-radius: 8px; border: 1px solid rgba(26,127,55,0.2); margin-top: 8px;">
          <strong style="display: block; margin-bottom: 4px;">Success! Statement Extracted:</strong>
          &bull; Monthly Net Salary: <strong>₹1,65,000</strong> (HDFC Bank)<br>
          &bull; Extracted Fixed Rent/EMI: <strong>₹55,000</strong><br>
          &bull; Top Spends: <strong>Online Shopping &amp; Dining</strong><br>
          &bull; RTO Jurisdiction: <strong>KA-51 (Bangalore)</strong>
        </div>
      `;
      
      // Update global badge
      updatePrefillStatusBadge();
      
      // Add a small delay then proceed
      setTimeout(() => {
        // Go straight to results page for tx_analysis
        showResults();
      }, 2500);
      
    }, 1200);
  }, 800);
};

function updatePrefillStatusBadge() {
  const badge = document.getElementById('prefill-status');
  const textEl = document.getElementById('prefill-status-text');
  const count = AppState.prefillCount;
  
  if (count > 0) {
    badge.style.display = 'flex';
    textEl.innerHTML = `<strong>${count} Profile Facts Saved</strong> (Cross-Tab Pre-fills Active)`;
  } else {
    badge.style.display = 'none';
  }
}

// 6. RANKING & RESULTS GENERATION
// 6. RANKING & RESULTS GENERATION
window.showResults = function() {
  const container = document.getElementById('app-content');
  const categoryId = AppState.currentCategory;
  const config = CategoryConfig[categoryId];
  
  let html = `
    <div class="results-container">
      <div class="results-header">
        <button class="back-btn" onclick="startWizard('${categoryId}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Adjust Inputs
        </button>
        <h2 style="font-size: 24px;">`;
        
  if (categoryId === 'fd' || categoryId === 'loans') {
    html += `Top Bank Rates Comparison (${config.title})</h2>
             <p style="font-size: 14px; color: var(--color-ink-secondary);">Best yields/rates segmented by banking sector based on your profile inputs.</p>`;
  } else {
    html += `Top 3 Ranked ${config.title} Options</h2>
             <p style="font-size: 14px; color: var(--color-ink-secondary);">Filtered based on your profile inputs &amp; ranked by financial efficiency.</p>`;
  }
  
  html += `</div>`;
  
  if (categoryId === 'fd') {
    const rawDetails = calculateTopThreeDetailsFD();
    const grouped = {
      PSU: [],
      Private: [],
      SFB: [],
      Foreign: []
    };
    rawDetails.forEach(item => {
      if (grouped[item.category]) {
        grouped[item.category].push(item);
      }
    });
    
    html += `
      <div class="bento-grid" style="margin-top: 16px;">
    `;
    
    Object.entries(grouped).forEach(([catKey, items]) => {
      const catInfo = F3Data.bankCategories[catKey] || { name: catKey, strengths: "" };
      const topTwo = items.slice(0, 2);
      
      html += `
        <div class="bento-box">
          <div style="width: 100%;">
            <h4 style="font-family: var(--font-display); font-weight: 700; font-size: 16px; margin-top: 0; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
              <span>${catInfo.name}</span>
              <span class="tag-badge" style="font-size: 9px; padding: 2px 6px; background-color: var(--color-accent-lime); color: var(--color-ink-primary); font-weight: 600;">Top 2</span>
            </h4>
            <p style="font-size: 11px; color: var(--color-ink-secondary); margin-top: 0; margin-bottom: 12px; font-style: italic;">
              Best for: ${catInfo.strengths}
            </p>
      `;
      
      if (topTwo.length === 0) {
        html += `<p style="font-size: 12px; color: var(--color-ink-muted); margin: 8px 0;">No matching options.</p>`;
      } else {
        topTwo.forEach(bank => {
          const overallIdx = rawDetails.findIndex(r => r.bankName === bank.bankName);
          html += `
            <div class="bento-item" onclick="openDrillIn('fd', ${overallIdx})" style="cursor: pointer;" role="button">
              <span class="bento-bank-name">${bank.bankName}</span>
              <div style="text-align: right; display: flex; align-items: center; gap: 8px;">
                <div style="text-align: right;">
                  <span class="bento-bank-rate">${bank.effectiveYield.toFixed(2)}%</span>
                  <span style="display: block; font-size: 9px; color: var(--color-ink-muted);">Base: ${bank.rate.toFixed(2)}%</span>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="color: var(--color-ink-muted); margin-left: 2px;"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            </div>
          `;
        });
      }
      
      html += `
          </div>
        </div>
      `;
    });
    
    html += `</div>`;
    
  } else if (categoryId === 'loans') {
    const rawDetails = calculateTopThreeDetailsLoans();
    const grouped = {
      PSU: [],
      Private: [],
      SFB: [],
      NBFC: []
    };
    rawDetails.forEach(item => {
      if (grouped[item.bankCategory]) {
        grouped[item.bankCategory].push(item);
      }
    });
    
    html += `
      <div class="bento-grid" style="margin-top: 16px;">
    `;
    
    Object.entries(grouped).forEach(([catKey, items]) => {
      const catInfo = F3Data.bankCategories[catKey] || { name: catKey, strengths: "" };
      const topTwo = items.slice(0, 2);
      
      html += `
        <div class="bento-box">
          <div style="width: 100%;">
            <h4 style="font-family: var(--font-display); font-weight: 700; font-size: 16px; margin-top: 0; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
              <span>${catInfo.name}</span>
              <span class="tag-badge" style="font-size: 9px; padding: 2px 6px; background-color: var(--color-accent-lime); color: var(--color-ink-primary); font-weight: 600;">Top 2</span>
            </h4>
            <p style="font-size: 11px; color: var(--color-ink-secondary); margin-top: 0; margin-bottom: 12px; font-style: italic;">
              Best for: ${catInfo.strengths}
            </p>
      `;
      
      if (topTwo.length === 0) {
        html += `<p style="font-size: 12px; color: var(--color-ink-muted); margin: 8px 0;">No matching options.</p>`;
      } else {
        topTwo.forEach(loan => {
          const overallIdx = rawDetails.findIndex(r => r.bankName === loan.bankName);
          html += `
            <div class="bento-item" onclick="openDrillIn('loans', ${overallIdx})" style="cursor: pointer;" role="button">
              <span class="bento-bank-name">${loan.bankName}</span>
              <div style="text-align: right; display: flex; align-items: center; gap: 8px;">
                <div style="text-align: right;">
                  <span class="bento-bank-rate">${loan.effectiveRate.toFixed(2)}%</span>
                  <span style="display: block; font-size: 9px; color: var(--color-ink-muted);">Base: ${loan.activeRate.toFixed(2)}%</span>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="color: var(--color-ink-muted); margin-left: 2px;"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            </div>
          `;
        });
      }
      
      html += `
          </div>
        </div>
      `;
    });
    
    html += `</div>`;
    
  } else {
    html += `<div class="results-grid">`;
    const results = calculateTopThree(categoryId);
    results.forEach((item, index) => {
      html += `
        <div class="ranked-card" onclick="openDrillIn('${categoryId}', ${index})" role="button" tabindex="0">
          <div class="rank-badge">${index + 1}</div>
          
          <div class="card-details">
            <div class="card-top-row">
              <div>
                <h3 class="card-title">${item.title}</h3>
                <p class="card-subtitle">${item.subtitle}</p>
              </div>
              <div>
                <span class="tag-badge ${index === 0 ? 'accent-tag' : ''}">${item.badge}</span>
              </div>
            </div>
          </div>
          
          <div class="card-metrics">
            <div class="metric-value">${item.metric}</div>
            <div class="metric-label">${item.metricLabel}</div>
          </div>
          
          <div class="card-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
        </div>
      `;
    });
    html += `</div>`;
  }
  
  html += `
      <div class="results-actions">
        <button class="btn btn-secondary" onclick="cancelWizard()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          Back to Categories
        </button>
        <button class="btn btn-primary" onclick="openComparisonTable('${categoryId}')">
          Compare All Options
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><rect x="7" y="9" width="3" height="8" rx="1"/><rect x="13" y="5" width="3" height="12" rx="1"/></svg>
        </button>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
};

// 7. FINANCIAL SCORING ENGINES
function calculateTopThree(categoryId) {
  const pref = AppState.prefills;
  
  if (categoryId === 'fd') {
    // 1. FILTER
    let list = [...F3Data.fixedDeposits];
    if (pref.bankCategory && pref.bankCategory.length > 0) {
      list = list.filter(item => pref.bankCategory.includes(item.category));
    }
    if (list.length === 0) list = [...F3Data.fixedDeposits]; // fallback if nothing matches
    
    // 2. SCORE & CALCULATE post-tax yield
    const amount = pref.amount || 500000;
    const years = pref.tenure || 3;
    const isSenior = pref.seniorCitizen === 'yes';
    
    // TDS Slab multiplier based on income
    let taxRate = 0.10; // 10% base
    if (pref.income && pref.income > 1500000) taxRate = 0.30;
    else if (pref.income && pref.income > 1000000) taxRate = 0.20;
    else if (pref.income && pref.income < 700000) taxRate = 0.00;
    
    const calculated = list.map(item => {
      const rate = isSenior ? item.seniorRate : item.headlineRate;
      
      // Cumulative Interest Formula: A = P(1 + r/4)^(4n)
      const maturityVal = amount * Math.pow(1 + (rate/100) / 4, 4 * years);
      const interestEarned = maturityVal - amount;
      
      // TDS limit is 40k (50k for seniors). If interest is above limit, apply tax
      const taxLimit = isSenior ? 50000 : 40000;
      let taxAmount = 0;
      if (interestEarned / years > taxLimit) {
        taxAmount = interestEarned * taxRate;
      }
      
      const netInterest = interestEarned - taxAmount;
      const effectiveYield = (netInterest / amount / years) * 100;
      
      return {
        ...item,
        rate,
        interestEarned,
        netInterest,
        maturityVal: amount + netInterest,
        effectiveYield
      };
    });
    
    // 3. SORT & RANK
    calculated.sort((a, b) => b.effectiveYield - a.effectiveYield);
    
    // 4. FORMAT TOP 3
    return calculated.slice(0, 3).map((item, idx) => {
      let badge = "Competitive Yield";
      if (idx === 0) badge = "Highest Effective Return";
      else if (item.category === 'PSU') badge = "Safest &bull; PSU Bank";
      else if (isSenior && idx === 1) badge = "Senior Citizen Special";
      
      return {
        title: `${item.bankName} Fixed Deposit`,
        subtitle: `${item.rating} &bull; ${item.category} Bank &bull; Compounded Quarterly`,
        badge: badge,
        metric: `${item.effectiveYield.toFixed(2)}%`,
        metricLabel: "Post-Tax Yield"
      };
    });
    
  } else if (categoryId === 'mf') {
    let list = [...F3Data.mutualFunds];
    const goal = pref.goal || "Wealth growth";
    const amcType = pref.fundType || "all";
    
    list = list.filter(item => item.goal === goal);
    if (amcType !== 'all') {
      list = list.filter(item => item.category === amcType);
    }
    
    // Rank by 3-year CAGR
    list.sort((a, b) => b.cagr3Yr - a.cagr3Yr);
    if (list.length === 0) list = F3Data.mutualFunds.slice(0, 3);
    
    return list.slice(0, 3).map((item, idx) => {
      let badge = "Top Tier Fund";
      if (idx === 0) badge = "Highest 3-Yr Growth";
      else if (item.expenseRatio < 0.60) badge = "Low Expense Ratio";
      else if (item.riskGrade === 'Moderate') badge = "Balanced Risk Profile";
      
      return {
        title: item.fundName,
        subtitle: `Risk: ${item.riskGrade} &bull; Expense: ${item.expenseRatio}% &bull; ${item.category === 'independent' ? 'Independent' : 'Bank-Backed'} AMC`,
        badge: badge,
        metric: `${item.cagr3Yr.toFixed(1)}%`,
        metricLabel: "3-Year CAGR"
      };
    });
    
  } else if (categoryId === 'bonds') {
    let list = [...F3Data.bonds];
    const rating = pref.bondRating || "AA+";
    const issuer = pref.issuerCategory || "all";
    
    if (rating === 'Sovereign') {
      list = list.filter(item => item.rating.includes('Sovereign'));
    } else if (rating === 'AAA') {
      list = list.filter(item => item.rating.includes('AAA') || item.rating.includes('Sovereign'));
    }
    
    if (issuer !== 'all') {
      list = list.filter(item => item.issuerCategory === issuer);
    }
    
    list.sort((a, b) => b.ytm - a.ytm);
    if (list.length === 0) list = F3Data.bonds.slice(0, 3);
    
    return list.slice(0, 3).map((item, idx) => {
      let badge = "Fixed Coupon";
      if (idx === 0) badge = "Highest YTM Yield";
      else if (item.taxFeature.includes('Tax-Free')) badge = "100% Tax Free";
      else if (item.issuerCategory === 'PSU') badge = "Sovereign/PSU Safety";
      
      return {
        title: item.bondName,
        subtitle: `Rating: ${item.rating} &bull; Issuer: ${item.issuerCategory} &bull; Min: ₹${item.minInvestment.toLocaleString()}`,
        badge: badge,
        metric: `${item.ytm.toFixed(2)}%`,
        metricLabel: "Yield to Maturity (YTM)"
      };
    });
    
  } else if (categoryId === 'ipo') {
    let list = [...F3Data.ipos];
    // Sort by GMP
    list.sort((a, b) => b.gmpPercent - a.gmpPercent);
    
    return list.slice(0, 3).map((item, idx) => {
      let badge = item.status === 'Open' ? "Active Bidding" : "Upcoming Listing";
      if (idx === 0 && item.gmpPercent > 30) badge = "Blockbuster Listing Expected";
      
      return {
        title: item.companyName,
        subtitle: `Price Band: ${item.priceBand} &bull; Close Date: ${item.closeDate} &bull; Subscribed: ${item.subscriptionTimes}`,
        badge: badge,
        metric: `+${item.gmpPercent}%`,
        metricLabel: "Grey Market Premium (GMP)"
      };
    });
    
  } else if (categoryId === 'tx_analysis') {
    // Return mock diagnostic details as options
    return [
      {
        title: "Salary Bank Surplus Allocator",
        subtitle: "HDFC Savings Account &bull; Suggested allocation to high yield deposits.",
        badge: "Smart Surplus Tagging",
        metric: "₹1,10,000",
        metricLabel: "Net Monthly Surplus"
      },
      {
        title: "Credit Card Spend Optimization",
        subtitle: "Optimize Shopping and Dining spending loops.",
        badge: "Recommended Card Action",
        metric: "5.0% back",
        metricLabel: "Potential Cashback Savings"
      },
      {
        title: "Tax Bracket Optimizations",
        subtitle: "Your income falls under the 30% slab. Suggesting Section 80C ELSS.",
        badge: "Tax Shield Active",
        metric: "₹46,500",
        metricLabel: "Direct Annual Tax Saving"
      }
    ];
    
  } else if (categoryId === 'cc_selector') {
    let list = [...F3Data.creditCards];
    const userSpends = pref.spendCategories || ["Shopping"];
    const income = pref.income || 50000;
    
    // Score cards based on category matches and income eligibility
    const scored = list.map(card => {
      let score = 0;
      card.spendCategories.forEach(cat => {
        if (userSpends.includes(cat)) score += 10;
      });
      // Filter out ineligible cards
      if (income < card.minIncome) {
        score -= 100;
      }
      return { ...card, score };
    });
    
    scored.sort((a, b) => b.score - a.score);
    
    // Grab top 3
    const finalCards = scored.filter(c => c.score > -50).slice(0, 3);
    const renderList = finalCards.length > 0 ? finalCards : F3Data.creditCards.slice(0, 3);
    
    return renderList.map((item, idx) => {
      let badge = "Highly Rated";
      if (idx === 0) badge = "Best Matched Rewards";
      else if (item.annualFee === 0) badge = "Lifetime Free Card";
      
      return {
        title: item.cardName,
        subtitle: `Fee: ₹${item.annualFee}/yr &bull; Eligible: Min Income ₹${item.minIncome.toLocaleString()}/mo`,
        badge: badge,
        metric: item.spendCategories[0],
        metricLabel: "Primary Benefit Focus"
      };
    });
    
  } else if (categoryId === 'trip_planner') {
    const duration = pref.tenure || 7;
    const travelers = pref.travelers || 2;
    const style = pref.travelStyle || "Comfort";
    
    // Mock calculations
    let multiplier = 5000; // comfort rate per person-day
    if (style === 'Budget') multiplier = 2000;
    else if (style === 'Luxury') multiplier = 15000;
    
    const targetBudget = duration * travelers * multiplier;
    
    return [
      {
        title: "Wise Multi-Currency Forex Card",
        subtitle: "Best exchange rates & lowest conversion fees for destination spends.",
        badge: "Zero Markup Card",
        metric: "0.41%",
        metricLabel: "Average Forex markup fee"
      },
      {
        title: "Comprehensive Travel Guard Policy",
        subtitle: "Covers medical emergencies, trip delays, and lost baggage.",
        badge: "Highly Rated Insurance",
        metric: "₹1,240",
        metricLabel: "Premium For Single Trip"
      },
      {
        title: "Automated Budget split target",
        subtitle: "Hotel (45%) &bull; Flight (30%) &bull; Food &amp; Retail (25%)",
        badge: `${style} Allocation Profile`,
        metric: `₹${targetBudget.toLocaleString()}`,
        metricLabel: "Estimated Target Budget"
      }
    ];
    
  } else if (categoryId === 'expense_planner') {
    const income = pref.income || 100000;
    const savingsGoal = pref.savingsGoal || 20;
    const obligations = pref.fixedObligations || 40000;
    
    const savingsAmount = (income * savingsGoal) / 100;
    const variableBudget = income - obligations - savingsAmount;
    
    return [
      {
        title: "Fixed Obligations & Bills",
        subtitle: "Rent, EMI, Utilities, and critical recurring payments.",
        badge: "Locked Budget",
        metric: `₹${obligations.toLocaleString()}`,
        metricLabel: "Fixed Outflows"
      },
      {
        title: "Target Savings & Surplus",
        subtitle: "Suggested destinations: High yield FDs or SIPs.",
        badge: "Priority Savings Outflow",
        metric: `₹${savingsAmount.toLocaleString()}`,
        metricLabel: `${savingsGoal}% Savings Goal`
      },
      {
        title: "Guilt-Free Variable Budget",
        subtitle: "Dining out, shopping, hobbies, and leisure spending limits.",
        badge: "Discretionary Spend Limit",
        metric: `₹${Math.max(0, variableBudget).toLocaleString()}`,
        metricLabel: "Remaining Variable Cashflow"
      }
    ];
    
  } else if (categoryId === 'loans') {
    let list = [...F3Data.loans];
    const amount = pref.loanAmount || 4500000;
    const purpose = pref.loanPurpose || "HL / HL Overdraft";
    
    // Sort and calculate effective rate (baseRate + processing fees)
    // PSU offers lowest rate, Private offers fast, NBFC offers speed
    const calculated = list.map(item => {
      // PSU banks often lowest headline rate; private banks faster processing; SFB flexible credit
      let discount = 0;
      // Pre-approved discount if relationship bank matches
      if (pref.existingBank && item.bankName.toLowerCase().includes(pref.existingBank.toLowerCase())) {
        discount = 0.15; // 15 bps loyalty discount
      }
      
      const activeRate = item.baseRate - discount;
      
      // Amortize processing fee over 20 year default tenure
      const fee = Math.min(item.processingFeeCap, amount * (item.processingFeePercent/100));
      const feeAmortizedRate = (fee / amount / 20) * 100; 
      
      const effectiveRate = activeRate + feeAmortizedRate;
      
      return {
        ...item,
        activeRate,
        fee,
        effectiveRate
      };
    });
    
    calculated.sort((a, b) => a.effectiveRate - b.effectiveRate);
    
    return calculated.slice(0, 3).map((item, idx) => {
      let badge = "Competitive Financing";
      if (idx === 0) badge = "Lowest Effective Rate";
      else if (item.bankCategory === 'Private') badge = "Fast Track Sanction";
      else if (item.bankCategory === 'PSU') badge = "Secure Public Bank";
      
      return {
        title: `${item.bankName} - ${purpose}`,
        subtitle: `Base: ${item.activeRate.toFixed(2)}% &bull; Fee: ${item.processingFeePercent}% (Cap ₹${item.processingFeeCap.toLocaleString()})`,
        badge: badge,
        metric: `${item.effectiveRate.toFixed(2)}%`,
        metricLabel: "Effective Rate (Fee Amortized)"
      };
    });
    
  } else if (F3Data.insurance[categoryId]) {
    // Matcher for Life, Health, Vehicle, Home, Business, Remittance
    let list = [...F3Data.insurance[categoryId]];
    
    // Apply basic calculation multipliers
    const amount = pref.amount || 1000000;
    const age = pref.age || 30;
    const isSmoker = pref.isSmoker === 'yes';
    
    const calculated = list.map(item => {
      let premium = item.premiumBase;
      
      if (categoryId === 'Life') {
        // Adjust for age and smoking
        const ageFactor = (age - 20) * 400;
        const smokerFactor = isSmoker ? 5000 : 0;
        premium = item.premiumBase + ageFactor + smokerFactor;
      } else if (categoryId === 'Health') {
        const ageFactor = (age - 20) * 500;
        const conditionFactor = pref.existingCondition === 'yes' ? 4000 : 0;
        premium = item.premiumBase + ageFactor + conditionFactor;
      } else if (categoryId === 'Vehicle') {
        const idv = pref.idv || 500000;
        const ncbPct = parseInt(pref.ncb || '0');
        premium = (idv * 0.025) * (1 - ncbPct/100);
      } else if (categoryId === 'Home') {
        const structVal = pref.amount || 4000000;
        const contentsVal = pref.fixedObligations || 1000000;
        premium = (structVal * 0.0006) + (contentsVal * 0.001);
      }
      
      return {
        ...item,
        premium
      };
    });
    
    calculated.sort((a, b) => a.premium - b.premium);
    
    return calculated.slice(0, 3).map((item, idx) => {
      let badge = "Top Tier Coverage";
      if (idx === 0) badge = "Lowest Premium";
      else if (item.provider.includes('LIC') || item.provider.includes('SBI')) badge = "Sovereign Trust";
      
      const isRate = categoryId === 'Remittance';
      
      return {
        title: item.provider,
        subtitle: item.details,
        badge: badge,
        metric: isRate ? `${item.premiumBase.toFixed(2)}%` : `₹${Math.round(item.premium).toLocaleString()}/yr`,
        metricLabel: isRate ? "Transfer Margin Fee" : "Annual Premium Cost"
      };
    });
  }
  
  // Fallback
  return [
    { title: "Option Alpha", subtitle: "PSU Partner &bull; High Reliability", badge: "Balanced choice", metric: "7.10%", metricLabel: "Yield" },
    { title: "Option Beta", subtitle: "Private Partner &bull; Speed Focus", badge: "Instant Account", metric: "7.45%", metricLabel: "Yield" },
    { title: "Option Gamma", subtitle: "SFB Partner &bull; High yield return", badge: "Highest growth", metric: "8.15%", metricLabel: "Yield" }
  ];
}

// 8. DRILL-IN DRAWER DETAILS
window.openDrillIn = function(categoryId, index) {
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawer = document.getElementById('drawer');
  const drawerTitle = document.getElementById('drawer-title');
  const drawerBody = document.getElementById('drawer-body');
  
  let selectedItem;
  if (categoryId === 'fd') {
    const rawList = calculateTopThreeDetailsFD();
    const itemDetails = rawList[index];
    selectedItem = {
      title: `${itemDetails.bankName} Fixed Deposit`,
      badge: (index === 0) ? "Highest Effective Return" : "Competitive Yield"
    };
  } else if (categoryId === 'loans') {
    const rawList = calculateTopThreeDetailsLoans();
    const itemDetails = rawList[index];
    const purpose = AppState.prefills.loanPurpose || "Home Loan";
    selectedItem = {
      title: `${itemDetails.bankName} - ${purpose}`,
      badge: (index === 0) ? "Lowest Effective Rate" : "Competitive Financing"
    };
  } else {
    const results = calculateTopThree(categoryId);
    selectedItem = results[index];
  }
  
  drawerTitle.innerText = selectedItem.title;
  
  let html = `
    <div style="margin-bottom: 24px;">
      <span class="tag-badge accent-tag" style="margin-bottom: 12px;">${selectedItem.badge}</span>
      <p style="font-size: 15px; color: var(--color-ink-secondary); line-height: 1.6;">
        Detailed breakdown and financial simulation for your profile parameters.
      </p>
    </div>
  `;
  
  // Custom Analytics sections based on category
  const amount = AppState.prefills.amount || 500000;
  const years = AppState.prefills.tenure || 3;
  const isSenior = AppState.prefills.seniorCitizen === 'yes';
  
  if (categoryId === 'fd') {
    const rawList = calculateTopThreeDetailsFD();
    const itemDetails = rawList[index];
    
    html += `
      <div class="calc-card">
        <h4 style="margin-bottom: 12px;">Maturity Yield Calculation</h4>
        <div class="calc-row"><span>Principal Investment</span><span class="mono">₹${amount.toLocaleString()}</span></div>
        <div class="calc-row"><span>Tenure Duration</span><span class="mono">${years} Years</span></div>
        <div class="calc-row"><span>Interest rate</span><span class="mono">${itemDetails.rate.toFixed(2)}%</span></div>
        <div class="calc-row"><span>Gross Interest Earned</span><span class="mono">₹${Math.round(itemDetails.interestEarned).toLocaleString()}</span></div>
        <div class="calc-row" style="color: var(--color-error);"><span>Estimated TDS Deductions</span><span class="mono">-₹${Math.round(itemDetails.tds).toLocaleString()}</span></div>
        <div class="calc-row total"><span>Net Maturity Value</span><span class="mono">₹${Math.round(itemDetails.maturityVal).toLocaleString()}</span></div>
      </div>
      
      <div style="margin-top: 24px;">
        <h4 style="margin-bottom: 8px;">F3 Trust &amp; Premature Penalties</h4>
        <p style="font-size: 13px; line-height: 1.5; color: var(--color-ink-secondary); margin-bottom: 12px;">
          &bull; <strong>DICGC Insurance Confirmed</strong>: Your deposit with ${selectedItem.title.split(' ')[0]} is fully insured up to **₹5,00,000** under RBI regulations.<br><br>
          &bull; <strong>Premature Withdrawal Penalty</strong>: ${itemDetails.prematurePenalty}. If you withdraw early, you will earn interest at the rate applicable to the duration held, minus this penalty.
        </p>
      </div>
    `;
  } else if (categoryId === 'loans') {
    const loanAmount = AppState.prefills.loanAmount || 5000000;
    const purpose = AppState.prefills.loanPurpose || "Home Loan";
    const rawList = calculateTopThreeDetailsLoans();
    const itemDetails = rawList[index];
    
    // EMI Calculation: P * r * (1+r)^n / ((1+r)^n - 1)
    const n = 20 * 12; // 20 years default monthly steps
    const r = (itemDetails.effectiveRate / 100) / 12;
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - loanAmount;
    
    html += `
      <div class="calc-card">
        <h4 style="margin-bottom: 12px;">EMI Simulator (20-Year Tenure)</h4>
        <div class="calc-row"><span>Requested Principal</span><span class="mono">₹${loanAmount.toLocaleString()}</span></div>
        <div class="calc-row"><span>Base Interest Rate</span><span class="mono">${itemDetails.activeRate.toFixed(2)}%</span></div>
        <div class="calc-row"><span>Processing Fee</span><span class="mono">₹${Math.round(itemDetails.fee).toLocaleString()}</span></div>
        <div class="calc-row"><span>Effective Rate (PF Amortized)</span><span class="mono">${itemDetails.effectiveRate.toFixed(2)}%</span></div>
        <div class="calc-row total"><span>Monthly EMI Outflow</span><span class="mono">₹${Math.round(emi).toLocaleString()}/mo</span></div>
      </div>
      
      <div style="margin-top: 24px;">
        <h4 style="margin-bottom: 8px;">Key Guidelines &amp; soft Checks</h4>
        <p style="font-size: 13px; line-height: 1.5; color: var(--color-ink-secondary);">
          &bull; <strong>Eligibility check</strong>: No CIBIL score hit. F3 performs a soft profile validation based on your statement uploads.<br>
          &bull; <strong>Amortized Costing</strong>: This comparison ranks banks by their *effective rate* which includes processing fee amortized over the loan lifecycle, so you see the true cost of credit.
        </p>
      </div>
    `;
  } else {
    // Default fallback drawer detail info
    html += `
      <div class="calc-card">
        <h4 style="margin-bottom: 12px;">Performance Metrics</h4>
        <div class="calc-row"><span>Yield / Growth Indicators</span><span class="mono">${selectedItem.metric}</span></div>
        <div class="calc-row"><span>Parameter Metric Type</span><span class="mono">${selectedItem.metricLabel}</span></div>
      </div>
      <p style="margin-top: 16px; font-size: 13px; line-height: 1.5; color: var(--color-ink-secondary);">
        Please consult the institution's official policy documentation before locking in terms. Pre-fills saved in this session are kept purely in your browser storage.
      </p>
    `;
  }
  
  drawerBody.innerHTML = html;
  
  // Show drawer
  drawerOverlay.style.display = 'block';
  drawer.style.display = 'flex';
  setTimeout(() => {
    drawerOverlay.classList.add('active');
    drawer.classList.add('active');
  }, 10);
};

function calculateTopThreeDetailsFD() {
  let list = [...F3Data.fixedDeposits];
  if (AppState.prefills.bankCategory && AppState.prefills.bankCategory.length > 0) {
    list = list.filter(item => AppState.prefills.bankCategory.includes(item.category));
  }
  if (list.length === 0) list = [...F3Data.fixedDeposits];
  
  const amount = AppState.prefills.amount || 500000;
  const years = AppState.prefills.tenure || 3;
  const isSenior = AppState.prefills.seniorCitizen === 'yes';
  
  let taxRate = 0.10;
  if (AppState.prefills.income && AppState.prefills.income > 1500000) taxRate = 0.30;
  else if (AppState.prefills.income && AppState.prefills.income > 1000000) taxRate = 0.20;
  else if (AppState.prefills.income && AppState.prefills.income < 700000) taxRate = 0.00;
  
  const calculated = list.map(item => {
    const rate = isSenior ? item.seniorRate : item.headlineRate;
    const maturityValVal = amount * Math.pow(1 + (rate/100) / 4, 4 * years);
    const interestEarned = maturityValVal - amount;
    
    const taxLimit = isSenior ? 50000 : 40000;
    let tds = 0;
    if (interestEarned / years > taxLimit) {
      tds = interestEarned * taxRate;
    }
    
    const netInterest = interestEarned - tds;
    const effectiveYield = (netInterest / amount / years) * 100;
    
    return {
      ...item,
      rate,
      interestEarned,
      tds,
      maturityVal: amount + netInterest,
      effectiveYield
    };
  });
  
  calculated.sort((a, b) => b.effectiveYield - a.effectiveYield);
  return calculated;
}

function calculateTopThreeDetailsLoans() {
  let list = [...F3Data.loans];
  const amount = AppState.prefills.loanAmount || 5000000;
  
  const calculated = list.map(item => {
    let discount = 0;
    if (AppState.prefills.existingBank && item.bankName.toLowerCase().includes(AppState.prefills.existingBank.toLowerCase())) {
      discount = 0.15;
    }
    const activeRate = item.baseRate - discount;
    const fee = Math.min(item.processingFeeCap, amount * (item.processingFeePercent/100));
    const feeAmortizedRate = (fee / amount / 20) * 100; 
    const effectiveRate = activeRate + feeAmortizedRate;
    
    return {
      ...item,
      activeRate,
      fee,
      effectiveRate
    };
  });
  
  calculated.sort((a, b) => a.effectiveRate - b.effectiveRate);
  return calculated;
}

// 9. COMPARE ALL FULL TABLE DIALOG
window.openComparisonTable = function(categoryId) {
  const compareOverlay = document.getElementById('compare-overlay');
  const compareModal = document.getElementById('compare-modal');
  const compareTitle = document.getElementById('compare-title');
  const compareBody = document.getElementById('compare-body');
  
  const config = CategoryConfig[categoryId];
  compareTitle.innerText = `All Registered Options (Ranked): ${config.title}`;
  
  let html = '';
  
  if (categoryId === 'fd') {
    const rawDetails = calculateTopThreeDetailsFD();
    
    html += `
      <p style="font-size: 13px; color: var(--color-ink-secondary); margin-bottom: 16px; line-height: 1.5;">
        All available Fixed Deposits ranked by net post-tax yield (highest yield to lowest). Click any row to view full maturity details.
      </p>
      <table class="compare-table">
        <thead>
          <tr>
            <th style="text-align: center; width: 50px;">Rank</th>
            <th>Institution</th>
            <th>Type</th>
            <th>Base Rate</th>
            <th>Senior Rate</th>
            <th>Effective Yield (Net)</th>
            <th>Insured (DICGC)</th>
          </tr>
        </thead>
        <tbody>
    `;
    rawDetails.forEach((item, idx) => {
      html += `
        <tr onclick="closeDrawers(); setTimeout(() => openDrillIn('fd', ${idx}), 310)" style="cursor: pointer;">
          <td style="font-weight: bold; text-align: center;">${idx + 1}</td>
          <td><strong>${item.bankName}</strong></td>
          <td>${item.category}</td>
          <td>${item.headlineRate.toFixed(2)}%</td>
          <td>${item.seniorRate.toFixed(2)}%</td>
          <td style="font-weight: 600; color: var(--color-success);">${item.effectiveYield.toFixed(2)}%</td>
          <td>${item.dicgcProtected ? 'Yes (₹5 L)' : 'No'}</td>
        </tr>
      `;
    });
    html += `</tbody></table>`;
    
  } else if (categoryId === 'loans') {
    const rawDetails = calculateTopThreeDetailsLoans();
    
    html += `
      <p style="font-size: 13px; color: var(--color-ink-secondary); margin-bottom: 16px; line-height: 1.5;">
        All available Loans ranked by effective amortized rate (lowest rate to highest). Click any row to view simulator.
      </p>
      <table class="compare-table">
        <thead>
          <tr>
            <th style="text-align: center; width: 50px;">Rank</th>
            <th>Bank</th>
            <th>Category</th>
            <th>Base Rate</th>
            <th>Processing Fee</th>
            <th>Effective Amortized Rate</th>
            <th>Primary Strengths</th>
          </tr>
        </thead>
        <tbody>
    `;
    rawDetails.forEach((item, idx) => {
      html += `
        <tr onclick="closeDrawers(); setTimeout(() => openDrillIn('loans', ${idx}), 310)" style="cursor: pointer;">
          <td style="font-weight: bold; text-align: center;">${idx + 1}</td>
          <td><strong>${item.bankName}</strong></td>
          <td>${item.bankCategory}</td>
          <td>${item.activeRate.toFixed(2)}%</td>
          <td>${item.processingFeePercent}% (Cap ₹${item.processingFeeCap.toLocaleString()})</td>
          <td style="font-weight: 600; color: var(--color-ink-primary);">${item.effectiveRate.toFixed(2)}%</td>
          <td>${item.suitability}</td>
        </tr>
      `;
    });
    html += `</tbody></table>`;
    
  } else if (categoryId === 'mf') {
    let list = [...F3Data.mutualFunds];
    const goal = AppState.prefills.goal || "Wealth growth";
    list = list.filter(item => item.goal === goal);
    
    html += `
      <table class="compare-table">
        <thead>
          <tr>
            <th>Fund Name</th>
            <th>Category</th>
            <th>Expense Ratio</th>
            <th>Risk Grade</th>
            <th>3-Yr CAGR</th>
            <th>5-Yr CAGR</th>
          </tr>
        </thead>
        <tbody>
    `;
    list.forEach(item => {
      html += `
        <tr>
          <td><strong>${item.fundName}</strong></td>
          <td>${item.category}</td>
          <td>${item.expenseRatio}%</td>
          <td>${item.riskGrade}</td>
          <td style="font-weight: 600; color: var(--color-success);">${item.cagr3Yr.toFixed(1)}%</td>
          <td>${item.cagr5Yr.toFixed(1)}%</td>
        </tr>
      `;
    });
    html += `</tbody></table>`;
  } else {
    html += `<p style="color: var(--color-ink-secondary);">Complete grid breakdown of all registered options in F3 data store.</p>`;
  }
  
  compareBody.innerHTML = html;
  
  compareOverlay.style.display = 'block';
  compareModal.style.display = 'flex';
  setTimeout(() => {
    compareOverlay.classList.add('active');
    compareModal.classList.add('active');
  }, 10);
};

// 10. CLOSING CONTROLS FOR DRAWERS & MODALS
function closeDrawers() {
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawer = document.getElementById('drawer');
  const compareOverlay = document.getElementById('compare-overlay');
  const compareModal = document.getElementById('compare-modal');

  drawerOverlay.classList.remove('active');
  drawer.classList.remove('active');
  compareOverlay.classList.remove('active');
  compareModal.classList.remove('active');

  setTimeout(() => {
    drawerOverlay.style.display = 'none';
    drawer.style.display = 'none';
    compareOverlay.style.display = 'none';
    compareModal.style.display = 'none';
  }, 300);
}

// 11. BOOTSTRAP INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  renderActiveTabContent();
  
  // Connect close click events
  document.getElementById('drawer-close').addEventListener('click', closeDrawers);
  document.getElementById('drawer-overlay').addEventListener('click', closeDrawers);
  
  document.getElementById('compare-close').addEventListener('click', closeDrawers);
  document.getElementById('compare-overlay').addEventListener('click', closeDrawers);
});
