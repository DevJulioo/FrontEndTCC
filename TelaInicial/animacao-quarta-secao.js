function animeScroll() {
    var windowHeight = window.innerHeight;
    var offset = windowHeight * 0.75;
    document.querySelectorAll('.anime').forEach(function(el) {
      var elementTop = el.getBoundingClientRect().top + window.scrollY;
      var scrollTop = window.scrollY;
      if (scrollTop + offset > elementTop) {
        el.classList.add('anime-init');
      } else {
        el.classList.remove('anime-init');
      }
    });
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    animeScroll();
    document.addEventListener('scroll', animeScroll);
  });
  