let allMeetings = [];
let currentDate = new Date();

document.addEventListener('DOMContentLoaded', () => {
    loadSidebarData();
    loadInitialData();
    setupEventListeners();
});

const token = sessionStorage.getItem('authToken');
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};

async function loadSidebarData() {
    try {
        const response = await fetch('https://educasenai-api.onrender.com/api/users/me', { headers });
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
        // Considerar redirecionar ou mostrar erro aqui se o sidebar for essencial
    }
}

async function loadInitialData() {
    await loadMentors();
    await loadMeetings();
}

async function loadMentors() {
    const mentorSelect = document.getElementById('mentor-select');
    if (!mentorSelect) return;
    try {
        const response = await fetch('https://educasenai-api.onrender.com/api/mentores', { headers });
        if (!response.ok) throw new Error('Falha ao buscar mentores.');
        const mentores = await response.json();
        mentorSelect.innerHTML = '<option value="">Escolher mentor...</option>';
        mentores.forEach(mentor => {
            const option = document.createElement('option');
            option.value = mentor.id;
            option.textContent = mentor.name;
            mentorSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar mentores:", error);
        // Mantendo Toastify para erros, pois são menos críticos se falharem
        showToast("Erro: Não foi possível carregar os mentores.", "error");
    }
}

async function loadMeetings() {
    try {
        const response = await fetch('https://educasenai-api.onrender.com/api/reunioes', { headers });
        if (!response.ok) throw new Error('Falha ao buscar agendamentos.');
        allMeetings = await response.json();
        renderRequestsList();
        renderCalendar();
    } catch (error) {
        console.error("Erro ao carregar reuniões:", error);
        showToast("Erro: Não foi possível carregar suas solicitações.", "error");
    }
}

function renderRequestsList() {
    const requestsList = document.getElementById('requests-list');
    if (!requestsList) return;
    requestsList.innerHTML = '';
    if (allMeetings.length === 0) {
        requestsList.innerHTML = `<div class="req"><div class="left"><div class="subject">Nenhuma solicitação encontrada.</div></div></div>`;
        return;
    }
    const sortedMeetings = [...allMeetings].sort((a, b) => new Date(b.data) - new Date(a.data));
    sortedMeetings.forEach(reuniao => {
        const item = document.createElement('div');
        item.className = 'req';
        item.dataset.id = reuniao.id;
        item.innerHTML = `
            <div class="left">
                <div class="subject">${reuniao.assunto}</div>
                <div class="meta">${reuniao.mentor.name} • ${new Date(reuniao.data + 'T00:00:00').toLocaleDateString('pt-BR')} às ${reuniao.hora.substring(0,5)}</div>
            </div>
            <div class="right">
                <div class="badge ${reuniao.status.toLowerCase()}">${reuniao.status}</div>
            </div>
        `;
        requestsList.appendChild(item);
    });
}

function renderCalendar() {
    const calendarEl = document.getElementById('calendar');
    const monthTitle = document.getElementById('month-title');
    if (!calendarEl || !monthTitle) return;
    calendarEl.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    const isCurrentMonthOrPast = year < today.getFullYear() || (year === today.getFullYear() && month <= today.getMonth());
    const prevMonthButton = document.getElementById('prev-month');
    if (prevMonthButton) {
        prevMonthButton.disabled = isCurrentMonthOrPast;
    }
    monthTitle.textContent = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarEl.insertAdjacentHTML('beforeend', `<div class="day empty"></div>`);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const isoDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const todaysMeetings = allMeetings.filter(m => m.data === isoDate && m.status === 'CONFIRMADA');
        const eventsHTML = todaysMeetings.map(reuniao => `
            <div class="event" data-id="${reuniao.id}" title="${reuniao.assunto} - ${reuniao.mentor.name}">
                <span class="time">${reuniao.hora.substring(0, 5)}</span>
            </div>
        `).join('');
        const dayCellHTML = `
            <div class="day" data-date="${isoDate}">
                <div class="date-num">${day}</div>
                <div class="events">${eventsHTML}</div>
            </div>
        `;
        calendarEl.insertAdjacentHTML('beforeend', dayCellHTML);
    }
}

function setupEventListeners() {
    const sidebar = document.querySelector(".sidebar");
    const toggleMenuButton = document.querySelector(".toggle-menu");
    const expandSidebarButton = document.querySelector(".expand-sidebar");
    const body = document.body;
    if (toggleMenuButton && sidebar && expandSidebarButton) {
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
            // Usando alert para logout também, para consistência
            alert('Você foi desconectado.');
            window.location.href = '/TelaInicial/index.html';
        });
    }

    const toggles = document.querySelectorAll('.toggle-group .toggle');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggles.forEach(t => t.classList.remove('active'));
            toggle.classList.add('active');
        });
    });

    const dateInput = document.getElementById('date-input');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    document.getElementById('prev-month')?.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('next-month')?.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    const form = document.getElementById('request-form');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const submitButton = form.querySelector('.btn.primary');

            submitButton.disabled = true;
            submitButton.textContent = "Solicitando...";

            const modalidadeSelecionada = document.querySelector('input[name="modalidade"]:checked');
            const requestData = {
                mentorId: document.getElementById('mentor-select').value,
                data: document.getElementById('date-input').value,
                hora: document.getElementById('time-input').value,
                modalidade: modalidadeSelecionada ? modalidadeSelecionada.value : 'Online',
                assunto: document.getElementById('subject-input').value,
                observacoes: document.getElementById('notes-input').value,
            };

            if (!requestData.mentorId || !requestData.data || !requestData.hora || !requestData.assunto) {
                // Usando alert para erros de validação também
                alert("Erro: Preencha todos os campos obrigatórios.");
                submitButton.disabled = false;
                submitButton.textContent = "Solicitar reunião";
                return;
            }

            try {
                const response = await fetch('https://educasenai-api.onrender.com/api/reunioes', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(requestData)
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || "Falha ao solicitar reunião.");
                }

                // =======================================================
                // ALTERAÇÃO: Voltando a usar alert() para sucesso
                // =======================================================
                alert("Reunião solicitada!");
                // =======================================================
                // FIM DA ALTERAÇÃO
                // =======================================================

                form.reset();

                toggles.forEach(t => t.classList.remove('active'));
                form.querySelector('input[value="Online"]').parentElement.classList.add('active');

                loadMeetings();

            } catch (error) {
                // Usando alert para erros da API também
                alert("Erro: " + error.message);
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = "Solicitar reunião";
            }
        });
    }
}

/**
 * Função helper para mostrar notificações Toastify (mantida para outros erros).
 * type = 'success', 'error', ou 'info'
 */
function showToast(message, type = "info") {
    // Verifica se Toastify está carregado antes de usar
    if (typeof Toastify === 'function') {
        const backgroundColor = type === "error" ? "#ff3860" : (type === "success" ? "#23d160" : "#3e8ed0");
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: backgroundColor,
            stopOnFocus: true,
        }).showToast();
    } else {
        // Fallback para alert se Toastify não carregou
        console.warn("Toastify não carregado. Usando alert como fallback.");
        alert(message);
    }
}