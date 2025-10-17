// login-mentor.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form-mentor');
    const messageElement = document.getElementById('message');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        messageElement.textContent = 'Verificando...';
        messageElement.style.color = '#333';

        const email = document.getElementById('email').value;
        const password = document.getElementById('senha').value;

        try {
            const response = await fetch('https://educasenai-api.onrender.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Email ou senha inválidos.');
            }

            const data = await response.json();

            // VERIFICAÇÃO DE PERMISSÃO
            if (data.role !== 'MENTOR') {
                messageElement.textContent = 'Acesso negado. Esta área é exclusiva para mentores.';
                messageElement.style.color = 'red';
                return; // Impede o login
            }

            // Se for mentor, continua normalmente
            sessionStorage.setItem('authToken', data.token);

            messageElement.textContent = 'Login bem-sucedido! Redirecionando...';
            messageElement.style.color = 'green';

            setTimeout(() => {
                // Verifique se este é o caminho correto para o dashboard do MENTOR
                window.location.href = '/Tela inicial Mentor/index.html';
            }, 1500);

        } catch (error) {
            console.error('Erro de login:', error);
            messageElement.textContent = error.message;
            messageElement.style.color = 'red';
        }
    });
});