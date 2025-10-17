// Exemplo de script para exibir uma mensagem ao carregar a página
window.onload = function() {
    console.log("Página carregada com sucesso!");
    showSuccessToast("Bem-vindo ao mundo da Internet das Coisas!");
};

// Aqui você pode adicionar outros comportamentos, por exemplo, alterar o texto ou a imagem.
document.querySelector('.content-box').addEventListener('click', function() {
    showSuccessToast("Você clicou no conteúdo!");
});
