import  { unexpectedError } from './erros.js'
import  { loader }          from './loader.js'


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
	const loaderContent = document.querySelector("#loaderContent")

	loaderContent.innerHTML = loader()
	$("#modalLoader").modal("show")
	console.log(loader())

	//Limpa o local storage caso o usuario clique no botao de sair e redireciona para a pagina de login
    sair.addEventListener("click", () => {
		$("#modalLoader").modal("show")
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
			$("#modalLoader").modal("hide")
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
		$("#modalLoader").modal("show")
		fetch("http://localhost:5000/user", {method : "GET", headers : myHeaders})
        .then(response => {
			$("#modalLoader").modal("hide")
			if (response.ok) {
				return response.json()
			} else {
				window.location.href = "logar.html"
			}
		})
		.then(user => {
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

	//constantes referentes ao usuario
	const DEFAULT_TIMER = 25
	const DEFAULT_BREAK = 5
	const DEFAULT_SECONDS  = 59
	const clockSpeed = 1000

	let task_id      = undefined

	let minutes = DEFAULT_TIMER
	let seconds = 0
	let intervalId = undefined
	let breakTime = false

	const timer = (task) => {
		task_id = task.id_task
		
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
		console.log("Opa")
		if (breakTime) {
			console.log("Opa 2")
			intervalId = setInterval(timeBreak, clockSpeed)
		} else {
			console.log("Opa 3")
			intervalId = setInterval(timeIt, clockSpeed)
		}
	})

	const timeIt = () => {
		seconds--
		if (seconds <= -1) {
			
			if (minutes == 0 && seconds == -1) {
				seconds = 0
				const myHeaders = new Headers()
				myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"))
				// fetch(`http://localhost:5000/updateTask/${task_id}`, {headers : myHeaders})
				// .then(response => {
				// 	if (response.status == 200) {
				// 		showTasks()
				// 		minutes = DEFAULT_BREAK
				// 		seconds = 0
				// 	} 
					
				// })
				minutes = DEFAULT_TIMER
				seconds = 0
				breakTime = true
				clearInterval(intervalId)
			}else {
				seconds = DEFAULT_SECONDS
				minutes--
			}
			
		}
		time.innerHTML = showTime(minutes, seconds)
	}

	const timeBreak = () => {
		console.log("Time break")
		seconds--
		if (seconds <= -1 ) {
			minutes--
			seconds = DEFAULT_SECONDS;
		}
		time.innerHTML = showTime(minutes, seconds)
	}

	document.querySelector("#close_timer").addEventListener("click", () => {
		minutes = DEFAULT_TIMER
		seconds = 0
		clearInterval(intervalId)
	})

	resetTimer.addEventListener("click", () => {
		minutes = breakTime ? DEFAULT_BREAK : DEFAULT_TIMER
		seconds = 0
		clearInterval(intervalId)
		time.innerHTML = showTime(minutes, seconds)
	});

	pauseTimer.addEventListener("click", () => {
		clearInterval(intervalId)
	});	
});


