from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

engine = create_engine("mysql://danilo@localhost/time2study")

db = scoped_session(sessionmaker(bind=engine))

app = Flask(__name__)

CORS(app)


@app.route("/")
def index():
	data = db.execute("SELECT * FROM User").fetchall()
	print(data)
	return "opa"

@app.route("/api/registrar", methods=["POST"])
def registrar():
	'''
	Recebera os dados enviados via post do front end e tentara inserir ao banco de dados
	'''
	name, email, password = request.form.get("name"), request.form.get("email"), request.form.get("password")
	result = db.execute("SELECT * FROM User WHERE email = :email", {"email" : email}).fetchone()
	if not result:
		a = db.execute("INSERT INTO User(name, email,password) VALUES(:name, :email, :password)", {"name" : name, "email" : email,"password" : password})
		db.commit()
		json = {"success" : True}
	else:
		json  = {"success" : False}

	return jsonify(json)

@app.route("/api/logar", methods=["POST"])
def logar():
	'''
	verifica se tem algum registro com o email e senha passados
	'''
	email, password = request.form.get("email"), request.form.get("password")
	result = db.execute("SELECT * FROM User WHERE email = :email AND password = :password", {"email" : email, "password" : password}).fetchone()

	if result is not None:
		json = {"success" : True}
	else:
		json = {"success" : False}
	return jsonify(json)

if __name__ == "__main__":
	app.run(debug=True)

