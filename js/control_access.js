//Só permite ir para a pagina de login caso não esteja logado
const isLogged = () => {
	const token = localStorage.getItem("token")
	var myHeaders = new Headers()
	myHeaders.append("Authorization", "JWT " + token)
	myHeaders.append("Content-Type", "application/json")
	fetch("http://localhost:5000/user", {headers: myHeaders})
	.then(response => {
		if (!response.ok) {
			window.location.href = "logar.html"
		}
	});
	
}

isLogged()