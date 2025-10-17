document.addEventListener("DOMContentLoaded", () => {
  const options = document.querySelectorAll(".option");
  const continueBtn = document.querySelector(".continue-btn");
  const perguntaEl = document.querySelector(".pergunta");

  // Mapa de siglas
  const siglas = {
    "IOT": "IOT",
    "Sistema Operacionais": "SOP",
    "Levantamento de Requisitos": "LEV",
    "BackEnd": "BE",
    "Banco de Dados": "BD",
    "Front End": "FE"
  };

  // Recupera as matérias salvas
  const materias = JSON.parse(sessionStorage.getItem("materiasSelecionadas")) || [];
  let currentIndex = 0;

  function atualizarPergunta() {
    const materiaAtual = materias[currentIndex] || "";
    const siglaAtual = siglas[materiaAtual] || materiaAtual;

    perguntaEl.textContent = `O quanto você entende de ${materiaAtual}?`;

    options.forEach((option, idx) => {
      if (idx === 0) {
        option.textContent = `Não sei nada de ${siglaAtual}!`;
      } else if (idx === 1) {
        option.textContent = "Sei o básico";
      } else if (idx === 2) {
        option.textContent = "Sei, mas preciso de ajuda!";
      } else if (idx === 3) {
        option.textContent = "Sei, mas quero aprender mais";
      }
    });

    // Sempre começa desabilitado
    continueBtn.classList.add("disabled");
    continueBtn.setAttribute("aria-disabled", "true");
    continueBtn.setAttribute("tabindex", "-1");
  }

  atualizarPergunta();

  options.forEach(option => {
    option.addEventListener("click", () => {
      if (option.classList.contains("selected")) {
        option.classList.remove("selected");
        const anySelected = Array.from(options).some(opt => opt.classList.contains("selected"));
        if (!anySelected) {
          continueBtn.classList.add("disabled");
          continueBtn.setAttribute("aria-disabled", "true");
          continueBtn.setAttribute("tabindex", "-1");
        }
      } else {
        options.forEach(opt => opt.classList.remove("selected"));
        option.classList.add("selected");

        continueBtn.classList.remove("disabled");
        continueBtn.setAttribute("aria-disabled", "false");
        continueBtn.setAttribute("tabindex", "0");
      }
    });
  });

  continueBtn.addEventListener("click", (event) => {
    if (continueBtn.classList.contains("disabled")) {
      event.preventDefault();
      showSuccessToast("Por favor, selecione uma opção antes de continuar.");
    } else {
      event.preventDefault();
      if (currentIndex < materias.length - 1) {
        currentIndex++;
        atualizarPergunta();
      } else {
        window.location.href = "/Tempo de estudos/index.html";
      }
    }
  });
});
