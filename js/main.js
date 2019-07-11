document.addEventListener("DOMContentLoaded", () => {
    const sair = document.querySelector("#sair")
    const form = document.querySelector("#add_task");
    
    //Limpa o local storage caso o usuario clique no botao de sair
    sair.addEventListener("click", () => {
        localStorage.setItem("log", false)
        window.location.href = "logar.html"
        
    });


    const addTask = () => {
    	const title = document.querySelector("#task-title")
    	const qtd_pomodoros = document.querySelector("#task-pomodoro")
    	const description = document.querySelector("#task-description")

    	const data = createData(1, title.value, qtd_pomodoros.value, description.value)
    	request(data)
    }

    form.addEventListener("submit", (event) => {
    	event.preventDefault()
    	addTask()
    });

    const createData = (id_user, title, qtd_pomodoros, description) => {
    	const data = new FormData();
    	data.append("id_user", id_user)
    	data.append("title", title)
    	data.append("qtd_pomodoros", qtd_pomodoros)
    	data.append("description", description)
    	return data
    }	

   	const request = (data) => {
   		const url = "http://localhost:5000/api/addTask"
   		fetch(url, {method:"POST", body:data})
   		.then(promise => promise.json())
   		.then(json => response(json))
   	}

   	const response = (json) => {
   		console.log(json)
   	}

});


