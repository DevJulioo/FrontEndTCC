document.addEventListener("DOMContentLoaded", function () {
    
    loadSidebarData();
    setupEventListeners();
    
    async function loadSidebarData() {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
            window.location.href = '/Login Principal/login.html';
            return;
        }
        try {
            // CORREÇÃO: Usando a URL de produção que funciona online
            const response = await fetch('https://educasenai-api.onrender.com/api/users/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Sessão expirada.');
            const user = await response.json();
            
            document.getElementById('sidebar-username').textContent = user.name;
            document.getElementById('sidebar-role').textContent = user.role;
            const sidebarAvatar = document.getElementById('sidebar-avatar');

            // CORRETO: SÓ altera a imagem se o usuário tiver uma customizada na API
            if (user.avatarUrl) {
                sidebarAvatar.src = `https://educasenai-api.onrender.com${user.avatarUrl}`;
            }
            // Sem 'else', ele deixa a imagem que o seu HTML já carregou em paz.

        } catch (error) {
            console.error('Erro:', error);
            sessionStorage.removeItem('authToken');
            window.location.href = '/Login Principal/login.html';
        }
    }

    function setupEventListeners() {
        const toggleMenuButton = document.querySelector(".toggle-menu");
        const expandSidebarButton = document.querySelector(".expand-sidebar");
        const body = document.body; // Adicionado para a lógica correta

        // =======================================================
        // CORREÇÃO DO MENU AQUI 👇
        // Substituindo a lógica antiga pela que funciona
        // =======================================================
        if (toggleMenuButton && expandSidebarButton) {
            toggleMenuButton.addEventListener("click", () => {
                body.classList.add("menu-collapsed");
            });
            expandSidebarButton.addEventListener("click", () => {
                body.classList.remove("menu-collapsed");
            });
        }

        // SEU CÓDIGO ORIGINAL - INTACTO
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.removeItem('authToken');
                window.location.href = '/TelaInicial/index.html';
            });
        }
        
        // SEU CÓDIGO ORIGINAL - INTACTO
        window.addEventListener('storage', (event) => {
            if (event.key === 'avatar_updated_signal') {
                const newAvatarUrl = event.newValue;
                if (newAvatarUrl) {
                    const sidebarAvatar = document.getElementById('sidebar-avatar');
                    if (sidebarAvatar) {
                        sidebarAvatar.src = `https://educasenai-api.onrender.com${newAvatarUrl}`;
                    }
                }
            }
        });

        // SEU CÓDIGO ORIGINAL - INTACTO
        const splash = document.getElementById("splash-screen");
        if (splash) {
            setTimeout(() => {
                splash.style.opacity = '0';
                setTimeout(() => splash.style.display = "none", 1000);
            }, 3000);
        }
    }
});