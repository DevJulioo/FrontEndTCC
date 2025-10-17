document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    loadPerformanceData();
    setupSidebar();
    setupAvatarUpload();
    setupPasswordToggle();
    setupFormSubmit();
});

async function loadPerformanceData() {
    const token = sessionStorage.getItem('authToken');
    if (!token) return;
    try {
        const response = await fetch('https://educasenai-api.onrender.com/api/aluno/desempenho', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Falha ao buscar dados de desempenho.");
        const data = await response.json();
        document.getElementById('grade-value').innerHTML = `<strong>${data.mediaGeral.toFixed(1)}</strong><span class="outof">/10</span>`;
        document.getElementById('activities-completed-value').innerHTML = `<strong>${data.atividadesConcluidas}</strong><span class="outof">/${data.totalAtividades}</span>`;
        const progressRing = document.getElementById('progress-ring-fg');
        const progressText = document.getElementById('progress-text');
        if (progressRing && progressText) {
            const percentage = data.totalAtividades > 0 ? (data.atividadesConcluidas / data.totalAtividades) * 100 : 0;
            const radius = progressRing.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (percentage / 100) * circumference;
            progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
            progressRing.style.strokeDashoffset = offset;
            progressText.textContent = `${Math.round(percentage)}%`;
        }
    } catch (error) {
        console.error("Erro ao carregar dados de desempenho:", error.message);
    }
}

async function loadUserProfile() {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/Login Principal/index.html';
        return;
    }
    try {
        const response = await fetch('https://educasenai-api.onrender.com/api/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Falha ao carregar os dados do perfil.');
        const userData = await response.json();
        populateProfileAndSidebar(userData);
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        sessionStorage.removeItem('authToken');
        window.location.href = '/Login Principal/login.html';
    }
}

function populateProfileAndSidebar(user) {
    document.getElementById('nome-view').textContent = user.name;
    document.getElementById('role-view').textContent = user.role;
    document.getElementById('nome').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('sidebar-username').textContent = user.name;
    document.getElementById('sidebar-role').textContent = user.role;
    const avatarImg = document.getElementById('avatar-img');
    const sidebarAvatar = document.getElementById('sidebar-avatar');

    // =======================================================
    // CORREÇÃO DA IMAGEM 👇
    // =======================================================
    if (user.avatarUrl) {
        const fullAvatarUrl = `https://educasenai-api.onrender.com${user.avatarUrl}`;
        avatarImg.src = fullAvatarUrl;
        sidebarAvatar.src = fullAvatarUrl;
    } else {
        // Força os dois lugares a usarem o mesmo caminho correto da imagem padrão
        const defaultAvatarPath = '/telaprincipal/img/user-avatar.png';
        avatarImg.src = defaultAvatarPath;
        sidebarAvatar.src = defaultAvatarPath;
    }
}

function setupFormSubmit() {
    const form = document.getElementById("perfil-form");
    form?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('authToken');
        if (!token) return;
        const updateData = {
            name: document.getElementById("nome").value.trim(),
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("senha").value.trim() || null
        };
        try {
            const response = await fetch('https://educasenai-api.onrender.com/api/users/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(updateData)
            });
            if (!response.ok) throw new Error(await response.text());
            if (updateData.name) {
                document.getElementById("nome-view").textContent = updateData.name;
                document.getElementById("sidebar-username").textContent = updateData.name;
            }
            document.getElementById("senha").value = '';
            Swal.fire({ icon: 'success', title: 'Sucesso!', text: 'Perfil atualizado.' });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Oops...', text: `Erro ao salvar: ${error.message}` });
        }
    });
}

function setupAvatarUpload() {
    const fileInput = document.getElementById("avatar-input");
    const avatarImg = document.getElementById("avatar-img");
    fileInput?.addEventListener("change", async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        avatarImg.src = URL.createObjectURL(file);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('https://educasenai-api.onrender.com/api/users/me/avatar', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${sessionStorage.getItem('authToken')}` },
                body: formData
            });
            if (!response.ok) throw new Error(await response.text());
            Swal.fire({ icon: 'success', title: 'Sucesso!', text: 'Foto de perfil atualizada.' });
            loadUserProfile();
        } catch (error) {
             Swal.fire({ icon: 'error', title: 'Oops...', text: `Erro no upload: ${error.message}` });
        }
    });
}

function setupSidebar() {
    // =======================================================
    // CORREÇÃO DO MENU DINÂMICO 👇
    // =======================================================
    const body = document.body;
    const toggleMenuButton = document.querySelector(".toggle-menu");
    const expandSidebarButton = document.querySelector(".expand-sidebar");

    if (toggleMenuButton && expandSidebarButton) {
        toggleMenuButton.addEventListener("click", () => {
            body.classList.add("menu-collapsed");
        });
        
        expandSidebarButton.addEventListener("click", () => {
            body.classList.remove("menu-collapsed");
        });
    }

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
    const togglePass = document.getElementById("toggle-pass");
    const senhaInput = document.getElementById("senha");
    togglePass?.addEventListener("click", () => {
        const isText = senhaInput.type === "text";
        senhaInput.type = isText ? "password" : "text";
        togglePass.textContent = isText ? "Mostrar" : "Ocultar";
    });
}