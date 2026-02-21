#!/usr/bin/env node

/**
 * Zuhre Planet - AI-Powered Development CLI
 * Terminal'den development tasks'ları çalıştırmak için
 * 
 * Setup:
 * 1. Get API key from: https://console.anthropic.com/
 * 2. Add to .env: ANTHROPIC_API_KEY=sk-ant-...
 * 3. Run: npm run zuhre -- help
 */

import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import Anthropic from "@anthropic-ai/sdk";

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

function checkApiKey() {
  if (!ANTHROPIC_KEY) {
    console.error(
      "\n❌ ANTHROPIC_API_KEY not found in .env\n" +
        "📍 Get your key from: https://console.anthropic.com/\n" +
        "📝 Add to .env: ANTHROPIC_API_KEY=sk-ant-...\n\n" +
        "📖 Full setup guide: CLI_SETUP_GUIDE.md\n"
    );
    process.exit(1);
  }
}

const client = new Anthropic({
  apiKey: ANTHROPIC_KEY || "dummy", // Will error if not set
});

interface Command {
  name: string;
  description: string;
  handler: (args: string[]) => Promise<void>;
}

// Commands
const commands: Record<string, Command> = {
  analyze: {
    name: "analyze",
    description: "Kod analiz et - errors, circular dependencies, type issues",
    handler: async (args) => {
      checkApiKey();
      console.log("🔍 Code Analysis başlıyor...\n");

      const response = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        system: `You are a senior TypeScript/Node.js code analyzer.
Analyze the project for:
1. Circular dependencies
2. Type errors and TypeScript issues
3. Database schema mismatches
4. Performance issues
5. Security vulnerabilities

Provide specific file paths and line numbers with actionable solutions.`,
        messages: [
          {
            role: "user",
            content: `Analyze this project structure and code:
${args.join(" ") || "D:\\Projeler\\Zuhre_Planet"}

Focus on:
- Server-side TypeScript errors
- Router/database integration issues
- Type safety problems`,
          },
        ],
      });

      const content = response.content[0];
      if (content.type === "text") {
        console.log(content.text);
      }
    },
  },

  fix: {
    name: "fix",
    description: "Otomatik hata düzeltme",
    handler: async (args) => {
      checkApiKey();
      const issue = args.join(" ") || "circular dependencies";
      console.log(`🔧 Fixing: ${issue}\n`);

      const response = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        system: `You are an expert TypeScript/Node.js developer.
Provide COMPLETE, production-ready code fixes.
Include file paths, exact code changes, and explanations.
Format as:

FILE: path/to/file.ts
\`\`\`typescript
// complete file content
\`\`\`

EXPLANATION: Why this fixes the issue`,
        messages: [
          {
            role: "user",
            content: `Fix this issue in the project: ${issue}

Project: Zuhre Planet (3D Adult Website)
Stack: React + Node.js + Express + tRPC + PostgreSQL + Drizzle ORM

Common issues to check:
- Circular imports between router.ts and router files
- Database schema mismatches
- TypeScript type errors
- ESM module initialization`,
          },
        ],
      });

      const content = response.content[0];
      if (content.type === "text") {
        console.log(content.text);
      }
    },
  },

  feature: {
    name: "feature",
    description: "Yeni feature implement et",
    handler: async (args) => {
      checkApiKey();
      const featureName = args.join(" ") || "new feature";
      console.log(`✨ Generating feature: ${featureName}\n`);

      const response = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 8192,
        system: `You are a full-stack developer expert.
Generate COMPLETE, production-ready code for new features.

Include:
1. Database schema (Drizzle migration)
2. tRPC router procedures
3. React component
4. Type definitions
5. API integration code

Format each file separately with file paths.`,
        messages: [
          {
            role: "user",
            content: `Implement this feature for Zuhre Planet:
${featureName}

Stack:
- Frontend: React 18 + Vite + TailwindCSS
- Backend: Node.js + Express + tRPC
- Database: PostgreSQL + Drizzle ORM
- Auth: JWT tokens

Requirements:
- Type-safe
- Following project conventions
- Production-ready
- With error handling`,
          },
        ],
      });

      const content = response.content[0];
      if (content.type === "text") {
        console.log(content.text);
      }
    },
  },

  test: {
    name: "test",
    description: "Test yaz ve çalıştır",
    handler: async (args) => {
      checkApiKey();
      const testFor = args.join(" ") || "database queries";
      console.log(`🧪 Writing tests for: ${testFor}\n`);

      const response = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        system: `Write comprehensive tests using Vitest.
Include unit tests, integration tests, and edge cases.`,
        messages: [
          {
            role: "user",
            content: `Write tests for: ${testFor}`,
          },
        ],
      });

      const content = response.content[0];
      if (content.type === "text") {
        console.log(content.text);
      }
    },
  },

  deploy: {
    name: "deploy",
    description: "Docker ve deployment config oluştur",
    handler: async (args) => {
      checkApiKey();
      const deployTarget =
        args.join(" ") || "Docker with Nginx and PostgreSQL";
      console.log(`🚀 Deployment config for: ${deployTarget}\n`);

      const response = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        system: `Generate production-ready deployment configurations.
Include Docker, docker-compose, environment variables, and setup instructions.`,
        messages: [
          {
            role: "user",
            content: `Create deployment config for: ${deployTarget}`,
          },
        ],
      });

      const content = response.content[0];
      if (content.type === "text") {
        console.log(content.text);
      }
    },
  },

  schema: {
    name: "schema",
    description: "Database schema migration oluştur",
    handler: async (args) => {
      checkApiKey();
      const migration = args.join(" ") || "user profile enhancement";
      console.log(`📊 Generating schema migration: ${migration}\n`);

      const response = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        system: `Generate Drizzle ORM migrations.
Include:
1. Schema definition
2. Migration file
3. Rollback strategy
4. Data transformation if needed`,
        messages: [
          {
            role: "user",
            content: `Create a migration for: ${migration}

Current stack: PostgreSQL + Drizzle ORM
Format: Drizzle migration syntax`,
          },
        ],
      });

      const content = response.content[0];
      if (content.type === "text") {
        console.log(content.text);
      }
    },
  },

  chat: {
    name: "chat",
    description: "Interactive AI chat session",
    handler: async (args) => {
      checkApiKey();
      console.log("💬 AI Chat Mode (type 'exit' to quit)\n");

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const askQuestion = (prompt: string): Promise<string> => {
        return new Promise((resolve) => {
          rl.question(prompt, (answer) => {
            resolve(answer);
          });
        });
      };

      let conversation: Anthropic.MessageParam[] = [];

      while (true) {
        const userInput = await askQuestion("\n🤖 You: ");

        if (userInput.toLowerCase() === "exit") {
          console.log("\n👋 Goodbye!");
          rl.close();
          break;
        }

        conversation.push({
          role: "user",
          content: userInput,
        });

        const response = await client.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 2048,
          system: `You are an expert developer assistant for the Zuhre Planet project.
Help with:
- Code questions and architecture
- Debugging and troubleshooting
- Feature design and planning
- Best practices and optimization
- Database and API design

Be concise, specific, and provide code examples when relevant.`,
          messages: conversation,
        });

        const content = response.content[0];
        if (content.type === "text") {
          console.log(`\n🤔 Assistant:\n${content.text}`);
          conversation.push({
            role: "assistant",
            content: content.text,
          });
        }
      }
    },
  },

  help: {
    name: "help",
    description: "Help görüntüle",
    handler: async () => {
      console.log("\n🚀 Zuhre Planet - AI-Powered Development CLI");
      console.log("Gemini/Claude ile hızlı geliştirme.\n");
      console.log(
        "🔑 SETUP REQUIRED:\n" +
        "1. Get API key: https://console.anthropic.com/\n" +
        "2. Add to .env: ANTHROPIC_API_KEY=sk-ant-...\n" +
        "3. See CLI_SETUP_GUIDE.md for full setup\n"
      );

      console.log("Available Commands:\n");

      for (const [key, cmd] of Object.entries(commands)) {
        if (key !== "help") {
          console.log(`  ${key.padEnd(12)} - ${cmd.description}`);
        }
      }

      console.log("\nExamples:");
      console.log("  npm run zuhre -- analyze");
      console.log('  npm run zuhre -- fix "circular dependencies"');
      console.log('  npm run zuhre -- feature "User messaging system"');
      console.log("  npm run zuhre -- test database queries");
      console.log("  npm run zuhre -- schema");
      console.log("  npm run zuhre -- chat");
      console.log("  npm run zuhre -- deploy\n");

      console.log("📖 Or after npm link:");
      console.log("  zuhre analyze");
      console.log("  zuhre chat\n");
    },
  },
};

// Main
async function main() {
  const args = process.argv.slice(2);
  const [commandName, ...commandArgs] = args;

  if (!commandName || commandName === "help") {
    await commands.help.handler([]);
    return;
  }

  const command = commands[commandName];

  if (!command) {
    console.error(
      `❌ Unknown command: ${commandName}\nRun 'npm run zuhre -- help' for available commands`
    );
    process.exit(1);
  }

  try {
    await command.handler(commandArgs);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("ANTHROPIC_API_KEY")) {
        console.error(
          "\n❌ API Key Error\n" +
          "Get key from: https://console.anthropic.com/\n" +
          "Add to .env: ANTHROPIC_API_KEY=sk-ant-..."
        );
      } else {
        console.error("❌ Error:", error.message);
      }
    } else {
      console.error("❌ Error:", error);
    }
    process.exit(1);
  }
}

main().catch(console.error);
