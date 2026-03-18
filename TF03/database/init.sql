CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO posts (title, content, author) VALUES
('Bem-vindo ao Blog', 'Este e o primeiro post do nosso sistema de blog multi-container!', 'Admin'),
('Docker Compose', 'Orquestracao de multiplos servicos com Docker Compose e incrivel.', 'DevOps'),
('Persistencia de Dados', 'Volumes garantem que os dados sobrevivam ao restart dos containers.', 'DBA');
