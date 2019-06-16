//Limpa o local storage caso o usuario clique no botao de sair
document.addEventListener("DOMContentLoaded", () => {
    const sair = document.querySelector("#sair")

    sair.addEventListener("click", () => {
        localStorage.setItem("log", false)
        window.location.href = "logar.html"
    });

})

