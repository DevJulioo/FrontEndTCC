// login.js (Completo e Corrigido)

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const messageElement = document.getElementById('message');
    const submitButton = document.getElementById('login-submit-btn');

    // --- Lógica para Mostrar/Ocultar Senha ---
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('senha');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
        });
    }

    // --- Lógica de Login ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Feedback visual imediato
            messageElement.textContent = 'Verificando...';
            messageElement.style.color = '#333';
            submitButton.disabled = true;
            submitButton.textContent = 'Entrando...';

            const email = document.getElementById('email').value;
            const password = document.getElementById('senha').value;

            try {
                const response = await fetch('https://educasenai-api.onrender.com/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                // =======================================================
                // A CORREÇÃO ESTÁ AQUI 👇
                // =======================================================
                if (!response.ok) {
                    // Se a resposta NÃO for OK (seja 401, 403, 500, etc.)
                    // Nós vamos FORÇAR a mensagem de erro amigável,
                    // ignorando o erro "feio" que o backend enviou.
                    throw new Error('Email ou senha inválidos.');
                }
                // =======================================================
                // FIM DA CORREÇÃO
                // =======================================================

                const data = await response.json();

                // VERIFICAÇÃO DE PERMISSÃO
                if (data.role !== 'ALUNO') {
                    throw new Error('Acesso negado. Esta área é exclusiva para alunos.');
                }
                
                // Se for aluno, continua normalmente
                sessionStorage.setItem('authToken', data.token);

                messageElement.textContent = 'Login bem-sucedido! Redirecionando...';
                messageElement.style.color = 'green';
                
                setTimeout(() => {
                    window.location.href = '/telaprincipal/index.html';
                }, 1500);

            } catch (error) {
                console.error('Erro de login:', error);
                
                // Agora, 'error.message' será "Email ou senha inválidos." 
                // ou "Acesso negado..."
                messageElement.textContent = error.message; 
                messageElement.style.color = 'red';

                // Reabilita o botão em caso de erro
                submitButton.disabled = false;
                submitButton.textContent = 'Entrar';
            }
        });
    }
});