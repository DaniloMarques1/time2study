import {missmatchPassword, errorRegister} from './erros.js'


//Só permite ir para a pagina de registro caso não esteja logado
const isNotLogged = () => {
	const flag = localStorage.getItem("log")
	if (flag == "true") {
		window.location.href = "index.html"
	}
}

isNotLogged()

document.addEventListener("DOMContentLoaded", () => {
	//Constantes referentes aos inputs html e url
	const name = document.querySelector("#name")
	const password = document.querySelector("#password")
	const confirm_password = document.querySelector("#confirm_password")
	const email = document.querySelector("#email")
	const url = "http://localhost:5000/api/registrar"
	const form = document.querySelector("#form")
	const erro = document.querySelector("#erro")

	//Criação do form data para enviar na requisição
	const createData = () => {
		const flag = password.value === confirm_password.value ? true : false
		if (flag) {
			const data = new FormData()
			data.append("name", name.value)
			data.append("email", email.value)
			data.append("password", password.value)
			return data
		}
		console.log(erro)
		//erro.insertAdjacentHTML("beforeend", missmatchPassword())
		erro.innerHTML = missmatchPassword()
        // deixando o modal visivel
		$('#myModal').modal('show');

		return false
	}

	form.onsubmit = (event) => {
		event.preventDefault()
		const data = createData()
		if (data != false) {
			if(validate(data.get("name"), data.get("email"), data.get("password"))){
				postRequest(data)
			}
		}
	}
	//Validando os campos do formulario
	const validate = (...inputs) => {
		for (const input of inputs) {
			if (!input) {
				return false
			}
		}
		return true
	}

	//Realizando a requisição post enviando os dados do formulario
	const postRequest = (data) => {
		fetch(url, {method : "POST", body : data})
		.then(promise  => promise.json())
		.then(json  => useResponse(json));
	}

	//Tratando a resposta do servidor
	const useResponse = (json) => {
		if (json["success"]) {
			document.location.href = "logar.html"
		} else {
			erro.innerHTML = errorRegister()
			$("#myModal").modal("show")
        }
	}
});
