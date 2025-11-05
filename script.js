const generateBtn = document.getElementById("generate");
const calculateBtn = document.getElementById("calculate");
const subjectsContainer = document.getElementById("subjects-container");
const resultDiv = document.getElementById("result");
const cgpaSection = document.getElementById("cgpa-section");

const gradeMap = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "F": 0.0,
  "S": 4.0, "US": 0.0
};

generateBtn.addEventListener("click", () => {
  const numSubjects = parseInt(document.getElementById("subjects").value);
  subjectsContainer.innerHTML = "";

  if (!numSubjects || numSubjects <= 0) {
    alert("Please enter a valid number of subjects!");
    return;
  }

  for (let i = 1; i <= numSubjects; i++) {
    const div = document.createElement("div");
    div.classList.add("subject-card");
    div.innerHTML = `
      <h3>📘 Subject ${i}</h3>
      <input type="text" placeholder="Subject Name" id="name${i}" />
      <input type="number" placeholder="Credit Hours" id="credit${i}" min="1" />
      <select id="grade${i}">
        <option value="">Select Grade</option>
        ${Object.keys(gradeMap).map(g => `<option value="${g}">${g}</option>`).join('')}
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
    const credit = parseFloat(document.getElementById(`credit${i}`).value);
    const grade = document.getElementById(`grade${i}`).value;

    if (!credit || !grade) {
      alert(`Please fill all fields for Subject ${i}`);
      return;
    }

    totalCredits += credit;
    totalGradePoints += credit * gradeMap[grade];
  }

  const GPA = totalGradePoints / totalCredits;
  const prevCredits = parseFloat(document.getElementById("prev-credits").value) || 0;
  const prevCGPA = parseFloat(document.getElementById("prev-cgpa").value) || 0;

  const CGPA = (prevCGPA * prevCredits + GPA * totalCredits) / (prevCredits + totalCredits || 1);

  let message = "";
  if (GPA >= 3.7) message = "🔥 Outstanding! You’re on fire!";
  else if (GPA >= 3.0) message = "💪 Great job! Keep pushing forward!";
  else if (GPA >= 2.0) message = "📈 You’re doing fine. A bit more effort and you’ll shine!";
  else message = "🌱 Don’t give up. Every semester is a new chance to rise!";

  resultDiv.innerHTML = `
    <h2>🎯 GPA: ${GPA.toFixed(2)}</h2>
    <h2>🏆 CGPA: ${CGPA.toFixed(2)}</h2>
    <p>${message}</p>
  `;
  resultDiv.classList.remove("hidden");
});

