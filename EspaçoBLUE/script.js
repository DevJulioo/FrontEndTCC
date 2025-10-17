document.addEventListener("DOMContentLoaded", function () {
  const chatBox = document.getElementById("chat-box");
  const chatInput = document.getElementById("chat-input");
  const sendButton = document.getElementById("send-button");
  const typingIndicator = document.getElementById("typing-indicator");
  const bubblesContainer = document.getElementById("bubbles-container");

  let botResponding = false; // bloqueio de envio

  sendButton.addEventListener("click", sendMessage);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  function sendMessage() {
    if (botResponding) return; // bloqueia envio até resposta
    const userMessage = chatInput.value.trim();
    if (userMessage === "") return;

    const userDiv = document.createElement("div");
    userDiv.classList.add("message", "user-message");
    userDiv.textContent = userMessage;
    chatBox.appendChild(userDiv);
    chatInput.value = "";
    scrollToBottom();

    botResponding = true;
    typingIndicator.style.display = "block";
    scrollToBottom();

    setTimeout(() => {
      typingIndicator.style.display = "none";

      const botDiv = document.createElement("div");
      botDiv.classList.add("message", "bot-message");
      botDiv.textContent = "Aqui está sua resposta!";
      chatBox.appendChild(botDiv);
      scrollToBottom();
      botResponding = false;
    }, 1500);
  }

  function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Função para criar bolhas de fundo
  function createBubble() {
    const bubble = document.createElement("div");
    bubble.classList.add("bubble");
    const size = Math.random() * 40 + 10; // tamanho aleatório
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDuration = `${Math.random() * 5 + 5}s`;
    bubblesContainer.appendChild(bubble);

    setTimeout(() => {
      bubble.remove();
    }, 10000);
  }

  setInterval(createBubble, 500); // cria bolha a cada meio segundo
});
