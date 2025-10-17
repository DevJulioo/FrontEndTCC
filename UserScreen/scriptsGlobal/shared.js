// /UserScreen/scriptsGlobal/shared.js

/**
 * --- FUNÇÃO FALTANDO ---
 * Exibe uma notificação de sucesso.
 * @param {string} title - O título da mensagem.
 * @param {string} text - O texto da mensagem.
 */
function showSuccessNotification(title, text) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'success',
            title: title,
            text: text,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
    } else {
        alert(title + "\n" + text);
    }
}

/**
 * --- FUNÇÃO FALTANDO ---
 * Exibe uma notificação de erro.
 * @param {string} title - O título do erro.
 * @param {string} text - O texto do erro.
 */
function showErrorNotification(title, text) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'error',
            title: title,
            text: text,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
    } else {
        alert(title + "\n" + text);
    }
}

/**
 * Carrega os dados do usuário na sidebar.
 */
async function loadSharedSidebarData() {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/Login Principal/login.html';
        return;
    }

    try {
        const response = await fetch('https://educasenai-api.onrender.com/api/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Sessão expirada. Faça o login novamente.');
        }

        const user = await response.json();
        
        const usernameEl = document.getElementById('sidebar-username');
        const roleEl = document.getElementById('sidebar-role');
        const avatarEl = document.getElementById('sidebar-avatar');

        if (usernameEl) usernameEl.textContent = user.name;
        if (roleEl) roleEl.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase();

        if (avatarEl && user.avatarUrl) {
            avatarEl.src = `https://educasenai-api.onrender.com${user.avatarUrl}`;
        } else if (avatarEl) {
            avatarEl.src = 'telaprincipal/img/user-avatar.png'; // Avatar padrão
        }

    } catch (error) {
        sessionStorage.removeItem('authToken');
        showErrorNotification("Erro de Autenticação", error.message);
        setTimeout(() => { window.location.href = '/Login Principal/login.html'; }, 2000);
    }
}



// Executa as funções compartilhadas assim que o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    loadSharedSidebarData();
    setupSharedLogoutButton();
})


function setupSharedLogoutButton() {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            sessionStorage.removeItem('authToken');
            showSuccessNotification("Desconectado", "Você saiu da sua conta com sucesso.");
            setTimeout(() => {
                window.location.href = '/TelaInicial/index.html';
            }, 1500); // Espera a notificação ser vista antes de redirecionar
        });
    }
}

// Executa as funções compartilhadas assim que o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    loadSharedSidebarData();
    setupSharedLogoutButton();
});