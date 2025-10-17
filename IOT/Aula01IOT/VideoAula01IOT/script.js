document.addEventListener("DOMContentLoaded", function() {
    let mascote = document.getElementById("mascote");
    let celular = document.getElementById("celular");
    let containerMascote = document.getElementById("containerMascote");
    let containerVideo = document.getElementById("containerVideo");
    let botao = document.getElementById("continuar");

    // Edufinho cresce
    setTimeout(() => {
        mascote.style.transform = "scale(1.8)";
        mascote.style.transition = "transform 1s ease-in-out";
    }, 500);



    //fundo 
    setTimeout(() => {
        containerVideo.style.opacity = "1";  
        containerVideo.style.transition = "opacity 1.5s ease-in-out"; 
    }, 2200);

    // Esconde edufinho
    setTimeout(() => {
        containerMascote.style.opacity = "0";  
        containerMascote.style.transition = "opacity 1s ease-in-out";
    }, 2500);

    // Mostra o vídeo e botão 
    setTimeout(() => {
        containerMascote.style.display = "none"; 
        containerVideo.style.visibility = "visible";
        botao.style.opacity = "1"; 
        botao.style.visibility = "visible";
    }, 3000);
});
