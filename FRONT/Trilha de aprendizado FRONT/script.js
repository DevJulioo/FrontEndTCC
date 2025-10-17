// Executado quando a página HTML é totalmente carregada
document.addEventListener("DOMContentLoaded", () => {
    // 1. Carrega os dados do usuário (foto, nome, etc.) na sidebar
    loadSidebarData();

    // 2. Configura a lógica dos círculos da trilha
    setupTrilhaAprendizado();

    // 3. Configura a lógica do botão de menu (sua função original)
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
            // =======================================================
            // A CORREÇÃO FINAL ESTÁ AQUI 👇
            // SÓ altera a imagem se o usuário tiver uma customizada na API
            // =======================================================
            if (user.avatarUrl) {
                avatarEl.src = `https://educasenai-api.onrender.com${user.avatarUrl}`;
            }
            // O 'else' foi removido. Se não houver foto customizada,
            // o JS NÃO FAZ NADA, deixando a imagem que o seu HTML já carregou em paz.
        }
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
    }
}


/**
 * Configura toda a lógica de funcionamento da Trilha de Aprendizado.
 */
function setupTrilhaAprendizado() {
    const bolinhas = document.querySelectorAll(".bolinha");
    const btnReset = document.getElementById("btnReset");
    const waveEffect = document.getElementById("waveEffect");
    const bubbleSound = document.getElementById("bubbleSound");

    if (!bolinhas.length) return;

    if (bubbleSound) {
        bubbleSound.volume = 0.5;
    }

    const caminhos = {
        "1": "/FRONT/Aula01FRONT/TabelaConteudofront/index.html",
        "2": "/FRONT/Aula02FRONT/OutraPagina/index.html",
        "3": "/FRONT/Aula03FRONT/OutraPagina2/index.html",
        "4": "/FRONT/Aula04FRONT/OutraPagina3/index.html",
        "5": "/FRONT/Aula05FRONT/OutraPagina4/index.html",
        "6": "/FRONT/Aula06FRONT/OutraPagina5/index.html",
        "7": "/FRONT/Aula07FRONT/OutraPagina6/index.html"
    };

    function atualizarEstado() {
        let todasMarcadas = true;
        bolinhas.forEach((bolinha, index) => {
            const numero = bolinha.getAttribute("data-numero");
            const marcado = sessionStorage.getItem("bolinha_" + numero) === "marcado";
            if (marcado) {
                bolinha.classList.add("marcado");
                bolinha.textContent = "";
            } else {
                bolinha.classList.remove("marcado");
                bolinha.textContent = numero;
            }
            if (index > 0) {
                const anteriorMarcada = sessionStorage.getItem("bolinha_" + bolinhas[index - 1].getAttribute("data-numero")) === "marcado";
                bolinha.style.pointerEvents = anteriorMarcada ? "auto" : "none";
                bolinha.style.opacity = anteriorMarcada ? "1" : "0.5";
            } else {
                bolinha.style.pointerEvents = "auto";
                bolinha.style.opacity = "1";
            }
            if (!marcado) {
                todasMarcadas = false;
            }
        });
        if (btnReset) {
            btnReset.disabled = !todasMarcadas;
            btnReset.style.cursor = todasMarcadas ? "pointer" : "not-allowed";
        }
    }

    bolinhas.forEach(bolinha => {
        bolinha.addEventListener("click", () => {
            if (bolinha.style.pointerEvents === "none") return;
            const numero = bolinha.getAttribute("data-numero");
            sessionStorage.setItem("bolinha_" + numero, "marcado");
            atualizarEstado();
            const destino = caminhos[numero] || "/index.html";
            window.location.href = destino;
        });
    });

    if (btnReset) {
        btnReset.addEventListener("click", () => {
            if (btnReset.disabled) return;
            if (bubbleSound) {
                bubbleSound.currentTime = 0;
                bubbleSound.play();
            }
            if (waveEffect) waveEffect.classList.add("active");
            setTimeout(() => {
                bolinhas.forEach(bolinha => {
                    sessionStorage.removeItem("bolinha_" + bolinha.getAttribute("data-numero"));
                });
                atualizarEstado();
                if (waveEffect) waveEffect.classList.remove("active");
            }, 1500);
        });
    }

    atualizarEstado();
}

/**
 * Configura o botão de menu para abrir e fechar a barra lateral.
 * (SEU CÓDIGO ORIGINAL - INTACTO)
 */
function setupMenuToggle() {
    const menuBtn = document.getElementById("menuBtn");
    const sideNav = document.getElementById("sideNav");
    if (menuBtn && sideNav) {
        menuBtn.addEventListener("click", () => {
            sideNav.classList.toggle("hidden");
        });
    }
}

/**
 * Adiciona a funcionalidade de logout ao botão com id="logout-button".
 * (SEU CÓDIGO ORIGINAL - INTACTO)
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