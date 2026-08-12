export const buildDefaultInsights = () => ({
  salaryRanges: [],
  growthRate: 0,
  demandLevel: "Medium",
  topSkills: [],
  marketOutlook: "Neutral",
  keyTrends: [],
  recommendedSkills: [],
  lastUpdated: new Date(),
});

const capitalizeWords = (value) =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const prettifyIndustrySlug = (industry) =>
  capitalizeWords((industry || "General Industry").replace(/[-_]+/g, " "));

const toRoleTitle = (industryLabel, role) => `${role}`;

const uniqueList = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = String(item || "").trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Benchmark values in INR (Annual Salary in INR Rupees)
const INDUSTRY_PROFILES = {
  tech: {
    growthRate: 16.5,
    demandLevel: "High",
    marketOutlook: "Positive",
    roles: [
      ["Junior Software Engineer", 450000, 800000, 1400000],
      ["Senior Software Engineer", 1200000, 1850000, 3200000],
      ["System Architect", 1800000, 2800000, 4500000],
      ["DevOps / Cloud Specialist", 900000, 1500000, 2600000],
      ["AI / ML Engineer", 1000000, 1800000, 3500000],
    ],
    topSkills: [
      "System Design",
      "Cloud Infrastructure",
      "Data Modeling",
      "AI/ML",
      "API Development",
    ],
    keyTrends: [
      "AI-assisted workflows are becoming default in product teams",
      "Cloud cost optimization is now a primary engineering KPI",
      "Security and compliance-by-design are required in new releases",
      "Platform engineering is replacing fragmented DevOps toolchains",
      "Data governance is shifting closer to product ownership",
    ],
    recommendedSkills: [
      "Prompt Engineering",
      "Cloud Security",
      "Distributed Systems",
      "Product Analytics",
      "MLOps",
    ],
  },
  finance: {
    growthRate: 11.4,
    demandLevel: "High",
    marketOutlook: "Positive",
    roles: [
      ["Financial Analyst", 500000, 900000, 1600000],
      ["Risk Manager", 800000, 1400000, 2400000],
      ["Quant Strategist", 1200000, 2200000, 3800000],
      ["Investment Analyst", 700000, 1300000, 2200000],
      ["Compliance Lead", 650000, 1100000, 1900000],
    ],
    topSkills: [
      "Risk Analytics",
      "Financial Modeling",
      "Market Microstructure",
      "Regulatory Compliance",
      "Python for Finance",
    ],
    keyTrends: [
      "Real-time risk monitoring is replacing batch-only reporting",
      "Digital assets are being integrated into mainstream portfolios",
      "Automation is reducing manual middle-office operations",
      "RegTech adoption is accelerating for cross-border compliance",
      "Data-driven trading strategies are expanding beyond hedge funds",
    ],
    recommendedSkills: [
      "Derivatives Pricing",
      "Portfolio Construction",
      "Fraud Detection",
      "SQL",
      "Scenario Analysis",
    ],
  },
  healthcare: {
    growthRate: 9.8,
    demandLevel: "High",
    marketOutlook: "Positive",
    roles: [
      ["Healthcare Data Analyst", 450000, 800000, 1300000],
      ["Clinical Operations Manager", 700000, 1200000, 2000000],
      ["Bioinformatics Specialist", 850000, 1500000, 2600000],
      ["HealthTech Product Manager", 900000, 1600000, 2800000],
      ["Quality Assurance Lead", 600000, 1000000, 1700000],
    ],
    topSkills: [
      "Clinical Data Analysis",
      "Healthcare Informatics",
      "Stakeholder Coordination",
      "Process Optimization",
    ],
    keyTrends: [
      "Patient data interoperability is becoming a procurement requirement",
      "Telehealth services are moving from pilot to permanent offerings",
      "AI-assisted diagnostics are expanding in imaging and triage",
      "Value-based care models are influencing hiring priorities",
      "Cybersecurity spending in healthcare is rising rapidly",
    ],
    recommendedSkills: [
      "Health Data Standards",
      "Clinical Workflow Design",
      "Data Privacy",
      "Outcome Measurement",
    ],
  },
};

const DEFAULT_PROFILE = {
  growthRate: 8.2,
  demandLevel: "Medium",
  marketOutlook: "Neutral",
  roles: [
    ["Specialist", 400000, 700000, 1200000],
    ["Senior Specialist", 650000, 1100000, 1800000],
    ["Team Lead", 850000, 1400000, 2400000],
    ["Manager", 1100000, 1800000, 3000000],
    ["Strategy Consultant", 1000000, 1600000, 2800000],
  ],
  topSkills: [
    "Communication",
    "Data Literacy",
    "Cross-Functional Collaboration",
    "Problem Solving",
    "Stakeholder Management",
  ],
  keyTrends: [
    "AI tooling is increasing productivity expectations across roles",
    "Hiring managers value measurable business impact over task lists",
    "Hybrid collaboration skills remain critical in distributed teams",
    "Operational efficiency is a primary driver for transformation projects",
  ],
  recommendedSkills: [
    "Business Analysis",
    "Presentation Skills",
    "Project Planning",
    "Data Storytelling",
  ],
};

const getIndustryProfile = (industry) => {
  const normalized = String(industry || "").toLowerCase();

  if (normalized.includes("finance")) return INDUSTRY_PROFILES.finance;
  if (normalized.includes("tech") || normalized.includes("software") || normalized.includes("engineering")) return INDUSTRY_PROFILES.tech;
  if (normalized.includes("health")) return INDUSTRY_PROFILES.healthcare;

  return DEFAULT_PROFILE;
};

export const buildTemplateInsights = (industry, userSkills = []) => {
  const profile = getIndustryProfile(industry);
  const industryLabel = prettifyIndustrySlug(industry);
  const normalizedUserSkills = uniqueList(
    Array.isArray(userSkills)
      ? userSkills.map((skill) => String(skill || "").trim()).filter(Boolean)
      : []
  );

  const salaryRanges = profile.roles.map(([roleName, min, median, max]) => ({
    role: roleName,
    min,
    median,
    max,
    location: "India (INR)",
    currency: "INR",
  }));

  const topSkills = uniqueList([...normalizedUserSkills, ...profile.topSkills]).slice(0, 8);
  const recommendedSkills = uniqueList([
    ...profile.recommendedSkills,
    ...profile.topSkills,
    ...normalizedUserSkills,
  ]).slice(0, 8);

  const growthBonus = clamp(normalizedUserSkills.length * 0.4, 0, 2);

  return {
    salaryRanges,
    growthRate: Number((profile.growthRate + growthBonus).toFixed(1)),
    demandLevel: profile.demandLevel,
    topSkills,
    marketOutlook: profile.marketOutlook,
    keyTrends: profile.keyTrends,
    recommendedSkills,
    lastUpdated: new Date(),
  };
};
