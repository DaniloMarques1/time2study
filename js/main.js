function isLogged() {
    const token = localStorage.getItem("token")
    if (token != "undefined" && token != null) {
        const myHeaders = new Headers()
        myHeaders.append("Authorization", "Bearer " + token)
        fetch("http://localhost:5000/user", {method : "GET", headers : myHeaders})
        .then(response => {
            if (!response.ok) {
                window.location.href = "logar.html"
            }
        })

    } else {
        window.location.href = "logar.html"
    }
}

isLogged()

document.addEventListener("DOMContentLoaded", () => {
    const sair = document.querySelector("#sair")
    
    //Limpa o local storage caso o usuario clique no botao de sair e redireciona para a pagina de login
    sair.addEventListener("click", () => {
        console.log("opa")
        localStorage.clear()
        window.location.href = "logar.html"
    });

    //div do formulario de criação de tarefa
    const form = document.querySelector("#add_task");

	const showTasks = () => {
		const tasksDiv = document.querySelector("#tasks")
		const myHeaders = new Headers()
		myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"))
		fetch("http://localhost:5000/tasks", {headers : myHeaders})
		.then(response => {
			if (response.ok) {
				return response.json()
			} else {
				window.location.href = "logar.html"
			}
		})
		.then(json => {
			const tasks = json["tasks"] // lista de tasks onde cada task na lista é um objeto
			let div = "";
			for (const task of tasks) {
				div += genetateDivTask(task)
			}
			tasksDiv.innerHTML = div
		});
	}
	showTasks()

	const genetateDivTask = (task) => {
		return `
			<div class='task-item'>
		    	<span> ${task.title} <span class="play_button oi oi-media-play" data-id='${task.id_task}'></span></span>
		    </div>
		`
	}

    const addTask = () => {
    	/*
		  função responsavel por enviar os dados para o servidor da atividade
		*/
        var myHeaders = new Headers()
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"))
		fetch("http://localhost:5000/user", {method : "GET", headers : myHeaders})
        .then(response => {
			if (response.ok) {
				return response.json()
			} else {
				window.location.href = "logar.html"
			}
		})
		.then(user => {
			console.log
			//Requisição post para adicionar a tarefa
			const titleTask       = document.querySelector("#task_title")
			const taskDescription = document.querySelector("#task_description")
			const taskPomodoro    = document.querySelector("#task_pomodoro")
			const body = {
				"title" : titleTask.value,
				"description" : taskDescription.value,
				"pomodoro_total" : taskPomodoro.value,
				"id_user" : user.id_user
			}
			const myHeaders = new Headers()
			myHeaders.append("Content-Type", "application/json")
			fetch("http://localhost:5000/addTask", {method : "POST", body : JSON.stringify(body), headers : myHeaders})
			.then(response => {
				if (response.ok) {
					showTasks()
					$("#myModal").modal("hide")
					resetFields(titleTask, taskDescription, taskPomodoro)
				}
			})
		});   	
	}
	
	form.addEventListener("submit", (event) => {
		event.preventDefault()
		addTask()
	});

	const resetFields = (...params) =>{
		for (const param of params) {
			param.value = ""
		}
	}

});


