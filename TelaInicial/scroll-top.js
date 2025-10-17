document.addEventListener('DOMContentLoaded', function() {
  var botao = document.getElementById('btn-comece-agora');
  if (botao) {
    botao.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'  
      });
    });
  }
});
