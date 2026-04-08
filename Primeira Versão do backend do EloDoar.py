from flask import Flask, request, jsonify

app = Flask(__name__)

#======"Banco de dados" temporário ======
itens = []
usuarios = []
solicitacoes = []

#======Rota inicial======
@app.route("/")
def home():
    return "API EloDoar funcionando!"

#======Cadastrar usuário======
@app.route("/usuarios", methods=["POST"])
def cadastrar_usuario():
    data = request.json
    
    usuario = {
        "id": len(usuarios) + 1,
        "nome": data["nome"],
        "tipo": data["tipo"]  # doador ou beneficiario
    }
    
    usuarios.append(usuario)
    return jsonify(usuario), 201

#======Cadastrar item para doação======
@app.route("/itens", methods=["POST"])
def cadastrar_item():
    data = request.json
    
    item = {
        "id": len(itens) + 1,
        "nome": data["nome"],
        "descricao": data["descricao"],
        "categoria": data["categoria"],
        "doador_id": data["doador_id"],
        "status": "disponivel"
    }
    
    itens.append(item)
    return jsonify(item), 201

#======Listar itens disponíveis======
@app.route("/itens", methods=["GET"])
def listar_itens():
    return jsonify(itens)

#======Solicitar um item======
@app.route("/solicitacoes", methods=["POST"])
def solicitar_item():
    data = request.json
    
    solicitacao = {
        "id": len(solicitacoes) + 1,
        "item_id": data["item_id"],
        "beneficiario_id": data["beneficiario_id"],
        "status": "pendente"
    }
    
    solicitacoes.append(solicitacao)
    
    #======muda status do item======
    for item in itens:
        if item["id"] == data["item_id"]:
            item["status"] = "solicitado"
    
    return jsonify(solicitacao), 201


if __name__ == "__main__":
    app.run(debug=True)
