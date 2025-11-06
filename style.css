const usernameInput = document.getElementById("username");
const saveNameBtn = document.getElementById("saveName");
const userSection = document.getElementById("user-section");
const calculatorSection = document.getElementById("calculator-section");
const leaderboardSection = document.getElementById("leaderboard-section");
const leaderboardList = document.getElementById("leaderboard");

const db = window.db;
const { collection, addDoc, getDocs, query, orderBy, limit } = window.firestoreRefs;

let userName = localStorage.getItem("userName") || null;
let chart;
let progressData = { gpa: [], cgpa: [] };

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("menuContent").classList.toggle("show");
});

document.getElementById("leaderboardBtn").addEventListener("click", async () => {
  calculatorSection.style.display = "none";
  leaderboardSection.style.display = "block";
  await loadLeaderboard();
});

document.getElementById("homeBtn").addEventListener("click", () => {
  leaderboardSection.style.display = "none";
  calculatorSection.style.display = "block";
});

if (userName) {
  userSection.style.display = "none";
  calculatorSection.style.display = "block";
} else {
  userSection.style.display = "block";
}

saveNameBtn.addEventListener("click", () => {
  userName = usernameInput.value.trim();
  if (userName) {
    localStorage.setItem("userName", userName);
    userSection.style.display = "none";
    calculatorSection.style.display = "block";
  }
});

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

document.getElementById("saveProgress").addEventListener("click", async () => {
  const lastGpa = progressData.gpa.at(-1);
  const lastCgpa = progressData.cgpa.at(-1);

  if (lastCgpa && userName) {
    await addDoc(collection(db, "leaderboard"), {
      name: userName,
      gpa: lastGpa.toFixed(2),
      cgpa: lastCgpa.toFixed(2),
    });
    alert("Progress saved! 🔥");
  }
});

document.getElementById("resetChart").addEventListener("click", () => {
  progressData = { gpa: [], cgpa: [] };
  if (chart) chart.destroy();
  alert("Chart reset.");
});

async function loadLeaderboard() {
  leaderboardList.innerHTML = "Loading...";
  const q = query(collection(db, "leaderboard"), orderBy("cgpa", "desc"), limit(10));
  const querySnapshot = await getDocs(q);

  leaderboardList.innerHTML = "";
  querySnapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `${data.name} — GPA: ${data.gpa}, CGPA: ${data.cgpa}`;
    leaderboardList.appendChild(li);
  });
}
