document.addEventListener("DOMContentLoaded", function () {
    const sendButton = document.getElementById("sendButton");
    const resultBanner = document.getElementById("resultBanner");
    const completeResultButton = document.getElementById("completeResultButton");
    const notaElement = document.getElementById("nota");
    const recadoElement = document.getElementById("recado");

    const respostasCorretas = { q1: "A", q2: "C" };
    let respostasSelecionadas = {};
    let bloqueado = false;

    // --- FUNÇÃO ADICIONADA PARA ENVIAR A NOTA PARA A API ---
    async function enviarResultadoParaAPI(notaFinal) {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
            console.error("Usuário não autenticado. Não é possível salvar a nota.");
            return;
        }
        
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

        try {
            const response = await fetch('https://educasenai-api.onrender.com/api/aluno/avaliacoes', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    nota: notaFinal,
                    cursoId: "iot" // Identificador do curso/prova
                })
            });

            if (response.ok) {
                console.log("Nota salva com sucesso no banco de dados!");
            } else {
                console.error("Falha ao salvar a nota no banco de dados.");
            }
        } catch (error) {
            console.error("Erro de rede ao enviar a nota:", error);
        }
    }

    // Seleção das opções
    document.querySelectorAll(".option").forEach(option => {
        option.addEventListener("click", function () {
            if (bloqueado) return;
            const question = this.getAttribute("data-question");
            const value = this.getAttribute("data-value");

            document.querySelectorAll(`.option[data-question="${question}"]`).forEach(opt => {
                opt.classList.remove("selected");
            });

            this.classList.add("selected");
            respostasSelecionadas[question] = value;
        });
    });

    // Envio das respostas
    sendButton.addEventListener("click", function () {
        if (sendButton.textContent === "CONTINUAR") {
            window.location.href = "/IOT/Aula01IOT/TabelaConteudo/index.html";
            return;
        }

        let totalQuestoes = Object.keys(respostasCorretas).length;
        if (Object.keys(respostasSelecionadas).length !== totalQuestoes) {
            showSuccessToast("Por favor, responda todas as questões antes de enviar.");
            return;
        }

        let acertos = 0;
        for (let questao in respostasCorretas) {
            if (respostasSelecionadas[questao] === respostasCorretas[questao]) {
                acertos++;
            }
        }

        // Cálculo da nota
        let nota = (acertos / totalQuestoes) * 10;
        notaElement.textContent = `Sua nota: ${nota.toFixed(1)}`;

        // --- CHAMADA DA FUNÇÃO DA API ---
        // Envia a nota para o back-end assim que ela for calculada
        enviarResultadoParaAPI(nota); 
        // ---------------------------------

        // Mensagem personalizada
        let recado = nota >= 7 ? "Muito bom! Continue estudando!" : "É importante revisar os conteúdos.";
        recadoElement.textContent = recado;
        resultBanner.style.display = "block";
    });

    // Exibir resultado completo e bloquear novas seleções
    completeResultButton.addEventListener("click", function () {
        resultBanner.style.display = "none";
        bloqueado = true;

        document.querySelectorAll(".option").forEach(option => {
            const question = option.getAttribute("data-question");
            const value = option.getAttribute("data-value");

            option.classList.remove("selected");

            if (respostasCorretas[question] === value) {
                option.classList.add("correct");
            } else if (respostasSelecionadas[question] === value) {
                option.classList.add("wrong");
            }
        });

        sendButton.textContent = "CONTINUAR";
    });
});