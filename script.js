import TubesCursor from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js"

// Full-screen tubes cursor (default colors)
const app = TubesCursor(document.getElementById('canvas'), {
  tubes: {
    colors: ["#f967fb", "#53bc28", "#6958d5"],
    lights: {
      intensity: 200,
      colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"]
    }
  }
});

// Randomize tube colors on click
document.body.addEventListener('click', () => {
  const colors = randomColors(3);
  const lightsColors = randomColors(4);
  app.tubes.setColors(colors);
  app.tubes.setLightsColors(lightsColors);
});

function randomColors (count) {
  return new Array(count)
      .fill(0)
      .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
}

// Burger menu toggle
const burgerBtn = document.getElementById('burgerBtn');
const menu = document.getElementById('menu');

burgerBtn.addEventListener('click', () => {
  burgerBtn.classList.toggle('active');
  menu.classList.toggle('active');
});
