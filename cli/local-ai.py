#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Zuhre Planet - Local AI CLI (Ollama + Mistral 7B)
NSFW kısıtlaması olmayan, lokal çalışan AI asistanı
"""

import requests
import sys
import json
import os
from typing import Generator

# Fix Windows encoding
os.environ['PYTHONIOENCODING'] = 'utf-8'
sys.stdout.reconfigure(encoding='utf-8')

OLLAMA_API = "http://127.0.0.1:11434/api/generate"
MODEL = "mistral"

def check_ollama():
    """Ollama sunucusunun çalıştığını kontrol et"""
    try:
        requests.get("http://127.0.0.1:11434", timeout=2)
        return True
    except:
        return False

def generate_text(prompt: str, context: str = "") -> Generator[str, None, None]:
    """Mistral 7B'den streaming response al"""
    
    full_prompt = f"{context}\n\n{prompt}" if context else prompt
    
    try:
        response = requests.post(
            OLLAMA_API,
            json={
                "model": MODEL,
                "prompt": full_prompt,
                "stream": True,
                "temperature": 0.7,
                "top_p": 0.9,
            },
            stream=True,
            timeout=None
        )
        
        for line in response.iter_lines():
            if line:
                try:
                    data = json.loads(line)
                    if "response" in data:
                        yield data["response"]
                except json.JSONDecodeError:
                    continue
    except requests.exceptions.ConnectionError:
        yield "❌ Ollama sunucusu çalışmıyor!\n"
        yield "Terminal'de çalıştır: ollama serve\n"
    except Exception as e:
        yield f"❌ Error: {str(e)}\n"

def analyze_code(project_path: str = "."):
    """Kodu analiz et"""
    prompt = f"""
Analyze the project at {project_path} for:
1. Circular dependencies
2. TypeScript errors
3. Database schema issues
4. Performance problems
5. Adult content handling (if applicable)

Provide specific files, line numbers, and solutions.
"""
    
    print("🔍 Kod Analizi Başlıyor...\n")
    for chunk in generate_text(prompt):
        print(chunk, end="", flush=True)
    print("\n")

def fix_issue(issue: str):
    """Hata düzelt"""
    prompt = f"""
Fix this issue in a Node.js/React/PostgreSQL project:
{issue}

Provide:
1. Complete file path
2. Full corrected code
3. Explanation

Format as:
FILE: path/to/file.ts
```
code here
```
EXPLANATION: Why this works
"""
    
    print(f"🔧 Fixing: {issue}\n")
    for chunk in generate_text(prompt):
        print(chunk, end="", flush=True)
    print("\n")

def generate_feature(feature_name: str):
    """Yeni feature oluştur"""
    prompt = f"""
Generate complete, production-ready code for this feature in a Node.js/React/TypeScript project:
{feature_name}

Include:
1. Database schema (Drizzle ORM)
2. tRPC router procedures
3. React component
4. Type definitions
5. API integration

Project: Adult entertainment website
Stack: React + Node.js + tRPC + PostgreSQL

Important: No content filtering for adult content.
"""
    
    print(f"✨ Generating Feature: {feature_name}\n")
    for chunk in generate_text(prompt):
        print(chunk, end="", flush=True)
    print("\n")

def write_tests(test_for: str):
    """Test yaz"""
    prompt = f"""
Write comprehensive Vitest tests for:
{test_for}

Include:
- Unit tests
- Integration tests
- Edge cases
- Error handling

Format ready for copy-paste into test file.
"""
    
    print(f"🧪 Writing Tests for: {test_for}\n")
    for chunk in generate_text(prompt):
        print(chunk, end="", flush=True)
    print("\n")

def schema_migration(migration_desc: str):
    """Database migration oluştur"""
    prompt = f"""
Generate a Drizzle ORM migration for:
{migration_desc}

Include:
1. Table definitions
2. Indexes
3. Foreign keys
4. Rollback migration

Format: Drizzle migration syntax
"""
    
    print(f"📊 Schema Migration: {migration_desc}\n")
    for chunk in generate_text(prompt):
        print(chunk, end="", flush=True)
    print("\n")

def interactive_chat():
    """Interactive sohbet modu"""
    print("💬 Mistral 7B Chat Mode")
    print("(type 'exit' to quit, 'clear' for new conversation)\n")
    
    system_context = """You are an expert developer for the Zuhre Planet adult entertainment website project.
Help with code, architecture, debugging, and development tasks.
No content restrictions - provide complete, uncensored help for adult content handling."""
    
    conversation_history = []
    
    while True:
        try:
            user_input = input("🤖 You: ")
            
            if user_input.lower() == "exit":
                print("\n👋 Goodbye!")
                break
            
            if user_input.lower() == "clear":
                conversation_history = []
                print("✨ Conversation cleared\n")
                continue
            
            # Build conversation context
            context = "\n".join([
                f"Human: {msg['human']}\nAssistant: {msg['assistant']}"
                for msg in conversation_history[-5:]  # Keep last 5 exchanges
            ])
            
            print("\n🤔 Assistant: ", end="", flush=True)
            full_response = ""
            
            for chunk in generate_text(user_input, context):
                print(chunk, end="", flush=True)
                full_response += chunk
            
            print("\n")
            
            # Store in history
            conversation_history.append({
                "human": user_input,
                "assistant": full_response
            })
            
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"\n❌ Error: {e}\n")

def show_help():
    """Help göster"""
    print("""
🚀 Zuhre Planet - Local AI CLI (Ollama + Mistral 7B)

Usage:
  python cli/local-ai.py <command> [arguments]

Commands:
  help              Show this help message
  chat              Interactive chat mode
  analyze           Analyze code for issues
  fix <issue>       Fix specific issue
  feature <name>    Generate new feature
  test <for>        Write tests
  schema <desc>     Create database migration

Examples:
  python cli/local-ai.py chat
  python cli/local-ai.py analyze
  python cli/local-ai.py fix "circular dependencies"
  python cli/local-ai.py feature "Real-time chat system"
  python cli/local-ai.py test "auth endpoints"
  python cli/local-ai.py schema "add user preferences table"

Requirements:
  - Ollama running: ollama serve
  - Mistral model: ollama pull mistral

For more info: LOCAL_MODEL_SETUP.md
""")

def main():
    if not check_ollama():
        print("❌ Ollama sunucusu çalışmıyor!")
        print("Terminal'de çalıştır: ollama serve")
        sys.exit(1)
    
    if len(sys.argv) < 2:
        show_help()
        return
    
    command = sys.argv[1].lower()
    
    if command == "help":
        show_help()
    elif command == "chat":
        interactive_chat()
    elif command == "analyze":
        analyze_code(sys.argv[2] if len(sys.argv) > 2 else ".")
    elif command == "fix":
        issue = " ".join(sys.argv[2:]) if len(sys.argv) > 2 else "bugs"
        fix_issue(issue)
    elif command == "feature":
        feature = " ".join(sys.argv[2:]) if len(sys.argv) > 2 else "new feature"
        generate_feature(feature)
    elif command == "test":
        test_for = " ".join(sys.argv[2:]) if len(sys.argv) > 2 else "code"
        write_tests(test_for)
    elif command == "schema":
        desc = " ".join(sys.argv[2:]) if len(sys.argv) > 2 else "new table"
        schema_migration(desc)
    else:
        print(f"❌ Unknown command: {command}")
        show_help()

if __name__ == "__main__":
    main()
