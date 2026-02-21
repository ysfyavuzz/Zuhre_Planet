#!/bin/bash

# Zuhre Planet - Preview Server
# Local preview arayüzünü görüntülemek için basit HTTP server

echo "🚀 Preview Server Başlatılıyor..."
echo "📍 URL: http://localhost:8080/preview.html"
echo ""
echo "Tuşlar:"
echo "  Ctrl+C: Sunucuyu durdur"
echo ""

cd "$(dirname "$0")/public"
python -m http.server 8080
