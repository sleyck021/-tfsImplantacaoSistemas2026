-- Schema do Banco de Dados

-- Tabela de Posts
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at),
    INDEX idx_author (author)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comentários sobre a estrutura:
-- id: Chave primária auto-incrementada
-- title: Título do post (máximo 255 caracteres)
-- content: Conteúdo completo do post (TEXT permite até 65,535 caracteres)
-- author: Nome do autor (máximo 100 caracteres)
-- created_at: Data/hora de criação (automático)
-- updated_at: Data/hora da última atualização (automático)
-- Índices para otimizar consultas por data e autor
