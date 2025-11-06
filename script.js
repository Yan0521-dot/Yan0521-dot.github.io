// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBKGVgtx7YbjfGt7trWF3gcQ1r6NZtNKBw",
  authDomain: "cgpa-calculator-ur.firebaseapp.com",
  projectId: "cgpa-calculator-ur",
  storageBucket: "cgpa-calculator-ur.firebasestorage.app",
  messagingSenderId: "345716541673",
  appId: "1:345716541673:web:0633637368fb0156d98878",
  measurementId: "G-277D7RMJLH"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const usernameInput = document.getElementById("username");
const saveNameBtn = document.getElementById("saveName");
const userSection = document.getElementById("user-section");
const calculatorSection = document.getElementById("calculator-section");
const leaderboardSection = document.getElementById("leaderboard-section");
const leaderboardList = document.getElementById("leaderboard");

let userName = localStorage.getItem("userName") || null;
let chart;
let progressData = { gpa: [], cgpa: [] };

// Menu toggle
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("menuContent").classList.toggle("show");
});

// Nav buttons
document.getElementById("leaderboardBtn").addEventListener("click", async () => {
  calculatorSection.style.display = "none";
  leaderboardSection.style.display = "block";
  await loadLeaderboard();
});

document.getElementById("homeBtn").addEventListener("click", () => {
  leaderboardSection.style.display = "none";
  calculatorSection.style.display = "block";
});

// Show calculator if returning user
if (userName) {
  userSection.style.display = "none";
  calculatorSection.style.display = "block";
  document.getElementById("motivation").innerText = `Welcome back, ${userName}! Keep going 💪`;
} else {
  userSection.style.display = "block";
}

saveNameBtn.addEventListener("click", () => {
  userName = usernameInput.value.trim();
  if (userName) {
    localStorage.setItem("userName", userName);
    userSection.style.display = "none";
    calculatorSection.style.display = "block";

    const quotes = [
      "You’re capable of amazing things, keep going!",
      "Believe in yourself — every GPA point matters 💯",
      "One step closer to your dream, UR student!"
    ];
    document.getElementById("motivation").innerText = quotes[Math.floor(Math.random() * quotes.length)];
  }
});

// Generate subject fields
document.getElementById("generateFields").addEventListener("click", () => {
  const num = document.getElementById("subjects").value;
  const container = document.getElementById("subjectsContainer");
  container.innerHTML = "";
  for (let i = 1; i <= num; i++) {
    container.innerHTML += `
      <div>
        <input type="text" placeholder="Subject ${i} Name" class="subject-name"/>
        <input type="number" placeholder="Credit Hours" class="credit"/>
        <select class="grade">
          <option value="4">A</option>
          <option value="3.7">A-</option>
          <option value="3.3">B+</option>
          <option value="3">B</option>
          <option value="2.7">B-</option>
          <option value="2.3">C+</option>
          <option value="2">C</option>
          <option value="1.7">C-</option>
          <option value="1.3">D+</option>
          <option value="1">D</option>
          <option value="0">F</option>
          <option value="S">S</option>
          <option value="US">US</option>
        </select>
      </div>`;
  }
});

// Calculate GPA/CGPA
document.getElementById("calculateBtn").addEventListener("click", () => {
  const credits = document.querySelectorAll(".credit");
  const grades = document.querySelectorAll(".grade");
  const prevCredits = parseFloat(document.getElementById("prevCredits").value || 0);
  const prevCgpa = parseFloat(document.getElementById("prevCgpa").value || 0);
  let totalCredits = 0, totalPoints = 0;

  credits.forEach((credit, i) => {
    const c = parseFloat(credit.value);
    const g = grades[i].value === "S" || grades[i].value === "US" ? null : parseFloat(grades[i].value);
    if (!isNaN(c) && g !== null) {
      totalCredits += c;
      totalPoints += c * g;
    }
  });

  const gpa = totalPoints / totalCredits;
  const cgpa = (prevCgpa * prevCredits + gpa * totalCredits) / (prevCredits + totalCredits);

  document.getElementById("results").innerHTML = `
    <p>GPA: ${gpa.toFixed(2)}</p>
    <p>CGPA: ${cgpa.toFixed(2)}</p>
  `;

  document.getElementById("chartContainer").style.display = "block";
  updateChart(gpa, cgpa);
});

// Update chart
function updateChart(gpa, cgpa) {
  const ctx = document.getElementById("progressChart");
  progressData.gpa.push(gpa);
  progressData.cgpa.push(cgpa);

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: progressData.gpa.map((_, i) => `Sem ${i + 1}`),
      datasets: [
        { label: "GPA", data: progressData.gpa, borderColor: "#ff4747", borderWidth: 3, fill: false },
        { label: "CGPA", data: progressData.cgpa, borderColor: "#b30000", borderWidth: 3, fill: false },
      ],
    },
    options: {
      animation: { duration: 1500 },
      scales: { y: { beginAtZero: true, max: 4.0 } },
    },
  });
}

// Save to leaderboard (only if top 10-worthy)
document.getElementById("saveProgress").addEventListener("click", async () => {
  const lastGpa = progressData.gpa.at(-1);
  const lastCgpa = progressData.cgpa.at(-1);

  if (!lastCgpa || !userName) return alert("No data to save.");

  const topQuery = await db.collection("leaderboard").orderBy("cgpa", "desc").limit(10).get();
  const lowestTopCgpa = topQuery.docs[topQuery.docs.length - 1]?.data()?.cgpa || 0;

  if (parseFloat(lastCgpa.toFixed(2)) > parseFloat(lowestTopCgpa)) {
    await db.collection("leaderboard").add({
      name: userName,
      gpa: lastGpa.toFixed(2),
      cgpa: lastCgpa.toFixed(2),
    });
    alert("🔥 Congrats! You made it to the leaderboard!");
  } else {
    alert("Keep pushing! Your CGPA isn’t in top 10 yet 💪");
  }
});

// Reset chart
document.getElementById("resetChart").addEventListener("click", () => {
  progressData = { gpa: [], cgpa: [] };
  if (chart) chart.destroy();
  alert("Chart reset.");
});

// Load leaderboard
async function loadLeaderboard() {
  leaderboardList.innerHTML = "Loading...";
  const q = await db.collection("leaderboard").orderBy("cgpa", "desc").limit(10).get();

  leaderboardList.innerHTML = "";
  q.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `${data.name} — GPA: ${data.gpa}, CGPA: ${data.cgpa}`;
    leaderboardList.appendChild(li);
  });
}
