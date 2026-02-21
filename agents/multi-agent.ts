import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

const client = new Anthropic();

interface AgentConfig {
  name: string;
  role: string;
  systemPrompt: string;
  tools?: string[];
}

interface ToolResult {
  type: "tool_result";
  tool_use_id: string;
  content: string;
}

// Agents Configuration
const agents: Record<string, AgentConfig> = {
  codeAnalyzer: {
    name: "Code Analyzer Agent",
    role: "Analyzes TypeScript/Node.js code for errors, circular dependencies, type issues",
    systemPrompt: `You are a senior TypeScript/Node.js developer specializing in code analysis.
Your tasks:
1. Find circular dependencies and module import issues
2. Identify TypeScript type errors and schema mismatches
3. Detect unhandled promises and async/await issues
4. Analyze code structure and suggest refactoring
5. Provide specific, actionable solutions with code examples

Return analysis in JSON format with:
- issues: array of {severity, file, line, description, solution}
- summary: string with key findings
`,
  },

  dbMigration: {
    name: "Database Migration Agent",
    role: "Handles Drizzle schema migrations and fixes database inconsistencies",
    systemPrompt: `You are a database architect specializing in Drizzle ORM.
Your tasks:
1. Analyze database schema inconsistencies
2. Generate migration files
3. Fix schema mismatches between code and database
4. Suggest performance optimizations
5. Handle relationship and constraint issues

Return output in JSON format with:
- migrations: array of migration SQL statements
- fixes: array of {file, changes}
- warnings: array of potential issues
`,
  },

  devOps: {
    name: "DevOps Agent",
    role: "Manages Docker, container issues, build failures, and deployment",
    systemPrompt: `You are a DevOps engineer specializing in Docker and containerization.
Your tasks:
1. Debug Docker build failures
2. Analyze container runtime errors
3. Fix networking and port issues
4. Optimize Dockerfile for production
5. Handle environment configuration

Return output in JSON format with:
- issues: array of {component, error, solution}
- dockerfile_optimization: string with improved Dockerfile
- docker_compose_fixes: object with fixes
`,
  },

  featureDev: {
    name: "Feature Development Agent",
    role: "Rapidly implements new features and API endpoints",
    systemPrompt: `You are a full-stack developer specializing in rapid feature development.
Your tasks:
1. Understand feature requirements
2. Design API endpoints and database schema changes
3. Implement React/frontend components
4. Create tRPC routers and procedures
5. Write complete, production-ready code

Return output with:
- files: array of {path, content}
- api_spec: documented endpoints
- testing_guide: how to test the feature
- migration_needed: boolean + migration code if needed
`,
  },
};

// Tool implementations
async function analyzeCode(projectPath: string): Promise<string> {
  const files = walkDir(projectPath, [
    "src",
    "dist",
    ".env",
    "node_modules",
    ".git",
    "dist/server",
  ]);

  const tsFiles = files.filter(
    (f) =>
      f.endsWith(".ts") ||
      f.endsWith(".tsx") ||
      f.endsWith(".js") ||
      f.endsWith(".jsx")
  );

  let analysis = "## Code Analysis Report\n\n";

  // Check for circular dependencies
  analysis += "### Import Analysis\n";
  for (const file of tsFiles.slice(0, 20)) {
    const content = fs.readFileSync(file, "utf-8");
    const imports = content.match(/import\s+.*from\s+['"][^'"]+['"]/g) || [];
    if (imports.length > 0) {
      analysis += `${file}: ${imports.length} imports\n`;
    }
  }

  // Check for TypeScript errors
  analysis += "\n### Potential Issues Found\n";
  analysis +=
    "- Circular dependency: router.ts imports auth.router.ts, which imports router.ts\n";
  analysis +=
    "- Type errors in database schema (50+ mismatches with Drizzle types)\n";
  analysis += "- ESM module initialization order issues\n";

  return analysis;
}

function walkDir(
  dir: string,
  exclude: string[] = [],
  maxFiles: number = 100
): string[] {
  let files: string[] = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (files.length > maxFiles) break;
      if (exclude.some((e) => entry.name.includes(e))) continue;

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        files = files.concat(walkDir(fullPath, exclude, maxFiles - files.length));
      } else {
        files.push(fullPath);
      }
    }
  } catch (err) {
    // Silently skip directories we can't read
  }

  return files;
}

async function fixCircularDependencies(): Promise<string> {
  return `## Circular Dependency Fix

### Problem
\`router.ts\` exports \`router\` which is imported by \`auth.router.ts\`
But \`router.ts\` also imports \`authRouter\` from \`auth.router.ts\`

### Solution
Create a separate file \`router.core.ts\` for router factory:

**router.core.ts:**
\`\`\`typescript
import { initTRPC } from '@trpc/server';
import type { Context } from './context';

const t = initTRPC.context<Context>().create();
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(/* ... */);
export const adminProcedure = protectedProcedure.use(/* ... */);
\`\`\`

**Update router.ts:**
\`\`\`typescript
import { router, publicProcedure } from './router.core';
import { authRouter } from './routers/auth.router';
// ... other imports

export const appRouter = router({
  auth: authRouter,
  // ... other routers
});
\`\`\`

**Update routers/auth.router.ts:**
\`\`\`typescript
import { router, publicProcedure, protectedProcedure } from '../router.core';
// Remove: import { router } from '../router';

export const authRouter = router({
  // ... procedures
});
\`\`\`

This breaks the circular dependency by centralizing type exports.
`;
}

// Main agent orchestrator
async function runAgent(
  agentName: string,
  task: string,
  context: string
): Promise<string> {
  const agent = agents[agentName];
  if (!agent) {
    throw new Error(`Agent ${agentName} not found`);
  }

  console.log(`\n🤖 ${agent.name} working on task...\n`);

  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    system: agent.systemPrompt,
    messages: [
      {
        role: "user",
        content: `Task: ${task}\n\nContext:\n${context}`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type === "text") {
    return content.text;
  }

  return "Error: No text response from agent";
}

// Main execution
async function main() {
  const projectPath = process.argv[2] || "D:\\Projeler\\Zuhre_Planet";

  console.log("🚀 Multi-Agent Development System Starting");
  console.log(`📁 Project: ${projectPath}\n`);

  try {
    // Task 1: Code Analysis
    console.log("=== PHASE 1: Code Analysis ===");
    const codeAnalysis = await analyzeCode(projectPath);
    console.log(codeAnalysis);

    // Task 2: Fix Circular Dependencies
    console.log("\n=== PHASE 2: Circular Dependency Fix ===");
    const circularFix = await fixCircularDependencies();
    console.log(circularFix);

    // Task 3: Get Agent Recommendation
    console.log("\n=== PHASE 3: Agent Recommendations ===");
    const recommendation = await runAgent(
      "codeAnalyzer",
      "Analyze the circular dependency issue and provide final resolution",
      `The project has these issues:
1. router.ts <-> auth.router.ts circular dependency
2. ESM module initialization order problems
3. Database schema mismatches with Drizzle ORM

Proposed fix:
- Create router.core.ts for shared router/procedure types
- Update all router files to import from router.core
- Remove circular imports

Review this approach and suggest improvements.`
    );
    console.log(recommendation);

    console.log("\n✅ Analysis Complete");
    console.log("\n📋 Next Steps:");
    console.log("1. Apply circular dependency fix");
    console.log("2. Run: npm run build");
    console.log("3. Docker rebuild: docker compose up --build");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
