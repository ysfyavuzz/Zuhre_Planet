#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Zuhre Planet - Image Generation CLI
SDXL + Ollama integration
"""

import requests
import json
import os
import sys
from typing import Optional
from pathlib import Path

# Fix Windows encoding
os.environ['PYTHONIOENCODING'] = 'utf-8'
sys.stdout.reconfigure(encoding='utf-8')

SDXL_API = "http://127.0.0.1:7860/api"
OUTPUT_DIR = Path("./sdxl-outputs")

def ensure_output_dir():
    """Output klasörü oluştur"""
    OUTPUT_DIR.mkdir(exist_ok=True)

def generate_image(
    prompt: str,
    negative_prompt: str = "low quality, blurry, distorted",
    width: int = 768,
    height: int = 1024,
    steps: int = 30,
    output_name: Optional[str] = None
) -> str:
    """SDXL'den görsel oluştur"""
    
    ensure_output_dir()
    
    try:
        print(f"🎨 Generating image: {prompt[:50]}...")
        
        # Request to SDXL WebUI API
        response = requests.post(
            f"{SDXL_API}/txt2img",
            json={
                "prompt": prompt,
                "negative_prompt": negative_prompt,
                "steps": steps,
                "width": width,
                "height": height,
                "cfg_scale": 7.5,
                "sampler_name": "DPM++ 2M Karras",
            },
            timeout=300
        )
        
        if response.status_code != 200:
            print(f"❌ Error: {response.text}")
            return ""
        
        result = response.json()
        
        if "images" not in result:
            print("❌ No image in response")
            return ""
        
        # Save image
        import base64
        from PIL import Image
        from io import BytesIO
        
        image_data = base64.b64decode(result["images"][0])
        img = Image.open(BytesIO(image_data))
        
        # Generate filename
        if not output_name:
            import time
            output_name = f"sdxl_{int(time.time())}.png"
        
        output_path = OUTPUT_DIR / output_name
        img.save(output_path)
        
        print(f"✅ Saved: {output_path}")
        return str(output_path)
        
    except requests.exceptions.ConnectionError:
        print("❌ SDXL server not running!")
        print("Start with: docker compose -f docker-compose.full.yml up")
        return ""
    except Exception as e:
        print(f"❌ Error: {e}")
        return ""

def generate_escort_profile_image(
    name: str,
    description: str,
    style: str = "professional photography"
) -> str:
    """Escort profili görseli oluştur"""
    
    prompt = f"""
    Professional glamour photography of {name}.
    {description}
    Style: {style}
    8k, highly detailed, beautiful lighting, 
    skin details, perfect face, professional studio,
    masterpiece, ultra detailed, sharp focus
    """
    
    negative = "low quality, blurry, distorted, ugly, bad anatomy"
    
    return generate_image(prompt, negative)

def generate_batch_images(prompts: list, output_prefix: str = "batch") -> list:
    """Batch görsel üret"""
    
    results = []
    for i, prompt in enumerate(prompts):
        output_name = f"{output_prefix}_{i:03d}.png"
        path = generate_image(prompt, output_name=output_name)
        if path:
            results.append(path)
    
    print(f"\n✅ Generated {len(results)}/{len(prompts)} images")
    return results

def show_help():
    """Help göster"""
    print("""
🎨 Zuhre Planet - Image Generation CLI

Usage:
  python cli/image-generator.py <command> [arguments]

Commands:
  help              Show this help
  generate <prompt> Generate single image
  profile <name> <desc> Generate escort profile image
  batch <file>     Generate from prompts file
  web              Open Web UI

Examples:
  python cli/image-generator.py generate "beautiful woman, professional photo"
  python cli/image-generator.py profile "Luna" "blonde, 24, photographer"
  python cli/image-generator.py batch prompts.txt
  python cli/image-generator.py web

Requirements:
  - SDXL running: docker compose -f docker-compose.full.yml up
  
Output: ./sdxl-outputs/
""")

def main():
    import sys
    
    if len(sys.argv) < 2:
        show_help()
        return
    
    command = sys.argv[1].lower()
    
    if command == "help":
        show_help()
    
    elif command == "generate":
        if len(sys.argv) < 3:
            print("❌ Usage: generate <prompt>")
            return
        prompt = " ".join(sys.argv[2:])
        generate_image(prompt)
    
    elif command == "profile":
        if len(sys.argv) < 4:
            print("❌ Usage: profile <name> <description>")
            return
        name = sys.argv[2]
        description = " ".join(sys.argv[3:])
        generate_escort_profile_image(name, description)
    
    elif command == "batch":
        if len(sys.argv) < 3:
            print("❌ Usage: batch <prompts_file.txt>")
            return
        
        file_path = sys.argv[2]
        try:
            with open(file_path, 'r') as f:
                prompts = [line.strip() for line in f if line.strip()]
            generate_batch_images(prompts)
        except FileNotFoundError:
            print(f"❌ File not found: {file_path}")
    
    elif command == "web":
        import webbrowser
        print("🌐 Opening Web UI: http://localhost:7860")
        webbrowser.open("http://localhost:7860")
    
    else:
        print(f"❌ Unknown command: {command}")
        show_help()

if __name__ == "__main__":
    main()
