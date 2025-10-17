document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    setupEventListeners();
});

function setupEventListeners() {
    setupSidebarToggle();
    setupAvatarUpload();
    setupFormSubmit();
    setupLogoutButton();
    setupPasswordToggle();
}

/**
 * Configura os botões para abrir e fechar a sidebar.
 */
function setupSidebarToggle() {
    const toggleMenuButton = document.querySelector(".toggle-menu");
    const expandSidebarButton = document.querySelector(".expand-sidebar");
    const body = document.body;

    if (toggleMenuButton && expandSidebarButton) {
        // Evento para FECHAR o menu
        toggleMenuButton.addEventListener("click", () => {
            body.classList.add("menu-collapsed");
        });

        // Evento para ABRIR o menu
        expandSidebarButton.addEventListener("click", () => {
            body.classList.remove("menu-collapsed");
        });
    }
}

async function loadUserProfile() {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/Login Principal/login.html';
        return;
    }
    try {
        const response = await fetch('https://educasenai-api.onrender.com/api/users/me', { headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) throw new Error('Falha ao carregar perfil.');
        const userData = await response.json();
        populateProfileData(userData);
    } catch (error) {
        console.error('Erro:', error);
        sessionStorage.removeItem('authToken');
        window.location.href = '/Login Principal/login.html';
    }
}

function populateProfileData(user) {
    document.getElementById('nome-view').textContent = user.name;
    document.getElementById('nome').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('role-view').textContent = user.role;
    document.getElementById('sidebar-username').textContent = user.name;
    document.getElementById('sidebar-role').textContent = user.role;
    
    const avatarImg = document.getElementById('avatar-img');
    const sidebarAvatar = document.getElementById('sidebar-avatar');
    
    // SÓ altera a imagem se o usuário tiver uma customizada na API
    if (user.avatarUrl) {
        const fullUrl = `https://educasenai-api.onrender.com${user.avatarUrl}`;
        if(avatarImg) avatarImg.src = fullUrl;
        if(sidebarAvatar) sidebarAvatar.src = fullUrl;
    }
    // O 'else' foi removido para não sabotar a imagem que o HTML já carregou.
}

function setupAvatarUpload() {
    const fileInput = document.getElementById("avatar-input");
    const avatarImg = document.getElementById("avatar-img");
    const sidebarAvatar = document.getElementById('sidebar-avatar'); // Pega a referência da imagem do menu

    fileInput?.addEventListener("change", async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview da imagem nos dois lugares
        const previewUrl = URL.createObjectURL(file);
        if (avatarImg) avatarImg.src = previewUrl;
        if (sidebarAvatar) sidebarAvatar.src = previewUrl;

        const token = sessionStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('https://educasenai-api.onrender.com/api/users/me/avatar', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
            if (!response.ok) throw new Error(await response.text());
            const data = await response.json();

            // Atualiza as DUAS imagens com a URL final do servidor
            const finalUrl = `https://educasenai-api.onrender.com${data.avatarUrl}`;
            if (avatarImg) avatarImg.src = finalUrl;
            if (sidebarAvatar) sidebarAvatar.src = finalUrl;
            
            alert("Foto de perfil atualizada com sucesso!");
        } catch (error) {
            console.error('Erro no upload da imagem:', error);
            alert(error.message);
            // Se der erro, recarrega o perfil para voltar à imagem antiga
            loadUserProfile(); 
        }
    });
}

function setupFormSubmit() {
    const form = document.getElementById("perfil-form");
    const nomeView = document.getElementById("nome-view");
    form?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('authToken');
        const novoNome = document.getElementById("nome").value.trim();
        const novoEmail = document.getElementById("email").value.trim();
        const novaSenha = document.getElementById("senha").value.trim();
        const updateData = { name: novoNome, email: novoEmail, password: novaSenha ? novaSenha : null };
        try {
            const response = await fetch('https://educasenai-api.onrender.com/api/users/me', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(updateData) });
            if (!response.ok) throw new Error(await response.text());
            if (novoNome) {
                nomeView.textContent = novoNome;
                const sidebarUsername = document.getElementById('sidebar-username');
                if (sidebarUsername) sidebarUsername.textContent = novoNome;
            }
            document.getElementById("senha").value = '';
            alert("Alterações salvas com sucesso!");
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            alert(error.message);
        }
    });
}

function setupLogoutButton() {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('authToken');
            window.location.href = '/TelaInicial/index.html';
        });
    }
}

function setupPasswordToggle() {
    const togglePassButton = document.getElementById("toggle-pass");
    const senhaInput = document.getElementById("senha");
    if (togglePassButton && senhaInput) {
        togglePassButton.addEventListener("click", () => {
            const isPasswordVisible = senhaInput.type === "text";
            senhaInput.type = isPasswordVisible ? "password" : "text";
            togglePassButton.textContent = isPasswordVisible ? "Mostrar" : "Ocultar";
        });
    }
}