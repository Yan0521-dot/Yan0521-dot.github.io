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

// 🔹 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBKGVgtx7YbjfGt7trWF3gcQ1r6NZtNKBw",
  authDomain: "cgpa-calculator-ur.firebaseapp.com",
  projectId: "cgpa-calculator-ur",
  storageBucket: "cgpa-calculator-ur.firebasestorage.app",
  messagingSenderId: "345716541673",
  appId: "1:345716541673:web:0633637368fb0156d98878",
  measurementId: "G-277D7RMJLH",
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// === UI Elements ===
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

// === Show name section only once ===
if (userName) {
  nameSection.classList.add("hidden");
  cgpaSection.classList.remove("hidden");
} else {
  cgpaSection.classList.add("hidden");
}

// === Save Name ===
saveNameBtn.addEventListener("click", () => {
  const name = usernameInput.value.trim();
  if (!name) {
    alert("Please enter your name!");
    return;
  }
  localStorage.setItem("username", name);
  userName = name;
  nameSection.classList.add("hidden");
  cgpaSection.classList.remove("hidden");
});

// === Add Subjects (with Subject Name Prompt) ===
addSubjectsBtn.addEventListener("click", () => {
  const numSubjects = parseInt(numSubjectsInput.value);
  subjectsDiv.innerHTML = "";
  if (!numSubjects || numSubjects <= 0) {
    alert("Enter a valid number of subjects!");
    return;
  }

  for (let i = 1; i <= numSubjects; i++) {
    let subjectName = prompt(`Enter the name of subject ${i}:`);
    if (!subjectName || subjectName.trim() === "") subjectName = `Subject ${i}`;

    subjectsDiv.innerHTML += `
      <div class="subject">
        <h3>${subjectName}</h3>
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

// === Calculate GPA / CGPA ===
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

  // Save Progress to Firebase
  const saveProgressBtn = document.getElementById("saveProgress");
  if (saveProgressBtn) {
    saveProgressBtn.onclick = async () => {
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
    };
  }
});

// === Leaderboard ===
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
      let medal = "";
      let color = "";

      if (rank === 1) {
        medal = "🥇";
        color = "#ffd700";
      } else if (rank === 2) {
        medal = "🥈";
        color = "#c0c0c0";
      } else if (rank === 3) {
        medal = "🥉";
        color = "#cd7f32";
      } else {
        medal = "🏅";
        color = "#00aaff";
      }

      leaderboardDiv.innerHTML += `
        <p style="color:${color}; font-weight:600;">
          ${medal} ${rank}. ${data.name} — GPA: ${data.gpa} | CGPA: ${data.cgpa}
        </p>
      `;
      rank++;
    });
  } catch (err) {
    console.error(err);
    leaderboardDiv.innerHTML += "<p>⚠️ Error loading leaderboard.</p>";
  }
});
