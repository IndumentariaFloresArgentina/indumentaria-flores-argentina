const menuIcon = document.getElementById('menuIcon');
  const menuLinks = document.getElementById('menuLinks');

  menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('open');
    menuLinks.classList.toggle('active');
  });