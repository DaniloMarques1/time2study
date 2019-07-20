import {errorLogin} from './erros.js'

//Só permite ir para a pagina de login caso não esteja logado
const isLogged = () => {
	const token = localStorage.getItem("token")
	var myHeaders = new Headers()
	myHeaders.append("Authorization", "JWT " + token)
	myHeaders.append("Content-Type", "application/json")
	fetch("http://localhost:5000/user", {headers: myHeaders})
	.then(response => {
		if (response.status == 200) {
			window.location.href = "index.html"
		}
		
	})
}
isLogged()

document.addEventListener("DOMContentLoaded", () => {
	const form = document.querySelector("#form")
	const password = document.querySelector("#password")
	const email = document.querySelector("#email")
	const url = "http://localhost:5000/auth"
	const erro = document.querySelector("#erro")
	
	form.addEventListener("submit", (event) => {
		event.preventDefault()
		const data = createData()
		request(data)
	});

	const createData = () => {
		const data = {username : email.value, password : password.value}
		return JSON.stringify(data)
	}
	const request = (data) => {
		const myHeaders = new Headers()
		myHeaders.append("Content-Type", "application/json");
		fetch(url, {method : "POST", headers: myHeaders, body: data})
		.then(res => {
			return res.json()
		})
		.then(json => response(json))
	}

	const response = (jsonResponse) => {
		// window.location.href = 	"index.html"
		if (jsonResponse.hasOwnProperty("status_code")) {
			erro.innerHTML = errorLogin()
			$("#myModal").modal("show")
		} else {
			const token = jsonResponse["access_token"]
			localStorage.setItem("token", token)
			window.location.href = "index.html"
		}
	}

});
