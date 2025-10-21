document.addEventListener('DOMContentLoaded', () => {
    // Seleção de Elementos
    const registerForm = document.getElementById('register-form');
    const messageElement = document.getElementById('message');
    const submitButton = document.getElementById('register-submit-btn');

    // Spans de erro individuais
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    
    // Função auxiliar para limpar todos os erros
    function clearErrors() {
        messageElement.textContent = '';
        messageElement.className = '';
        nameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';
    }

    // Função auxiliar para os botões de mostrar/ocultar senha
    function setupPasswordToggle(toggleId, inputId) {
        const toggle = document.getElementById(toggleId);
        const input = document.getElementById(inputId);
        if (toggle && input) {
            toggle.addEventListener('click', () => {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                toggle.textContent = type === 'password' ? '👁️' : '🙈';
            });
        }
    }

    // Configura os dois botões de senha
    setupPasswordToggle('toggle-password', 'password-input');
    setupPasswordToggle('toggle-confirm-password', 'confirm-password-input');

    // Listener principal do formulário
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Impede o envio padrão
            clearErrors(); // Limpa erros antigos

            // --- 1. Coleta de Dados ---
            const name = document.getElementById('name-input').value;
            const email = document.getElementById('email-input').value;
            const password = document.getElementById('password-input').value;
            const confirmPassword = document.getElementById('confirm-password-input').value;
            const mentorCode = document.getElementById('mentor-code').value;

            // --- 2. Validação do Lado do Cliente (Frontend) ---
            let isValid = true; // Flag de validação

            if (name.length < 3) {
                nameError.textContent = "Nome completo deve ter pelo menos 3 caracteres.";
                isValid = false;
            }

            if (!email.includes('@') || !email.includes('.')) {
                emailError.textContent = "Por favor, insira um e-mail válido.";
                isValid = false;
            }

            if (password.length < 8) {
                passwordError.textContent = "Senha deve ter pelo menos 8 caracteres.";
                isValid = false;
            }

            if (password !== confirmPassword) {
                confirmPasswordError.textContent = "As senhas não coincidem.";
                isValid = false;
            }
            
            // Verifica a meta diária (lógica da página anterior)
            const dailyGoal = sessionStorage.getItem('userDailyGoal');
            if (!dailyGoal) {
                messageElement.textContent = "Meta diária não encontrada. Por favor, volte ao início do cadastro.";
                messageElement.className = 'error-message';
                isValid = false;
            }

            // Se qualquer validação local falhou, para a execução aqui
            if (!isValid) {
                return; 
            }

            // --- 3. Feedback de Carregamento (Se tudo estiver válido) ---
            submitButton.disabled = true;
            submitButton.textContent = 'CADASTRANDO...';

            // Prepara os dados para o backend
            const registrationData = {
                name: name,
                email: email,
                password: password,
                role: 'ALUNO', // Hardcoded como ALUNO
                mentorCode: mentorCode,
                dailyLearningGoalMinutes: parseInt(dailyGoal, 10)
            };

            // --- 4. Envio para a API ---
            try {
                const response = await fetch('https://educasenai-api.onrender.com/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registrationData)
                });

                // Pega o texto da resposta (seja erro ou sucesso)
                const responseText = await response.text();

                if (!response.ok) {
                    // Joga o erro com a mensagem do backend (ex: "Este e-mail já está em uso.")
                    throw new Error(responseText || "Falha ao realizar o cadastro.");
                }

                // Sucesso
                messageElement.textContent = "Cadastro realizado com sucesso! Redirecionando para o login...";
                messageElement.className = 'success-message';
                
                sessionStorage.removeItem('userDailyGoal'); // Limpa a meta
                
                // Espera 2 segundos antes de redirecionar
                setTimeout(() => {
                    window.location.href = '/Login Principal/login.html'; 
                }, 2000); 

            } catch (error) {
                // Pega erros de validação (ex: email duplicado) ou de rede
                messageElement.textContent = "Erro: " + error.message;
                messageElement.className = 'error-message';
                
                // Reabilita o botão para o usuário tentar novamente
                submitButton.disabled = false;
                submitButton.textContent = 'CADASTRAR';
            }
        });
    }
});

