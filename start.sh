#!/bin/bash

# Script para iniciar o projeto completo (frontend + backend)

echo "🚀 Iniciando aplicação Lista de Livros..."

# Verificar se está no diretório correto
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Erro: Execute este script no diretório raiz do projeto"
    exit 1
fi

# Instalar dependências se necessário
echo "📦 Verificando dependências..."

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Instalando dependências do backend..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    cd frontend && npm install && cd ..
fi

echo "✅ Dependências verificadas!"

# Criar janelas separadas do terminal (funciona no Git Bash/WSL)
echo "🖥️  Iniciando serviços..."

# Backend em background
cd backend
gnome-terminal --tab --title="Backend API" -- bash -c "npm run dev; exec bash" 2>/dev/null || \
start cmd /k "cd backend && npm run dev" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/backend && npm run dev"' 2>/dev/null &

sleep 2

# Frontend em background  
cd ../frontend
gnome-terminal --tab --title="Frontend" -- bash -c "npm run dev; exec bash" 2>/dev/null || \
start cmd /k "cd frontend && npm run dev" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/frontend && npm run dev"' 2>/dev/null &

echo ""
echo "🎉 Aplicação iniciada com sucesso!"
echo ""
echo "📝 URLs:"
echo "   Backend:  http://localhost:3001"
echo "   Frontend: http://localhost:3000"
echo "   Health:   http://localhost:3001/health"
echo ""
echo "📚 Para parar os serviços:"
echo "   Pressione Ctrl+C nos terminais do backend e frontend"
echo ""
