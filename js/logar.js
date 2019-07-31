import {errorLogin} from './erros.js'
import { loader } from './loader.js'


//Só permite ir para a pagina de login caso não esteja logado
const isLogged = () => {
	const token = localStorage.getItem("token")
	if (token != "undefined" && token != null) {
		var myHeaders = new Headers()
		myHeaders.append("Authorization", "Bearer " + token)
		myHeaders.append("Content-Type", "application/json")
		fetch("http://localhost:5000/user", {headers: myHeaders})
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
	const url = "http://localhost:5000/logar"
	const erro = document.querySelector("#erro")
	const btnSubmit = document.querySelector("#btn_click")
	const loaderContent = document.querySelector("#loaderContent")

	form.addEventListener("submit", (event) => {
		event.preventDefault()
		btnSubmit.disabled = true
		const data = createData()
		loaderContent.innerHTML = loader()
		$("#modalLoader").modal("show")
		console.log(loader())
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
				return res.json()
			} else {
				erro.innerHTML = errorLogin()
				$("#myModalError").modal("show")
			}
		})
		.then(json => {
			const token = json["token"]
			localStorage.setItem("token", token)
			window.location.href = "index.html"
		});
	}

});
