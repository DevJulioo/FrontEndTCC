// app.js (Tela de Alunos do Mentor - Conectado à API)

const token = sessionStorage.getItem('authToken');
const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

let currentStudents = []; 

const studentListEl = document.getElementById("studentList");
const expandedPanel = document.getElementById("expandedPanel");
const expandedContent = document.getElementById("expandedContent");
const closeBtn = document.getElementById("closeExpanded");

// --- INICIALIZAÇÃO ---
document.addEventListener("DOMContentLoaded", () => {
    if (!token) {
        window.location.href = '/Login Principal/login.html';
        return;
    }
    loadPageData();
    setupEventListeners();
});

// --- CARREGAMENTO DE DADOS ---
async function loadPageData() {
    await Promise.all([
        loadSidebarData(), // Adicionado para carregar dados do menu
        loadStudentsFromAPI()
    ]);
}

async function loadSidebarData() {
    try {
        const response = await fetch('https://educasenai-api.onrender.com/api/users/me', { headers });
        if (!response.ok) throw new Error('Falha ao carregar perfil.');
        const user = await response.json();

        document.getElementById('sidebar-username').textContent = user.name;
        document.getElementById('sidebar-role').textContent = user.role;
        const sidebarAvatar = document.getElementById('sidebar-avatar');
        if (sidebarAvatar && user.avatarUrl) {
            sidebarAvatar.src = `https://educasenai-api.onrender.com${user.avatarUrl}`;
        }
    } catch (error) {
        console.error("Erro ao carregar dados da sidebar:", error);
    }
}

async function loadStudentsFromAPI() {
    studentListEl.innerHTML = `<li class="student-item info">Carregando alunos...</li>`;
    try {
        const response = await fetch('https://educasenai-api.onrender.com/api/mentor/alunos', { headers });
        if (!response.ok) throw new Error('Falha ao carregar a lista de alunos.');
        
        currentStudents = await response.json();
        renderStudentList();
    } catch (error) {
        console.error("Erro ao carregar alunos:", error);
        studentListEl.innerHTML = `<li class="student-item error">${error.message}</li>`;
    }
}

// --- LÓGICA DE RENDERIZAÇÃO E UI ---
function renderStudentList() {
    studentListEl.innerHTML = "";
    if (currentStudents.length === 0) {
        studentListEl.innerHTML = `<li class="student-item info">Nenhum aluno associado.</li>`;
        return;
    }

    const sortedStudents = [...currentStudents].sort((a, b) => (b.score || 0) - (a.score || 0));
    const highestScore = sortedStudents.length > 0 ? (sortedStudents[0].score || 0) : 0;

    sortedStudents.forEach(student => {
        const li = document.createElement("li");
        li.className = "student-item";
        li.dataset.id = student.id;

        if ((student.score || 0) === highestScore && highestScore > 0) {
            li.classList.add("top-student");
        }

        li.innerHTML = `
            <div class="student-left">
                <div class="student-score">${String(student.score || 0).replace(".", ",")}</div>
                <div class="student-name" tabindex="0">${student.name}</div>
            </div>
            <div class="student-actions"></div>
        `;
        
        li.addEventListener("click", () => openExpandedPanel(student.id));
        li.addEventListener("keydown", (e) => { 
            if (e.key === "Enter") openExpandedPanel(student.id); 
        });

        studentListEl.appendChild(li);
    });
}

function openExpandedPanel(id) {
    const student = currentStudents.find(st => st.id == id);
    if (!student) return;

    expandedContent.innerHTML = ""; // Limpa antes de preencher

    const header = document.createElement("div");
    header.className = "panel-header";
    header.innerHTML = `
        <div class="student-name-large">${student.name}</div>
        <div class="student-score-large">${String(student.score || 0).replace(".", ",")}</div>
    `;
    expandedContent.appendChild(header);

    const row = document.createElement("div");
    row.className = "progress-row";
    row.innerHTML = `
        <div class="progress-slot">
            <div class="img-placeholder"><img src="progresso.svg" alt="Progresso"></div>
            <div class="slot-label">Progresso</div>
            <div class="slot-sub">N/D</div>
        </div>
        <div class="progress-slot">
            <div class="img-placeholder"><img src="nota.svg" alt="Nota"></div>
            <div class="slot-label">Nota Média</div>
            <div class="slot-sub">${String(student.score || 0).replace(".", ",")}</div>
        </div>
        <div class="progress-slot">
            <div class="img-placeholder"><img src="concluidos.svg" alt="Concluídas"></div>
            <div class="slot-label">Concluídas</div>
            <div class="slot-sub">N/D</div>
        </div>
    `;
    expandedContent.appendChild(row);

    expandedPanel.style.display = "flex";
    expandedPanel.setAttribute("aria-hidden", "false");
    document.getElementById("listContainer").scrollTop = 0;
}

function closeExpandedPanel() {
    expandedPanel.style.display = "none";
    expandedPanel.setAttribute("aria-hidden", "true");
    expandedContent.innerHTML = "";
}

// --- CONFIGURAÇÃO DE EVENTOS ---
function setupEventListeners() {
    closeBtn.addEventListener("click", closeExpandedPanel);

    const toggleMenuButton = document.querySelector(".toggle-menu");
    const expandSidebarButton = document.querySelector(".expand-sidebar");
    const body = document.body;
    if (toggleMenuButton && expandSidebarButton) {
        toggleMenuButton.addEventListener("click", () => body.classList.add("menu-collapsed"));
        expandSidebarButton.addEventListener("click", () => body.classList.remove("menu-collapsed"));
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