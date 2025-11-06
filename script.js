import { collection, addDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import Chart from "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";

export function setupApp(db) {
  const numSubjectsInput = document.getElementById("numSubjects");
  const generateBtn = document.getElementById("generateBtn");
  const subjectsContainer = document.getElementById("subjectsContainer");
  const calcBtn = document.getElementById("calculateBtn");
  const results = document.getElementById("results");
  const leaderboardList = document.getElementById("leaderboardList");

  const calcSection = document.getElementById("calculatorSection");
  const leaderboardSection = document.getElementById("leaderboardSection");

  const calcBtnMenu = document.getElementById("calcBtn");
  const leaderboardBtn = document.getElementById("leaderboardBtn");

  let chart = null;

  calcBtnMenu.addEventListener("click", () => {
    calcSection.style.display = "block";
    leaderboardSection.style.display = "none";
  });

  leaderboardBtn.addEventListener("click", async () => {
    calcSection.style.display = "none";
    leaderboardSection.style.display = "block";
    loadLeaderboard();
  });

  generateBtn.addEventListener("click", () => {
    subjectsContainer.innerHTML = "";
    const num = parseInt(numSubjectsInput.value);
    for (let i = 1; i <= num; i++) {
      subjectsContainer.innerHTML += `
        <div>
          <input type="text" placeholder="Subject ${i} name" id="subName${i}" />
          <input type="number" placeholder="Credit Hour" id="credit${i}" />
          <input type="text" placeholder="Grade (A, B+, C...)" id="grade${i}" />
        </div>`;
    }
  });

  calcBtn.addEventListener("click", async () => {
    const num = parseInt(numSubjectsInput.value);
    const prevCredits = parseFloat(document.getElementById("prevCredits").value);
    const prevCgpa = parseFloat(document.getElementById("prevCgpa").value);

    const grades = {
      A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7,
      "C+": 2.3, C: 2.0, "C-": 1.7, D: 1.3, F: 0
    };

    let totalPoints = 0, totalCredits = 0;

    for (let i = 1; i <= num; i++) {
      const credit = parseFloat(document.getElementById(`credit${i}`).value);
      const grade = document.getElementById(`grade${i}`).value.toUpperCase();
      totalPoints += grades[grade] * credit;
      totalCredits += credit;
    }

    const gpa = totalPoints / totalCredits;
    const cgpa = ((prevCgpa * prevCredits) + (gpa * totalCredits)) / (prevCredits + totalCredits);

    results.innerHTML = `<h3>Your GPA: ${gpa.toFixed(2)}</h3><h3>Your CGPA: ${cgpa.toFixed(2)}</h3>`;

    let username = localStorage.getItem("unirazak_user");
    if (!username) {
      username = prompt("Enter your name (UniRazak Student):");
      localStorage.setItem("unirazak_user", username);
    }

    await addDoc(collection(db, "leaderboard"), {
      name: username,
      gpa: gpa,
      cgpa: cgpa,
      timestamp: Date.now()
    });

    if (chart) chart.destroy();
    const ctx = document.getElementById("progressChart");
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Previous", "Current"],
        datasets: [
          {
            label: "CGPA Progress",
            data: [prevCgpa, cgpa],
            borderColor: "#00e0ff",
            borderWidth: 3,
            fill: false,
            tension: 0.4
          }
        ]
      },
      options: {
        animation: { duration: 1500 },
        scales: { y: { beginAtZero: true, max: 4.0 } }
      }
    });
  });

  async function loadLeaderboard() {
    leaderboardList.innerHTML = "<li>Loading...</li>";
    const q = query(collection(db, "leaderboard"), orderBy("cgpa", "desc"), limit(10));
    const snapshot = await getDocs(q);

    leaderboardList.innerHTML = "";
    snapshot.forEach(doc => {
      const d = doc.data();
      leaderboardList.innerHTML += `<li>${d.name} — CGPA: ${d.cgpa.toFixed(2)} | GPA: ${d.gpa.toFixed(2)}</li>`;
    });
  }
}
