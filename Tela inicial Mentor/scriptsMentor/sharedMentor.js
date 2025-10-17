// shared.js

// Executa tudo assim que qualquer página que usa este script for carregada
document.addEventListener('DOMContentLoaded', () => {
    loadSharedSidebarData();
    setupSharedLogoutButton();
    setupSharedSidebarToggle();
});

/**
 * Busca os dados do usuário logado e preenche a barra lateral.
 * Esta função é a mais importante.
 */
async function loadSharedSidebarData() {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/Login Principal/login.html'; // Protege a página, redireciona se não houver login
        return;
    }

    try {
        const response = await fetch('https://educasenai-api.onrender.com/api/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Sessão inválida.');

        const user = await response.json();
        
        // Preenche os elementos da sidebar com os dados reais
        const usernameEl = document.getElementById('sidebar-username');
        const roleEl = document.getElementById('sidebar-role');
        const avatarEl = document.getElementById('sidebar-avatar');

        if (usernameEl) usernameEl.textContent = user.name;
        if (roleEl) roleEl.textContent = user.role;

        if (avatarEl && user.avatarUrl) {
            avatarEl.src = `https://educasenai-api.onrender.com${user.avatarUrl}`;
        } else if (avatarEl) {
            avatarEl.src = '/img/user-avatar.jpg'; // Caminho para sua imagem padrão
        }

    } catch (error) {
        console.error('Erro de autenticação:', error);
        sessionStorage.removeItem('authToken');
        window.location.href = '/Login Principal/login.html';
    }
}

/**
 * Configura o botão de logout.
 */
function setupSharedLogoutButton() {
    const logoutButton = document.getElementById('logout-button');
    logoutButton?.addEventListener('click', (event) => {
        event.preventDefault();
        sessionStorage.removeItem('authToken');
        alert('Você foi desconectado.');
        window.location.href = '/Login Principal/login.html';
    });
}

/**
 * Configura a funcionalidade de abrir e fechar a barra lateral.
 */
function setupSharedSidebarToggle() {
    const toggleMenuButton = document.querySelector(".toggle-menu");
    const sidebar = document.querySelector(".sidebar");
    const expandSidebarButton = document.querySelector(".expand-sidebar");

    toggleMenuButton?.addEventListener("click", () => {
        sidebar.classList.add("collapsed");
        expandSidebarButton.classList.add("show");
    });

    expandSidebarButton?.addEventListener("click", () => {
        sidebar.classList.remove("collapsed");
        expandSidebarButton.classList.remove("show");
    });
}