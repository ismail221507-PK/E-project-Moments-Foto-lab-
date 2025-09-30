const navbarMenu = document.getElementById('navbarMenu');
const menuOverlay = document.getElementById('menuOverlay');

navbarMenu.addEventListener('show.bs.collapse', () => {
  menuOverlay.classList.add('active');
});

navbarMenu.addEventListener('hidden.bs.collapse', () => {
  menuOverlay.classList.remove('active');
});

// Close menu when clicking on overlay
menuOverlay.addEventListener('click', () => {
  const bsCollapse = bootstrap.Collapse.getInstance(navbarMenu);
  bsCollapse.hide();
});