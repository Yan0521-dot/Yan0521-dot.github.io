// ===== FIREBASE CONNECTION =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Your Firebase config (from your Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBKGVgtx7YbjfGt7trWF3gcQ1r6NZtNKBw",
  authDomain: "cgpa-calculator-ur.firebaseapp.com",
  projectId: "cgpa-calculator-ur",
  storageBucket: "cgpa-calculator-ur.firebasestorage.app",
  messagingSenderId: "345716541673",
  appId: "1:345716541673:web:0633637368fb0156d98878",
  measurementId: "G-277D7RMJLH"
};

// Initialize Firebase + Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===== DOM ELEMENTS =====
const generateBtn = document.getElementById("generate");
const calculateBtn = document.getElementById("calculate");
const subjectsContainer = document.getElementById("subjects-container");
const resultDiv = document.getElementById("result");
const cgpaSection = document.getElementById("cgpa-section");
const chartSection = document.getElementById("chart-section");
const leaderboardBtn = document.getElementById("leaderboard-btn");
const leaderboardDiv = document.getElementById("leaderboard");
let userName = localStorage.getItem("username");

// ===== ASK FOR USERNAME ONCE =====
if (!userName) {
  userName = prompt("Enter your name (this will appear on leaderboard):");
  if (userName) {
    localStorage.setItem("username", userName);
  } else {
    userName = "Anonymous";
  }
}

// ===== GENERATE SUBJECT INPUTS =====
generateBtn.addEventListener("click", () => {
  const numSubjects = parseInt(document.getElementById("subjects").value);
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
        <option value="S">S (Ungraded)</option>
        <option value="US">US (Ungraded)</option>
      </select>
    `;
    subjectsContainer.appendChild(div);
  }

  cgpaSection.classList.remove("hidden");
  calculateBtn.classList.remove("hidden");
});

// ===== CALCULATE GPA + CGPA =====
calculateBtn.addEventListener("click", async () => {
  let totalCredits = 0;
  let totalGradePoints = 0;
  const numSubjects = parseInt(document.getElementById("subjects").value);

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
  const prevCredits = parseFloat(document.getElementById("prev-credits").value) || 0;
  const prevCGPA = parseFloat(document.getElementById("prev-cgpa").value) || 0;
  const CGPA = (prevCGPA * prevCredits + GPA * totalCredits) / (prevCredits + totalCredits || 1);

  resultDiv.innerHTML = `
    <h2>🎯 GPA: ${GPA.toFixed(2)}</h2>
    <h2>🏆 CGPA: ${CGPA.toFixed(2)}</h2>
    <button id="saveProgress">💾 Save Progress</button>
  `;
  resultDiv.classList.remove("hidden");

  // ===== SAVE PROGRESS =====
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

// ===== LEADERBOARD DISPLAY =====
leaderboardBtn.addEventListener("click", async () => {
  leaderboardDiv.innerHTML = "<h3>🏆 Top 10 Leaderboard</h3>";
  const q = query(collection(db, "leaderboard"), orderBy("cgpa", "desc"), limit(10));
  const snapshot = await getDocs(q);

  snapshot.forEach((doc) => {
    const data = doc.data();
    leaderboardDiv.innerHTML += `
      <p>👤 ${data.name} — GPA: ${data.gpa} | CGPA: ${data.cgpa}</p>
    `;
  });
});
