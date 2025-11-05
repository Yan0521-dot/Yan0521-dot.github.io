const generateFieldsBtn = document.getElementById("generateFields");
const subjectsContainer = document.getElementById("subjectsContainer");
const gpaForm = document.getElementById("gpaForm");
const calculateBtn = document.getElementById("calculateBtn");
const resultDiv = document.getElementById("result");
const chartSection = document.getElementById("chartSection");
let chart;

generateFieldsBtn.addEventListener("click", () => {
  const numSubjects = document.getElementById("numSubjects").value;
  if (numSubjects <= 0) return alert("Enter a valid number of subjects!");

  subjectsContainer.innerHTML = "";
  gpaForm.style.display = "block";

  for (let i = 1; i <= numSubjects; i++) {
    const div = document.createElement("div");
    div.classList.add("subject-row");

    div.innerHTML = `
      <input type="text" placeholder="Subject ${i} name" required>
      <select class="grade">
        <option value="4">A</option>
        <option value="3.7">A-</option>
        <option value="3.3">B+</option>
        <option value="3">B</option>
        <option value="2.7">B-</option>
        <option value="2.3">C+</option>
        <option value="2">C</option>
        <option value="1.7">C-</option>
        <option value="1.3">D+</option>
        <option value="1">D</option>
        <option value="0">F</option>
        <option value="0">US</option>
        <option value="4">S</option>
      </select>
      <input type="number" class="credit" placeholder="Credit Hours" min="1" required>
    `;
    subjectsContainer.appendChild(div);
  }
});

calculateBtn.addEventListener("click", () => {
  const grades = document.querySelectorAll(".grade");
  const credits = document.querySelectorAll(".credit");

  let totalPoints = 0, totalCredits = 0;

  grades.forEach((grade, i) => {
    const g = parseFloat(grade.value);
    const c = parseFloat(credits[i].value);
    totalPoints += g * c;
    totalCredits += c;
  });

  const gpa = totalPoints / totalCredits;

  const prevCredits = parseFloat(document.getElementById("prevCredits").value) || 0;
  const prevCgpa = parseFloat(document.getElementById("prevCgpa").value) || 0;

  const newCgpa = ((prevCgpa * prevCredits) + (gpa * totalCredits)) / (prevCredits + totalCredits);

  resultDiv.innerHTML = `
    <p><b>Semester GPA:</b> ${gpa.toFixed(2)}</p>
    <p><b>Overall CGPA:</b> ${newCgpa.toFixed(2)}</p>
  `;

  chartSection.classList.remove("hidden");
  updateChart(gpa.toFixed(2), newCgpa.toFixed(2));
});

function updateChart(gpa, cgpa) {
  const ctx = document.getElementById("progressChart");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["This Semester", "Overall"],
      datasets: [
        {
          label: "GPA",
          data: [0, 0],
          borderColor: "#58a6ff",
          tension: 0.4,
          fill: false,
          borderWidth: 3,
          pointRadius: 5
        },
        {
          label: "CGPA",
          data: [0, 0],
          borderColor: "#2ea043",
          tension: 0.4,
          fill: false,
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
        easing: "easeOutQuart",
        onProgress: function(animation) {
          const progress = animation.currentStep / animation.numSteps;
          chart.data.datasets[0].data = [0, gpa * progress];
          chart.data.datasets[1].data = [0, cgpa * progress];
          chart.update("none");
        }
      }
    }
  });
}

document.getElementById("saveChart").addEventListener("click", () => {
  alert("Chart saved! Data will remain visible for this session ✅");
});

document.getElementById("resetChart").addEventListener("click", () => {
  if (confirm("Reset chart and data?")) {
    chart.destroy();
    chartSection.classList.add("hidden");
    resultDiv.innerHTML = "";
  }
});
