// Terminal animation for the header
const commands = [
    "initializing...",
    "scanning_systems.sh --target=127.0.0.1",
    "decrypting_ciphertext.py --algo=AES256",
    "bypassing_firewall.exe --port=443",
    "root@kali:~# rm -rf / --no-preserve-root"
];

let index = 0;
setInterval(() => {
    document.getElementById("hacking-animation").textContent = commands[index];
    index = (index + 1) % commands.length;
}, 3000);

// Burger menu toggle
const burgerBtn = document.getElementById('burgerBtn');
const menu = document.getElementById('menu');

burgerBtn.addEventListener('click', () => {
  burgerBtn.classList.toggle('active');
  menu.classList.toggle('active');
});
