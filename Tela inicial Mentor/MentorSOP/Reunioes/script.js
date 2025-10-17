// Variáveis globais
let allMeetings = [];
let currentDate = new Date();

// Ponto de entrada
document.addEventListener('DOMContentLoaded', () => {
    loadInitialData(); // Carrega dados do usuário e reuniões
    setupEventListeners(); // Configura todos os botões
});

// Headers para requisições
const token = sessionStorage.getItem('authToken');
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};

/**
 * Carrega dados do usuário e reuniões em paralelo.
 */
async function loadInitialData() {
    // Array de promessas para carregar tudo de uma vez
    await Promise.all([
        loadSidebarData(),
        loadMeetings()
    ]);
}

/**
 * Busca os dados do usuário e preenche a sidebar.
 */
async function loadSidebarData() {
    if (!token) {
        window.location.href = '/Login Principal/login.html';
        return;
    }
    try {
        const response = await fetch('https://educasenai-api.onrender.com/api/users/me', { headers });
        if (!response.ok) throw new Error('Falha ao carregar perfil do usuário.');
        const user = await response.json();
        
        document.getElementById('sidebar-username').textContent = user.name;
        document.getElementById('sidebar-role').textContent = user.role;
        const sidebarAvatar = document.getElementById('sidebar-avatar');
        if (sidebarAvatar && user.avatarUrl) {
            sidebarAvatar.src = `https://educasenai-api.onrender.com${user.avatarUrl}`;
        }
    } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        // Em caso de erro, pode ser útil deslogar o usuário
        // sessionStorage.removeItem('authToken');
        // window.location.href = '/Login Principal/login.html';
    }
}

/**
 * Carrega todas as reuniões do back-end.
 */
async function loadMeetings() {
    try {
        const response = await fetch('https://educasenai-api.onrender.com/api/reunioes', { headers });
        if (!response.ok) throw new Error('Falha ao carregar reuniões.');
        
        allMeetings = await response.json();
        renderRequestList();
        renderCalendar();
    } catch (error) {
        console.error("Erro ao carregar reuniões:", error);
        document.getElementById('incoming-list').innerHTML = `<p class="error-message">${error.message}</p>`;
    }
}

/**
 * Coloca os dados de solicitações PENDENTES na lista.
 */
function renderRequestList() {
    const requestList = document.getElementById('incoming-list');
    requestList.innerHTML = '';
    const pendingMeetings = allMeetings.filter(m => m.status === 'PENDENTE');

    if (pendingMeetings.length === 0) {
        requestList.innerHTML = '<p>Nenhuma nova solicitação.</p>';
        return;
    }

    pendingMeetings.forEach(reuniao => {
        const item = document.createElement('div');
        item.className = 'req';
        item.innerHTML = `
            <div class="left">
                <div class="subject">${reuniao.assunto}</div>
                <div class="meta">${reuniao.aluno.name} • ${new Date(reuniao.data + 'T00:00:00').toLocaleDateString('pt-BR')}</div>
            </div>
            <div class="right">
                <div class="actions">
                    <button class="small-btn view-details-btn" data-reuniao-id="${reuniao.id}">Ver</button>
                </div>
            </div>
        `;
        requestList.appendChild(item);
    });
}

/**
 * Coloca os dados de reuniões CONFIRMADAS no calendário.
 */
function renderCalendar() {
    const calendarEl = document.getElementById('m-calendar');
    const monthTitle = document.getElementById('m-month-title');
    if (!calendarEl || !monthTitle) return;
    calendarEl.innerHTML = '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const today = new Date();
    const isCurrentMonthOrPast = year < today.getFullYear() || (year === today.getFullYear() && month <= today.getMonth());
    const prevMonthButton = document.getElementById('m-prev-month');

    if (prevMonthButton) {
        prevMonthButton.disabled = isCurrentMonthOrPast;
    }
    
    monthTitle.textContent = new Date(year, month).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) { calendarEl.appendChild(document.createElement('div')); }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day';
        dayCell.innerHTML = `<div class="date-num">${day}</div><div class="events"></div>`;
        const isoDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        const todaysMeetings = allMeetings.filter(m => m.data === isoDate && m.status === 'CONFIRMADA');

        const eventsContainer = dayCell.querySelector('.events');
        todaysMeetings.forEach(reuniao => {
            const eventEl = document.createElement('div');
            eventEl.className = 'event';
            eventEl.dataset.reuniaoId = reuniao.id;
            eventEl.innerHTML = `
                <div class="time">${reuniao.hora.substring(0, 5)}</div>
                <div class="title" title="${reuniao.assunto}">${reuniao.assunto}</div>
            `;
            eventsContainer.appendChild(eventEl);
        });
        calendarEl.appendChild(dayCell);
    }
}

/**
 * Adiciona as ações a todos os botões da página.
 */
function setupEventListeners() {
    // --- Menu ---
    const toggleMenuButton = document.querySelector(".toggle-menu");
    const expandSidebarButton = document.querySelector(".expand-sidebar");
    if (toggleMenuButton && expandSidebarButton) {
        toggleMenuButton.addEventListener("click", () => document.body.classList.add("menu-collapsed"));
        expandSidebarButton.addEventListener("click", () => document.body.classList.remove("menu-collapsed"));
    }

    // --- Calendário e Lista ---
    document.getElementById('m-prev-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    document.getElementById('m-next-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    document.getElementById('incoming-list').addEventListener('click', (e) => {
        const button = e.target.closest('.view-details-btn');
        if (button) openModalWithMeeting(button.dataset.reuniaoId);
    });
    document.getElementById('m-calendar').addEventListener('click', (e) => {
        const item = e.target.closest('.event');
        if (item) openModalWithMeeting(item.dataset.reuniaoId);
    });

    // --- Modal ---
    document.getElementById('m-modal-close').addEventListener('click', () => {
        document.getElementById('m-modal').classList.remove('show');
    });
    document.getElementById('m-approve').addEventListener('click', () => updateMeetingStatus('CONFIRMADA'));
    document.getElementById('m-reject').addEventListener('click', () => updateMeetingStatus('RECUSADA'));
    document.getElementById('m-cancel').addEventListener('click', () => updateMeetingStatus('CANCELADA'));

    // --- Logout ---
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

/**
 * Preenche o modal com os dados da reunião clicada.
 */
function openModalWithMeeting(reuniaoId) {
    const modal = document.getElementById('m-modal');
    const reuniao = allMeetings.find(m => m.id == reuniaoId); // Usar '==' para comparar string com número
    if (!reuniao) return;

    modal.dataset.currentId = reuniao.id;

    document.getElementById('m-modal-subject').textContent = reuniao.assunto;
    document.getElementById('m-mdl-student').textContent = reuniao.aluno.name;
    document.getElementById('m-mdl-mentor').textContent = reuniao.mentor.name;
    document.getElementById('m-mdl-mode').textContent = reuniao.modalidade;
    document.getElementById('m-mdl-notes').textContent = reuniao.observacoes || 'Nenhuma.';
    document.getElementById('m-mdl-datetime').textContent = `${new Date(reuniao.data + 'T00:00:00').toLocaleDateString('pt-BR')} às ${reuniao.hora.substring(0, 5)}`;
    
    const statusBadge = document.getElementById('m-mdl-status-badge');
    statusBadge.textContent = reuniao.status;
    statusBadge.className = 'status-pill';
    if (reuniao.status === 'CONFIRMADA') statusBadge.classList.add('ok');
    else if (reuniao.status === 'RECUSADA' || reuniao.status === 'CANCELADA') statusBadge.classList.add('warn');
    else statusBadge.classList.add('neutral');

    document.getElementById('m-approve').style.display = (reuniao.status === 'PENDENTE') ? 'inline-flex' : 'none';
    document.getElementById('m-reject').style.display = (reuniao.status === 'PENDENTE') ? 'inline-flex' : 'none';
    document.getElementById('m-cancel').style.display = (reuniao.status === 'CONFIRMADA') ? 'inline-flex' : 'none';

    modal.classList.add('show');
}

/**
 * Comunica com o back-end para alterar o status de uma reunião.
 */
async function updateMeetingStatus(newStatus) {
    const modal = document.getElementById('m-modal');
    const reuniaoId = modal.dataset.currentId;
    if (!reuniaoId) return;

    if (!confirm(`Tem certeza que deseja alterar o status para "${newStatus}"?`)) return;

    try {
        const response = await fetch(`https://educasenai-api.onrender.com/api/reunioes/${reuniaoId}/status`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ status: newStatus })
        });
        if (!response.ok) throw new Error(`Falha ao atualizar status.`);
        alert(`Reunião atualizada com sucesso!`);
        modal.classList.remove('show');
        loadMeetings();
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        alert(error.message);
    }
}