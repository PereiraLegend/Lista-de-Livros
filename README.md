# Lista de Livros - Aplicação Fullstack
Para iniciar a API automáticamente você pode usar:

```bash
./start.ps1
```

Para testar a API manualmente você pode usar os seguintes comandos:

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
curl "http://localhost:3001/books?title=1984"
```

### Adicionar Novo Livro
```bash
curl -X POST http://localhost:3001/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "O Hobbit",
    "author": "J.R.R. Tolkien",
    "publishedYear": 1936
  }'
```

### Editar Novo Livro
```bash
curl --location --request PUT 'localhost:3001/books/1945d582-07d8-471c-b5c3-e9785dd601b1' \
--header 'Content-Type: application/json' \
--data '{
    "title": "O Hobbit",
    "author": "J.R.R Tolkien",
    "publishedYear": 1937
}'
```

### Deletar Novo Livro
```bash
curl --location --request DELETE 'localhost:3001/books/1945d582-07d8-471c-b5c3-e9785dd601b1'
```

## 3. Iniciar o Frontend
```bash
cd frontend
npm run dev
```

Acesse: http://localhost:3000
