# Script PowerShell para iniciar o projeto completo

Write-Host "Iniciando aplicação Lista de Livros..." -ForegroundColor Green

# Verificar se está no diretório correto
if (-not (Test-Path "frontend") -or -not (Test-Path "backend")) {
    Write-Host "Erro: Execute este script no diretório raiz do projeto" -ForegroundColor Red
    exit 1
}

# Instalar dependências se necessário
Write-Host "Verificando dependências..." -ForegroundColor Yellow

if (-not (Test-Path "backend\node_modules")) {
    Write-Host "Instalando dependências do backend..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "Instalando dependências do frontend..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
}

Write-Host "Dependências verificadas!" -ForegroundColor Green

# Iniciar serviços
Write-Host "Iniciando serviços..." -ForegroundColor Yellow

# Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 3

# Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "Aplicação iniciada com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "URLs:" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Health:   http://localhost:3001/health" -ForegroundColor White
Write-Host ""
Write-Host "Para parar os serviços:" -ForegroundColor Cyan
Write-Host "   Feche as janelas do PowerShell do backend e frontend" -ForegroundColor White
Write-Host ""
