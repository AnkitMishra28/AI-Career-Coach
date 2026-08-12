/**
 * Converts Work Experience entries into clean, ATS-friendly markdown (NO EMOJIS)
 */
export function workExperienceToMarkdown(entries) {
  if (!entries?.length) return "";

  return (
    `## Work Experience\n\n` +
    entries
      .map((entry) => {
        const title = entry.jobTitle || entry.title || "Role";
        const company = entry.company || entry.organization || "Company";
        const location = entry.location ? ` | ${entry.location}` : "";
        const dateRange = entry.current
          ? `${entry.startDate || ""} - Present`
          : `${entry.startDate || ""} - ${entry.endDate || ""}`;

        let text = `### ${title} at ${company}${location}\n*${dateRange}*\n\n${entry.description || ""}`;
        return text;
      })
      .join("\n\n")
  );
}

/**
 * Converts Education entries into clean, ATS-friendly markdown (NO EMOJIS)
 */
export function educationToMarkdown(entries) {
  if (!entries?.length) return "";

  return (
    `## Education\n\n` +
    entries
      .map((entry) => {
        const degree = entry.degree || entry.title || "Degree";
        const field = entry.fieldOfStudy ? ` in ${entry.fieldOfStudy}` : "";
        const institution = entry.institution || entry.organization || "Institution";
        const dateRange = entry.current
          ? `${entry.startDate || ""} - Present`
          : `${entry.startDate || ""} - ${entry.endDate || ""}`;

        let text = `### ${degree}${field} - ${institution}\n*${dateRange}*`;
        if (entry.grade) text += `\nGrade / CGPA: ${entry.grade}`;
        if (entry.coursework) text += `\nRelevant Coursework: ${entry.coursework}`;
        if (entry.activities) text += `\nActivities / Achievements: ${entry.activities}`;
        if (entry.description) text += `\n\n${entry.description}`;

        return text;
      })
      .join("\n\n")
  );
}

/**
 * Converts Project entries into clean, ATS-friendly markdown (NO EMOJIS)
 */
export function projectsToMarkdown(entries) {
  if (!entries?.length) return "";

  return (
    `## Projects\n\n` +
    entries
      .map((entry) => {
        const name = entry.projectName || entry.title || "Project";
        const tech = entry.technologies ? ` (${entry.technologies})` : "";
        const links = [];
        if (entry.projectUrl) links.push(`[Live Demo](${entry.projectUrl})`);
        if (entry.githubUrl) links.push(`[GitHub](${entry.githubUrl})`);
        const linksStr = links.length > 0 ? `\nLinks: ${links.join(" | ")}` : "";

        let text = `### ${name}${tech}${linksStr}\n\n${entry.description || ""}`;
        if (entry.role) text += `\nRole: ${entry.role}`;
        if (entry.achievements) text += `\nKey Achievements: ${entry.achievements}`;

        return text;
      })
      .join("\n\n")
  );
}

/**
 * Generic section entry to markdown converter (Emoji-free)
 */
export function entriesToMarkdown(entries, type) {
  if (!entries?.length) return "";

  const typeLower = (type || "").toLowerCase();
  if (typeLower.includes("work") || typeLower.includes("experience")) {
    return workExperienceToMarkdown(entries);
  }
  if (typeLower.includes("education")) {
    return educationToMarkdown(entries);
  }
  if (typeLower.includes("project")) {
    return projectsToMarkdown(entries);
  }

  return (
    `## ${type}\n\n` +
    entries
      .map((entry) => {
        const title = entry.jobTitle || entry.degree || entry.projectName || entry.title || "Item";
        const org = entry.company || entry.institution || entry.organization || "";
        const header = org ? `### ${title} at ${org}` : `### ${title}`;
        const dateRange = entry.current
          ? `${entry.startDate || ""} - Present`
          : `${entry.startDate || ""} - ${entry.endDate || ""}`;

        return `${header}\n*${dateRange}*\n\n${entry.description || ""}`;
      })
      .join("\n\n")
  );
}

/**
 * Generates full markdown from structured resume object
 */
export function buildMarkdownFromStructured(data, userName = "Candidate") {
  if (!data) return "";
  const parts = [];

  // Contact line
  const contactParts = [];
  if (data.contactInfo?.email) contactParts.push(`Email: ${data.contactInfo.email}`);
  if (data.contactInfo?.mobile) contactParts.push(`Phone: ${data.contactInfo.mobile}`);
  if (data.contactInfo?.linkedin) contactParts.push(`LinkedIn: ${data.contactInfo.linkedin}`);
  if (data.contactInfo?.twitter) contactParts.push(`Twitter: ${data.contactInfo.twitter}`);

  const contactMd = contactParts.length > 0
    ? `# ${userName}\n\n${contactParts.join(" | ")}`
    : `# ${userName}`;

  parts.push(contactMd);

  if (data.summary && String(data.summary).trim()) {
    parts.push(`## Professional Summary\n\n${String(data.summary).trim()}`);
  }

  if (data.skills && String(data.skills).trim()) {
    parts.push(`## Technical Skills\n\n${String(data.skills).trim()}`);
  }

  if (Array.isArray(data.experience) && data.experience.length > 0) {
    parts.push(workExperienceToMarkdown(data.experience));
  }

  if (Array.isArray(data.education) && data.education.length > 0) {
    parts.push(educationToMarkdown(data.education));
  }

  if (Array.isArray(data.projects) && data.projects.length > 0) {
    parts.push(projectsToMarkdown(data.projects));
  }

  return parts.filter(Boolean).join("\n\n");
}

/**
 * Parses raw Markdown text into a structured resume object fallback
 */
export function parseMarkdownToStructured(markdownStr) {
  if (!markdownStr || typeof markdownStr !== "string") return null;

  const result = {
    contactInfo: { email: "", mobile: "", linkedin: "", twitter: "" },
    summary: "",
    skills: "",
    experience: [],
    education: [],
    projects: [],
  };

  // Robust contact extraction from Markdown text
  const emailMatch = markdownStr.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) result.contactInfo.email = emailMatch[1];

  const phoneMatch = markdownStr.match(/(?:Phone:\s*|\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+\d{10,12}/);
  if (phoneMatch && phoneMatch[0].trim()) {
    result.contactInfo.mobile = phoneMatch[0].replace(/^Phone:\s*/i, "").trim();
  }

  const linkedinMatch = markdownStr.match(/(https?:\/\/(?:www\.)?linkedin\.com\/in\/[^\s|)]+)/i);
  if (linkedinMatch) result.contactInfo.linkedin = linkedinMatch[1];

  const twitterMatch = markdownStr.match(/(https?:\/\/(?:www\.)?(?:twitter|x)\.com\/[^\s|)]+)/i);
  if (twitterMatch) result.contactInfo.twitter = twitterMatch[1];

  const lines = markdownStr.split("\n");
  let currentSection = "";
  let currentLines = [];

  const processSection = () => {
    const text = currentLines.join("\n").trim();
    if (!text) return;
    const secLower = currentSection.toLowerCase();

    if (secLower.includes("summary") || secLower.includes("profile")) {
      result.summary = text;
    } else if (secLower.includes("skill")) {
      result.skills = text;
    } else if (secLower.includes("work") || secLower.includes("experience") || secLower.includes("employment")) {
      const entries = text.split(/^###\s+/m).filter(Boolean);
      result.experience = entries.map((entryText) => {
        const entryLines = entryText.split("\n");
        const header = entryLines[0].trim();
        const bodyLines = entryLines.slice(1).join("\n").trim();

        let title = header;
        let company = "";
        let location = "";

        if (header.includes(" at ")) {
          const parts = header.split(" at ");
          title = parts[0].trim();
          company = parts[1].trim();
        }
        if (company.includes(" | ")) {
          const cParts = company.split(" | ");
          company = cParts[0].trim();
          location = cParts[1].trim();
        }

        let startDate = "";
        let endDate = "";
        let current = false;
        let description = bodyLines;

        const dateMatch = bodyLines.match(/^\*([^*]+)\*\s*\n?/);
        if (dateMatch) {
          const dStr = dateMatch[1].trim();
          description = bodyLines.replace(/^\*([^*]+)\*\s*\n?/, "").trim();
          if (dStr.includes("-")) {
            const dParts = dStr.split("-");
            startDate = dParts[0].trim();
            const end = dParts[1].trim();
            if (end.toLowerCase() === "present") current = true;
            else endDate = end;
          }
        }

        return { jobTitle: title, company, location, startDate, endDate, current, description };
      });
    } else if (secLower.includes("education") || secLower.includes("academic")) {
      const entries = text.split(/^###\s+/m).filter(Boolean);
      result.education = entries.map((entryText) => {
        const entryLines = entryText.split("\n");
        const header = entryLines[0].trim();
        const bodyLines = entryLines.slice(1).join("\n").trim();

        let degree = header;
        let fieldOfStudy = "";
        let institution = "";

        if (header.includes(" - ")) {
          const parts = header.split(" - ");
          degree = parts[0].trim();
          institution = parts[1].trim();
        }
        if (degree.includes(" in ")) {
          const dParts = degree.split(" in ");
          degree = dParts[0].trim();
          fieldOfStudy = dParts[1].trim();
        }

        let startDate = "";
        let endDate = "";
        let current = false;
        let grade = "";
        let coursework = "";
        let activities = "";

        const cleanBodyLines = [];
        bodyLines.split("\n").forEach((line) => {
          const lTrim = line.trim();
          if (lTrim.startsWith("*") && lTrim.endsWith("*")) {
            const dStr = lTrim.replace(/^\*|\*$/g, "").trim();
            if (dStr.includes("-")) {
              const dParts = dStr.split("-");
              startDate = dParts[0].trim();
              const end = dParts[1].trim();
              if (end.toLowerCase() === "present") current = true;
              else endDate = end;
            }
          } else if (lTrim.toLowerCase().startsWith("grade / cgpa:")) {
            grade = lTrim.replace(/^grade \/ cgpa:\s*/i, "").trim();
          } else if (lTrim.toLowerCase().startsWith("relevant coursework:")) {
            coursework = lTrim.replace(/^relevant coursework:\s*/i, "").trim();
          } else if (
            lTrim.toLowerCase().startsWith("activities / achievements:") ||
            lTrim.toLowerCase().startsWith("activities & honors:")
          ) {
            activities = lTrim.replace(/^activities (?:(?:\/ achievements)|(?:& honors)):\s*/i, "").trim();
          } else {
            cleanBodyLines.push(line);
          }
        });

        return {
          degree,
          fieldOfStudy,
          institution,
          startDate,
          endDate,
          current,
          grade,
          coursework,
          activities,
          description: cleanBodyLines.join("\n").trim(),
        };
      });
    } else if (secLower.includes("project")) {
      const entries = text.split(/^###\s+/m).filter(Boolean);
      result.projects = entries.map((entryText) => {
        const entryLines = entryText.split("\n");
        const header = entryLines[0].trim();
        const bodyLines = entryLines.slice(1).join("\n").trim();

        let projectName = header;
        let technologies = "";
        if (header.includes("(")) {
          const match = header.match(/^(.*?)\s*\((.*?)\)$/);
          if (match) {
            projectName = match[1].trim();
            technologies = match[2].trim();
          }
        }

        let projectUrl = "";
        let githubUrl = "";
        const cleanBodyLines = [];

        bodyLines.split("\n").forEach((line) => {
          const lTrim = line.trim();
          if (lTrim.toLowerCase().startsWith("links:")) {
            if (lTrim.includes("[Live Demo]")) {
              const m = lTrim.match(/\[Live Demo\]\((.*?)\)/);
              if (m) projectUrl = m[1].trim();
            }
            if (lTrim.includes("[GitHub]")) {
              const m = lTrim.match(/\[GitHub\]\((.*?)\)/);
              if (m) githubUrl = m[1].trim();
            }
          } else {
            cleanBodyLines.push(line);
          }
        });

        return {
          projectName,
          technologies,
          projectUrl,
          githubUrl,
          description: cleanBodyLines.join("\n").trim(),
        };
      });
    }

    currentLines = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("# ")) {
      // Header line
    } else if (trimmed.startsWith("## ")) {
      processSection();
      currentSection = trimmed.replace(/^##\s*/, "");
    } else if (currentSection) {
      currentLines.push(line);
    }
  });
  processSection();

  return result;
}

/**
 * Parses content from DB (which can be a JSON string or raw Markdown)
 */
export function parseResumeContent(contentStr) {
  if (!contentStr || typeof contentStr !== "string") {
    return { markdown: "", structured: null };
  }
  const trimmed = contentStr.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === "object") {
        const markdown = parsed.markdown || buildMarkdownFromStructured(parsed);
        return { markdown, structured: parsed };
      }
    } catch (e) {
      // Fallthrough to raw markdown parsing
    }
  }
  const structuredFromMd = parseMarkdownToStructured(contentStr);
  return { markdown: contentStr, structured: structuredFromMd };
}

/**
 * Serializes structured resume data into JSON for DB storage
 */
export function stringifyResumeData(structuredData, markdown) {
  return JSON.stringify({
    ...structuredData,
    markdown: markdown || "",
  });
}

/**
 * Helper to safely extract markdown from any resume content format
 */
export function getResumeMarkdown(contentStr) {
  const { markdown, structured } = parseResumeContent(contentStr);
  if (markdown && markdown.trim()) return markdown;
  if (structured) return buildMarkdownFromStructured(structured);
  return contentStr || "";
}

/**
 * Sanitizes and cleans structured resume data for professional ATS rendering.
 * Pure Read-Only Function: Deep clones input and never mutates original resume state.
 */
export function sanitizeAndCleanResumeData(data) {
  if (!data || typeof data !== "object") return null;

  // Immutable Deep Clone to prevent mutating form state
  const clone = typeof structuredClone === "function"
    ? structuredClone(data)
    : JSON.parse(JSON.stringify(data));

  const sanitizeString = (str) => {
    if (!str || typeof str !== "string") return "";
    let s = str;
    // Remove explicit placeholder patterns like [Year], [X%], [Your Name], [Your Phone], [Your Email], [Your Address], [Date]
    s = s.replace(/\[(?:Year|X%|Your Name|Your Phone|Your Email|Your Address|Date|Company|Job Title)\]/gi, "");
    // Remove orphaned "Expected Graduation:" if trailing
    s = s.replace(/Expected Graduation:\s*$/gi, "");
    return s.trim();
  };

  const cleanContact = {
    email: sanitizeString(clone.contactInfo?.email),
    mobile: sanitizeString(clone.contactInfo?.mobile),
    linkedin: sanitizeString(clone.contactInfo?.linkedin),
    twitter: sanitizeString(clone.contactInfo?.twitter),
  };

  const cleanSummary = sanitizeString(clone.summary);
  const cleanSkills = sanitizeString(clone.skills);

  const cleanExperience = Array.isArray(clone.experience)
    ? clone.experience.map((item) => {
        let desc = sanitizeString(item.description);
        const title = sanitizeString(item.jobTitle || item.title);
        const company = sanitizeString(item.company || item.organization);
        if (title && desc.toLowerCase().startsWith(title.toLowerCase())) {
          desc = desc.replace(new RegExp(`^${title.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\s*(?:at|@|-)?\\s*${company.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}?`, "i"), "").trim();
        }
        return {
          ...item,
          jobTitle: title,
          company: company,
          location: sanitizeString(item.location),
          startDate: sanitizeString(item.startDate),
          endDate: item.current ? "" : sanitizeString(item.endDate),
          current: Boolean(item.current),
          description: desc,
        };
      })
    : [];

  const cleanEducation = Array.isArray(clone.education)
    ? clone.education.map((item) => {
        const degree = sanitizeString(item.degree || item.title);
        const institution = sanitizeString(item.institution || item.organization);
        const fieldOfStudy = sanitizeString(item.fieldOfStudy);
        const grade = sanitizeString(item.grade);
        const coursework = sanitizeString(item.coursework);
        const activities = sanitizeString(item.activities);
        let desc = sanitizeString(item.description);

        // Crucial: Strip redundant lines in description that repeat degree, institution, coursework, or Expected Graduation: [Year]
        if (desc) {
          const lines = desc.split("\n").filter((line) => {
            const trimmed = line.replace(/^[-*•]\s*/, "").trim();
            if (!trimmed) return false;
            if (trimmed.includes("[Year]") || trimmed.toLowerCase().includes("expected graduation")) return false;
            if (degree && trimmed.toLowerCase().includes(degree.toLowerCase())) return false;
            if (institution && trimmed.toLowerCase().includes(institution.toLowerCase())) return false;
            if (coursework && trimmed.toLowerCase().includes(coursework.toLowerCase())) return false;
            if (activities && trimmed.toLowerCase().includes(activities.toLowerCase())) return false;
            return true;
          });
          desc = lines.join("\n").trim();
        }

        return {
          ...item,
          degree,
          institution,
          fieldOfStudy,
          grade,
          coursework,
          activities,
          startDate: sanitizeString(item.startDate),
          endDate: item.current ? "" : sanitizeString(item.endDate),
          current: Boolean(item.current),
          description: desc,
        };
      })
    : [];

  const cleanProjects = Array.isArray(clone.projects)
    ? clone.projects.map((item) => {
        const projectName = sanitizeString(item.projectName || item.title);
        const technologies = sanitizeString(item.technologies);
        const role = sanitizeString(item.role);
        const achievements = sanitizeString(item.achievements);
        let desc = sanitizeString(item.description);

        desc = desc.replace(/^Technical Implementation:\s*/gi, "");
        desc = desc.replace(/^Outcome:\s*/gi, "");
        desc = desc.replace(/^Role:\s*/gi, "");

        return {
          ...item,
          projectName,
          technologies,
          role,
          achievements,
          projectUrl: sanitizeString(item.projectUrl),
          githubUrl: sanitizeString(item.githubUrl),
          description: desc,
        };
      })
    : [];

  return {
    contactInfo: cleanContact,
    summary: cleanSummary,
    skills: cleanSkills,
    experience: cleanExperience,
    education: cleanEducation,
    projects: cleanProjects,
  };
}
