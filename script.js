import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const db = window.db;

const nameSection = document.getElementById("name-section");
const cgpaSection = document.getElementById("cgpa-section");
const usernameInput = document.getElementById("username");
const saveNameBtn = document.getElementById("save-name");
const addSubjectsBtn = document.getElementById("addSubjects");
const calculateBtn = document.getElementById("calculateBtn");
const subjectsDiv = document.getElementById("subjects");
const resultDiv = document.getElementById("result");
const gpaSpan = document.getElementById("gpa");
const cgpaSpan = document.getElementById("cgpa");
const saveProgressBtn = document.getElementById("saveProgress");
const leaderboardSection = document.getElementById("leaderboard-section");
const leaderboardList = document.getElementById("leaderboard");
const leaderboardBtn = document.getElementById("leaderboard-btn");
const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");
const chartCanvas = document.getElementById("progressChart");

let chart = null;
let userName = localStorage.getItem("username");

if (userName) {
  nameSection.classList.add("hidden");
  cgpaSection.classList.remove("hidden");
}

saveNameBtn.addEventListener("click", () => {
  const name = usernameInput.value.trim();
  if (!name) return alert("Please enter your name.");
  localStorage.setItem("username", name);
  userName = name;
  nameSection.classList.add("hidden");
  cgpaSection.classList.remove("hidden");
});

menuBtn.addEventListener("click", () => menu.classList.toggle("hidden"));

addSubjectsBtn.addEventListener("click", () => {
  const numSubjects = parseInt(document.getElementById("numSubjects").value);
  subjectsDiv.innerHTML = "";
  if (!numSubjects || numSubjects < 1) return alert("Enter valid subject count");

  for (let i = 1; i <= numSubjects; i++) {
    const div = document.createElement("div");
    div.innerHTML = `
      <h4>Subject ${i}</h4>
      <input type="text" id="subject${i}" placeholder="Name" />
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
        <option value="S">S (Ungraded)</option>
        <option value="US">US (Ungraded)</option>
      </select>
    `;
    subjectsDiv.appendChild(div);
  }

  calculateBtn.classList.remove("hidden");
});

calculateBtn.addEventListener("click", () => {
  const numSubjects = parseInt(document.getElementById("numSubjects").value);
  let totalCredits = 0;
  let totalPoints = 0;

  for (let i = 1; i <= numSubjects; i++) {
    const credit = parseFloat(document.getElementById(`credit${i}`).value);
    const grade = document.getElementById(`grade${i}`).value;

    if (grade !== "S" && grade !== "US") {
      totalCredits += credit;
      totalPoints += credit * parseFloat(grade);
    }
  }

  const GPA = totalPoints / totalCredits;
  const CGPA = GPA; // simplified unless you add previous term data

  gpaSpan.textContent = GPA.toFixed(2);
  cgpaSpan.textContent = CGPA.toFixed(2);
  resultDiv.classList.remove("hidden");

  if (chart) chart.destroy();
  const ctx = chartCanvas.getContext("2d");
  chartCanvas.classList.remove("hidden");

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["GPA", "CGPA"],
      datasets: [{
        label: "Progress",
        data: [GPA, CGPA],
        borderColor: "#c70039",
        borderWidth: 3,
        tension: 0.4
      }]
    },
    options: {
      animations: { tension: { duration: 2000, easing: "easeInOutBounce", from: 0.1, to: 0.4, loop: false } },
      scales: { y: { beginAtZero: true, max: 4 } }
    }
  });

  saveProgressBtn.onclick = async () => {
    const q = query(collection(db, "leaderboard"), orderBy("cgpa", "desc"), limit(10));
    const snapshot = await getDocs(q);
    let leaderboard = snapshot.docs.map(d => d.data());
    const minCgpa = leaderboard.length < 10 ? 0 : Math.min(...leaderboard.map(x => parseFloat(x.cgpa)));

    if (CGPA > minCgpa) {
      await addDoc(collection(db, "leaderboard"), {
        name: userName,
        gpa: GPA.toFixed(2),
        cgpa: CGPA.toFixed(2),
        timestamp: new Date().toISOString()
      });
      alert("Progress saved! You made it to the leaderboard 🏆");
    } else {
      alert("Your CGPA isn’t in the top 10 yet. Keep improving 💪");
    }
  };
});

leaderboardBtn.addEventListener("click", async () => {
  leaderboardSection.classList.toggle("hidden");
  leaderboardList.innerHTML = "";
  const q = query(collection(db, "leaderboard"), orderBy("cgpa", "desc"), limit(10));
  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `${data.name} — GPA: ${data.gpa} | CGPA: ${data.cgpa}`;
    leaderboardList.appendChild(li);
  });
});
