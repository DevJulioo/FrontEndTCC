// cadastro.js (Corrigido para exibir erros na tela)

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const messageElement = document.getElementById('message');

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Limpa mensagens de erro anteriores
            messageElement.textContent = '';
            messageElement.className = '';

            const name = document.getElementById('name-input').value;
            const email = document.getElementById('email-input').value;
            const password = document.getElementById('password-input').value;
            const mentorCode = document.getElementById('mentor-code').value;

            const dailyGoal = sessionStorage.getItem('userDailyGoal');
            if (!dailyGoal) {
                messageElement.textContent = "Meta diária não encontrada. Por favor, volte e selecione uma.";
                messageElement.className = 'error-message';
                return;
            }

            const registrationData = {
                name: name,
                email: email,
                password: password,
                role: 'ALUNO',
                mentorCode: mentorCode,
                dailyLearningGoalMinutes: parseInt(dailyGoal, 10)
            };

            try {
                const response = await fetch('https://educasenai-api.onrender.com/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registrationData)
                });

                // Pega o texto da resposta, seja de erro ou sucesso
                const responseText = await response.text();

                if (!response.ok) {
                    // Se a resposta não for OK, lança um erro com a mensagem do back-end
                    throw new Error(responseText || "Falha ao realizar o cadastro.");
                }

                // Se o cadastro foi bem-sucedido
                messageElement.textContent = "Cadastro realizado com sucesso! Redirecionando para o login...";
                messageElement.className = 'success-message';
                
                sessionStorage.removeItem('userDailyGoal');
                
                setTimeout(() => {
                    window.location.href = '/Login Principal/login.html';
                }, 2000); // Espera 2 segundos antes de redirecionar

            } catch (error) {
                // Exibe a mensagem de erro (ex: "Este e-mail já está em uso.") no parágrafo
                messageElement.textContent = "Erro: " + error.message;
                messageElement.className = 'error-message';
            }
        });
    }
});