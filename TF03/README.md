# TF03 - Sistema de Blog Multi-Container

## Aluno

* **Nome:** Riquelme Menezes
* **RA:** 6324064
* **Curso:** Análise e Desenvolvimento de Sistemas

---

## Arquitetura

* **Nginx Proxy:** Load balancer e proxy reverso
* **Frontend:** Interface web (HTML/CSS/JS)
* **Backend:** API REST (Node.js / Python / PHP)
* **Database:** MySQL com persistência

---

## Como Executar

### Pré-requisitos

* Docker instalado
* Docker Compose instalado

---

### Execução

```bash
# Clone o repositório
git clone https://github.com/sleyck021/-tfsImplantacaoSistemas2026.git

# Acesse a pasta do projeto
cd TF03

# Subir todos os serviços
docker-compose up -d --build

# Verificar status dos containers
docker-compose ps

# Acessar aplicação
# Frontend: http://localhost
# API: http://localhost/api/posts
```

---

## Funcionalidades

✅ Listar posts existentes
✅ Visualizar post individual
✅ Criar novo post
✅ Editar post existente
✅ Deletar post

---

## Endpoints da API

* `GET /api/posts` → Lista todos os posts
* `POST /api/posts` → Cria novo post
* `GET /api/posts/:id` → Obtém um post específico
* `PUT /api/posts/:id` → Atualiza um post
* `DELETE /api/posts/:id` → Remove um post

---

## Comandos Úteis

```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend

# Parar todos os serviços
docker-compose down

# Parar e remover volumes
docker-compose down -v
```

---

## Persistência

* Dados do banco armazenados no volume: `blog-data`
* Logs do Nginx armazenados no volume: `nginx-logs`

✔ Os dados permanecem mesmo após reiniciar os containers

---

## Entrega

### Repositório GitHub

* **Nome:** tfsImplantacaoSistemas2026
* **Pasta:** TF03/
* **Visibilidade:** Público
* **Link:** https://github.com/sleyck021/-tfsImplantacaoSistemas2026.git

---

## Validação

```bash
# Teste completo da aplicação
docker-compose up -d --build

# Testar API
curl http://localhost/api/posts

# Finalizar execução
docker-compose down
```
