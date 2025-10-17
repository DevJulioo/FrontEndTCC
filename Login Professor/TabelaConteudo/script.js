document.addEventListener("DOMContentLoaded", function () {
    const rows = document.querySelectorAll(".menu td");

    rows.forEach(row => {
        row.addEventListener("click", function () {
            // Verifica se a linha já está selecionada
            if (this.classList.contains("selected")) {
                // Desmarca a linha (remove a classe "selected" e o símbolo "✔")
                this.classList.remove("selected");
                this.querySelector(".status").textContent = "";
            } else {
                // Marca a linha (adiciona a classe "selected" e o símbolo "✔")
                this.classList.add("selected");
                this.querySelector(".status").textContent = "✔";
            }
        });
    });
});
