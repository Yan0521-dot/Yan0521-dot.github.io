const generateBtn = document.getElementById("generate");
const calculateBtn = document.getElementById("calculate");
const subjectsContainer = document.getElementById("subjects-container");
const resultDiv = document.getElementById("result");
const cgpaSection = document.getElementById("cgpa-section");

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
      <input type="text" placeholder="Subject name" id="name${i}" />
      <input type="number" placeholder="Credit Hours" id="credit${i}" min="1" />
      <select id="grade${i}">
        <option value="">-- Select Grade --</option>
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
        <option value="S">S (Satisfactory)</option>
        <option value="US">US (Unsatisfactory)</option>
      </select>
    `;
    subjectsContainer.appendChild(div);
  }

  cgpaSection.classList.remove("hidden");
  calculateBtn.classList.remove("hidden");
});

calculateBtn.addEventListener("click", () => {
  let totalCredits = 0;
  let totalGradePoints = 0;
  const numSubjects = parseInt(document.getElementById("subjects").value);

  for (let i = 1; i <= numSubjects; i++) {
    const name = document.getElementById(`name${i}`).value.trim();
    const credit = parseFloat(document.getElementById(`credit${i}`).value);
    const grade = document.getElementById(`grade${i}`).value;

    if (!credit || !grade) {
      alert(`Please fill all fields for Subject ${i}`);
      return;
    }

    // Skip S and US (ungraded)
    if (grade === "S" || grade === "US") {
      continue;
    }

    const gradePoint = parseFloat(grade);
    totalCredits += credit;
    totalGradePoints += credit * gradePoint;
  }

  const GPA = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  const prevCredits = parseFloat(document.getElementById("prev-credits").value) || 0;
  const prevCGPA = parseFloat(document.getElementById("prev-cgpa").value) || 0;

  const CGPA = (prevCGPA * prevCredits + GPA * totalCredits) / (prevCredits + totalCredits || 1);

  let message = "";
  if (GPA >= 3.7) message = "🔥 Outstanding! You’re on fire!";
  else if (GPA >= 3.0) message = "💪 Great job! Keep pushing forward!";
  else if (GPA >= 2.0) message = "📈 You’re doing fine. Keep improving!";
  else message = "🌱 Don’t give up. Every semester is a new chance to rise!";

  resultDiv.innerHTML = `
    <h2>🎯 GPA: ${GPA.toFixed(2)}</h2>
    <h2>🏆 CGPA: ${CGPA.toFixed(2)}</h2>
    <p>${message}</p>
  `;
  resultDiv.classList.remove("hidden");
});


