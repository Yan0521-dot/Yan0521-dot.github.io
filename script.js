// Show glitch layer on hover (desktop) or tap (mobile)
document.querySelectorAll('.cyber-btn').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.querySelector('.glitch').style.display = 'flex';
  });
  btn.addEventListener('mouseleave', () => {
    btn.querySelector('.glitch').style.display = 'none';
  });

  // Mobile click/tap
  btn.addEventListener('touchstart', () => {
    btn.querySelector('.glitch').style.display = 'flex';
  });
  btn.addEventListener('touchend', () => {
    btn.querySelector('.glitch').style.display = 'none';
  });
});

