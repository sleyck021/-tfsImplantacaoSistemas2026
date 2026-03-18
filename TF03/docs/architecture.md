# Arquitetura do Sistema

## Visão Geral

O sistema é composto por 4 containers Docker orquestrados via Docker Compose:

```
┌─────────────────────────────────────────────────┐
│                   Cliente                        │
│              (Navegador Web)                     │
└────────────────────┬────────────────────────────┘
                     │ HTTP :80
                     ▼
┌─────────────────────────────────────────────────┐
│              Nginx Proxy                         │
│         (Load Balancer/Reverse Proxy)            │
└──────────┬──────────────────────┬────────────────┘
           │                      │
           │ :3000                │ :5000
           ▼                      ▼
┌──────────────────┐    ┌──────────────────────┐
│    Frontend      │    │      Backend         │
│  (Nginx + HTML)  │───▶│   (Flask/Python)     │
└──────────────────┘    └──────────┬───────────┘
                                   │ :3306
                                   ▼
                        ┌──────────────────────┐
                        │      Database        │
                        │      (MySQL 8.0)     │
                        └──────────────────────┘
```

## Componentes

### 1. Nginx Proxy (nginx-proxy)
- **Imagem:** nginx:alpine
- **Porta Externa:** 80
- **Função:** Load balancer e proxy reverso
- **Rotas:**
  - `/` → Frontend (porta 3000)
  - `/api/*` → Backend (porta 5000)
  - `/health` → Backend health check

### 2. Frontend (frontend)
- **Base:** nginx:alpine
- **Porta Interna:** 3000
- **Tecnologias:** HTML5, CSS3, JavaScript (Vanilla)
- **Páginas:**
  - `index.html` - Lista de posts
  - `post.html` - Visualização de post individual
  - `novo-post.html` - Formulário de criação

### 3. Backend (backend)
- **Base:** python:3.9-slim
- **Porta Interna:** 5000
- **Framework:** Flask
- **Funcionalidades:**
  - API REST completa (CRUD)
  - Conexão com MySQL
  - Health checks
  - CORS habilitado

### 4. Database (database)
- **Imagem:** mysql:8.0
- **Porta Interna:** 3306
- **Persistência:** Volume `blog-data`
- **Inicialização:** Script `init.sql` com dados de exemplo

## Rede

### blog-network
- **Driver:** bridge
- **Isolamento:** Todos os containers na mesma rede privada
- **DNS Interno:** Containers se comunicam por nome (ex: `backend:5000`)

## Volumes

### blog-data
- **Tipo:** Named volume
- **Montagem:** `/var/lib/mysql` no container database
- **Função:** Persistência dos dados do banco

### nginx-logs
- **Tipo:** Named volume
- **Montagem:** `/var/log/nginx` no container nginx-proxy
- **Função:** Armazenamento de logs do Nginx

## Fluxo de Dados

### Criação de Post
1. Usuário preenche formulário no frontend
2. JavaScript envia POST para `/api/posts`
3. Nginx roteia para backend:5000
4. Flask valida dados e insere no MySQL
5. MySQL persiste no volume `blog-data`
6. Backend retorna sucesso
7. Frontend redireciona para lista de posts

### Listagem de Posts
1. Frontend carrega e faz GET para `/api/posts`
2. Nginx roteia para backend:5000
3. Flask consulta MySQL
4. MySQL retorna dados do volume
5. Backend serializa para JSON
6. Frontend renderiza cards dos posts

## Dependências

```yaml
nginx-proxy → frontend, backend
frontend → backend
backend → database (com health check)
```

## Health Checks

### Backend
- **Comando:** `curl -f http://localhost:5000/health`
- **Intervalo:** 30s
- **Timeout:** 10s
- **Retries:** 3

### Database
- **Comando:** `mysqladmin ping`
- **Intervalo:** 10s
- **Timeout:** 5s
- **Retries:** 5

### Frontend
- **Comando:** `wget --spider http://localhost:3000`
- **Intervalo:** 30s
- **Timeout:** 10s
- **Retries:** 3

## Segurança

- Portas internas não expostas externamente (exceto Nginx:80)
- Credenciais do banco via variáveis de ambiente
- Rede isolada para comunicação inter-container
- CORS configurado no backend

## Escalabilidade

O sistema pode ser escalado horizontalmente:
```bash
docker-compose up -d --scale backend=3
```

O Nginx fará load balancing automático entre as instâncias.
