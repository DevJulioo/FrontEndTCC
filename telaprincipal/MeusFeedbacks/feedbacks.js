// feedbacks.js (Visão do Aluno - Conectado à API)

const token = sessionStorage.getItem('authToken');
const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

let state = {
    items: [],
    search: "",
    status: "all",
    sort: "newest"
};

const listEl = document.getElementById("list");
const template = document.getElementById("item-template");
const counterEl = document.getElementById("counter");

document.addEventListener("DOMContentLoaded", () => {
    if (!token) {
        window.location.href = '/Login Principal/login.html';
        return;
    }
    loadSidebarData();
    setupMenu();
    setupEventListeners();
    loadFeedbacksFromAPI();
});

// =======================================================
// LÓGICA DA SIDEBAR CORRIGIDA 👇
// =======================================================
async function loadSidebarData() {
    try {
        const response = await fetch('https://educasenai-api.onrender.com/api/users/me', { headers });
        if (!response.ok) throw new Error('Falha na autenticação.');
        const user = await response.json();
        
        document.getElementById('sidebar-username').textContent = user.name;
        document.getElementById('sidebar-role').textContent = user.role;
        const sidebarAvatar = document.getElementById('sidebar-avatar');

        // SÓ MEXE NA FOTO SE O USUÁRIO TIVER UMA CUSTOMIZADA.
        // SE NÃO, ELE DEIXA A FOTO QUE O HTML JÁ CARREGOU.
        if (user.avatarUrl) { 
            sidebarAvatar.src = `https://educasenai-api.onrender.com${user.avatarUrl}`; 
        }
        
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
    }
}

function setupMenu() {
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
            alert('Você foi desconectado.');
            window.location.href = '/TelaInicial/index.html';
        });
    }
}

// =======================================================
// SEU CÓDIGO ORIGINAL (INTACTO) 👇
// =======================================================
async function loadFeedbacksFromAPI() {
    listEl.innerHTML = `<p>Carregando feedbacks...</p>`;
    try {
        const response = await fetch('https://educasenai-api.onrender.com/api/feedbacks', { headers });
        if (!response.ok) throw new Error('Falha ao carregar feedbacks.');
        state.items = await response.json();
        render();
    } catch (error) {
        listEl.innerHTML = `<div class="card">${error.message}</div>`;
    }
}

async function toggleReadStatusAPI(feedbackId, currentStatus) {
    try {
        const response = await fetch(`https://educasenai-api.onrender.com/api/feedbacks/${feedbackId}/lido`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ lido: !currentStatus })
        });
        if (!response.ok) throw new Error('Não foi possível alterar o status.');
        const item = state.items.find(f => f.id === feedbackId);
        if (item) item.lido = !item.lido;
        render();
    } catch (error) {
        console.error("Erro ao alterar status:", error);
    }
}

async function markAllAsReadAPI() {
    if (state.items.filter(i => !i.lido).length === 0) return;
    if (!confirm("Marcar todos os feedbacks como lidos?")) return;
    try {
        const response = await fetch(`https://educasenai-api.onrender.com/api/feedbacks/marcar-todos-lidos`, { method: 'POST', headers });
        if (!response.ok) throw new Error('Não foi possível marcar todos.');
        state.items.forEach(f => f.lido = true);
        render();
    } catch (error) {
        console.error("Erro ao marcar todos:", error);
    }
}

function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function applyFilters(items) {
    let out = [...items];
    const q = state.search.trim().toLowerCase();
    if (q) {
        out = out.filter(it =>
            it.texto.toLowerCase().includes(q) ||
            it.mentorNome.toLowerCase().includes(q) ||
            formatDate(it.dataEnvio).toLowerCase().includes(q)
        );
    }
    if (state.status === "read") out = out.filter(it => it.lido);
    if (state.status === "unread") out = out.filter(it => !it.lido);

    if (state.sort === "newest") out.sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio));
    else if (state.sort === "oldest") out.sort((a, b) => new Date(a.dataEnvio) - new Date(b.dataEnvio));
    else if (state.sort === "teacher") out.sort((a, b) => a.mentorNome.localeCompare(b.mentorNome, "pt-BR"));
    
    return out;
}

function render() {
    listEl.innerHTML = "";
    const data = applyFilters(state.items);
    const total = state.items.length;
    const unread = data.filter(i => !i.lido).length;
    counterEl.textContent = `Mostrando ${data.length} de ${total} • Não lidos: ${unread}`;

    if (data.length === 0) {
        listEl.innerHTML = `<div class="card">Nenhum feedback encontrado.</div>`;
        return;
    }

    data.forEach(it => {
        const node = template.content.cloneNode(true);
        const card = node.querySelector(".card");
        const badge = node.querySelector(".badge");
        const dateEl = node.querySelector(".date");
        const textEl = node.querySelector(".text");
        const teacherEl = node.querySelector(".teacher");
        const toggleBtn = node.querySelector(".toggle-read");
        
        card.classList.toggle("read", it.lido);
        badge.textContent = it.lido ? "Lido" : "Não lido";
        dateEl.textContent = formatDate(it.dataEnvio);
        textEl.textContent = it.texto;
        teacherEl.textContent = `Mentor: ${it.mentorNome}`;
        toggleBtn.textContent = it.lido ? "Marcar como não lido" : "Marcar como lido";

        toggleBtn.addEventListener("click", () => toggleReadStatusAPI(it.id, it.lido));
        
        listEl.appendChild(node);
    });
}

function setupEventListeners() {
    document.getElementById("mark-all").addEventListener("click", markAllAsReadAPI);
    document.getElementById("search").addEventListener("input", (e) => { state.search = e.target.value; render(); });
    document.querySelectorAll('input[name="status"]').forEach(r => r.addEventListener("change", () => { state.status = r.value; render(); }));
    document.getElementById("sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
}