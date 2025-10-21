// telaprincipal/script.js
document.addEventListener('DOMContentLoaded', () => {
    loadSidebarData();
    loadStreakData();
    setupPageInteractions();
});

async function loadSidebarData() {
    const token = sessionStorage.getItem('authToken');
    if (!token) { window.location.href = '/Login Principal/login.html'; return; }
    try {
        const response = await fetch('https://educasenai-api.onrender.com/api/users/me', { headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) throw new Error('Falha na autenticação.');
        const user = await response.json();
        document.getElementById('sidebar-username').textContent = user.name;
        document.getElementById('sidebar-role').textContent = user.role;
        const sidebarAvatar = document.getElementById('sidebar-avatar');
        if (user.avatarUrl) { 
            sidebarAvatar.src = `https://educasenai-api.onrender.com${user.avatarUrl}`; 
        } 
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        sessionStorage.removeItem('authToken'); 
        window.location.href = '/Login Principal/login.html';
    }
}

async function loadStreakData() {
    const token = sessionStorage.getItem('authToken');
    if (!token) return;
    try {
        const response = await fetch('https://educasenai-api.onrender.com/api/aluno/dashboard', { headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) throw new Error("Erro ao carregar dados de ofensiva.");
        const data = await response.json();
        const streakCountEl = document.getElementById('streak-count');
        const streakFlameEl = document.getElementById('streak-flame');
        if (streakCountEl) streakCountEl.textContent = data.streakCount;
        if (streakFlameEl) {
            if (data.streakCount > 0) {
                streakFlameEl.classList.add('active');
                streakFlameEl.src = './img/fogoOn.png';
            } else {
                streakFlameEl.classList.remove('active');
                streakFlameEl.src = './img/fogoOff.png';
            }
        }
    } catch (error) {
        console.error("Falha ao carregar dados de ofensiva:", error);
    }
}

function setupPageInteractions() {
    const logoutButton = document.getElementById('logout-button');
    if(logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            sessionStorage.removeItem('authToken');
            alert('Você foi desconectado.');
            window.location.href = '/TelaInicial/index.html'; 
        });
    }

    // Lógica robusta para o menu dinâmico (SEU CÓDIGO ORIGINAL - ESTÁ CORRETO)
    const body = document.body;
    const toggleMenuButton = document.querySelector(".toggle-menu");
    const expandSidebarButton = document.querySelector(".expand-sidebar");

    if (toggleMenuButton && expandSidebarButton) {
        // Botão para FECHAR o menu
        toggleMenuButton.addEventListener("click", () => {
            body.classList.add("menu-collapsed");
        });
        
        // Botão para ABRIR o menu
        expandSidebarButton.addEventListener("click", () => {
            body.classList.remove("menu-collapsed");
        });
    }

    // =======================================================
    // CORREÇÃO: Código do olho do golfinho (removida a duplicata)
    // Esta é a versão mais completa que você colou (com suporte a touch)
    // =======================================================
    const eye = document.querySelector(".eye");
    const pupil = eye ? eye.querySelector(".pupil") : null;
    if (eye && pupil) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        document.addEventListener("touchmove", (e) => {
            if (e.touches && e.touches[0]) {
                mouseX = e.touches[0].clientX;
                mouseY = e.touches[0].clientY;
            }
        }, { passive: true });

        function updateEye() {
            const rect = eye.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            let dx = mouseX - cx;
            let dy = mouseY - cy;
            const dist = Math.hypot(dx, dy);
            const maxMove = Math.max( (rect.width - pupil.offsetWidth) / 2 - 2, 2 );

            if (dist > 0) {
                dx = (dx / dist) * Math.min(dist, maxMove);
                dy = (dy / dist) * Math.min(dist, maxMove);
            } else {
                dx = 0; dy = 0;
            }
            
            pupil.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
            requestAnimationFrame(updateEye);
        }
        updateEye();
    }
}