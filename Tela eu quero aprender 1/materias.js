document.addEventListener("DOMContentLoaded", function() {
    const subjects = document.querySelectorAll(".subject");
    const semesterSelect = document.querySelector(".semester-select");
    const btnContinuar = document.getElementById("btn-continuar");

    // Dados das matérias por semestre (SEU CÓDIGO ORIGINAL)
    const materiasPorSemestre = {
        "1": [
            { nome: "IOT", img: "./img/iot.png" },
            { nome: "Sistema Operacionais", img: "./img/sistemas.png" },
            { nome: "Levantamento de Requisitos", img: "./img/levantamento.png" }
        ],
        "2": [
            { nome: "BackEnd", img: "img/BackEnd.png" },
            { nome: "Banco de Dados", img: "img/BancoDeDados.png" },
            { nome: "Front End", img: "img/FrontEnd.png" }
        ]
    };

    // Armazena seleção por semestre (índices) (SEU CÓDIGO ORIGINAL)
    const selecaoPorSemestre = {
        "1": new Set(),
        "2": new Set()
    };

    // Atualiza matérias exibidas (CORRIGIDO)
    function atualizarMaterias(semestre) {
        const materias = materiasPorSemestre[semestre] || [];
        subjects.forEach((subject, i) => {
            const img = subject.querySelector("img");
            const p = subject.querySelector("p");

            if (materias[i]) {
                img.src = materias[i].img;
                img.alt = materias[i].nome;
                p.textContent = materias[i].nome;
                subject.style.display = "inline-block"; // Garante que a matéria apareça
            } else {
                // Limpa e oculta a matéria se não houver dados
                img.src = "";
                img.alt = ""; // CORREÇÃO: Limpa o 'alt' também
                p.textContent = "";
                subject.style.display = "none"; // Oculta o 'subject'
            }

            // CORREÇÃO: Verifica se 'semestre' existe antes de acessar 'selecaoPorSemestre[semestre]'
            if (semestre && selecaoPorSemestre[semestre] && selecaoPorSemestre[semestre].has(i)) {
                subject.classList.add("selecionada");
            } else {
                subject.classList.remove("selecionada");
            }
        });
    }

    // Verifica se há alguma seleção em qualquer semestre (SEU CÓDIGO ORIGINAL)
    function temSelecao() {
        return Object.values(selecaoPorSemestre).some(set => set.size > 0);
    }

    // Atualiza estado do botão continuar (SEU CÓDIGO ORIGINAL)
    function atualizarBotaoContinuar() {
        if (temSelecao()) {
            btnContinuar.classList.remove("disabled");
            btnContinuar.setAttribute("tabindex", "0");
            btnContinuar.setAttribute("aria-disabled", "false");
        } else {
            btnContinuar.classList.add("disabled");
            btnContinuar.setAttribute("tabindex", "-1");
            btnContinuar.setAttribute("aria-disabled", "true");
        }
    }

    // Clique para selecionar/deselecionar matéria (CORRIGIDO)
    subjects.forEach((subject, i) => {
        subject.addEventListener("click", () => {
            const semestreAtual = semesterSelect.value;
            if (!semestreAtual) {
                // CORREÇÃO: 'showSuccessToast' não existia, substituído por 'alert'
                alert("Por favor, selecione um semestre primeiro.");
                return;
            }

            // Lógica original de seleção
            if (subject.classList.contains("selecionada")) {
                subject.classList.remove("selecionada");
                selecaoPorSemestre[semestreAtual].delete(i);
            } else {
                subject.classList.add("selecionada");
                selecaoPorSemestre[semestreAtual].add(i);
            }

            atualizarBotaoContinuar();
        });
    });

    // Troca de semestre (CORRIGIDO/SIMPLIFICADO)
    semesterSelect.addEventListener("change", () => {
        const semestreSelecionado = semesterSelect.value;
        
        // CORREÇÃO: A função 'atualizarMaterias' já lida com o caso de
        // semestreSelecionado ser "" (vazio), limpando a tela.
        atualizarMaterias(semestreSelecionado);
        
        // A lógica de `temSelecao` funciona corretamente,
        // mantendo o botão ativo se houver seleção em *outro* semestre.
        atualizarBotaoContinuar();
    });

    // Salva as matérias selecionadas no sessionStorage ao continuar (SEU CÓDIGO ORIGINAL)
    btnContinuar.addEventListener("click", (e) => {
        if (!temSelecao()) {
            e.preventDefault();
            return;
        }

        let todasMateriasSelecionadas = [];

        // Percorre todos os semestres e pega as matérias escolhidas
        Object.keys(selecaoPorSemestre).forEach(semestre => {
            // Garante que só tente acessar o semestre se ele existir nos dados
            if (materiasPorSemestre[semestre]) { 
                selecaoPorSemestre[semestre].forEach(index => {
                    // Garante que o índice existe na lista de matérias
                    if (materiasPorSemestre[semestre][index]) { 
                        todasMateriasSelecionadas.push(materiasPorSemestre[semestre][index].nome);
                    }
                });
            }
        });

        // Salva no sessionStorage
        sessionStorage.setItem("materiasSelecionadas", JSON.stringify(todasMateriasSelecionadas));
    });

    // --- EXECUÇÃO INICIAL ---
    
    // CORREÇÃO: Limpa a tela ao carregar (oculta as 3 matérias)
    atualizarMaterias(""); 
    
    // Atualiza o botão (que começará desabilitado)
    atualizarBotaoContinuar();
});