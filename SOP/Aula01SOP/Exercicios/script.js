document.addEventListener("DOMContentLoaded", function () {
    const sendButton = document.getElementById("sendButton");
    const resultBanner = document.getElementById("resultBanner");
    const completeResultButton = document.getElementById("completeResultButton");
    const notaElement = document.getElementById("nota");
    const recadoElement = document.getElementById("recado");

    // Gabarito das questões
    const respostasCorretas = {
        q1: "A",
        q2: "C"
    };

    let respostasSelecionadas = {};
    let bloqueado = false; // Bloqueia a seleção após o resultado

    // Seleção das opções
    document.querySelectorAll(".option").forEach(option => {
        option.addEventListener("click", function () {
            if (bloqueado) return; // Se já enviou, não permite mudar

            const question = this.getAttribute("data-question");
            const value = this.getAttribute("data-value");

            // Remove seleções anteriores
            document.querySelectorAll(`.option[data-question="${question}"]`).forEach(opt => {
                opt.classList.remove("selected");
            });

            // Adiciona a nova seleção
            this.classList.add("selected");
            respostasSelecionadas[question] = value;
        });
    });

    // Envio das respostas
    sendButton.addEventListener("click", function () {
        if (sendButton.textContent === "CONTINUAR") {
            window.location.href = "outra_pagina.html"; // Altere para a página desejada
            return;
        }

        let acertos = 0;
        let totalQuestoes = Object.keys(respostasCorretas).length;

        // Verifica se todas as perguntas foram respondidas
        let todasRespondidas = Object.keys(respostasCorretas).every(questao => respostasSelecionadas[questao] !== undefined);
        
        if (!todasRespondidas) {
            showSuccessToast("Por favor, responda todas as questões antes de enviar.");
            return;
        }

        for (let questao in respostasCorretas) {
            if (respostasSelecionadas[questao] === respostasCorretas[questao]) {
                acertos++;
            }
        }

        // Cálculo da nota
        let nota = (acertos / totalQuestoes) * 10;
        notaElement.textContent = `Sua nota: ${nota.toFixed(1)}`;

        // Mensagem personalizada
        let recado = nota === 10 ? "Parabéns! Você acertou tudo!" :
                     nota >= 7 ? "Muito bom! Continue estudando!" :
                     nota >= 5 ? "Foi razoável, mas você pode melhorar!" :
                     "É importante revisar os conteúdos e tentar novamente.";
        recadoElement.textContent = recado;

        resultBanner.style.display = "block";
    });

    // Exibir resultado completo e bloquear novas seleções
    completeResultButton.addEventListener("click", function () {
        resultBanner.style.display = "none";
        bloqueado = true; // Impede que o usuário selecione outras opções

        document.querySelectorAll(".option").forEach(option => {
            const question = option.getAttribute("data-question");
            const value = option.getAttribute("data-value");

            // Remove a classe selected para evitar confusão
            option.classList.remove("selected");

            if (respostasCorretas[question] === value) {
                option.classList.add("correct"); // Azul para corretas
            } else if (respostasSelecionadas[question] === value) {
                option.classList.add("wrong"); // Vermelho para erradas
            }
        });

        // Exibir também a resposta correta das erradas
        for (let questao in respostasCorretas) {
            const respostaCerta = respostasCorretas[questao];

            document.querySelectorAll(`.option[data-question="${questao}"]`).forEach(option => {
                if (option.getAttribute("data-value") === respostaCerta) {
                    option.classList.add("correct"); // Azul na resposta correta
                }
            });
        }

        // Altera o botão "ENVIAR" para "CONTINUAR"
        sendButton.textContent = "CONTINUAR";
    });
});
