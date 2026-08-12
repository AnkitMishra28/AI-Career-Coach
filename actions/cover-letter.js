"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { safeGenerateAIContent } from "@/lib/gemini";
import { parseResumeContent, getResumeMarkdown } from "@/app/lib/helper";
import { revalidatePath } from "next/cache";

const buildCoverLetterTemplate = ({ user, resume, data }) => {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const parsed = parseResumeContent(resume?.content);
  const contact = parsed.structured?.contactInfo || {};

  const name = user.name || "Candidate";
  const email = contact.email || user.email || "";
  const phone = contact.mobile || "";
  const linkedin = contact.linkedin || "";

  const contactHeaderLines = [
    name,
    [email, phone, linkedin].filter(Boolean).join(" | "),
    today,
  ].filter(Boolean).join("\n");

  const skillsList = (user.skills || []).length > 0
    ? user.skills.join(", ")
    : (parsed.structured?.skills || "technical engineering and problem solving");

  const expCount = typeof user.experience === "number" ? `${user.experience}+ years` : "practical";

  let highlightSection = "";
  if (parsed.structured?.experience?.length) {
    const topJob = parsed.structured.experience[0];
    highlightSection = `In my role as ${topJob.jobTitle || topJob.title || "Developer"} at ${topJob.company || topJob.organization || "my previous organization"}, I contributed to key development initiatives, writing clean code and supporting technical goals.`;
  } else if (parsed.structured?.projects?.length) {
    const topProj = parsed.structured.projects[0];
    highlightSection = `Through technical projects such as ${topProj.projectName || topProj.title || "my engineering project"}, I applied ${topProj.technologies || skillsList} to build working software solutions and deliver reliable functional outcomes.`;
  } else {
    highlightSection = `Through my hands-on background and project coursework, I have developed strong foundational engineering capabilities in ${skillsList}.`;
  }

  return `
${contactHeaderLines}

Hiring Manager  
${data.companyName}

Subject: Application for ${data.jobTitle}

Dear Hiring Manager,

I am writing to express my strong interest in the ${data.jobTitle} position at ${data.companyName}. With ${expCount} of experience in ${user.industry || "software engineering"}, I have built practical capability in ${skillsList} and focused on delivering high-quality, reliable technical execution.

${highlightSection}

Based on the role description for ${data.jobTitle}, I am confident that my technical skills in ${skillsList} align with your team requirements. I prioritize structured problem solving, practical ownership, and clear communication.

I would welcome the opportunity to discuss how my real background and project experience can contribute to ${data.companyName}. Thank you for your time and consideration.

Sincerely,

${name}
`.trim();
};

export async function generateCoverLetter(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        resume: true,
      },
    });

    if (!user) throw new Error("User not found");

    const parsedResume = parseResumeContent(user.resume?.content);
    const contact = parsedResume.structured?.contactInfo || {};

    const candidateName = user.name || "Candidate";
    const candidateEmail = contact.email || user.email || "";
    const candidatePhone = contact.mobile || "";
    const candidateLinkedin = contact.linkedin || "";

    const rawResumeText = getResumeMarkdown(user.resume?.content);

    const formattedWork = Array.isArray(parsedResume.structured?.experience) && parsedResume.structured.experience.length > 0
      ? parsedResume.structured.experience.map(e => `- ${e.jobTitle || e.title} at ${e.company || e.organization} (${e.startDate || ""} - ${e.current ? "Present" : e.endDate || ""}): ${e.description || ""}`).join("\n")
      : "No formal work experience entries listed.";

    const formattedEdu = Array.isArray(parsedResume.structured?.education) && parsedResume.structured.education.length > 0
      ? parsedResume.structured.education.map(e => `- ${e.degree || e.title} in ${e.fieldOfStudy || ""} at ${e.institution || e.organization}: ${e.description || ""}`).join("\n")
      : "No education entries listed.";

    const formattedProj = Array.isArray(parsedResume.structured?.projects) && parsedResume.structured.projects.length > 0
      ? parsedResume.structured.projects.map(p => `- ${p.projectName || p.title} (${p.technologies || ""}): ${p.description || ""}`).join("\n")
      : "No project entries listed.";

    const prompt = `
      You are an expert career coach and technical resume writer. Write a tailored, professional cover letter for the candidate applying to the position below.

      TARGET POSITION:
      - Company Name: ${data.companyName}
      - Job Title: ${data.jobTitle}
      - Target Job Description / Requirements:
      ${data.jobDescription}

      REAL VERIFIED CANDIDATE PROFILE & RESUME FACTS:
      - Full Name: ${candidateName}
      - Email: ${candidateEmail}
      - Phone: ${candidatePhone}
      - LinkedIn: ${candidateLinkedin}
      - Primary Industry: ${user.industry || "Technology"}
      - Years of Experience: ${user.experience || 0}
      - Bio: ${user.bio || "None"}
      - Listed Skills: ${user.skills?.join(", ") || parsedResume.structured?.skills || "Engineering"}
      - Work Experience Entries:
      ${formattedWork}
      - Education Entries:
      ${formattedEdu}
      - Technical Project Entries:
      ${formattedProj}

      FULL RESUME TEXT CONTEXT:
      ${rawResumeText}

      CRITICAL ACCURACY & GROUNDING INSTRUCTIONS:
      1. You MUST ONLY use real facts, roles, companies, projects, skills, education, and details provided in the candidate data above.
      2. ABSOLUTELY NO HALLUCINATIONS: Do NOT invent or fabricate any metric (e.g. NEVER claim "improved system latency by 20%" or "managed 15 engineers" unless explicitly stated in the candidate data).
      3. DO NOT invent false past employers, job titles, years of experience, or unmentioned technical accomplishments.
      4. Format the letter header using the candidate's REAL contact information (Name, Email, Phone, LinkedIn) provided above. DO NOT write placeholder tags like [Your Name], [Your Address], [Your Phone Number], [Your Email], [Your LinkedIn Profile], [Date]. Use real values. If a contact field is empty, omit that line cleanly.
      5. Keep the letter concise (max 380 words), persuasive, and grounded strictly in candidate truth.
      6. Use clean Markdown business letter formatting.
    `;

    const content = await safeGenerateAIContent({
      prompt,
      fallbackFn: () => buildCoverLetterTemplate({ user, resume: user.resume, data }),
      logTag: "Cover Letter AI",
    });

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      },
    });

    revalidatePath("/ai-cover-letter");
    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error?.message || error);
    throw new Error("Failed to generate cover letter. Your saved data is safe.");
  }
}

export async function updateCoverLetter({ id, content, companyName, jobTitle, jobDescription }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const updated = await db.coverLetter.updateMany({
    where: {
      id,
      userId: user.id,
    },
    data: {
      content,
      ...(companyName ? { companyName } : {}),
      ...(jobTitle ? { jobTitle } : {}),
      ...(jobDescription ? { jobDescription } : {}),
    },
  });

  revalidatePath("/ai-cover-letter");
  revalidatePath(`/ai-cover-letter/${id}`);

  return { success: true, count: updated.count };
}

export async function getCoverLetters() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function deleteCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const result = await db.coverLetter.deleteMany({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!result.count) {
    throw new Error("Cover letter not found");
  }

  revalidatePath("/ai-cover-letter");
  return { success: true };
}
