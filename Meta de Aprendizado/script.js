document.addEventListener("DOMContentLoaded", () => {
    const options = document.querySelectorAll(".option");
    const continueBtn = document.querySelector(".continue-btn");
    const perguntaEl = document.querySelector(".pergunta");
    
    // Elementos da barra de progresso
    const progressBarContainer = document.getElementById("progress-bar-quiz");
    const progressBarInner = document.getElementById("progress-bar-inner");

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
    
    // CORREÇÃO: Objeto para guardar as respostas
    const quizAnswers = {};

    function atualizarPergunta() {
        if (materias.length === 0) {
            perguntaEl.textContent = "Nenhuma matéria selecionada.";
            // Opcional: redirecionar de volta
            // window.location.href = '/pagina-anterior/index.html';
            return;
        }

        const materiaAtual = materias[currentIndex] || "";
        const siglaAtual = siglas[materiaAtual] || materiaAtual;

        // --- MELHORIA: Atualiza a barra de progresso ---
        const totalPerguntas = materias.length;
        // O progresso é (pergunta atual / total)
        const progressPercent = ((currentIndex + 1) / totalPerguntas) * 100;

        // Atualiza o CSS da barra interna
        // (Você precisa ter um .progress no seu CSS com width 100% dentro do .progress-bar)
        // Se a sua barra .progress for a própria .progress-bar-quiz, use-a.
        // Assumindo que você tem um .progress dentro, como no HTML anterior:
        if (progressBarInner) {
             progressBarInner.style.width = `${progressPercent}%`;
        } else {
            // Se a barra principal é a que cresce:
            progressBarContainer.style.width = `${progressPercent}%`;
        }
        
        // Atualiza acessibilidade da barra
        progressBarContainer.setAttribute("aria-valuenow", Math.round(progressPercent));
        progressBarContainer.setAttribute("aria-valuetext", `Pergunta ${currentIndex + 1} de ${totalPerguntas}: ${materiaAtual}`);
        // --- Fim da Melhoria da Barra ---


        perguntaEl.textContent = `O quanto você entende de ${materiaAtual}?`;

        // Reseta os textos das opções
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
            
            // Reseta o estado visual e de acessibilidade
            option.classList.remove("selected");
            option.setAttribute("aria-checked", "false");
        });

        // Sempre começa desabilitado ao carregar nova pergunta
        continueBtn.classList.add("disabled");
        continueBtn.setAttribute("aria-disabled", "true");
        continueBtn.setAttribute("tabindex", "-1");
    }

    // Inicia a primeira pergunta
    atualizarPergunta();

    // Evento de clique nas opções
    options.forEach(option => {
        option.addEventListener("click", () => {
            // MELHORIA: Lógica de "radio button" simplificada
            
            // 1. Desmarca todos
            options.forEach(opt => {
                opt.classList.remove("selected");
                opt.setAttribute("aria-checked", "false");
            });

            // 2. Marca o clicado
            option.classList.add("selected");
            option.setAttribute("aria-checked", "true");

            // CORREÇÃO: Salva a resposta do usuário
            const materiaAtual = materias[currentIndex];
            const nivelSelecionado = option.textContent;
            quizAnswers[materiaAtual] = nivelSelecionado; // Salva no objeto

            // 3. Habilita o botão "Continuar"
            continueBtn.classList.remove("disabled");
            continueBtn.setAttribute("aria-disabled", "false");
            continueBtn.setAttribute("tabindex", "0");
        });
    });

    // Evento de clique no botão "Continuar"
    continueBtn.addEventListener("click", (event) => {
        event.preventDefault(); // Sempre previne o link, nós controlamos a navegação

        if (continueBtn.classList.contains("disabled")) {
            // CORREÇÃO: Substitui a função que não existe por um alert
            alert("Por favor, selecione uma opção antes de continuar.");
        } else {
            // Avança para a próxima pergunta ou finaliza
            if (currentIndex < materias.length - 1) {
                // Ainda há perguntas
                currentIndex++;
                atualizarPergunta(); // Carrega a próxima pergunta
            } else {
                // Esta foi a última pergunta
                
                // CORREÇÃO: Salva o objeto de respostas final no sessionStorage
                sessionStorage.setItem('quizNivelamentoRespostas', JSON.stringify(quizAnswers));
                
                // Redireciona para a próxima página
                window.location.href = continueBtn.href; // Usa o href do próprio link
            }
        }
    });
});