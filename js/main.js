document.addEventListener("DOMContentLoaded", () => {
    const sair = document.querySelector("#sair")
    
    //Limpa o local storage caso o usuario clique no botao de sair e redireciona para a pagina de login
    sair.addEventListener("click", () => {
        localStorage.setItem("log", false)
        window.location.href = "logar.html"
    });

    //div do formulario de criação de tarefa
    const form = document.querySelector("#add_task");

    //div do cronometro
    const timerDiv = document.querySelector("#timer")
 
    

    const requestTasks = () => {
    	/* 
    		faz uma requisição de todas as tasks para o endpoint 
			retorno da requisição no formato -> {"tasks" : [lista de tasks]}
    	*/
    	const url = "http://localhost:5000/api/viewTasks"
    	fetch(url)
    	.then(promise => promise.json())
    	.then(json => {
    		// tasks = json["tasks"]
    		//Passa a lista de tasks
    		showTasks(json["tasks"])
    	})
    }

    const showTasks = (tasks) => {
    	/* 
    		função responsavel por exibir as tasks na tela 
    		@param - tasks - Lista de tarefas
    		@task[0] - id da task
    		@task[1] - id do usuario
    		@task[2] - Titulo da task
    		@task[3] - qtd_pomodoros
    		@task[4] - descrição
    	*/
    	const tasksDiv = document.querySelector("#tasks")
    	
    	for (const task of tasks) {

    		tasksDiv.insertAdjacentHTML("beforeend", createViewTasks(task[2], task[0]))	
    	}
    	//cada dastk criada terá uma classe (plau_button) associado com ela, vamos para cada task adicionar um evento
    	const startTaskButton = Array.from(document.querySelectorAll(".play_button"))
    	
    	startTaskButton.map((i) => {
    		i.addEventListener("click", () => {
    			//pegando o  id que foi atribuido a task
    			const id_task = i.getAttribute("data-id")
    			//recuperar a task (array) clicada
    			const taskArray = getTask(id_task, tasks)
    			//envia essa task clicada para o modal do cronometro que será criada
    			timerDiv.innerHTML = timer(taskArray)
    			//Exibe o modal criado
    			$("#timerModal").modal("show")
    		})
    	});
    }

    const getTask = (id_task, tasks) => {
    	/*
			função vai retornar a task clicada dentro de tasks
			@id_task - id da task clicada
			@tasks - array de arrays (task de tasks)
			retorna o array com os dados da task clicada
    	*/
    	for (let task of tasks) {
    		if (task[0] == id_task) {
    			return task
    		}
    	}
    }

    const createViewTasks = (task_title, task_id) => {
    	/*
			Função responsavel por criar a div com a task onde cada task terá um data-id={task_id}
			@task_title - Titulo da task
			@task_id - Id da task
    	*/
    	return `
    		<div class='task-item'>
    			<span> ${task_title} <span class="play_button oi oi-media-play" data-id='${task_id}'></span></span>
    		</div>

    	`
    }

    //ao carregar a pagina, exibir todas as tasks
    requestTasks()
    
    const timer = (taskArray) => {
    	/*
			criará um modal com os dados da task passada
			@taskArray - array com os dados da task passada.
			@taskArray[0] - id da task
    		@taskArray[1] - id do usuario
    		@taskArray[2] - Titulo da task
    		@taskArray[3] - qtd_pomodoros
    		@taskArray[4] - descrição
    	*/
    	
    	return `
         <div id="timerModal" class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Timer</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                 	<h1>Cronomettro</h1>
                 	<h3>${taskArray[2]}</h3>
                </div>
              </div>
    	</div>

    	`
    }




    const addTask = () => {
    	/*
		função responsavel por enviar os dados para o servidor
    	*/
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
    	/*
		cria um objeto FormData() que será enviado para o servidor
    	*/
    	const data = new FormData();
    	data.append("id_user", id_user)
    	data.append("title", title)
    	data.append("qtd_pomodoros", qtd_pomodoros)
    	data.append("description", description)
    	return data
    }	

   	const request = (data) => {
   		/*
		realiza a requsição post enviando os dados da task que serão salvos
   		*/
   		const url = "http://localhost:5000/api/addTask"
   		fetch(url, {method:"POST", body:data})
   		.then(promise => promise.json())
   		.then(json => response(json))
   	}

   	const response = (json) => {
   		/*
   		json - resposta do servidor ao adicionar uma task
   		*/
   		if (json["success"]) {
   			//caso tudo tenha corrido bem, exibir as tasks
   			requestTasks()
   		}
   	}



});


