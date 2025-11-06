// ===== FIREBASE SETUP =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBKGVgtx7YbjfGt7trWF3gcQ1r6NZtNKBw",
  authDomain: "cgpa-calculator-ur.firebaseapp.com",
  projectId: "cgpa-calculator-ur",
  storageBucket: "cgpa-calculator-ur.firebasestorage.app",
  messagingSenderId: "345716541673",
  appId: "1:345716541673:web:0633637368fb0156d98878",
  measurementId: "G-277D7RMJLH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===== DOM ELEMENTS =====
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
const saveProgressBtn = document.getElementById("saveProgress");
const leaderboardBtn = document.getElementById("leaderboard-btn");
const leaderboardDiv = document.getElementById("leaderboard");

let userName = localStorage.getItem("username");

// ===== SAVE USERNAME =====
saveNameBtn.addEventListener("click", () => {
  const name = usernameInput.value.trim();
  if (name === "") {
    alert("Please enter your name first!");
    return;
  }
  localStorage.setItem("username", name);
  userName = name;
  nameSection.classList.add("hidden");
  cgpaSection.classList.remove("hidden");
});

// ===== ADD SUBJECT INPUT FIELDS =====
addSubjectsBtn.addEventListener("click", () => {
  const numSubjects = parseInt(document.getElementById("numSubjects").value);
  subjectsDiv.innerHTML = "";

  if (!numSubjects || numSubjects <= 0) {
    alert("Enter a valid number of subjects!");
    return;
  }

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
      </select>
    `;
    subjectsDiv.appendChild(div);
  }

  calculateBtn.classList.remove("hidden");
});

// ===== CALCULATE GPA + CGPA =====
calculateBtn.addEventListener("click", async () => {
  const numSubjects = parseInt(document.getElementById("numSubjects").value);
  let totalCredits = 0;
  let totalPoints = 0;

  for (let i = 1; i <= numSubjects; i++) {
    const credit = parseFloat(document.getElementById(`credit${i}`).value);
    const grade = parseFloat(document.getElementById(`grade${i}`).value);

    if (!credit || isNaN(grade)) {
      alert(`Please fill all fields for Subject ${i}`);
      return;
    }

    totalCredits += credit;
    totalPoints += credit * grade;
  }

  const gpa = totalPoints / totalCredits;
  const cgpa = gpa; // You can later modify to include previous CGPA

  gpaSpan.textContent = gpa.toFixed(2);
  cgpaSpan.textContent = cgpa.toFixed(2);
  resultDiv.classList.remove("hidden");

  // Save to Firestore
  document.getElementById("saveProgress").addEventListener("click", async () => {
    try {
      await addDoc(collection(db, "leaderboard"), {
        name: userName,
        gpa: gpa.toFixed(2),
        cgpa: cgpa.toFixed(2),
        timestamp: new Date().toISOString(),
      });
      alert("✅ Progress saved successfully!");
    } catch (err) {
      console.error("Error saving data:", err);
      alert("❌ Failed to save progress.");
    }
  });
});

// ===== LEADERBOARD =====
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

  leaderboardDiv.classList.toggle("hidden");
});
