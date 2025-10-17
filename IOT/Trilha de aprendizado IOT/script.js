// Executado quando a página HTML é totalmente carregada
document.addEventListener("DOMContentLoaded", () => {
    loadSidebarData();
    setupTrilhaAprendizado();
    // CORRIGIDO: Chamando as funções corretas
    setupMenuToggle(); // Usando sua função original, mas corrigida
    setupLogout();
});

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
            // CORRIGIDO: O 'else' foi removido para não interferir com o HTML.
            if (user.avatarUrl) {
                avatarEl.src = `https://educasenai-api.onrender.com${user.avatarUrl}`;
            }
        }

    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
    }
}

// =======================================================
// SEU CÓDIGO ORIGINAL DA TRILHA (INTACTO) 👇
// =======================================================
function setupTrilhaAprendizado() {
    const circulos = document.querySelectorAll(".circulo");
    const botaoReiniciar = document.getElementById("botaoReiniciar");
    const efeitoOnda = document.getElementById("efeitoOnda");
    const somBolha = document.getElementById("somBolha");

    if (!circulos.length) return;

    if (somBolha) {
        somBolha.volume = 0.5;
    }

    const caminhos = {
        "1": "/IOT/Aula01IOT/TabelaConteudo/index.html",
        "2": "/FRONT/Aula02FRONT/OutraPagina/index.html",
        //... (seus outros caminhos)
    };

    function atualizarEstado() {
        let todasMarcadas = true;
        circulos.forEach((circulo, index) => {
            const numero = circulo.getAttribute("data-numero");
            const marcado = sessionStorage.getItem("circulo_" + numero) === "marcado";
            if (marcado) {
                circulo.classList.add("marcado");
                circulo.textContent = "";
            } else {
                circulo.classList.remove("marcado");
                circulo.textContent = numero;
            }
            if (index > 0) {
                const anteriorMarcada = sessionStorage.getItem("circulo_" + circulos[index - 1].getAttribute("data-numero")) === "marcado";
                circulo.style.pointerEvents = anteriorMarcada ? "auto" : "none";
                circulo.style.opacity = anteriorMarcada ? "1" : "0.5";
            } else {
                circulo.style.pointerEvents = "auto";
                circulo.style.opacity = "1";
            }
            if (!marcado) {
                todasMarcadas = false;
            }
        });
        if (botaoReiniciar) {
            botaoReiniciar.disabled = !todasMarcadas;
            botaoReiniciar.style.cursor = todasMarcadas ? "pointer" : "not-allowed";
        }
    }

    circulos.forEach(circulo => {
        circulo.addEventListener("click", () => {
            if (circulo.style.pointerEvents === "none") return;
            const numero = circulo.getAttribute("data-numero");
            sessionStorage.setItem("circulo_" + numero, "marcado");
            atualizarEstado();
            const destino = caminhos[numero] || "/index.html";
            window.location.href = destino;
        });
    });

    if (botaoReiniciar) {
        botaoReiniciar.addEventListener("click", () => {
            if (botaoReiniciar.disabled) return;
            if (somBolha) {
                somBolha.currentTime = 0;
                somBolha.play();
            }
            if (efeitoOnda) efeitoOnda.classList.add("active");
            setTimeout(() => {
                circulos.forEach(circulo => {
                    sessionStorage.removeItem("circulo_" + circulo.getAttribute("data-numero"));
                });
                atualizarEstado();
                if (efeitoOnda) efeitoOnda.classList.remove("active");
            }, 1500);
        });
    }
    
    atualizarEstado();
}
// =======================================================
// FIM DO SEU CÓDIGO ORIGINAL DA TRILHA
// =======================================================

/**
 * Configura o botão de menu para abrir e fechar a barra lateral.
 */
function setupMenuToggle() {
    const botaoMenu = document.getElementById("botaoMenu");
    const navLateral = document.getElementById("navLateral");
    const body = document.body;

    if (botaoMenu && navLateral) {
        botaoMenu.addEventListener("click", () => {
            // =======================================================
            // CORREÇÃO DO MENU AQUI 👇
            // Adiciona/remove classes para o CSS funcionar
            // =======================================================
            const isVisible = navLateral.classList.contains('visivel');
            if (isVisible) {
                navLateral.classList.remove('visivel');
                body.classList.remove('menu-visible');
            } else {
                navLateral.classList.add('visivel');
                body.classList.add('menu-visible');
            }
        });
    }
}

/**
 * Configura o botão de logout.
 */
function setupLogout() {
    const logoutButton = document.getElementById('logout-button');

    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            sessionStorage.removeItem('authToken');
            alert('Você foi desconectado com sucesso.');
            window.location.href = '/TelaInicial/index.html'; 
        });
    }
}