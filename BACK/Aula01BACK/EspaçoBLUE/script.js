document.addEventListener("DOMContentLoaded", function() {
    const splashScreen = document.getElementById("splash-screen");
    setTimeout(() => {
        splashScreen.style.opacity = "0";
        setTimeout(() => {
            splashScreen.style.display = "none";
        }, 1000);
    }, 2000);

    const chatBox = document.getElementById("chat-box");
    const chatInput = document.getElementById("chat-input");
    const sendButton = document.getElementById("send-button");

    function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (userMessage === "") retur
        n;

        const userDiv = document.createElement("div");
        userDiv.classList.add("message", "user-message");
        userDiv.textContent = userMessage;
        chatBox.appendChild(userDiv);

        chatInput.value = "";
        setTimeout(() => {
            const botDiv = document.createElement("div");
            botDiv.classList.add("message", "bot-message");
            const botImg = document.createElement("img");
            botImg.src = "edufinho.png";
            botImg.classList.add("bot-avatar");
            botDiv.appendChild(botImg);
            botDiv.appendChild(document.createTextNode("Aqui está sua resposta!"));
            chatBox.appendChild(botDiv);
        }, 1000);
     
    }
}

