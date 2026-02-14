// Portfolio menu toggle
const burgerBtn = document.getElementById('burgerBtn');
const menu = document.getElementById('menu');

burgerBtn.addEventListener('click', () => {
  burgerBtn.classList.toggle('active');
  menu.classList.toggle('active');
});

// Cyber header burger toggle (if you want animation)
const cyberBurger = document.querySelector('.cyber-header .burger');
cyberBurger.addEventListener('click', () => {
  cyberBurger.classList.toggle('active');
  // You can add menu toggle here if needed
});
