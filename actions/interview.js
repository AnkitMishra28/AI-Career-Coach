"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { safeGenerateJSON, safeGenerateAIContent } from "@/lib/gemini";

const normalizeIndustryLabel = (industry) =>
  String(industry || "Software Engineering")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const CATEGORY_TEMPLATE_QUIZZES = {
  Technical: [
    {
      question: "Which data structure provides average O(1) time complexity for lookup operations?",
      options: ["Binary Search Tree", "Hash Table", "LinkedList", "Array (Unsorted)"],
      correctAnswer: "Hash Table",
      explanation: "Hash tables compute array indices using a hash function, providing O(1) average lookup performance.",
    },
    {
      question: "In React, what is the primary purpose of keys in rendered list elements?",
      options: [
        "To style individual list items",
        "To help React identify which items have changed, added, or removed during re-renders",
        "To bind event handlers automatically",
        "To convert array indices into string IDs",
      ],
      correctAnswer: "To help React identify which items have changed, added, or removed during re-renders",
      explanation: "Keys provide stable identities for React elements so reconciliation can re-order nodes efficiently instead of re-creating the entire DOM tree.",
    },
    {
      question: "What is the primary advantage of using a PostgreSQL B-Tree index on a frequently queried column?",
      options: [
        "Eliminates disk storage requirements",
        "Reduces query time complexity from O(N) full table scan to O(log N)",
        "Guarantees automatic data encryption",
        "Prevents SQL injection vulnerabilities",
      ],
      correctAnswer: "Reduces query time complexity from O(N) full table scan to O(log N)",
      explanation: "B-Tree indexes sort column values into a balanced tree, enabling logarithmic lookup instead of scanning every row.",
    },
    {
      question: "Which HTTP status code should a REST API return when a client sends invalid JSON payload data?",
      options: ["400 Bad Request", "401 Unauthorized", "404 Not Found", "500 Internal Server Error"],
      correctAnswer: "400 Bad Request",
      explanation: "400 Bad Request indicates that the server cannot process the request due to malformed syntax or client payload validation errors.",
    },
    {
      question: "What handles asynchronous I/O operations non-blockingly in Node.js?",
      options: ["V8 Garbage Collector", "libuv Event Loop and Thread Pool", "CSS Parsing Engine", "Single-threaded CPU Cache"],
      correctAnswer: "libuv Event Loop and Thread Pool",
      explanation: "libuv provides Node.js with its event-driven non-blocking I/O model and underlying thread pool for filesystem and network tasks.",
    },
    {
      question: "What is the main benefit of immutable data patterns in state management?",
      options: [
        "Reduces memory allocation to zero",
        "Simplifies change detection and prevents unintended side-effect mutations",
        "Speeds up network transfer rates",
        "Bypasses JavaScript type checking",
      ],
      correctAnswer: "Simplifies change detection and prevents unintended side-effect mutations",
      explanation: "Immutability allows shallow reference equality comparisons (oldState !== newState), making state tracking fast and predictable.",
    },
    {
      question: "Which technique prevents SQL injection in web applications?",
      options: [
        "Concatenating user inputs into raw SQL strings",
        "Using parameterized queries / prepared statements with ORM bindings",
        "Disabling database indexes",
        "Using HTTP POST instead of GET",
      ],
      correctAnswer: "Using parameterized queries / prepared statements with ORM bindings",
      explanation: "Parameterized queries separate SQL code from user-supplied data parameters, preventing executable injection payload execution.",
    },
    {
      question: "What does the 'A' in ACID database transactions stand for?",
      options: ["Availability", "Atomicity", "Abstraction", "Aggregation"],
      correctAnswer: "Atomicity",
      explanation: "Atomicity guarantees that all operations within a database transaction complete successfully, or all changes are completely rolled back.",
    },
    {
      question: "When should you implement Redis caching in a web backend?",
      options: [
        "For storing non-volatile primary database tables permanently",
        "For frequently accessed, slow-changing queries to reduce main DB load and latency",
        "To replace standard TLS/SSL encryption",
        "To compile frontend JavaScript assets",
      ],
      correctAnswer: "For frequently accessed, slow-changing queries to reduce main DB load and latency",
      explanation: "In-memory caching with Redis serves hot data in sub-milliseconds, protecting relational databases under heavy traffic.",
    },
    {
      question: "What is the primary role of Docker containers in modern software deployment?",
      options: [
        "To write application code automatically",
        "To package application code and dependencies into a lightweight, portable runtime environment",
        "To replace unit testing frameworks",
        "To increase file download speeds for end users",
      ],
      correctAnswer: "To package application code and dependencies into a lightweight, portable runtime environment",
      explanation: "Containerization ensures environment consistency across local development, staging, and production clusters.",
    },
  ],
  "System Design": [
    {
      question: "In distributed system design, what does CAP theorem state about network partitions?",
      options: [
        "A system can provide Consistency, Availability, and Partition Tolerance simultaneously at all times",
        "When a network partition occurs, a system must choose between Consistency (CP) and Availability (AP)",
        "Latency is always reduced to zero during partitions",
        "Relational databases cannot suffer from partitions",
      ],
      correctAnswer: "When a network partition occurs, a system must choose between Consistency (CP) and Availability (AP)",
      explanation: "CAP theorem proves that under network network partitions (P), a distributed system cannot guarantee both immediate consistency (C) and 100% availability (A).",
    },
    {
      question: "Which component distributes incoming HTTP traffic evenly across a cluster of backend microservices?",
      options: ["Database Reader Replica", "Layer 7 Load Balancer", "DNS Name Server", "Message Queue Consumer"],
      correctAnswer: "Layer 7 Load Balancer",
      explanation: "Layer 7 load balancers (e.g. NGINX, HAProxy, AWS ALB) route HTTP requests based on URL, headers, and node health metrics.",
    },
    {
      question: "What design pattern is commonly used to prevent cascading failures when a downstream microservice is failing?",
      options: ["Circuit Breaker", "Singleton", "Factory Method", "Observer"],
      correctAnswer: "Circuit Breaker",
      explanation: "Circuit breakers intercept calls to failing services, returning fast fallbacks and preventing worker thread exhaustion across upstream services.",
    },
    {
      question: "Why are distributed message queues (e.g. Kafka, RabbitMQ) used in event-driven architectures?",
      options: [
        "To encrypt user passwords in transit",
        "To decouple producers and consumers, enabling asynchronous background processing and load smoothing",
        "To replace frontend client routing",
        "To automatically generate database schemas",
      ],
      correctAnswer: "To decouple producers and consumers, enabling asynchronous background processing and load smoothing",
      explanation: "Message queues allow systems to absorb high traffic spikes asynchronously without blocking client HTTP request threads.",
    },
    {
      question: "Which caching strategy updates the cache and database synchronously during write operations?",
      options: ["Cache-Aside", "Write-Through", "Write-Behind", "Read-Through"],
      correctAnswer: "Write-Through",
      explanation: "In Write-Through caching, the application writes data to the cache, which synchronously updates the underlying database before returning success.",
    },
    {
      question: "What is database horizontal sharding?",
      options: [
        "Adding more CPU and RAM to a single database server",
        "Partitioning a large dataset across multiple database instances based on a shard key",
        "Creating read-only replicas in a single data center",
        "Backing up database tables to cold S3 storage nightly",
      ],
      correctAnswer: "Partitioning a large dataset across multiple database instances based on a shard key",
      explanation: "Sharding distributes rows across independent database servers, allowing write throughput and storage to scale horizontally.",
    },
    {
      question: "How does Consistent Hashing benefit distributed cache clusters during node additions or removals?",
      options: [
        "It re-hashes 100% of all keys to new nodes",
        "It minimizes key redistribution, remapping only K/N keys on average when a node joins or leaves",
        "It forces all traffic to route through a single master node",
        "It eliminates the need for cache expiration TTLs",
      ],
      correctAnswer: "It minimizes key redistribution, remapping only K/N keys on average when a node joins or leaves",
      explanation: "Consistent Hashing maps both keys and servers to a virtual ring, preventing massive cache misses during cluster scaling.",
    },
    {
      question: "What is the primary role of a CDN (Content Delivery Network)?",
      options: [
        "To execute heavy database SQL queries",
        "To cache static assets (images, JS, CSS) at edge locations close to global users, reducing latency and origin server load",
        "To store private user passwords",
        "To compile backend microservice code",
      ],
      correctAnswer: "To cache static assets (images, JS, CSS) at edge locations close to global users, reducing latency and origin server load",
      explanation: "CDNs serve content from edge nodes near the user, drastically lowering network latency (TTFB).",
    },
    {
      question: "In microservices, what problem does the Saga Pattern solve?",
      options: [
        "Managing distributed transactions across multiple microservice databases without 2-phase commit locking",
        "Compiling TypeScript code into WebAssembly",
        "Routing static CSS assets",
        "Formatting JSON log outputs",
      ],
      correctAnswer: "Managing distributed transactions across multiple microservice databases without 2-phase commit locking",
      explanation: "Sagas coordinate a sequence of local transactions with compensating rollback transactions if any step fails.",
    },
    {
      question: "Which database type is best suited for social network connections and recommendation relationships?",
      options: ["Time-series Database", "Graph Database (e.g. Neo4j)", "Key-Value Store", "Document Store"],
      correctAnswer: "Graph Database (e.g. Neo4j)",
      explanation: "Graph databases model entities as nodes and relationships as edges, allowing multi-hop relationship traversals without expensive SQL JOINs.",
    },
  ],
  Behavioral: [
    {
      question: "When faced with tight deadlines and scope creep on a critical feature, what is the most effective approach?",
      options: [
        "Work 80-hour weeks silently without informing anyone",
        "Proactively communicate trade-offs to product management and negotiate MVP scope slicing",
        "Cut automated testing and code reviews completely",
        "Deliver half-finished broken code on the deadline date",
      ],
      correctAnswer: "Proactively communicate trade-offs to product management and negotiate MVP scope slicing",
      explanation: "Transparent trade-off discussion enables leadership to make informed prioritization decisions while maintaining quality standards.",
    },
    {
      question: "How should a senior engineer handle a critical production outage caused by a peer's recent code deployment?",
      options: [
        "Focus on immediate mitigation/rollback first, followed by a blameless post-mortem to fix systemic gaps",
        "Blame the author publicly in team chat",
        "Hide the incident so management doesn't notice",
        "Disable deployment pipelines permanently",
      ],
      correctAnswer: "Focus on immediate mitigation/rollback first, followed by a blameless post-mortem to fix systemic gaps",
      explanation: "Blameless post-mortems foster psychological safety and focus engineering efforts on preventing failure recurrence.",
    },
    {
      question: "During a technical design review, a colleague strongly disagrees with your chosen architecture. What is the best response?",
      options: [
        "Reject their feedback immediately to protect your proposal",
        "Listen actively, clarify constraints, evaluate both approaches against objective metrics, and seek consensus",
        "Escalate to executive leadership immediately",
        "Withdraw from the project entirely",
      ],
      correctAnswer: "Listen actively, clarify constraints, evaluate both approaches against objective metrics, and seek consensus",
      explanation: "Evaluating technical options against objective criteria (latency, scalability, maintenance cost) yields better architectural decisions.",
    },
    {
      question: "What demonstrates strong technical ownership when you discover an unassigned bug in a production service?",
      options: [
        "Ignore it because it is not assigned to your current sprint ticket",
        "Investigate the root cause, log an issue with diagnostic context, and propose or implement a fix",
        "Reassign the ticket to a junior developer without context",
        "Delete the error log",
      ],
      correctAnswer: "Investigate the root cause, log an issue with diagnostic context, and propose or implement a fix",
      explanation: "Ownership means taking responsibility for product quality and system health beyond immediate task boundaries.",
    },
    {
      question: "How do you handle a situation where a requirement provided by product managers is technically infeasible or risky?",
      options: [
        "Implement it anyway and let it fail in production",
        "Explain the technical risks and trade-offs clearly, and propose alternative technical approaches that meet business goals",
        "Refuse to work on the feature without explanation",
        "Delegate the task to another team member",
      ],
      correctAnswer: "Explain the technical risks and trade-offs clearly, and propose alternative technical approaches that meet business goals",
      explanation: "Collaborative problem-solving helps non-technical stakeholders achieve business goals safely.",
    },
    {
      question: "What is the STAR method used for in behavioral interview responses?",
      options: [
        "Situation, Task, Action, Result — a framework for structuring clear, concise accomplishments",
        "System, Technology, Architecture, Reliability — a database benchmarking tool",
        "Software Testing And Release — a CI/CD pipeline stage",
        "Strategy, Tactics, Alignment, Revenue — a product management matrix",
      ],
      correctAnswer: "Situation, Task, Action, Result — a framework for structuring clear, concise accomplishments",
      explanation: "STAR provides a clear structure: setting the context (S/T), describing your specific contribution (A), and highlighting quantitative outcomes (R).",
    },
    {
      question: "How should an engineer approach mentoring a junior developer who is struggling with autonomous problem solving?",
      options: [
        "Write all the code for them to speed up sprint velocity",
        "Guide them through debugging techniques, ask leading questions, and encourage independent problem decomposition",
        "Tell them to figure it out without any assistance",
        "Re-assign their tasks to senior engineers permanently",
      ],
      correctAnswer: "Guide them through debugging techniques, ask leading questions, and encourage independent problem decomposition",
      explanation: "Effective mentorship builds problem-solving skills rather than creating dependency.",
    },
    {
      question: "When delivering constructive feedback during peer code reviews, what principles should be followed?",
      options: [
        "Focus on the code rather than the person, provide clear rationale for suggestions, and highlight good work",
        "Approve all pull requests instantly without reading the diff",
        "Insist on personal stylistic preferences regardless of linter standards",
        "Use harsh critical language to enforce standards",
      ],
      correctAnswer: "Focus on the code rather than the person, provide clear rationale for suggestions, and highlight good work",
      explanation: "Objectivity, clarity, and respect improve code quality while building positive team engineering culture.",
    },
    {
      question: "How should an engineer handle unexpected technical debt accumulated during a rapid MVP release?",
      options: [
        "Ignore technical debt forever",
        "Catalog high-risk debt items, quantify their impact on team velocity/reliability, and schedule dedicated refactoring cycles",
        "Re-write the entire codebase from scratch without product alignment",
        "Blame early developers for past speed trade-offs",
      ],
      correctAnswer: "Catalog high-risk debt items, quantify their impact on team velocity/reliability, and schedule dedicated refactoring cycles",
      explanation: "Managing technical debt requires quantifying risk and business impact to prioritize refactoring effectively.",
    },
    {
      question: "What is the most effective way to communicate complex technical system status to non-technical executive leadership?",
      options: [
        "Use dense implementation details and un-translated code stack trace snippets",
        "Focus on business impact, customer experience, key metrics, and strategic recommendations in clear language",
        "Avoid reporting until project completion",
        "Send long raw log files",
      ],
      correctAnswer: "Focus on business impact, customer experience, key metrics, and strategic recommendations in clear language",
      explanation: "Executive communication succeeds by bridging technical execution to business outcomes, customer impact, and timeline risk.",
    },
  ],
};

export async function generateQuiz(category = "Technical") {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  const normalizedCategory = ["Technical", "System Design", "Behavioral"].includes(category)
    ? category
    : "Technical";

  const prompt = `
    Generate 10 ${normalizedCategory} multiple choice questions for a ${user.industry || "Software Engineering"} candidate.
    ${user.skills?.length ? `Candidate Skill Stack: ${user.skills.join(", ")}.` : ""}

    Requirements by category:
    - Technical: programming concepts, data structures, algorithms, frameworks, databases, debugging, APIs.
    - System Design: scalability, microservices, load balancing, caching, databases, sharding, system trade-offs.
    - Behavioral: engineering leadership, teamwork, conflict resolution, technical trade-offs, STAR scenario responses.

    Return response in ONLY this JSON format:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "exact matching option string",
          "explanation": "string"
        }
      ]
    }
  `;

  const fallbackQuiz = { questions: CATEGORY_TEMPLATE_QUIZZES[normalizedCategory] || CATEGORY_TEMPLATE_QUIZZES.Technical };
  const quiz = await safeGenerateJSON({
    prompt,
    fallbackData: fallbackQuiz,
    logTag: `Quiz Generation (${normalizedCategory})`,
  });

  const questions = Array.isArray(quiz?.questions) ? quiz.questions : fallbackQuiz.questions;
  return questions.slice(0, 10);
}

export async function saveQuizResult(questions, answers, score, category = "Technical") {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `
      The user got the following ${category} questions wrong:
      ${wrongQuestionsText}

      Provide a 2-sentence specific improvement tip focusing on knowledge gaps.
    `;

    const defaultTip = `Focus on ${category} concepts, review core architecture trade-offs, and practice scenario-based problem solving.`;
    improvementTip = await safeGenerateAIContent({
      prompt: improvementPrompt,
      fallbackFn: () => defaultTip,
      logTag: "Quiz Improvement Tip",
    });
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: category,
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}

const CONVERSATIONAL_TEMPLATE_QUESTIONS = {
  Technical: [
    "Explain how React's virtual DOM diffing algorithm works, and how keys optimize re-renders in large list components.",
    "In database selection, how do ACID transaction guarantees influence your choice between PostgreSQL and DynamoDB for core business entities?",
    "What strategies would you use to diagnose and resolve a memory leak or CPU spike in a Node.js service running in production?",
    "Describe the trade-offs between REST APIs and GraphQL when designing endpoints for low-bandwidth mobile clients.",
    "How do you ensure idempotency and prevent double-processing when receiving webhook notifications from an external payment gateway?"
  ],
  "System Design": [
    "Design a high-throughput notification service that delivers 10M push and email alerts per minute without overloading downstream providers.",
    "How would you design a distributed rate limiter enforcing per-user quotas across 50 API nodes with microsecond latency?",
    "Explain how you would architect a read-heavy newsfeed system serving 10M daily active users using Redis caching and read replicas.",
    "What database sharding strategy would you choose for a multi-tenant SaaS platform scaling past 50TB of data?",
    "Describe how distributed consensus algorithms (like Raft) maintain log consistency and handle leader election during network partitions."
  ],
  Behavioral: [
    "Tell me about a time you had a technical disagreement with a team architect. How did you resolve it and align on the architecture?",
    "Describe a project or release that missed its target launch date. What were the root causes, and what systemic changes did you implement?",
    "How do you balance shipping a high-priority business feature quickly versus refactoring technical debt?",
    "Give an example of taking end-to-end ownership when a production issue occurred outside your immediate team's codebase.",
    "How do you mentor junior developers to help them develop autonomous technical decision-making and ownership?"
  ]
};

export async function generateConversationalQuestions(category = "Technical") {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { industry: true, skills: true },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Generate 5 open-ended, scenario-based ${category} interview questions for a ${user.industry} engineer.
    Target Skills: ${user.skills?.join(", ") || "software engineering"}.

    Return ONLY a JSON array of 5 strings:
    ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]
  `;

  const fallbackQuestions = CONVERSATIONAL_TEMPLATE_QUESTIONS[category] || CONVERSATIONAL_TEMPLATE_QUESTIONS.Technical;
  const questions = await safeGenerateJSON({
    prompt,
    fallbackData: fallbackQuestions,
    logTag: `Conversational Questions (${category})`,
  });

  return Array.isArray(questions) && questions.length > 0 ? questions.slice(0, 5) : fallbackQuestions;
}

function buildFallbackEvaluation(question, userAnswer) {
  const wordCount = userAnswer ? userAnswer.trim().split(/\s+/).length : 0;
  const score = Math.min(95, Math.max(50, Math.round(wordCount * 1.2 + 45)));
  const accuracy = Math.min(95, Math.max(55, score + 4));
  const depth = Math.min(95, Math.max(45, score - 3));
  const comms = Math.min(98, Math.max(60, score + 5));

  return {
    score,
    technicalAccuracy: accuracy,
    depth,
    communication: comms,
    strengths: [
      "Addressed the core question prompt clearly",
      "Demonstrated relevant domain terminology and structured thinking"
    ],
    missingPoints: [
      "Could elaborate more on explicit edge-case handling and latency metrics",
      "Consider stating trade-offs between speed vs memory consumption"
    ],
    improvement: "Walk through architectural trade-offs explicitly and quantify impact with numbers.",
    idealApproach: "State constraints upfront, describe high-level design, detail key algorithms, and mention failure recovery strategies."
  };
}

export async function evaluateInterviewAnswer({ category, question, userAnswer }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { industry: true },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    You are a Senior Principal Engineer evaluating a candidate's answer for a ${category} interview.

    Question: "${question}"
    Candidate's Answer: "${userAnswer}"

    Evaluate the answer and return ONLY a JSON object with this exact schema:
    {
      "score": number (0-100),
      "technicalAccuracy": number (0-100),
      "depth": number (0-100),
      "communication": number (0-100),
      "strengths": ["string"],
      "missingPoints": ["string"],
      "improvement": "string",
      "idealApproach": "string"
    }
  `;

  const fallbackEvaluation = buildFallbackEvaluation(question, userAnswer);
  return await safeGenerateJSON({
    prompt,
    fallbackData: fallbackEvaluation,
    logTag: `Evaluate Answer (${category})`,
  });
}

export async function saveConversationalInterviewResult({ category, evaluations, overallScore }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const questionResults = evaluations.map((item) => ({
    question: item.question,
    userAnswer: item.userAnswer,
    score: item.evaluation.score,
    technicalAccuracy: item.evaluation.technicalAccuracy,
    depth: item.evaluation.depth,
    communication: item.evaluation.communication,
    strengths: item.evaluation.strengths,
    missingPoints: item.evaluation.missingPoints,
    improvement: item.evaluation.improvement,
    idealApproach: item.evaluation.idealApproach,
    isCorrect: item.evaluation.score >= 70,
  }));

  const topImprovement = evaluations.find((e) => e.evaluation.improvement)?.evaluation.improvement ||
    "Practice stating architecture constraints and trade-offs upfront.";

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: overallScore,
        questions: questionResults,
        category: `AI ${category} Mock`,
        improvementTip: topImprovement,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving conversational interview result:", error);
    throw new Error("Failed to save interview result");
  }
}
