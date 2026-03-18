from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os
import time

app = Flask(__name__)
CORS(app)

def get_db_connection():
    max_retries = 5
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            connection = mysql.connector.connect(
                host=os.getenv('DB_HOST', 'database'),
                user=os.getenv('DB_USER', 'bloguser'),
                password=os.getenv('DB_PASSWORD', 'blogpass'),
                database=os.getenv('DB_NAME', 'blogdb'),
                charset='utf8mb4',
                collation='utf8mb4_unicode_ci'
            )
            return connection
        except mysql.connector.Error as err:
            retry_count += 1
            if retry_count < max_retries:
                time.sleep(2)
            else:
                raise err

@app.route('/health', methods=['GET'])
def health():
    try:
        conn = get_db_connection()
        conn.close()
        return jsonify({'status': 'healthy'}), 200
    except Exception as e:
        return jsonify({'status': 'unhealthy', 'error': str(e)}), 500

@app.route('/api/posts', methods=['GET'])
def get_posts():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM posts ORDER BY created_at DESC')
        posts = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(posts), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM posts WHERE id = %s', (post_id,))
        post = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if post:
            return jsonify(post), 200
        else:
            return jsonify({'error': 'Post não encontrado'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/posts', methods=['POST'])
def create_post():
    try:
        data = request.get_json()
        title = data.get('title')
        content = data.get('content')
        author = data.get('author', 'Anônimo')
        
        if not title or not content:
            return jsonify({'error': 'Título e conteúdo são obrigatórios'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO posts (title, content, author) VALUES (%s, %s, %s)',
            (title, content, author)
        )
        conn.commit()
        post_id = cursor.lastrowid
        cursor.close()
        conn.close()
        
        return jsonify({'id': post_id, 'message': 'Post criado com sucesso'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    try:
        data = request.get_json()
        title = data.get('title')
        content = data.get('content')
        
        if not title or not content:
            return jsonify({'error': 'Título e conteúdo são obrigatórios'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            'UPDATE posts SET title = %s, content = %s WHERE id = %s',
            (title, content, post_id)
        )
        conn.commit()
        affected_rows = cursor.rowcount
        cursor.close()
        conn.close()
        
        if affected_rows > 0:
            return jsonify({'message': 'Post atualizado com sucesso'}), 200
        else:
            return jsonify({'error': 'Post não encontrado'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM posts WHERE id = %s', (post_id,))
        conn.commit()
        affected_rows = cursor.rowcount
        cursor.close()
        conn.close()
        
        if affected_rows > 0:
            return jsonify({'message': 'Post deletado com sucesso'}), 200
        else:
            return jsonify({'error': 'Post não encontrado'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
