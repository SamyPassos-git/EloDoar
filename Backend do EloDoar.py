from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

#======Conexão com banco======
def get_db_connection():
    conn = sqlite3.connect("elodoar.db")
    conn.row_factory = sqlite3.Row
    return conn

#======Criar tabelas======
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        tipo TEXT NOT NULL
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS itens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT,
        categoria TEXT,
        doador_id INTEGER,
        status TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS solicitacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER,
        beneficiario_id INTEGER,
        status TEXT
    )
    """)

    conn.commit()
    conn.close()

#======Rota inicial======
@app.route("/")
def home():
    return "API EloDoar funcionando com SQLite!"

#======Cadastrar usuário======
@app.route("/usuarios", methods=["POST"])
def cadastrar_usuario():
    data = request.json

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO usuarios (nome, tipo) VALUES (?, ?)",
        (data["nome"], data["tipo"])
    )

    conn.commit()
    usuario_id = cursor.lastrowid
    conn.close()

    return jsonify({
        "id": usuario_id,
        "nome": data["nome"],
        "tipo": data["tipo"]
    }), 201

#======Cadastrar item======
@app.route("/itens", methods=["POST"])
def cadastrar_item():
    data = request.json

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO itens (nome, descricao, categoria, doador_id, status)
        VALUES (?, ?, ?, ?, ?)
    """, (
        data["nome"],
        data["descricao"],
        data["categoria"],
        data["doador_id"],
        "disponivel"
    ))

    conn.commit()
    item_id = cursor.lastrowid
    conn.close()

    return jsonify({
        "id": item_id,
        "nome": data["nome"],
        "descricao": data["descricao"],
        "categoria": data["categoria"],
        "doador_id": data["doador_id"],
        "status": "disponivel"
    }), 201

#======Listar itens======
@app.route("/itens", methods=["GET"])
def listar_itens():
    conn = get_db_connection()
    itens = conn.execute("SELECT * FROM itens").fetchall()
    conn.close()

    return jsonify([dict(item) for item in itens])

#======Solicitar item======
@app.route("/solicitacoes", methods=["POST"])
def solicitar_item():
    data = request.json

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO solicitacoes (item_id, beneficiario_id, status)
        VALUES (?, ?, ?)
    """, (
        data["item_id"],
        data["beneficiario_id"],
        "pendente"
    ))

    # Atualiza status do item
    cursor.execute("""
        UPDATE itens SET status = 'solicitado'
        WHERE id = ?
    """, (data["item_id"],))

    conn.commit()
    solicitacao_id = cursor.lastrowid
    conn.close()

    return jsonify({
        "id": solicitacao_id,
        "item_id": data["item_id"],
        "beneficiario_id": data["beneficiario_id"],
        "status": "pendente"
    }), 201


if __name__ == "__main__":
    init_db()
    app.run(debug=True)
