import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBKGVgtx7YbjfGt7trWF3gcQ1r6NZtNKBw",
  authDomain: "cgpa-calculator-ur.firebaseapp.com",
  projectId: "cgpa-calculator-ur",
  storageBucket: "cgpa-calculator-ur.firebasestorage.app",
  messagingSenderId: "345716541673",
  appId: "1:345716541673:web:0633637368fb0156d98878",
  measurementId: "G-277D7RMJLH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const nameSection = document.getElementById("name-section");
const cgpaSection = document.getElementById("cgpa-section");
const saveNameBtn = document.getElementById("save-name");
const usernameInput = document.getElementById("username");
const addSubjectsBtn = document.getElementById("addSubjects");
const subjectsDiv = document.getElementById("subjects");
const calculateBtn = document.getElementById("calculateBtn");
const resultDiv = document.getElementById("result");
const gpaSpan = document.getElementById("gpa");
const cgpaSpan = document.getElementById("cgpa");
const leaderboardSection = document.getElementById("leaderboard-section");
const leaderboardList = document.getElementById("leaderboard");
const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");
const saveProgressBtn = document.getElementById("saveProgress");
const chartCanvas = document.getElementById("progressChart");

let userName = localStorage.getItem("username");
let cgpaHistory = [];

// ===== AUTO LOGIN =====
if (userName) {
  nameSection.classList.add("hidden");
  cgpaSection.classList.remove("hidden");
}

// ===== SAVE NAME =====
saveNameBtn.addEventListener("click", () => {
  const name = usernameInput.value.trim();
  if (!name) return alert("Enter your name first!");
  localStorage.setItem("username", name);
  userName = name;
  nameSection.classList.add("hidden");
  cgpaSection.classList.remove("hidden");
});

// ===== ADD SUBJECTS =====
addSubjectsBtn.addEventListener("click", () => {
  const numSubjects = parseInt(document.getElementById("numSubjects").value);
  subjectsDiv.innerHTML = "";
  if (!numSubjects || numSubjects <= 0) return alert("Enter valid number!");
  
  for (let i = 1; i <= numSubjects; i++) {
    const div = document.createElement("div");
    div.innerHTML = `
      <h4>Subject ${i}</h4>
      <input type="text" placeholder="Subject Name" id="subject${i}">
      <input type="number" placeholder="Credit Hours" id="credit${i}" min="1">
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
        <option value="S">S (Ungraded)</option>
        <option value="US">US (Ungraded)</option>
      </select>
    `;
    subjectsDiv.appendChild(div);
  }
  calculateBtn.classList.remove("hidden");
});

// ===== CALCULATE + SAVE =====
calculateBtn.addEventListener("click", async () => {
  const numSubjects = parseInt(document.getElementById("numSubjects").value);
  let totalCredits = 0, totalPoints = 0;

  for (let i = 1; i <= numSubjects; i++) {
    const credit = parseFloat(document.getElementById(`credit${i}`).value);
    const gradeVal = document.getElementById(`grade${i}`).value;

    if (gradeVal === "S" || gradeVal === "US") continue;
    if (!credit || !gradeVal) return alert(`Fill all fields for subject ${i}`);

    totalCredits += credit;
    totalPoints += credit * parseFloat(gradeVal);
  }

  const GPA = totalPoints / totalCredits;
  const CGPA = GPA;

  gpaSpan.textContent = GPA.toFixed(2);
  cgpaSpan.textContent = CGPA.toFixed(2);
  resultDiv.classList.remove("hidden");
  chartCanvas.classList.remove("hidden");

  // Update chart
  cgpaHistory.push(CGPA);
  const ctx = chartCanvas.getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: cgpaHistory.map((_, i) => `Sem ${i + 1}`),
      datasets: [{ label: "CGPA Progress", data: cgpaHistory, borderColor: "#ff3333", tension: 0.3 }]
    },
  });

  // ===== SAVE ONLY IF IN TOP 10 =====
  document.getElementById("saveProgress").addEventListener("click", async () => {
    const q = query(collection(db, "leaderboard"), orderBy("cgpa", "desc"), limit(10));
    const snapshot = await getDocs(q);
    const top10 = snapshot.docs.map(doc => doc.data().cgpa);
    const lowestTop = top10.length === 10 ? Math.min(...top10.map(c => parseFloat(c))) : 0;

    if (CGPA > lowestTop || top10.length < 10) {
      await addDoc(collection(db, "leaderboard"), {
        name: userName,
        gpa: GPA.toFixed(2),
        cgpa: CGPA.toFixed(2),
        timestamp: new Date().toISOString(),
      });
      alert("🔥 Congrats! You made it into the Top 10!");
    } else {
      alert("Keep going! You’re close to the Top 10! 💪");
    }
  });
});

// ===== MENU TOGGLE =====
menuBtn.addEventListener("click", () => menu.classList.toggle("hidden"));

// ===== LEADERBOARD =====
document.getElementById("leaderboard-btn").addEventListener("click", async () => {
  leaderboardList.innerHTML = "";
  const q = query(collection(db, "leaderboard"), orderBy("cgpa", "desc"), limit(10));
  const snapshot = await getDocs(q);

  snapshot.forEach((doc, i) => {
    const d = doc.data();
    leaderboardList.innerHTML += `<li>#${i + 1} ${d.name} — CGPA: ${d.cgpa}</li>`;
  });

  leaderboardSection.classList.toggle("hidden");
});
