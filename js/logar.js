import { loader } from './loader.js'

import { showError } from './erros.js'

const baseUrl = "http://danilomarques.pythonanywhere.com/"

//Só permite ir para a pagina de login caso não esteja logado
const isLogged = () => {
	const token = localStorage.getItem("token")
	if (token != "undefined" && token != null) {
		var myHeaders = new Headers()
		myHeaders.append("Authorization", "Bearer " + token)
		myHeaders.append("Content-Type", "application/json")
		fetch(`${baseUrl}/user`, {headers: myHeaders})
		.then(response => {
			if (response.ok) {
				window.location.href = "index.html"
			}		
		})

	}
}
isLogged()

document.addEventListener("DOMContentLoaded", () => {
	const form = document.querySelector("#form")
	const password = document.querySelector("#password")
	const email = document.querySelector("#email")
	const url = `${baseUrl}/logar`
	const erro = document.querySelector("#erro")
	const btnSubmit = document.querySelector("#btn_click")
	const loaderContent = document.querySelector("#loaderContent")

	form.addEventListener("submit", (event) => {
		event.preventDefault()
		btnSubmit.disabled = true
		const data = createData()
		loaderContent.innerHTML = loader()
		$("#modalLoader").modal("show")
		request(data)
	});

	const createData = () => {
		const data = {email : email.value, password : password.value}
		return JSON.stringify(data)
	}
	
	const request = (data) => {
		const myHeaders = new Headers()
		myHeaders.append("Content-Type", "application/json");
		fetch(url, {method : "POST", headers: myHeaders, body: data})
		.then(res => {
			btnSubmit.disabled = false
			$("#modalLoader").modal("hide")	
			if (res.ok) {
				//caso o o usuario seja valido
				res.json().then(json => {
					const token = json["token"]
					localStorage.setItem("token", token)
					window.location.href = "index.html"
				})
			} else {
				//caso o usuario nao bata
				res.json().then(json => {
					erro.innerHTML = showError(json.message)
					$("#myModalError").modal("show")
				})
			}
		})

	}

});
