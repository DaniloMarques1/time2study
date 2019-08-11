import { showError } from './erros.js'

import { loader } from './loader.js'

document.addEventListener("DOMContentLoaded", () => {
	//Constantes referentes aos inputs html e url
	const name = document.querySelector("#name")
	const password = document.querySelector("#password")
	const confirm_password = document.querySelector("#confirm_password")
	const email = document.querySelector("#email")
	const url = "http://localhost:5000/registrar"
	const form = document.querySelector("#form")
	const erro = document.querySelector("#erro")
	const loaderContent = document.querySelector("#loaderContent")
	const weakPassword = document.querySelector("#weak_password")

	//Criação do form data para enviar na requisição
	const createData = () => {
		const flag = password.value === confirm_password.value ? true : false
		if (flag) {
			if (validPass(password.value)) {
				const data = {name : name.value, email : email.value, password : password.value}
				return data
			} else {
				weakPassword.style.display = "block"
			}
			
		} else {
			erro.innerHTML = showError("password do not match")
			// deixando o modal visivel
			$('#myModalError').modal('show');
		}


		return false
	}

	form.onsubmit = (event) => {
		event.preventDefault()
		loaderContent.innerHTML = loader()
		const data = createData()
		if (data != false) {
			$("#modalLoader").modal("show")
			postRequest(data)
		}
	}

	//Realizando a requisição post enviando os dados do formulario
	const postRequest = (data) => {
		const myHeaders = new Headers()
		myHeaders.append("Content-Type", "application/json")
		fetch(url, {method : "POST", body : JSON.stringify(data), headers : myHeaders})
		.then(promise  => {
			$("#modalLoader").modal("hide")
			if (promise.ok) {
				window.location.href = "logar.html"
			} else {
				//Retorna a resposta como json para ter acesso ao campo "message" do erro
				promise.json().then(json => {
					erro.innerHTML = showError(json.message)
					$("#myModalError").modal("show")
				})
			}
		})
	}

	function validPass(password){
		const regExp = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
		return regExp.test(password)
	}


});
