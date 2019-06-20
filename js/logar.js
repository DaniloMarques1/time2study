import {errorLogin} from './erros.js'

document.addEventListener("DOMContentLoaded", () => {
	const form = document.querySelector("#form")
	const password = document.querySelector("#password")
	const email = document.querySelector("#email")
	const url = "http://localhost:5000/api/logar"
	const erro = document.querySelector("#erro")
	
	form.addEventListener("submit", (event) => {
		event.preventDefault()
		const data = createData()
		request(data)
	});

	const createData = () => {
		const data = new FormData()
		data.append("email", email.value)
		data.append("password", password.value)
		return data
	}

	const request = (data) => {
		//console.log(data.get("email"))
		fetch(url, {method : "POST", body: data})
		.then(promise => promise.json())
		.then(json => response(json))
	}

	const response = (json) => {
		if (json["success"]) {
			localStorage.setItem("log", true)
            window.location.href = "index.html"
		} else {
			erro.innerHTML = errorLogin()
			$("#myModal").modal("show")
		}
	}

});
