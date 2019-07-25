import  { unexpectedError } from './erros.js'

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
    const erro = document.querySelector("#erro")
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
			const startTask = Array.from(document.querySelectorAll(".play_button"))
			startTask.map(task  => {
				task.addEventListener("click", () => {
					const id_task = task.getAttribute("data-id")
					const specificTask = getTask(tasks, id_task)
					if (specificTask) {
						timer(specificTask)
					} else {
						erro.innerHTML = unexpectedError()
						$("#myModalError").modal("show")
					}
				});
			});
		});
	}
	
	showTasks()
	
	const getTask = (tasks, id_task) => {
		for (const task of tasks) {
			if (task.id_task == id_task) {
				return task
			}
		}
	}

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
		params.map(field => field.value = "")
	}

	/* Geração do cronometro */
	const time = document.querySelector("#minutes_seconds_value")
	const startTimer = document.querySelector("#startTimer")
	const pauseTimer = document.querySelector("#pauseTimer")
	const resetTimer = document.querySelector("#resetTimer")
	let task_id      = undefined

	let minutes = 1
	let seconds = 0
	let intervalId = undefined
	
	const timer = (task) => {
		task_id = task.id_task
		console.log(task_id)
		time.innerHTML = showTime(minutes, seconds)
		$("#timerModal").modal("show")
	}
	
	const showTime = (minutes, seconds) => {
		return `${padNumber(minutes)}:${padNumber(seconds)}`
	}

	const padNumber = (number) => {
		number = number.toString()
		if (number.length < 2) {
			number = "0" + number
		}
		return number
	}

	startTimer.addEventListener("click", () => {
		intervalId = setInterval(timeIt, 100)
	})

	const timeIt = () => {
		seconds--
		if (seconds <= -1) {
			
			if (minutes == 0 && seconds == -1) {
				seconds = 0
				const myHeaders = new Headers()
				myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"))
				fetch(`http://localhost:5000/updateTask/${task_id}`, {headers : myHeaders})
				.then(response => {
					if (response.status == 200) {
						showTasks()
					} 
					
				})
				clearInterval(intervalId)
			}else {
				seconds = 59
				minutes--
			}
			
		}
		time.innerHTML = showTime(minutes, seconds)
	}

	document.querySelector("#close_timer").addEventListener("click", () => {
		minutes = 25
		seconds = 0
		clearInterval(intervalId)
	})

	resetTimer.addEventListener("click", () => {
		minutes = 25
		seconds = 0
		clearInterval(intervalId)
		time.innerHTML = showTime(minutes, seconds)
	});

	pauseTimer.addEventListener("click", () => {
		clearInterval(intervalId)
	});	
});


