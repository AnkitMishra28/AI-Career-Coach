import DashboardView from "../(main)/dashboard/_component/dashboard-view";

const mockData = {
  user: {
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
    industry: "Tech",
    experience: 5,
    skills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    bio: "Senior Full Stack Engineer specializing in distributed web applications.",
    createdAt: new Date(),
  },
  resume: {
    id: "test-resume-id",
    content: "# Test User Resume\n\nSenior Software Engineer",
    atsScore: 88,
    feedback: JSON.stringify({
      atsScore: 88,
      keywordMatchScore: 85,
      matchedKeywords: ["React", "Next.js", "TypeScript", "Node.js"],
      missingKeywords: ["GraphQL", "Docker"],
      sectionHealth: { summary: true, experienceMetrics: true, skillsSection: true, educationSection: true, projectsSection: true },
      recommendations: ["Quantify impact in projects section"],
      rewriteSuggestions: []
    })
  },
  assessments: [
    {
      id: "test-assess-1",
      quizScore: 85,
      category: "Technical",
      improvementTip: "Practice system design constraints",
      createdAt: new Date(),
      questions: []
    }
  ],
  coverLetters: [],
  insights: {
    salaryRanges: [
      { role: "Software Engineer", min: 600000, median: 1200000, max: 2000000 },
      { role: "Senior Software Engineer", min: 1200000, median: 1850000, max: 3200000 },
      { role: "System Architect", min: 1800000, median: 2800000, max: 4500000 }
    ],
    growthRate: 16.5,
    demandLevel: "High",
    topSkills: ["System Design", "Cloud Infrastructure", "Data Modeling", "AI/ML"],
    marketOutlook: "Positive",
    keyTrends: ["AI-assisted workflows", "Cloud cost optimization"],
    recommendedSkills: ["Prompt Engineering", "Cloud Security"],
    lastUpdated: new Date()
  }
};

export default function ViewTestPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4 text-foreground">SenseAI Live Dashboard Preview Test</h1>
      <DashboardView data={mockData} />
    </div>
  );
}
