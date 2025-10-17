document.addEventListener("DOMContentLoaded", () => {
    loadSidebarData();
    loadProgress();
    setupMenu();
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
        document.getElementById('sidebar-username').textContent = user.name;
        document.getElementById('sidebar-role').textContent = user.role;
        const avatarImg = document.getElementById('sidebar-avatar');
        if (user.avatarUrl) {
            avatarImg.src = `https://educasenai-api.onrender.com${user.avatarUrl}`;
        }
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
    }
}

function setupMenu() {
    const botaoMenu = document.getElementById("botaoMenu");
    const navLateral = document.getElementById("navLateral");
    if (botaoMenu && navLateral) {
        botaoMenu.addEventListener("click", () => {
            navLateral.classList.toggle("oculto");
        });
    }
}

function setupLogout() {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            sessionStorage.removeItem('authToken');
            alert('Você foi desconectado com sucesso.');
            window.location.href = 'index.html'; 
        });
    }
}

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
