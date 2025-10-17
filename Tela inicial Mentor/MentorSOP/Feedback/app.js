const token = sessionStorage.getItem('authToken');
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};

let currentStudents = [];
let selectedStudent = null;

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
        loadSidebarData(),
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
        if (user.avatarUrl) {
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

// --- FUNÇÕES DE API ---

async function sendFeedbackToAPI(studentId, feedbackText) {
    try {
        const response = await fetch('https://educasenai-api.onrender.com/api/mentor/feedbacks', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                alunoId: studentId,
                texto: feedbackText
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Falha ao enviar feedback.');
        }

        alert("Feedback enviado com sucesso!");
        closeExpandedPanel();

    } catch (error) {
        alert(`Erro: ${error.message}`);
        console.error("Erro ao enviar feedback:", error);
    }
}

// --- LÓGICA DE RENDERIZAÇÃO E UI ---

function renderStudentList() {
    studentListEl.innerHTML = "";
    if (currentStudents.length === 0) {
        studentListEl.innerHTML = `<li class="student-item info">Nenhum aluno encontrado.</li>`;
        return;
    }
    const sortedStudents = [...currentStudents].sort((a, b) => a.name.localeCompare(b.name));

    sortedStudents.forEach(student => {
        const li = document.createElement("li");
        li.className = "student-item";
        li.dataset.id = student.id;
        li.setAttribute('role', 'button');
        li.setAttribute('tabindex', '0');

        li.innerHTML = `
            <div class="student-left">
                <div class="student-name">${student.name}</div>
            </div>
            <div class="student-actions"></div>
        `;

        li.addEventListener("click", () => openExpandedPanel(student.id));
        li.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") openExpandedPanel(student.id);
        });
        studentListEl.appendChild(li);
    });
}

function openExpandedPanel(studentId) {
    selectedStudent = currentStudents.find(s => s.id == studentId); // Usar == para comparar
    if (!selectedStudent) return;

    expandedContent.innerHTML = `
        <div class="panel-header">
            <div class="student-name-large">${selectedStudent.name}</div>
        </div>
        <div class="feedback-form">
            <textarea id="feedbackText" placeholder="Escreva um feedback construtivo para ${selectedStudent.name}..."></textarea>
            <div class="feedback-actions">
                <button class="clear-btn" id="feedbackClear">Limpar</button>
                <button class="send-btn" id="feedbackSend">Enviar Feedback</button>
            </div>
        </div>
    `;

    expandedPanel.style.display = "flex";
    expandedPanel.setAttribute("aria-hidden", "false");
    document.getElementById("feedbackText").focus();

    document.getElementById("feedbackClear").addEventListener("click", () => {
        document.getElementById("feedbackText").value = "";
    });

    document.getElementById("feedbackSend").addEventListener("click", () => {
        const text = document.getElementById("feedbackText").value.trim();
        if (!text) {
            alert("O campo de feedback não pode estar vazio.");
            return;
        }
        sendFeedbackToAPI(selectedStudent.id, text);
    });
}

function closeExpandedPanel() {
    expandedPanel.setAttribute("aria-hidden", "true");
    expandedPanel.style.display = "none";
    expandedContent.innerHTML = "";
    selectedStudent = null;
}

// --- CONFIGURAÇÃO DE EVENTOS ---
function setupEventListeners() {
    // Painel de Feedback
    if (closeBtn) {
        closeBtn.addEventListener("click", closeExpandedPanel);
    }

    // Sidebar
    const toggleMenuButton = document.querySelector(".toggle-menu");
    const expandSidebarButton = document.querySelector(".expand-sidebar");
    const body = document.body;
    if (toggleMenuButton && expandSidebarButton) {
        toggleMenuButton.addEventListener("click", () => body.classList.add("menu-collapsed"));
        expandSidebarButton.addEventListener("click", () => body.classList.remove("menu-collapsed"));
    }

    // Logout
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('authToken');
            window.location.href = '/TelaInicial/index.html';
        });
    }
}