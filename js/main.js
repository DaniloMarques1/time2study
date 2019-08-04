import  { showError } from './erros.js'
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
						erro.innerHTML = showError("unnexpected error")
						//caso o data-id da task tenha sido modificado e o usuario nao possuir aquela task
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
	const startTimer 	= document.querySelector("#startTimer")
	const pauseTimer    = document.querySelector("#pauseTimer")
	const resetTimer    = document.querySelector("#resetTimer")
	const taskValuesDiv = document.querySelector("#task_values")
	const current_pomodoros = document.querySelector("#current_pomodoros")

	//constantes referentes ao usuario
	const DEFAULT_TIMER = 1
	const DEFAULT_BREAK = 5
	const DEFAULT_SECONDS  = 59
	const clockSpeed = 100

	let task_id      = undefined
	let minutes = DEFAULT_TIMER
	let seconds = 0
	let intervalId = undefined
	let breakTime = false

	const timer = (task) => {
		task_id = task.id_task
		const taskInfo = makeTaskInfo(task)
		const taskTitle  = document.querySelector("#task_title_modal")
		time.innerHTML = showTime(minutes, seconds)
		taskTitle.innerHTML = task.title
		taskValuesDiv.innerHTML = taskInfo
		$("#timerModal").modal("show")
	}
	
	const makeTaskInfo = (task) => {
		return `
			<div>
				<h5 class='text-center'>
					${task.current_pomodoros}</span>/${task.pomodoros_total}
				</h5>
				<h5>${task.description}</h5>
			</div>

		`
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
		if (breakTime) {
			intervalId = setInterval(timeBreak, clockSpeed)
		} else {
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
				fetch(`http://localhost:5000/updateTask/${task_id}`, {headers : myHeaders})
				.then(response => {
					minutes = DEFAULT_BREAK
					time.innerHTML = showTime(minutes, seconds)
					if (response.status == 200) {
						// caso tenha finalizado a task
						showTasks()
						return response.json()
					}
					
				})
				.then(json => {
					const taskInfo = makeTaskInfo(json["task"])
					taskValuesDiv.innerHTML = taskInfo
				});
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
		seconds--
		if (seconds <= -1 ) {
			if (minutes == 0 && seconds == -1){
				clearInterval(intervalId)
				console.log("Acabou")
				$("#timerModal").modal("hide")
			} else {
				seconds = DEFAULT_SECONDS
				minutes--
			}
			
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


