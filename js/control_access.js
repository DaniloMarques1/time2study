//Função que checa o local storage para ve se o usuario esta logado
const isLog = () => {
    const flag = localStorage.getItem("log")
    if (flag == "false") {
        window.location.href = "logar.html"
    }
}

isLog()
