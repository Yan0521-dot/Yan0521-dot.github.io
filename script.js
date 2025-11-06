import { collection, addDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const db = window.db;

const nameSection = document.getElementById("name-section");
const cgpaSection = document.getElementById("cgpa-section");
const saveNameBtn = document.getElementById("save-name");
const usernameInput = document.getElementById("username");
const addSubjectsBtn = document.getElementById("addSubjects");
const numSubjectsInput = document.getElementById("numSubjects");
const subjectsDiv = document.getElementById("subjects");
const calculateBtn = document.getElementById("calculateBtn");
const resultDiv = document.getElementById("result");
const gpaSpan = document.getElementById("gpa");
const cgpaSpan = document.getElementById("cgpa");
const leaderboardBtn = document.getElementById("leaderboard-btn");
const leaderboardDiv = document.getElementById("leaderboard");
const progressChart = document.getElementById("progressChart");

let userName = localStorage.getItem("username");

// ==== If username exists, skip name section ====
if (userName) {
  nameSection.classList.add("hidden");
  cgpaSection.classList.remove("hidden");
} else {
  cgpaSection.classList.add("hidden");
}

// ==== Save name once ====
saveNameBtn.addEventListener("click", () => {
  const name = usernameInput.value.trim();
  if (!name) {
    alert("Please enter your name first!");
    return;
  }
  localStorage.setItem("username", name);
  userName = name;
  nameSection.classList.add("hidden");
  cgpaSection.classList.remove("hidden");
});

// ==== Add subjects dynamically ====
addSubjectsBtn.addEventListener("click", () => {
  const numSubjects = parseInt(numSubjectsInput.value);
  subjectsDiv.innerHTML = "";
  if (!numSubjects || numSubjects <= 0) {
    alert("Enter a valid number of subjects!");
    return;
  }

  for (let i = 1; i <= numSubjects; i++) {
    subjectsDiv.innerHTML += `
      <div class="subject">
        <h3>Subject ${i}</h3>
        <input type="number" id="credit${i}" placeholder="Credit Hours" min="1" />
        <select id="grade${i}">
          <option value="4.00">A+</option>
          <option value="4.00">A</option>
          <option value="3.67">A-</option>
          <option value="3.33">B+</option>
          <option value="3.00">B</option>
          <option value="2.67">B-</option>
          <option value="2.33">C+</option>
          <option value="2.00">C</option>
          <option value="1.67">C-</option>
          <option value="1.33">D+</option>
          <option value="1.00">D</option>
          <option value="0.00">F</option>
          <option value="S">S</option>
          <option value="US">US</option>
        </select>
      </div>
    `;
  }

  calculateBtn.classList.remove("hidden");
});

// ==== Calculate GPA + CGPA ====
calculateBtn.addEventListener("click", async () => {
  let totalCredits = 0;
  let totalGradePoints = 0;
  const numSubjects = parseInt(numSubjectsInput.value);

  for (let i = 1; i <= numSubjects; i++) {
    const credit = parseFloat(document.getElementById(`credit${i}`).value);
    const gradeVal = document.getElementById(`grade${i}`).value;

    if (!credit || !gradeVal) {
      alert(`Please fill all fields for Subject ${i}`);
      return;
    }

    if (gradeVal !== "S" && gradeVal !== "US") {
      totalCredits += credit;
      totalGradePoints += credit * parseFloat(gradeVal);
    }
  }

  const GPA = totalGradePoints / totalCredits;
  const CGPA = GPA; // simplified single-sem calculation

  gpaSpan.textContent = GPA.toFixed(2);
  cgpaSpan.textContent = CGPA.toFixed(2);
  resultDiv.classList.remove("hidden");
  progressChart.classList.remove("hidden");

  // Chart
  const ctx = progressChart.getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["GPA", "CGPA"],
      datasets: [
        {
          label: `${userName}'s Progress`,
          data: [GPA, CGPA],
          backgroundColor: ["#0044ff", "#00aaff"],
        },
      ],
    },
  });

  // Save Progress
  document.getElementById("saveProgress").addEventListener("click", async () => {
    try {
      await addDoc(collection(db, "leaderboard"), {
        name: userName,
        gpa: GPA.toFixed(2),
        cgpa: CGPA.toFixed(2),
        timestamp: new Date().toISOString(),
      });
      alert("✅ Progress saved successfully!");
    } catch (e) {
      console.error("Error saving progress:", e);
      alert("❌ Error saving progress. Try again.");
    }
  });
});

// ==== Leaderboard ====
leaderboardBtn.addEventListener("click", async () => {
  leaderboardDiv.classList.toggle("hidden");
  leaderboardDiv.innerHTML = "<h3>🏆 Top 10 Leaderboard</h3>";

  const q = query(collection(db, "leaderboard"), orderBy("cgpa", "desc"), limit(10));
  const snapshot = await getDocs(q);

  snapshot.forEach((doc) => {
    const data = doc.data();
    leaderboardDiv.innerHTML += `<p>👤 ${data.name} — GPA: ${data.gpa} | CGPA: ${data.cgpa}</p>`;
  });
});
