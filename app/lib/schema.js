import { z } from "zod";

export const onboardingSchema = z.object({
  industry: z.string({
    required_error: "Please select an industry",
  }),
  subIndustry: z.string({
    required_error: "Please select a specialization",
  }),
  bio: z.string().max(500).optional(),
  experience: z.coerce
    .number({
      invalid_type_error: "Experience must be a valid number",
    })
    .int("Experience must be a whole number")
    .min(0, "Experience must be at least 0 years")
    .max(50, "Experience cannot exceed 50 years"),
  skills: z.string().transform((val) =>
    val
      ? val
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : []
  ),
});

export const contactSchema = z.object({
  email: z.string().email("Invalid email address"),
  mobile: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
});

export const workExperienceSchema = z
  .object({
    jobTitle: z.string().min(1, "Job title is required"),
    company: z.string().min(1, "Company is required"),
    location: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    description: z.string().min(1, "Responsibilities / Achievements are required"),
  })
  .refine(
    (data) => data.current || Boolean(data.endDate),
    {
      message: "End date is required unless this is your current position",
      path: ["endDate"],
    }
  );

export const educationSchema = z
  .object({
    degree: z.string().min(1, "Degree is required"),
    fieldOfStudy: z.string().min(1, "Field of study / Specialization is required"),
    institution: z.string().min(1, "Institution / College / University is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    grade: z.string().optional(),
    coursework: z.string().optional(),
    activities: z.string().optional(),
    description: z.string().optional(),
  })
  .refine(
    (data) => data.current || Boolean(data.endDate),
    {
      message: "End date is required unless currently studying",
      path: ["endDate"],
    }
  );

export const projectSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  technologies: z.string().min(1, "Technologies / Skills are required"),
  role: z.string().optional(),
  achievements: z.string().optional(),
  projectUrl: z.string().optional(),
  githubUrl: z.string().optional(),
});

// Backward-compatible generic entry schema fallback
export const entrySchema = z.object({
  title: z.string().optional(),
  organization: z.string().optional(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  degree: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  institution: z.string().optional(),
  projectName: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  current: z.boolean().optional(),
});

export const resumeSchema = z.object({
  contactInfo: contactSchema,
  summary: z.string().min(1, "Professional summary is required"),
  skills: z.string().min(1, "Skills are required"),
  experience: z.array(workExperienceSchema).or(z.array(entrySchema)),
  education: z.array(educationSchema).or(z.array(entrySchema)),
  projects: z.array(projectSchema).or(z.array(entrySchema)),
});

export const coverLetterSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z.string().min(1, "Job description is required"),
});
