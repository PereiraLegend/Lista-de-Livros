@echo off
echo 🚀 Iniciando servidor Backend (Fastify + TypeScript)...
cd backend
start cmd /k "npm run dev"

echo 🌐 Iniciando servidor Frontend (Next.js + TypeScript)...
cd ../frontend
start cmd /k "npm run dev"

echo ✅ Servidores iniciados!
echo 📁 Backend: http://localhost:3001
echo 🌍 Frontend: http://localhost:3000
echo.
echo ⚠️  Certifique-se de que as portas 3000 e 3001 estejam livres
pause
