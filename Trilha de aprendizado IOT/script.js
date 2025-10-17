function marcar(elemento) {
    elemento.classList.toggle("marcado");
    if (!elemento.classList.contains("marcado")) {
        elemento.textContent = elemento.getAttribute("data-numero");
    } else {
        elemento.setAttribute("data-numero", elemento.textContent);
        elemento.textContent = "";
    }
}

// Alternar visibilidade do menu lateral ao clicar em "Sair"
document.getElementById("btnSair").addEventListener("click", function(event) {
    event.preventDefault(); // Evita que o link recarregue a página
    document.getElementById("sideNav").classList.toggle("hidden");
});
