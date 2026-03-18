const API_URL = '/api/posts';

// Função para carregar todos os posts
async function loadPosts() {
    try {
        const response = await fetch(API_URL);
        const posts = await response.json();
        
        const container = document.getElementById('posts-container');
        
        if (posts.length === 0) {
            container.innerHTML = '<p class="loading">Nenhum post encontrado.</p>';
            return;
        }
        
        container.innerHTML = posts.map(post => `
            <div class="post-card">
                <h3>${escapeHtml(post.title)}</h3>
                <div class="post-meta">
                    Por ${escapeHtml(post.author)} • ${formatDate(post.created_at)}
                </div>
                <p class="post-excerpt">${escapeHtml(post.content.substring(0, 150))}...</p>
                <div class="post-actions">
                    <a href="post.html?id=${post.id}" class="btn btn-view">Ver Post</a>
                    <button onclick="deletePost(${post.id})" class="btn btn-delete">Deletar</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
        document.getElementById('posts-container').innerHTML = 
            '<p class="loading">Erro ao carregar posts.</p>';
    }
}

// Função para carregar um post específico
async function loadPost(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const post = await response.json();
        
        const container = document.getElementById('post-detail');
        container.innerHTML = `
            <h2>${escapeHtml(post.title)}</h2>
            <div class="post-meta">
                Por ${escapeHtml(post.author)} • ${formatDate(post.created_at)}
            </div>
            <div class="post-content">
                ${escapeHtml(post.content).replace(/\n/g, '<br>')}
            </div>
            <div class="post-actions" style="margin-top: 30px;">
                <a href="index.html" class="btn btn-secondary">Voltar</a>
                <button onclick="deletePost(${post.id}, true)" class="btn btn-delete">Deletar</button>
            </div>
        `;
    } catch (error) {
        console.error('Erro ao carregar post:', error);
        document.getElementById('post-detail').innerHTML = 
            '<p class="loading">Erro ao carregar post.</p>';
    }
}

// Função para criar novo post
async function createPost(event) {
    event.preventDefault();
    
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;
    
    console.log('Enviando post:', { title, author, content });
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, author, content })
        });
        
        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Response data:', result);
        
        if (response.ok) {
            alert('Post publicado com sucesso!');
            document.getElementById('post-form').reset();
            window.location.href = '/index.html';
        } else {
            alert('Erro ao publicar: ' + (result.error || 'Erro desconhecido'));
        }
    } catch (error) {
        console.error('Erro ao criar post:', error);
        alert('Erro ao publicar post: ' + error.message);
    }
}

// Função para deletar post
async function deletePost(id, redirect = false) {
    if (!confirm('Tem certeza que deseja deletar este post?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            if (redirect) {
                window.location.href = 'index.html';
            } else {
                loadPosts();
            }
        } else {
            alert('Erro ao deletar post');
        }
    } catch (error) {
        console.error('Erro ao deletar post:', error);
        alert('Erro ao deletar post');
    }
}

// Funções auxiliares
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path === '/') {
        loadPosts();
    } else if (path.includes('post.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        if (postId) {
            loadPost(postId);
        }
    } else if (path.includes('novo-post.html')) {
        const form = document.getElementById('post-form');
        if (form) {
            form.addEventListener('submit', createPost);
        }
    }
});
