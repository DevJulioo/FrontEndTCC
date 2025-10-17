document.addEventListener("DOMContentLoaded", function () {
  const toggleMenuButton = document.querySelector(".toggle-menu");
  const sidebar = document.querySelector(".sidebar");
  const expandSidebarButton = document.querySelector(".expand-sidebar");
  const body = document.body;

  // Contrair menu
  toggleMenuButton?.addEventListener("click", function () {
    sidebar.classList.add("collapsed");
    expandSidebarButton.classList.add("show");
    body.classList.add("menu-collapsed");
  });

  // Expandir menu
  expandSidebarButton?.addEventListener("click", function () {
    sidebar.classList.remove("collapsed");
    expandSidebarButton.classList.remove("show");
    body.classList.remove("menu-collapsed");
  });
});
