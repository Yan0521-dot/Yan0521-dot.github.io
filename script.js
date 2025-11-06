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

const generateBtn = document.getElementById("addSubjects");
const calculateBtn = document.getElementById("calculateBtn");
const subjectsContainer = document.getElementById("subjects");
const resultDiv = document.getElementById("result");
const leaderboardBtn = document.getElementById("leaderboard-btn");
const leaderboardDiv = document.getElementById("leaderboard");
let userName = localStorage.getItem("username");

if (!userName) {
  document.getElementById("name-section").classList.remove("hidden");
} else {
  document.getElementById("cgpa-section").classList.remove("hidden");
}

document.getElementById("save-name").addEventListener("click", () => {
  const inputName = document.getElementById("username").value.trim();
  if (inputName) {
    localStorage.setItem("username", inputName);
    userName = inputName;
    document.getElementById("name-section").classList.add("hidden");
    document.getElementById("cgpa-section").classList.remove("hidden");
  } else {
    alert("Please enter your name!");
  }
});

generateBtn.addEventListener("click", () => {
  const numSubjects = parseInt(document.getElementById("numSubjects").value);
  subjectsContainer.innerHTML = "";

  if (!numSubjects || numSubjects <= 0) {
    alert("Please enter a valid number of subjects!");
    return;
  }

  for (let i = 1; i <= numSubjects; i++) {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>Subject ${i}</h3>
      <input type="text" placeholder="Subject Name" id="subject${i}" />
      <input type="number" placeholder="Credit Hours" id="credit${i}" min="1" />
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
        <option value="S">S (Satisfactory - Ungraded)</option>
        <option value="US">US (Unsatisfactory - Ungraded)</option>
      </select>
    `;
    subjectsContainer.appendChild(div);
  }

  calculateBtn.classList.remove("hidden");
});

calculateBtn.addEventListener("click", async () => {
  let totalCredits = 0;
  let totalGradePoints = 0;
  const numSubjects = parseInt(document.getElementById("numSubjects").value);

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

  resultDiv.innerHTML = `
    <h2>🎯 GPA: ${GPA.toFixed(2)}</h2>
    <h2>🏆 CGPA: ${CGPA.toFixed(2)}</h2>
    <button id="saveProgress">💾 Save Progress</button>
  `;
  resultDiv.classList.remove("hidden");

  document.getElementById("saveProgress").addEventListener("click", async () => {
    try {
      await addDoc(collection(db, "leaderboard"), {
        name: userName,
        gpa: GPA.toFixed(2),
        cgpa: CGPA.toFixed(2),
        timestamp: new Date().toISOString()
      });
      alert("✅ Progress saved successfully!");
    } catch (e) {
      console.error("Error saving progress:", e);
      alert("❌ Error saving progress. Try again.");
    }
  });
});

leaderboardBtn.addEventListener("click", async () => {
  leaderboardDiv.innerHTML = "<h3>🏆 Top 10 Leaderboard</h3>";
  const q = query(collection(db, "leaderboard"), orderBy("cgpa", "desc"), limit(10));
  const snapshot = await getDocs(q);

  snapshot.forEach((doc) => {
    const data = doc.data();
    leaderboardDiv.innerHTML += `<p>👤 ${data.name} — GPA: ${data.gpa} | CGPA: ${data.cgpa}</p>`;
  });
});
