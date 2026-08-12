"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { safeGenerateAIContent, safeGenerateJSON } from "@/lib/gemini";
import { revalidatePath } from "next/cache";
import { getResumeMarkdown } from "@/app/lib/helper";

const buildContextualFallback = ({ current, type, contextDetails = {}, user }) => {
  const normalized = String(current || "").trim();
  if (!normalized) return "";

  const userSkills = Array.isArray(user?.skills) && user.skills.length > 0
    ? user.skills.slice(0, 3).join(", ")
    : "technical problem solving and core engineering principles";

  if (type === "education") {
    const degree = contextDetails.degree || "Degree";
    const field = contextDetails.fieldOfStudy ? `in ${contextDetails.fieldOfStudy}` : "";
    const institution = contextDetails.institution ? `at ${contextDetails.institution}` : "";
    return `Pursued ${degree} ${field} ${institution}. Built strong academic foundations in ${userSkills}, completing coursework, lab implementations, and collaborative technical projects.`;
  }

  if (type === "project") {
    const projectName = contextDetails.projectName || "Project";
    const technologies = contextDetails.technologies || userSkills;
    return `Engineered ${projectName} using ${technologies}. Solved key performance and architecture requirements, implementing modular features and delivering verified results.`;
  }

  // Work experience default fallback
  const jobTitle = contextDetails.jobTitle || "Role";
  const company = contextDetails.company ? `at ${contextDetails.company}` : "";
  return `Delivered core responsibilities as ${jobTitle} ${company}, leveraging ${userSkills} to improve system reliability, code quality, and technical execution.`;
};

export async function saveResume(content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const resume = await db.resume.upsert({
      where: {
        userId: user.id,
      },
      update: {
        content,
      },
      create: {
        userId: user.id,
        content,
      },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.resume.findUnique({
    where: {
      userId: user.id,
    },
  });
}

export async function improveWithAI({ current, type, contextDetails = {} }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const userProfileSummary = `Industry: ${user.industry || "Software Engineering"}, Target Skills: ${user.skills?.join(", ") || "Engineering"}`;

  // Controlled variation angles
  const variationAngles = [
    "Focus on action verbs and measurable business/technical impact.",
    "Emphasize technical ownership, architecture choices, and clarity.",
    "Highlight core technical skills, optimization, and reliable delivery.",
  ];
  const selectedAngle = variationAngles[Math.floor(Math.random() * variationAngles.length)];

  let sectionInstruction = "";
  if (type === "education") {
    sectionInstruction = `
      Focus strictly on ACADEMIC details: degree, field of study, coursework, learning, academic achievements, and projects.
      Do NOT use work experience phrasing like 'Led high-impact initiatives' or corporate business jargon.
    `;
  } else if (type === "project") {
    sectionInstruction = `
      Focus on what was built, problem solved, technical implementation, tools used, user's role, and key outcomes.
    `;
  } else {
    sectionInstruction = `
      Focus on job title, company, responsibilities, technical contribution, quantifiable outcomes, and engineering impact.
    `;
  }

  const prompt = `
    You are an expert resume writer. Improve the following ${type} content for a candidate.
    Candidate Context: ${userProfileSummary}
    Section Type: ${type}
    Current Content: "${current}"
    Additional Details: ${JSON.stringify(contextDetails)}

    Instructions:
    1. ${sectionInstruction}
    2. Variation Angle: ${selectedAngle}
    3. CRITICAL: Never invent false metrics, degrees, companies, or technologies not supplied by the user. If metrics are absent, use clean text or suggest placeholders like [X%].
    4. Do NOT include decorative emojis or markdown headings.

    Return ONLY the improved text snippet without explanations.
  `;

  try {
    const text = await safeGenerateAIContent({
      prompt,
      fallbackFn: () => buildContextualFallback({ current, type, contextDetails, user }),
      logTag: "ImproveWithAI",
    });

    if (!text) {
      return buildContextualFallback({ current, type, contextDetails, user });
    }

    // Strip emojis if any returned
    return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "").trim();
  } catch (aiError) {
    return buildContextualFallback({ current, type, contextDetails, user });
  }
}

function calculateDeterministicATS(resumeContent, jobTitle, jobDescription, userSkills = []) {
  const contentLower = (resumeContent || "").toLowerCase();
  const jdLower = (jobDescription || "").toLowerCase();
  const userSkillsSet = new Set((userSkills || []).map((s) => s.toLowerCase()));

  // Dynamic keyword extraction from candidate skills and JD words
  const extractWords = (text) =>
    Array.from(new Set((text || "").match(/\b[A-Za-z0-9+#.-]{3,25}\b/g) || []))
      .map((w) => w.toLowerCase())
      .filter((w) => !["and", "the", "for", "with", "this", "that", "from", "have", "been", "will", "your", "must", "with"].includes(w));

  const jdWords = extractWords(jobDescription);
  const resumeWords = new Set([...extractWords(resumeContent), ...userSkillsSet]);

  const hasJD = Boolean(jobDescription && jobDescription.trim().length > 10);

  const matchedKeywords = hasJD
    ? jdWords.filter((w) => resumeWords.has(w)).map((w) => w.toUpperCase())
    : Array.from(userSkillsSet).map((s) => String(s).toUpperCase());

  const missingKeywords = hasJD
    ? jdWords.filter((w) => !resumeWords.has(w)).slice(0, 10).map((w) => w.toUpperCase())
    : [];

  const sectionHealth = {
    summary: contentLower.includes("summary") || contentLower.includes("profile"),
    experienceMetrics: contentLower.includes("%") || /\d+/.test(contentLower),
    skillsSection: contentLower.includes("skill"),
    educationSection: contentLower.includes("education") || contentLower.includes("university") || contentLower.includes("b.tech") || contentLower.includes("degree"),
    projectsSection: contentLower.includes("project"),
  };

  const completedSectionsCount = Object.values(sectionHealth).filter(Boolean).length;
  const sectionScore = (completedSectionsCount / 5) * 40;

  let keywordMatchScore = null;
  let atsScore = 0;

  if (hasJD && jdWords.length > 0) {
    keywordMatchScore = Math.min(100, Math.round((matchedKeywords.length / Math.max(1, jdWords.length)) * 100));
    atsScore = Math.min(100, Math.round(sectionScore + (keywordMatchScore * 0.6)));
  } else {
    atsScore = Math.min(100, Math.round(sectionScore + Math.min(40, matchedKeywords.length * 5)));
  }

  const recommendations = [];
  if (!sectionHealth.summary) recommendations.push("Add a clear Professional Summary section.");
  if (!sectionHealth.skillsSection) recommendations.push("Explicitly list your core Technical Skills.");
  if (!sectionHealth.experienceMetrics) recommendations.push("Add quantified metrics (e.g. 'improved latency by 35%') to your achievements.");
  if (hasJD && missingKeywords.length > 0) {
    recommendations.push(`Incorporate key job description keywords: ${missingKeywords.slice(0, 3).join(", ")}.`);
  } else if (!hasJD) {
    recommendations.push("Paste a target Job Description to get job-specific keyword coverage analysis.");
  }

  return {
    atsScore,
    keywordMatchScore,
    isBaseline: !hasJD,
    matchedKeywords: matchedKeywords.slice(0, 15),
    missingKeywords: missingKeywords.slice(0, 10),
    sectionHealth,
    recommendations,
    rewriteSuggestions: [
      {
        original: "Responsible for core project tasks and implementation.",
        suggested: `Engineered core systems leveraging ${userSkills[0] || "technical skills"}, delivering measurable speed and reliability improvements.`,
        reason: "Replaces passive description with action-oriented achievement metrics.",
      },
    ],
  };
}

export async function auditResumeWithAI({ resumeContent, jobTitle, jobDescription }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const rawMarkdown = getResumeMarkdown(resumeContent);
  const fallbackData = calculateDeterministicATS(rawMarkdown, jobTitle, jobDescription, user.skills);

  const prompt = `
    You are an expert ATS (Applicant Tracking System) Screener and Technical Resume Auditor.
    Analyze the following candidate resume content against target job details.

    Target Job Title: ${jobTitle || "Software Engineer"}
    Target Job Description: ${jobDescription || "Not Provided"}

    Candidate Resume Content:
    ${rawMarkdown}

    Candidate Skills Profile: ${user.skills?.join(", ") || "Engineering"}

    Instructions:
    1. Extract matched keywords present in BOTH the resume and job description.
    2. Extract missing keyword gaps that appear in the job description but are missing from the candidate resume.
    3. Calculate an accurate ATS Score (0-100) based on keyword match density, structural sections, and quantifiable metrics.
    4. Provide specific actionable recommendations and bullet rewrite suggestions based on the candidate's actual text.

    Return ONLY a JSON object with this exact schema:
    {
      "atsScore": number (0-100),
      "keywordMatchScore": number (0-100 or null if no JD),
      "isBaseline": boolean,
      "matchedKeywords": ["string"],
      "missingKeywords": ["string"],
      "sectionHealth": {
        "summary": boolean,
        "experienceMetrics": boolean,
        "skillsSection": boolean,
        "educationSection": boolean,
        "projectsSection": boolean
      },
      "recommendations": ["string"],
      "rewriteSuggestions": [
        {
          "original": "string",
          "suggested": "string",
          "reason": "string"
        }
      ]
    }
  `;

  const auditResult = await safeGenerateJSON({
    prompt,
    fallbackData,
    logTag: "Resume Audit AI",
  });

  // Persist ATS score & feedback in Resume record
  await db.resume.upsert({
    where: { userId: user.id },
    update: {
      content: resumeContent,
      atsScore: auditResult.atsScore,
      feedback: JSON.stringify(auditResult),
    },
    create: {
      userId: user.id,
      content: resumeContent,
      atsScore: auditResult.atsScore,
      feedback: JSON.stringify(auditResult),
    },
  });

  revalidatePath("/resume");
  revalidatePath("/dashboard");
  return auditResult;
}

