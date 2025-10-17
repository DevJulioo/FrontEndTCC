// meta-diaria.js (Corrigido para salvar antes do cadastro)

document.addEventListener("DOMContentLoaded", () => {
    const options = document.querySelectorAll(".option");
    const continueBtn = document.querySelector(".continue-btn");
    let selectedMinutes = null;

    options.forEach(option => {
        option.addEventListener("click", () => {
            options.forEach(opt => opt.classList.remove("selected"));
            option.classList.add("selected");

            const text = option.textContent.trim();
            const match = text.match(/(\d+)\s*min/);
            if (match) {
                selectedMinutes = parseInt(match[1], 10);
            }

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
            sessionStorage.setItem("userDailyGoal", selectedMinutes);
            // O redirecionamento acontece normalmente pelo href do link <a>
        } else {
            event.preventDefault();
            alert("Não foi possível identificar a meta. Tente novamente.");
        }
    });
});