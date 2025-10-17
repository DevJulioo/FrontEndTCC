document.addEventListener("DOMContentLoaded", function () {
    // Adiciona a chamada para carregar os dados do usuário
    loadSidebarData();

    // Mantém suas funções originais
    setupMenu();
    rotateWords();
    tipOfTheMoment();
    fancyHover();
    setupLogout();
});

async function loadSidebarData() {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
        console.warn("Nenhum token de autenticação encontrado.");
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
        if (sidebarAvatar && user.avatarUrl) {
            sidebarAvatar.src = `https://educasenai-api.onrender.com${user.avatarUrl}`;
        }
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
    }
}

function setupMenu() {
    const toggleMenuButton = document.querySelector(".toggle-menu");
    const expandSidebarButton = document.querySelector(".expand-sidebar");
    const body = document.body;

    if (toggleMenuButton && expandSidebarButton) {
        toggleMenuButton.addEventListener("click", function () {
            body.classList.add("menu-collapsed");
        });

        expandSidebarButton.addEventListener("click", function () {
            body.classList.remove("menu-collapsed");
        });
    }
}

function setupLogout() {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('authToken');
            window.location.href = '/TelaInicial/index.html';
        });
    }
}

// Suas funções originais (sem alteração)
function rotateWords(){
    const el = document.querySelector('.mentor-cta__rotate');
    if(!el) return;
    const words = JSON.parse(el.dataset.words || '["mentor"]');
    let i = 0;
    setInterval(() => {
        i = (i + 1) % words.length;
        el.style.opacity = '0';
        setTimeout(()=>{
            el.textContent = words[i];
            el.style.opacity = '1';
        }, 180);
    }, 1800);
}

function tipOfTheMoment(){
    const tips = [
        "Dica: acompanhe o progresso de cada aluno regularmente.",
        "Sugestão: use os feedbacks para reforçar pontos fortes e corrigir fraquezas.",
        "Pro atalho: registre insights das reuniões para revisitar depois.",
        "Combine: defina pequenos objetivos com os alunos e revise semanalmente."
    ];
    const el = document.getElementById('mentorTip');
    if(!el) return;
    el.textContent = tips[Math.floor(Math.random()*tips.length)];
}

function fancyHover(){
    const card = document.querySelector('.mentor-cta');
    if(!card) return;

    const strength = 10;
    card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const cx = r.left + r.width/2;
        const cy = r.top + r.height/2;
        const dx = (e.clientX - cx) / (r.width/2);
        const dy = (e.clientY - cy) / (r.height/2);
        card.style.transform =
            `perspective(900px) rotateX(${(-dy*strength)}deg) rotateY(${(dx*strength)}deg) translateY(-2px)`;
        
        if(Math.random() < 0.08){
            const s = document.createElement('span');
            s.className = 'spark';
            s.style.left = (e.clientX - r.left - 4) + 'px';
            s.style.top  = (e.clientY - r.top - 4) + 'px';
            card.appendChild(s);
            setTimeout(()=> s.remove(), 800);
        }
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
}