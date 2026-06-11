from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

#======Conexão com banco======
def get_db_connection():
    conn = sqlite3.connect("elodoar.db")
    conn.row_factory = sqlite3.Row
    return conn

#======Criar tabelas e fazer migração======
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        tipo TEXT NOT NULL
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS itens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT,
        categoria TEXT,
        imagem TEXT,
        localizacao TEXT,
        condicao TEXT,
        doador_id INTEGER,
        status TEXT,
        FOREIGN KEY (doador_id) REFERENCES usuarios (id)
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

    migrate_db(conn)
    conn.close()


def migrate_db(conn):
    cursor = conn.cursor()

    cursor.execute("PRAGMA table_info(usuarios)")
    usuario_columns = [row[1] for row in cursor.fetchall()]
    if "email" not in usuario_columns:
        cursor.execute("ALTER TABLE usuarios ADD COLUMN email TEXT UNIQUE")
    if "senha" not in usuario_columns:
        cursor.execute("ALTER TABLE usuarios ADD COLUMN senha TEXT")

    cursor.execute("PRAGMA table_info(itens)")
    itens_columns = [row[1] for row in cursor.fetchall()]
    if "imagem" not in itens_columns:
        cursor.execute("ALTER TABLE itens ADD COLUMN imagem TEXT")
    if "localizacao" not in itens_columns:
        cursor.execute("ALTER TABLE itens ADD COLUMN localizacao TEXT")
    if "condicao" not in itens_columns:
        cursor.execute("ALTER TABLE itens ADD COLUMN condicao TEXT")

    conn.commit()

#======Rota inicial======
@app.route("/")
def home():
    return "API EloDoar funcionando com SQLite!"

#======Cadastrar usuário======
@app.route("/usuarios", methods=["POST"])
def cadastrar_usuario():
    data = request.json

    if not data or not data.get("nome") or not data.get("email") or not data.get("senha"):
        return jsonify({"message": "Nome, email e senha são obrigatórios."}), 400

    hashed_password = generate_password_hash(data["senha"])
    tipo = data.get("tipo", "beneficiario")

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)",
            (data["nome"], data["email"], hashed_password, tipo)
        )
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"message": "Email já cadastrado."}), 409

    conn.commit()
    usuario_id = cursor.lastrowid
    conn.close()

    return jsonify({
        "id": usuario_id,
        "nome": data["nome"],
        "email": data["email"],
        "tipo": tipo,
    }), 201

#======Login de usuário======
@app.route("/login", methods=["POST"])
def login_usuario():
    data = request.json

    if not data or not data.get("email") or not data.get("senha"):
        return jsonify({"message": "Email e senha são obrigatórios."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM usuarios WHERE email = ?", (data["email"],))
    usuario = cursor.fetchone()
    conn.close()

    if usuario is None or not check_password_hash(usuario["senha"], data["senha"]):
        return jsonify({"message": "Email ou senha inválidos."}), 401

    return jsonify({
        "id": usuario["id"],
        "nome": usuario["nome"],
        "email": usuario["email"],
        "tipo": usuario["tipo"],
    })

#======Obter usuário por id======
@app.route("/usuarios/<int:usuario_id>", methods=["GET"])
def obter_usuario(usuario_id):
    conn = get_db_connection()
    usuario = conn.execute("SELECT id, nome, email, tipo FROM usuarios WHERE id = ?", (usuario_id,)).fetchone()
    conn.close()

    if usuario is None:
        return jsonify({"message": "Usuário não encontrado."}), 404

    return jsonify(dict(usuario))

#======Cadastrar item======
@app.route("/itens", methods=["POST"])
def cadastrar_item():
    data = request.json

    if not data or not data.get("nome") or not data.get("descricao") or not data.get("categoria") or not data.get("doador_id"):
        return jsonify({"message": "Nome, descrição, categoria e doador_id são obrigatórios."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO itens (nome, descricao, categoria, imagem, localizacao, condicao, doador_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (
            data["nome"],
            data["descricao"],
            data["categoria"],
            data.get("imagem", ""),
            data.get("localizacao", "Não informado"),
            data.get("condicao", "Bom estado"),
            data["doador_id"],
            "disponivel"
        )
    )

    conn.commit()
    item_id = cursor.lastrowid
    conn.close()

    return jsonify({
        "id": item_id,
        "nome": data["nome"],
        "descricao": data["descricao"],
        "imagem": data.get("imagem", ""),
        "localizacao": data.get("localizacao", "Não informado"),
        "condicao": data.get("condicao", "Bom estado"),
        "doador_id": data["doador_id"],
        "status": "disponivel"
    }), 201

#======Listar itens======
@app.route("/itens", methods=["GET"])
def listar_itens():
    conn = get_db_connection()
    itens = conn.execute(
        """
        SELECT itens.*, usuarios.nome AS doador_nome
        FROM itens
        LEFT JOIN usuarios ON itens.doador_id = usuarios.id
        ORDER BY itens.id DESC
        """
    ).fetchall()
    conn.close()

    resultado = []
    for item in itens:
        registro = dict(item)
        registro["imagem"] = registro.get("imagem") or ""
        registro["localizacao"] = registro.get("localizacao") or "Não informado"
        registro["condicao"] = registro.get("condicao") or "Bom estado"
        registro["doador_nome"] = registro.get("doador_nome") or "Anônimo"
        resultado.append(registro)

    return jsonify(resultado)

#======Solicitar item======
@app.route("/solicitacoes", methods=["POST"])
def solicitar_item():
    data = request.json

    if not data or not data.get("item_id") or not data.get("beneficiario_id"):
        return jsonify({"message": "item_id e beneficiario_id são obrigatórios."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO solicitacoes (item_id, beneficiario_id, status) VALUES (?, ?, ?)",
        (
            data["item_id"],
            data["beneficiario_id"],
            "pendente"
        )
    )

    cursor.execute(
        "UPDATE itens SET status = 'solicitado' WHERE id = ?",
        (data["item_id"],)
    )

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
    app.run(host="0.0.0.0", port=5000, debug=True)
