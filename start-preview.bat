@echo off
REM Zuhre Planet - Preview Server

cls
echo.
echo  🚀 Preview Server Baslatlyor...
echo.
echo  📍 URL: http://localhost:8080/preview.html
echo.
echo  Tuslar:
echo    Ctrl+C: Sunucuyu durdur
echo.
echo  ============================================
echo.

cd /d "%~dp0public"
python -m http.server 8080

pause
