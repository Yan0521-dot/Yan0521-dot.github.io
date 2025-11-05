document.getElementById("generateFields").addEventListener("click", function () {
  const numSubjects = parseInt(document.getElementById("numSubjects").value);
  const container = document.getElementById("subjectsContainer");
  container.innerHTML = "";

  for (let i = 1; i <= numSubjects; i++) {
    container.innerHTML += `
      <div class="subject">
        <h4>Subject ${i}</h4>
        Credit hours: <input type="number" id="credit${i}" step="0.01" min="0" />
        Grade:
        <select id="grade${i}">
          <option value="A+">A+</option>
          <option value="A">A</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B">B</option>
          <option value="B-">B-</option>
          <option value="C+">C+</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="F">F</option>
          <option value="S">S (Satisfactory)</option>
          <option value="US">US (Unsatisfactory)</option>
        </select>
      </div>
    `;
  }
});

const gradePoints = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "D": 1.0, "F": 0.0
};

let gpaData = [];
let cgpaData = [];
let semesterLabels = [];
let chart;

document.getElementById("calculate").addEventListener("click", function () {
  const numSubjects = parseInt(document.getElementById("numSubjects").value);
  let totalPoints = 0, totalCredits = 0;

  for (let i = 1; i <= numSubjects; i++) {
    const credit = parseFloat(document.getElementById(`credit${i}`).value);
    const grade = document.getElementById(`grade${i}`).value;
    if (grade === "S" || grade === "US") continue;

    totalCredits += credit;
    totalPoints += credit * (gradePoints[grade] || 0);
  }

  const gpa = totalPoints / totalCredits;
  const prevCredits = parseFloat(document.getElementById("prevCredits").value) || 0;
  const prevCGPA = parseFloat(document.getElementById("prevCGPA").value) || 0;
  const newCGPA = ((prevCGPA * prevCredits) + (gpa * totalCredits)) / (prevCredits + totalCredits);

  document.getElementById("results").innerHTML = `
    <p>🎯 GPA: <b>${gpa.toFixed(2)}</b></p>
    <p>🏆 CGPA: <b>${newCGPA.toFixed(2)}</b></p>
  `;

  // Auto-track progress
  const sem = semesterLabels.length + 1;
  semesterLabels.push(`Sem ${sem}`);
  gpaData.push(parseFloat(gpa.toFixed(2)));
  cgpaData.push(parseFloat(newCGPA.toFixed(2)));

  updateChart();
  motivateUser(newCGPA);
});

function updateChart() {
  const ctx = document.getElementById("progressChart").getContext("2d");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: semesterLabels,
      datasets: [
        {
          label: "GPA",
          data: gpaData,
          borderColor: "#00bcd4",
          fill: false,
          tension: 0.3
        },
        {
          label: "CGPA",
          data: cgpaData,
          borderColor: "#8e44ad",
          fill: false,
          tension: 0.3
        }
      ]
    },
    options: {
      animation: {
        duration: 1500,
        easing: 'easeInOutQuart'
      },
      scales: {
        y: { beginAtZero: true, max: 4 }
      },
      plugins: {
        legend: { labels: { color: "#fff" } }
      }
    }
  });
}

document.getElementById("saveProgress").addEventListener("click", () => {
  localStorage.setItem("gpaData", JSON.stringify(gpaData));
  localStorage.setItem("cgpaData", JSON.stringify(cgpaData));
  localStorage.setItem("semesterLabels", JSON.stringify(semesterLabels));
  alert("Progress saved ✅");
});

document.getElementById("resetProgress").addEventListener("click", () => {
  if (confirm("Reset all progress?")) {
    gpaData = [];
    cgpaData = [];
    semesterLabels = [];
    localStorage.clear();
    updateChart();
    document.getElementById("motivation").innerText = "";
  }
});

window.onload = () => {
  if (localStorage.getItem("gpaData")) {
    gpaData = JSON.parse(localStorage.getItem("gpaData"));
    cgpaData = JSON.parse(localStorage.getItem("cgpaData"));
    semesterLabels = JSON.parse(localStorage.getItem("semesterLabels"));
    updateChart();
  }
};

function motivateUser(cgpa) {
  const msg = document.getElementById("motivation");
  if (cgpa >= 3.8) msg.innerText = "🔥 You’re a Dean’s List material! Keep that fire burning!";
  else if (cgpa >= 3.5) msg.innerText = "💪 You’re doing great! Stay consistent.";
  else if (cgpa >= 3.0) msg.innerText = "⚡ Good progress! Aim for the next level.";
  else msg.innerText = "🌱 Keep going — progress takes time!";
}
