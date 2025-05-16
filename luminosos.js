const menuIcon = document.getElementById('menuIcon');
  const menuLinks = document.getElementById('menuLinks');

  menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('open');
    menuLinks.classList.toggle('active');
});

$('#lightSlider').lightSlider({
    gallery: true,
    item: 1,
    loop:true,
    slideMargin: 0,
    thumbItem: 9
});