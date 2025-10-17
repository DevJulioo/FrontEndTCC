document.addEventListener('DOMContentLoaded', function() {
    var botao = document.getElementById('btn-comece-agora');
    var primeiraSecao = document.getElementById('primeira-secao');
    if (botao && primeiraSecao) {
      botao.addEventListener('click', function(e) {
        e.preventDefault();
        primeiraSecao.scrollIntoView({ behavior: 'smooth' });
      });
    }
  });
  