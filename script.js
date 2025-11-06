import { collection, addDoc, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const db = window.db;
let username = localStorage.getItem("username") || "";

const nameSection = document.getElementById("name-section");
const cgpaSection = document.getElementById("cgpa-section");
const leaderboardSection = document.getElementById("leaderboard-section");
const saveNameBtn = document.getElementById("save-name");

if (username) {
  nameSection.classList.add("hidden");
  cgpaSection.classList.remove("hidden");
  loadLeaderboard();
}

saveNameBtn.addEventListener("click", () => {
  const nameInput = document.getElementById("username").value.trim();
  if (!nameInput) return alert("Enter your name first!");
  username = nameInput;
  localStorage.setItem("username", username);
  nameSection.classList.add("hidden");
  cgpaSection.classList.remove("hidden");
});

document.getElementById("addSubjects").addEventListener("click", () => {
  const numSubjects = parseInt(document.getElementById("numSubjects").value);
  const subjectsDiv = document.getElementById("subjects");
  subjectsDiv.innerHTML = "";

  for (let i = 1; i <= numSubjects; i++) {
    subjectsDiv.innerHTML += `
      <div class="subject-row">
        <input type="text" placeholder="Subject ${i} name" class="subjectName" />
        <input type="number" placeholder="Credit Hour" class="credit" />
        <input type="number" placeholder="Grade Point (0-4)" class="grade" />
      </div>`;
  }

  document.getElementById("calculateBtn").classList.remove("hidden");
});

document.getElementById("calculateBtn").addEventListener("click", () => {
  const credits = document.querySelectorAll(".credit");
  const grades = document.querySelectorAll(".grade");

  let totalCredits = 0;
  let totalPoints = 0;

  for (let i = 0; i < credits.length; i++) {
    const c = parseFloat(credits[i].value);
    const g = parseFloat(grades[i].value);
    if (isNaN(c) || isNaN(g)) continue;
    totalCredits += c;
    totalPoints += c * g;
  }

  const gpa = (totalPoints / totalCredits).toFixed(2);
  const cgpa = gpa;

  document.getElementById("gpa").innerText = gpa;
  document.getElementById("cgpa").innerText = cgpa;

  document.getElementById("result").classList.remove("hidden");
  document.getElementById("progressChart").classList.remove("hidden");

  drawChart([gpa]);
});

document.getElementById("saveProgress").addEventListener("click", async () => {
  const cgpa = parseFloat(document.getElementById("cgpa").innerText);
  if (!cgpa || !username) return alert("Invalid data!");

  await addDoc(collection(db, "leaderboard"), {
    name: username,
    cgpa: cgpa,
    timestamp: new Date()
  });

  alert("Saved successfully!");
  loadLeaderboard();
});

async function loadLeaderboard() {
  const leaderboardList = document.getElementById("leaderboard");
  leaderboardList.innerHTML = "";

  const q = query(collection(db, "leaderboard"), orderBy("cgpa", "desc"), limit(10));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `${data.name} — ${data.cgpa.toFixed(2)}`;
    leaderboardList.appendChild(li);
  });

  leaderboardSection.classList.remove("hidden");
}

function drawChart(data) {
  const ctx = document.getElementById("progressChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Current GPA"],
      datasets: [{
        label: "CGPA Progress",
        data: data,
        borderWidth: 2,
        borderColor: "#00ffff",
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      animation: { duration: 1000, easing: "easeOutQuart" },
      scales: { y: { beginAtZero: true, max: 4 } }
    }
  });
}
