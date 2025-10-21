document.addEventListener("DOMContentLoaded", () => {
    // Carrega dados da sidebar
    loadSidebarData();
    
    // Configura o botão de menu (hamburguer)
    setupMenuToggle();

    // Configura a lógica da trilha de aprendizado
    setupTrilha();

    // Configura o botão de logout
    setupLogout();
});

// --- Funções Auxiliares ---

async function loadSidebarData() {
    const token = sessionStorage.getItem('authToken');
    if (!token) { 
        console.warn("Token não encontrado, redirecionando para login.");
        window.location.href = '/Login Principal/login.html'; 
        return; 
    }
    try {
        const response = await fetch('https://educasenai-api.onrender.com/api/users/me', { 
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        if (!response.ok) throw new Error('Falha na autenticação.');
        const user = await response.json();
        
        document.getElementById('sidebar-username').textContent = user.name;
        document.getElementById('sidebar-role').textContent = user.role;
        const sidebarAvatar = document.getElementById('sidebar-avatar');

        if (user.avatarUrl) { 
            sidebarAvatar.src = `https://educasenai-api.onrender.com${user.avatarUrl}`; 
        } else {
             sidebarAvatar.src = './img/user-avatar.png'; // Garante imagem padrão
        }
        
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        sessionStorage.removeItem('authToken'); 
        window.location.href = '/Login Principal/login.html';
    }
}

function setupMenuToggle() {
    const menuBtn = document.getElementById("menuBtn");
    const sideNav = document.getElementById("sideNav");
    if (menuBtn && sideNav) {
        menuBtn.addEventListener("click", () => {
            sideNav.classList.toggle("hidden");
        });
    }
}

function setupLogout() {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('authToken');
            alert('Você foi desconectado.');
            window.location.href = '/TelaInicial/index.html'; // Redireciona para a tela inicial pública
        });
    }
}

function setupTrilha() {
    const bolinhas = document.querySelectorAll(".trilha .bolinha");
    const btnReset = document.getElementById("btnReset");

    // URLs de destino para cada bolinha (EXEMPLO - ajuste os caminhos!)
    const destinos = {
        "1": "/IOT/Aula1/index.html",
        "2": "/IOT/Aula2/index.html",
        "3": "/IOT/Aula3/index.html",
        "4": "/IOT/Aula4/index.html",
        "5": "/IOT/Aula5/index.html",
        "6": "/IOT/Aula6/index.html",
        "7": "/IOT/Aula7/index.html",
    };

    function atualizarEstadoVisual() {
        let ultimaMarcadaIndex = -1;
        let todasMarcadas = true;

        bolinhas.forEach((bolinha, index) => {
            const numero = bolinha.getAttribute("data-numero");
            const chaveStorage = `trilha_iot_${numero}_marcado`; // Chave específica para esta trilha
            const marcado = sessionStorage.getItem(chaveStorage) === "true";

            if (marcado) {
                bolinha.classList.add("marcado");
                bolinha.textContent = ""; // ✅ ou vazio
                ultimaMarcadaIndex = index;
            } else {
                bolinha.classList.remove("marcado");
                bolinha.textContent = numero;
                todasMarcadas = false;
            }

            // Habilita/Desabilita bolinhas baseado na sequência
            // Só pode clicar na próxima se a anterior estiver marcada
            if (index === 0 || sessionStorage.getItem(`trilha_iot_${index}_marcado`) === "true") {
                 bolinha.classList.remove('disabled'); // Habilita a atual ou a próxima
            } else {
                 bolinha.classList.add('disabled'); // Desabilita futuras
            }
        });

        // Habilita o botão de reset apenas se todas estiverem marcadas
        if (btnReset) {
            btnReset.disabled = !todasMarcadas;
        }
    }

    // Adiciona evento de clique a cada bolinha
    bolinhas.forEach((bolinha) => {
        bolinha.addEventListener("click", () => {
            // Não faz nada se estiver desabilitada
            if (bolinha.classList.contains('disabled')) {
                alert("Complete a etapa anterior primeiro!");
                return;
            }

            const numero = bolinha.getAttribute("data-numero");
            const chaveStorage = `trilha_iot_${numero}_marcado`;

            // Marca como feita no sessionStorage
            sessionStorage.setItem(chaveStorage, "true");
            
            // Atualiza a aparência de todas as bolinhas
            atualizarEstadoVisual();

            // Navega para a página da aula correspondente
            const urlDestino = destinos[numero];
            if (urlDestino) {
                window.location.href = urlDestino;
            } else {
                console.warn(`URL de destino não definida para a bolinha ${numero}`);
            }
        });
    });

    // Adiciona evento ao botão de reset
    if (btnReset) {
        btnReset.addEventListener("click", () => {
            if (confirm("Tem certeza que deseja reiniciar o progresso desta trilha?")) {
                bolinhas.forEach(bolinha => {
                    const numero = bolinha.getAttribute("data-numero");
                    sessionStorage.removeItem(`trilha_iot_${numero}_marcado`);
                });
                atualizarEstadoVisual(); // Atualiza a aparência
            }
        });
    }

    // Carrega o estado inicial ao carregar a página
    atualizarEstadoVisual();
}