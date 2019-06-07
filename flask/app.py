from flask import Flask, jsonify, request
from flask_cors import CORS


app = Flask(__name__)

CORS(app)

@app.route("/registrar", methods=["POST"])
def registrar():
	name, email, senha = request.get.form("nome"), request.get.form("email"), request.get.form("senha")
	print(name, email, senha)
if __name__ == "__main__":
	app.run(debug=True)

