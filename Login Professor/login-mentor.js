// login-mentor.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form-mentor');
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
                    // Ignora a resposta do backend (seja 401, 403, 500...)
                    // e força a mensagem de erro padrão e amigável.
                    throw new Error('Email ou senha inválidos.');
                }
                // =======================================================
                // FIM DA CORREÇÃO
                // =======================================================

                const data = await response.json();

                // VERIFICAÇÃO DE PERMISSÃO (Deve ser MENTOR)
                if (data.role !== 'MENTOR') {
                    // Mantém a mensagem específica para role incorreta
                    throw new Error('Acesso negado. Esta área é exclusiva para mentores.');
                }

                // Se for mentor, continua normalmente
                sessionStorage.setItem('authToken', data.token);

                messageElement.textContent = 'Login bem-sucedido! Redirecionando...';
                messageElement.style.color = 'green';

                setTimeout(() => {
                    window.location.href = '/Tela inicial Mentor/index.html';
                }, 1500);

            } catch (error) {
                console.error('Erro de login:', error);
                
                // Exibe a mensagem ("Email ou senha inválidos." ou "Acesso negado...")
                messageElement.textContent = error.message; 
                messageElement.style.color = 'red';

                // Reabilita o botão em caso de erro
                submitButton.disabled = false;
                submitButton.textContent = 'PRONTO!';
            }
        });
    }
});