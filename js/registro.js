document.addEventListener("DOMContentLoaded", () => {
	
	const name = document.querySelector("#name")
	const password = document.querySelector("#password")
	const confirm_password = document.querySelector("#confirm_password")
	const email = document.querySelector("#email")
	const sign_up = document.querySelector("#btn_click")
	const url = "http://localhost:5000/registrar"
	const form = document.querySelector("#form")


	const createData = () => {
		const flag = password.value === confirm_password.value ? true : false
		if (flag) {
			const data = new FormData()
			data.append("name", name.value)
			data.append("email", email.value)
			data.append("password", password.value)
			return data
		}
	}

	sign_up.onclick = (event) => {
		const data = createData()
		if(validate(data.get("name"), data.get("email"), data.get("password"))){
			postRequest(data)
		}
	}

	const validate = (...inputs) => {
		for (const input of inputs) {
			if (!input) {
				return false
			}
		}
		return true
	}


	const postRequest = (data) => {
		console.log(data.get("name"))
		fetch(url, {method : "POST", body : data})
		.then(promise  => promise.json())
		.then(json  => {
			if (json.success) {
				document.location.href = "index.html"
			} else {
				console.log("error")
			}
		});
	}
});	