const burgerBtn = document.getElementById('burgerBtn');
const menu = document.getElementById('menu');

burgerBtn.addEventListener('click', () => {
  burgerBtn.classList.toggle('active');
  menu.classList.toggle('active');
});
