const grades = {
  'A': 4.00, 'A-': 3.67, 'B+': 3.33, 'B': 3.00, 'B-': 2.67,
  'C+': 2.33, 'C': 2.00, 'C-': 1.67, 'D+': 1.33, 'D': 1.00,
  'F': 0.00, 'S': null, 'US': null
};

document.getElementById('generateBtn').addEventListener('click', () => {
  const count = parseInt(document.getElementById('subjectCount').value);
  const container = document.getElementById('subjectsContainer');
  container.innerHTML = '';

  for (let i = 1; i <= count; i++) {
    const div = document.createElement('div');
    div.innerHTML = `
      <label>Subject ${i} Name:</label>
      <input type="text" id="subjectName${i}" placeholder="Enter subject name" />
      <label>Credit Hours:</label>
      <input type="number" id="credit${i}" min="1" />
      <label>Grade:</label>
      <select id="grade${i}">
        ${Object.keys(grades).map(g => `<option value="${g}">${g}</option>`).join('')}
      </select>
      <hr>
    `;
    container.appendChild(div);
  }
});

let chart;

document.getElementById('calcBtn').addEventListener('click', () => {
  const count = parseInt(document.getElementById('subjectCount').value);
  let totalPoints = 0, totalCredits = 0;

  for (let i = 1; i <= count; i++) {
    const grade = document.getElementById(`grade${i}`).value;
    const credit = parseFloat(document.getElementById(`credit${i}`).value);
    const gp = grades[grade];
    if (gp !== null && !isNaN(credit)) {
      totalPoints += gp * credit;
      totalCredits += credit;
    }
  }

  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
  const prevCredits = parseFloat(document.getElementById('prevCredits').value) || 0;
  const prevCGPA = parseFloat(document.getElementById('prevCGPA').value) || 0;
  const cgpa = (prevCGPA * prevCredits + gpa * totalCredits) / (prevCredits + totalCredits || 1);

  document.getElementById('result').innerHTML = `
    <h3>Your GPA: ${gpa.toFixed(2)}</h3>
    <h3>Your CGPA: ${cgpa.toFixed(2)}</h3>
  `;

  document.getElementById('chartSection').classList.remove('hidden');
  updateChart(gpa, cgpa);
});

function updateChart(gpa, cgpa) {
  const ctx = document.getElementById('progressChart').getContext('2d');
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Previous Sem', 'Current Sem'],
      datasets: [
        {
          label: 'GPA',
          data: [null, gpa],
          borderColor: '#1f6feb',
          tension: 0.3,
          fill: false,
        },
        {
          label: 'CGPA',
          data: [null, cgpa],
          borderColor: '#ffcc00',
          tension: 0.3,
          fill: false,
        }
      ]
    },
    options: {
      animation: {
        duration: 2000,
        easing: 'easeInOutQuart'
      },
      scales: {
        y: { beginAtZero: true, max: 4 }
      }
    }
  });
}

document.getElementById('resetBtn').addEventListener('click', () => {
  localStorage.removeItem('cgpaData');
  if (chart) chart.destroy();
});

document.getElementById('saveBtn').addEventListener('click', () => {
  localStorage.setItem('cgpaData', chart.data.datasets[1].data.join(','));
  alert('Progress saved successfully!');
});
