# Documentação da API

## Base URL
```
http://localhost/api
```

## Endpoints

### Health Check
```
GET /health
```
Verifica o status da API e conexão com o banco de dados.

**Resposta de Sucesso (200):**
```json
{
  "status": "healthy"
}
```

### Listar Todos os Posts
```
GET /api/posts
```
Retorna todos os posts ordenados por data de criação (mais recentes primeiro).

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "title": "Título do Post",
    "content": "Conteúdo completo do post",
    "author": "Nome do Autor",
    "created_at": "2026-03-11T10:30:00",
    "updated_at": "2026-03-11T10:30:00"
  }
]
```

### Obter Post Específico
```
GET /api/posts/:id
```
Retorna um post específico pelo ID.

**Parâmetros:**
- `id` (path): ID do post

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "title": "Título do Post",
  "content": "Conteúdo completo do post",
  "author": "Nome do Autor",
  "created_at": "2026-03-11T10:30:00",
  "updated_at": "2026-03-11T10:30:00"
}
```

**Resposta de Erro (404):**
```json
{
  "error": "Post não encontrado"
}
```

### Criar Novo Post
```
POST /api/posts
```
Cria um novo post.

**Body (JSON):**
```json
{
  "title": "Título do Post",
  "content": "Conteúdo do post",
  "author": "Nome do Autor"
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": 4,
  "message": "Post criado com sucesso"
}
```

**Resposta de Erro (400):**
```json
{
  "error": "Título e conteúdo são obrigatórios"
}
```

### Atualizar Post
```
PUT /api/posts/:id
```
Atualiza um post existente.

**Parâmetros:**
- `id` (path): ID do post

**Body (JSON):**
```json
{
  "title": "Novo Título",
  "content": "Novo Conteúdo"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Post atualizado com sucesso"
}
```

**Resposta de Erro (404):**
```json
{
  "error": "Post não encontrado"
}
```

### Deletar Post
```
DELETE /api/posts/:id
```
Remove um post.

**Parâmetros:**
- `id` (path): ID do post

**Resposta de Sucesso (200):**
```json
{
  "message": "Post deletado com sucesso"
}
```

**Resposta de Erro (404):**
```json
{
  "error": "Post não encontrado"
}
```

## Códigos de Status HTTP

- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Dados inválidos
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro no servidor

## Exemplos de Uso com cURL

### Listar posts
```bash
curl http://localhost/api/posts
```

### Criar post
```bash
curl -X POST http://localhost/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Meu Post","content":"Conteúdo aqui","author":"João"}'
```

### Deletar post
```bash
curl -X DELETE http://localhost/api/posts/1
```
