# Time to study
Link para o projeto -> https://danilomarques1.github.io/time2study/index.html

## Gerenciamento de tempo e atividades para o seu estudo

### Usuario
Fará o cadastro no site, e poderá adicionar atividades

### Atividades
Uma atividade (task) poderá ser adicionada tendo um **titulo**, quantidade de **pomodoros** e uma **descrição**.

* **Pomdoro** - Um pomodoro é uma tecnica que divide o seu estudo em periodos de 25 minutos (customizaveis) com um intervalo de 5 minutos a cada pomodoro. Mais informações [aqui](https://pt.wikipedia.org/wiki/T%C3%A9cnica_pomodoro). 

* **Quantidade de pomodoros** - Essa quantidade será a quantidade de pomoros que você deseja dedicar a aquela atividade. Por exemplo, se você cadastrou uma atividade, "Leitura do capitulo 3 do livro X" e colocou 4 de quantida de pomodoros, terá um contador a cada pomodor que você realizar e a atividade só sera finalizada após completar esse contador (4). 

### Iniciar uma atividade
Após ter uma atividade cadastrada ela poderá ser inicializada no quadro (coluna) que terá todas as atividades cadastradas. Após clicar no botão para inicializar o cronometro começará, podendo ser pausado ou resetado. Quando inicializada e o primeiro pomodoro for finalizado, dependendo da quantidade de pomodoros adicionados ela poderá ser finalizada ou não. Após a finalização, a tela deverá voltar para a exibição das atividades cadastradas.

### Historico
Todas as atividades ja finalizadas (completada a quantidade de pomodoros cadastradas) poderá ser vista em um historico, pois cada atividade terá uma **flag** que indicará se a atividade esta ativa ou não.


### Backend
O backend da aplicação foi feito em flask. O repositorio do código da api esta -> https://github.com/DaniloMarques1/Time2StudyApi


### Futuro
**Todo**

### A ordem não necessariamente precisa ser essa

1. Refatoração do front end utilizando o reactjs
2. Pagina de historico de atividades consumindo o endpoint /history
3. Pagina com o perfil do usuario, exibindo informações sobre ele e podendo editar
4. Botão para deletar uma atividade recém criada
