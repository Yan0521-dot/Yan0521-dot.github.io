const generateFieldsBtn = document.getElementById("generateFields");
const subjectsContainer = document.getElementById("subjectsContainer");
const prevSection = document.getElementById("prevSection");
const calculateBtn = document.getElementById("calculateBtn");
const resultDiv = document.getElementById("result");
const chartSection = document.getElementById("chartSection");
let chart;

// Generate subject fields
generateFieldsBtn.addEventListener("click", () => {
  const numSubjects = parseInt(document.getElementById("numSubjects").value);
  if (!numSubjects || numSubjects <= 0) return alert("Enter a valid number of subjects!");

  subjectsContainer.innerHTML = "";
  prevSection.classList.remove("hidden");
  calculateBtn.classList.remove("hidden");

  for (let i = 1; i <= numSubjects; i++) {
    const div = document.createElement("div");
    div.classList.add("subject-row");

    div.innerHTML = `
      <input type="text" placeholder="Subject ${i} Name" required>
      <input type="number" class="credit" placeholder="Credit Hours" min="1" required>
      <select class="grade" required>
        <option value="" disabled selected>Select Grade</option>
        <option value="4.0">A+</option>
        <option value="4.0">A</option>
        <option value="3.7">A-</option>
        <option value="3.3">B+</option>
        <option value="3.0">B</option>
        <option value="2.7">B-</option>
        <option value="2.3">C+</option>
        <option value="2.0">C</option>
        <option value="1.7">C-</option>
        <option value="1.3">D+</option>
        <option value="1.0">D</option>
        <option value="0.0">F</option>
        <option value="S">S (Satisfactory)</option>
        <option value="US">US (Unsatisfactory)</option>
      </select>
    `;
    subjectsContainer.appendChild(div);
  }
});

// Calculate GPA & CGPA
calculateBtn.addEventListener("click", () => {
  const grades = document.querySelectorAll(".grade");
  const credits = document.querySelectorAll(".credit");

  let totalPoints = 0, totalCredits = 0;

  grades.forEach((grade, i) => {
    const gValue = grade.value;
    const c = parseFloat(credits[i].value);

    // Skip S/US grades
    if (gValue === "S" || gValue === "US") return;

    const g = parseFloat(gValue);
    totalPoints += g * c;
    totalCredits += c;
  });

  const gpa = totalPoints / totalCredits;
  const prevCredits = parseFloat(document.getElementById("prevCredits").value) || 0;
  const prevCgpa = parseFloat(document.getElementById("prevCgpa").value) || 0;

  const cgpa = ((prevCgpa * prevCredits) + (gpa * totalCredits)) / (prevCredits + totalCredits);

  resultDiv.innerHTML = `
    <h3>🎯 GPA: ${gpa.toFixed(2)}</h3>
    <h3>🏆 CGPA: ${cgpa.toFixed(2)}</h3>
    <p>${gpa >= 3.7 ? "🔥 Outstanding work!" :
        gpa >= 3.0 ? "💪 Keep it up!" :
        gpa >= 2.0 ? "📈 You’re improving!" :
        "🌱 Every semester is a chance to grow!"}</p>
  `;
  resultDiv.classList.remove("hidden");
  chartSection.classList.remove("hidden");

  drawChart(gpa, cgpa);
});

// Chart animation
function drawChart(gpa, cgpa) {
  const ctx = document.getElementById("progressChart");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["This Semester", "Overall"],
      datasets: [
        {
          label: "GPA",
          data: [0, gpa],
          borderColor: "#58a6ff",
          backgroundColor: "rgba(88,166,255,0.1)",
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 5
        },
        {
          label: "CGPA",
          data: [0, cgpa],
          borderColor: "#2ea043",
          backgroundColor: "rgba(46,160,67,0.1)",
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true, max: 4 } },
      animation: {
        duration: 1500,
        easing: "easeOutQuart"
      },
      plugins: { legend: { labels: { color: "#e6edf3" } } }
    }
  });
}

document.getElementById("saveChart").addEventListener("click", () => {
  alert("✅ Chart saved for this session!");
});

document.getElementById("resetChart").addEventListener("click", () => {
  if (confirm("Reset chart and data?")) {
    chart.destroy();
    chartSection.classList.add("hidden");
    resultDiv.innerHTML = "";
  }
});
