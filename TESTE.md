# Teste Manual da API

Para testar a API manualmente, você pode usar os seguintes comandos:

## 1. Iniciar o Backend
```bash
cd backend
npm run dev
```

## 2. Testar Endpoints

### Health Check
```bash
curl http://localhost:3001/health
```

### Listar Livros
```bash
curl http://localhost:3001/books
```

### Buscar Livros por Título
```bash
curl "http://localhost:3001/books?title=senhor"
```

### Adicionar Novo Livro
```bash
curl -X POST http://localhost:3001/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "O Hobbit",
    "author": "J.R.R. Tolkien",
    "publishedYear": 1937
  }'
```

## 3. Iniciar o Frontend
```bash
cd frontend
npm run dev
```

Acesse: http://localhost:3000
