// Executado quando a página HTML é totalmente carregada
document.addEventListener("DOMContentLoaded", () => {
    // 1. Carrega os dados do usuário (foto, nome, etc.) na sidebar
    loadSidebarData();

    // 2. Carrega o progresso salvo das bolinhas
    loadProgress();

    // 3. Configura a lógica do botão de menu (sua função original)
    setupMenuToggle();
    
    // 4. Configura o botão de logout
    setupLogoutButton();
});

/**
 * Função para marcar/desmarcar as "bolinhas" de progresso.
 */
function marcar(elemento) {
    elemento.classList.toggle("marcado");
    const linkDaAula = elemento.previousElementSibling;
    if (linkDaAula && linkDaAula.getAttribute('href')) {
        const lessonId = linkDaAula.getAttribute('href');
        if (elemento.classList.contains("marcado")) {
            sessionStorage.setItem(`progress_${lessonId}`, "true");
        } else {
            sessionStorage.removeItem(`progress_${lessonId}`);
        }
    }
}

/**
 * Carrega o progresso salvo das "bolinhas" ao carregar a página.
 */
function loadProgress() {
    document.querySelectorAll('.bolinha').forEach(bolinha => {
        const linkDaAula = bolinha.previousElementSibling;
        if (linkDaAula && linkDaAula.getAttribute('href')) {
            const lessonId = linkDaAula.getAttribute('href');
            if (sessionStorage.getItem(`progress_${lessonId}`) === "true") {
                bolinha.classList.add("marcado");
            }
        }
    });
}

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
 * Configura o botão de menu para abrir e fechar a barra lateral.
 * (SEU CÓDIGO ORIGINAL - INTACTO)
 */
function setupMenuToggle() {
    const botaoMenu = document.getElementById("botaoMenu");
    const navLateral = document.getElementById("navLateral");

    if (botaoMenu && navLateral) {
        botaoMenu.addEventListener("click", () => {
            navLateral.classList.toggle("oculto");
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
            window.location.href = '/Login Principal/login.html'; // Ajuste o link se necessário
        });
    }
}