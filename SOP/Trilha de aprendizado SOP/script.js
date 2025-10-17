// Executado quando a página HTML é totalmente carregada
document.addEventListener("DOMContentLoaded", () => {
    // 1. Carrega os dados do usuário (foto, nome, etc.) na sidebar
    loadSidebarData();

    // 2. Configura a lógica dos círculos da trilha (seu código original)
    setupTrilhaAprendizado();

    // 3. Configura a lógica do botão de menu (seu código original)
    setupMenuToggle();

    // 4. Configura o botão de logout
    setupLogoutButton();
});

/**
 * Busca os dados do usuário no back-end e preenche a sidebar.
 */
async function loadSidebarData() {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
        console.warn("Nenhum token de autenticação encontrado.");
        return;
    }
    try {
        const response = await fetch('https://educasenai-api.onrender.com/api/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Falha na autenticação.');
        const user = await response.json();
        
        const usernameEl = document.getElementById('sidebar-username');
        const roleEl = document.getElementById('sidebar-role');
        const avatarEl = document.getElementById('sidebar-avatar');

        if (usernameEl) usernameEl.textContent = user.name;
        if (roleEl) roleEl.textContent = user.role;
        if (avatarEl) {
            // SÓ altera a imagem se o usuário tiver uma customizada na API
            if (user.avatarUrl) {
                avatarEl.src = `https://educasenai-api.onrender.com${user.avatarUrl}`;
            }
            // Se não tiver, NÃO FAZ NADA, deixando a imagem do HTML (agora corrigido) carregar.
        }
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
    }
}

/**
 * Configura toda a lógica de funcionamento da Trilha de Aprendizado.
 */
function setupTrilhaAprendizado() {
    const circulos3 = document.querySelectorAll(".circulo3");
    const botaoReset3 = document.getElementById("botaoReiniciar3");
    const efeitoOnda3 = document.getElementById("efeito-de-onda3");
    const somBolha3 = document.getElementById("som-bolhas3");

    if (!circulos3.length) return;

    if (somBolha3) {
        somBolha3.volume = 0.5;
    }
    const caminhos = {
        "1": "/SOP/Aula01SOP/TabelaConteudosop/index.html",
        "2": "FRONT/Aula02FRONT/OutraPagina/index.html",
        "3": "FRONT/Aula03FRONT/OutraPagina2/index.html",
        "4": "FRONT/Aula04FRONT/OutraPagina3/index.html",
        "5": "FRONT/Aula05FRONT/OutraPagina4/index.html",
        "6": "FRONT/Aula06FRONT/OutraPagina5/index.html",
        "7": "FRONT/Aula07FRONT/OutraPagina6/index.html"
    };
    function atualizar() {
        let todasSelecionadas = true;
        circulos3.forEach((circulo, idx) => {
            const num = circulo.getAttribute("data-num");
            const marcado = sessionStorage.getItem("circulo3_" + num) === "marcado";
            if (marcado) {
                circulo.classList.add("selecionado3");
                circulo.textContent = "";
            } else {
                circulo.classList.remove("selecionado3");
                circulo.textContent = num;
            }
            if (idx > 0) {
                const anteriorMarcada = sessionStorage.getItem("circulo3_" + circulos3[idx - 1].getAttribute("data-num")) === "marcado";
                circulo.style.pointerEvents = anteriorMarcada ? "auto" : "none";
                circulo.style.opacity = anteriorMarcada ? "1" : "0.5";
            } else {
                circulo.style.pointerEvents = "auto";
                circulo.style.opacity = "1";
            }
            if (!marcado) {
                todasSelecionadas = false;
            }
        });
        if (botaoReset3) {
            botaoReset3.disabled = !todasSelecionadas;
            botaoReset3.style.cursor = todasSelecionadas ? "pointer" : "not-allowed";
        }
    }
    circulos3.forEach(circulo => {
        circulo.addEventListener("click", () => {
            if (circulo.style.pointerEvents === "none") return;
            const num = circulo.getAttribute("data-num");
            sessionStorage.setItem("circulo3_" + num, "marcado");
            atualizar();
            const destino = caminhos[num] || "/index.html";
            window.location.href = destino;
        });
    });
    if (botaoReset3) {
        botaoReset3.addEventListener("click", () => {
            if (botaoReset3.disabled) return;
            if (somBolha3) {
                somBolha3.currentTime = 0;
                somBolha3.play();
            }
            if (efeitoOnda3) efeitoOnda3.classList.add("ativo3");
            setTimeout(() => {
                circulos3.forEach(circulo => {
                    sessionStorage.removeItem("circulo3_" + circulo.getAttribute("data-num"));
                });
                atualizar();
                if (efeitoOnda3) efeitoOnda3.classList.remove("ativo3");
            }, 1500);
        });
    }
    atualizar();
}

/**
 * Configura o botão de menu para abrir e fechar a barra lateral.
 */
function setupMenuToggle() {
    const botaoMenu3 = document.getElementById("botaoMenu3");
    const navLat3 = document.getElementById("navEsquerda3");
    if (botaoMenu3 && navLat3) {
        botaoMenu3.addEventListener("click", () => {
            navLat3.classList.toggle("escondido3");
        });
    }
}

/**
 * Adiciona a funcionalidade de logout ao botão com id="logout-button".
 */
function setupLogoutButton() {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            sessionStorage.removeItem('authToken');
            alert('Você foi desconectado.');
            window.location.href = '/Login Principal/login.html'; // Ajuste se necessário
        });
    }
}