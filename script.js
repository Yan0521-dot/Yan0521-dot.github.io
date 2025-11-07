import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBKGVgtx7YbjfGt7trWF3gcQ1r6NZtNKBw",
  authDomain: "cgpa-calculator-ur.firebaseapp.com",
  projectId: "cgpa-calculator-ur",
  storageBucket: "cgpa-calculator-ur.firebasestorage.app",
  messagingSenderId: "345716541673",
  appId: "1:345716541673:web:0633637368fb0156d98878",
  measurementId: "G-277D7RMJLH",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const nameSection = document.getElementById("name-section");
const cgpaSection = document.getElementById("cgpa-section");
const saveNameBtn = document.getElementById("save-name");
const usernameInput = document.getElementById("username");
const displayName = document.getElementById("displayName");
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

let chartInstance = null;
let userName = localStorage.getItem("username");

if (userName) {
  nameSection.classList.add("hidden");
  cgpaSection.classList.remove("hidden");
  displayName.textContent = userName;
}

saveNameBtn.addEventListener("click", () => {
  const name = usernameInput.value.trim();
  if (!name) {
    alert("Please enter your name!");
    return;
  }
  localStorage.setItem("username", name);
  userName = name;
  displayName.textContent = name;
  nameSection.classList.add("hidden");
  cgpaSection.classList.remove("hidden");
});

addSubjectsBtn.addEventListener("click", () => {
  const numSubjects = parseInt(numSubjectsInput.value);
  subjectsDiv.innerHTML = "";
  if (!numSubjects || numSubjects <= 0) {
    alert("Enter a valid number of subjects!");
    return;
  }

  for (let i = 1; i <= numSubjects; i++) {
    subjectsDiv.innerHTML += `
      <div class="subject card">
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
  const CGPA = GPA;

  gpaSpan.textContent = GPA.toFixed(2);
  cgpaSpan.textContent = CGPA.toFixed(2);
  resultDiv.classList.remove("hidden");

  // Smooth Doughnut Chart
  const ctx = progressChart.getContext("2d");
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["GPA", "CGPA"],
      datasets: [
        {
          label: "Performance",
          data: [GPA, CGPA],
          backgroundColor: ["#ff1e1e", "#ff6b6b"],
          hoverOffset: 15,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: "#fff" } },
      },
      animation: {
        animateRotate: true,
        animateScale: true,
      },
    },
  });

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

leaderboardBtn.addEventListener("click", async () => {
  leaderboardDiv.classList.toggle("hidden");
  leaderboardDiv.innerHTML = "<h3>🏆 Top 10 Leaderboard</h3>";

  try {
    const q = query(collection(db, "leaderboard"), orderBy("cgpa", "desc"), limit(10));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      leaderboardDiv.innerHTML += "<p>No records yet 😅</p>";
      return;
    }

    let rank = 1;
    snapshot.forEach((doc) => {
      const data = doc.data();
      let trophy = "🎖️";
      if (rank === 1) trophy = "🥇";
      else if (rank === 2) trophy = "🥈";
      else if (rank === 3) trophy = "🥉";

      leaderboardDiv.innerHTML += `<p>${trophy} ${rank}. ${data.name} — GPA: ${data.gpa} | CGPA: ${data.cgpa}</p>`;
      rank++;
    });
  } catch (err) {
    console.error(err);
    leaderboardDiv.innerHTML += "<p>⚠️ Error loading leaderboard.</p>";
  }
});
