import os
import requests
import json
from mcp.server.fastmcp import Fastmcp
from dotenv import load_dotenv

# .env dosyasını yükle
load_dotenv()

# MCP Server oluştur
mcp = Fastmcp("zuhre-image-mcp")

# Konfigürasyon
OLLAMA_API = "http://host.docker.internal:11434/api"
SDXL_API = os.getenv("SDXL_API", "http://localhost:7860/api") # Docker'daki SDXL servisi
CIVITAI_API_KEY = os.getenv("CIVITAI_API_KEY", "")

@mcp.tool()
def improve_prompt(base_prompt: str):
    """Ollama kullanarak ham bir prompt'u sanatsal ve detaylı bir hale getirir."""
    payload = {
        "model": "llama3", # Veya senin Ollama'da yüklü olan modelin
        "prompt": f"Improve this image generation prompt for a 3D artistic website. Make it detailed and cinematic: {base_prompt}",
        "stream": False
    }
    try:
        response = requests.post(f"{OLLAMA_API}/generate", json=payload)
        return response.json().get("response", base_prompt)
    except Exception as e:
        return f"Ollama hatası: {str(e)}"

@mcp.tool()
def generate_image(prompt: str, negative_prompt: str = "nsfw, low quality, blurry", provider: str = "sdxl"):
    """
    Belirtilen provider (sdxl veya civitai) üzerinden görsel üretir.
    """
    if provider == "sdxl":
        # Lokal SDXL (Open WebUI / Automatic1111 uyumlu)
        payload = {
            "prompt": prompt,
            "negative_prompt": negative_prompt,
            "steps": 25,
            "width": 1024,
            "height": 1024
        }
        try:
            # Not: Bu endpoint SDXL kurulumuna göre değişebilir
            response = requests.post(f"{SDXL_API}/predict", json=payload) 
            return {"status": "success", "info": "Görsel üretim isteği SDXL'e gönderildi.", "data": response.json()}
        except Exception as e:
            return {"status": "error", "message": f"SDXL hatası: {str(e)}"}
            
    elif provider == "civitai":
        if not CIVITAI_API_KEY:
            return {"status": "error", "message": "Civitai API Key bulunamadı."}
            
        headers = {"Authorization": f"Bearer {CIVITAI_API_KEY}"}
        payload = {
            "modelId": 12345, # Örnek model ID
            "params": {"prompt": prompt, "negativePrompt": negative_prompt}
        }
        try:
            response = requests.post("https://api.civitai.com/v1/images/generate", json=payload, headers=headers)
            return response.json()
        except Exception as e:
            return {"status": "error", "message": f"Civitai hatası: {str(e)}"}

if __name__ == "__main__":
    mcp.run()
