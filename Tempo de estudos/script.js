// script.js (antes nomeado 'meta-diaria.js')

document.addEventListener("DOMContentLoaded", () => {
    const options = document.querySelectorAll(".option");
    const continueBtn = document.querySelector(".continue-btn");
    let selectedMinutes = null;

    options.forEach(option => {
        option.addEventListener("click", () => {
            // Desmarca todos visualmente e para acessibilidade
            options.forEach(opt => {
                opt.classList.remove("selected");
                opt.setAttribute("aria-checked", "false"); // MELHORIA DE ACESSIBILIDADE
            });
            
            // Marca o clicado
            option.classList.add("selected");
            option.setAttribute("aria-checked", "true"); // MELHORIA DE ACESSIBILIDADE

            // Sua lógica original para extrair os minutos (está ótima)
            const text = option.textContent.trim();
            const match = text.match(/(\d+)\s*min/);
            if (match) {
                selectedMinutes = parseInt(match[1], 10);
            }

            // Habilita o botão
            continueBtn.classList.remove("disabled");
            continueBtn.setAttribute("aria-disabled", "false");
            continueBtn.setAttribute("tabindex", "0");
        });
    });

    continueBtn.addEventListener("click", (event) => {
        if (continueBtn.classList.contains("disabled")) {
            event.preventDefault();
            alert("Por favor, selecione uma opção antes de continuar.");
            return;
        }

        if (selectedMinutes !== null) {
            // Salva a meta escolhida no sessionStorage para ser usada na próxima página
            // Sua lógica aqui está perfeita!
            sessionStorage.setItem("userDailyGoal", selectedMinutes);
            // O redirecionamento acontece normalmente pelo href do link <a>
        } else {
            // Fallback caso algo dê errado na extração dos minutos
            event.preventDefault();
            alert("Não foi possível identificar a meta. Tente novamente.");
        }
    });
});