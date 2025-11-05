document.getElementById("generateFields").addEventListener("click", function () {
  const numSubjects = parseInt(document.getElementById("numSubjects").value);
  const container = document.getElementById("subjectsContainer");
  container.innerHTML = "";

  if (!numSubjects || numSubjects < 1) {
    alert("Please enter a valid number of subjects!");
    return;
  }

  const subjectNames = [];

  // Ask for subject names
  for (let i = 1; i <= numSubjects; i++) {
    let name = prompt(`Enter the name of subject ${i}:`);
    if (!name || name.trim() === "") name = `Subject ${i}`;
    subjectNames.push(name);
  }

  // Generate the fields using the subject names
  for (let i = 0; i < numSubjects; i++) {
    container.innerHTML += `
      <div class="subject">
        <h4>${subjectNames[i]}</h4>
        Credit hours: <input type="number" id="credit${i + 1}" step="0.01" min="0" />
        Grade:
        <select id="grade${i + 1}">
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
