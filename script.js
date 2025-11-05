let courses = [];

function addCourse() {
    const courseName = document.getElementById('courseName').value.trim();
    const credits = parseFloat(document.getElementById('credits').value);
    const gradeValue = document.getElementById('grade').value;

    if (!credits || credits <= 0) {
        alert('Please enter valid credit hours');
        return;
    }

    if (!gradeValue) {
        alert('Please select a grade');
        return;
    }

    const course = {
        id: Date.now(),
        name: courseName || `Course ${courses.length + 1}`,
        credits: credits,
        grade: gradeValue === 'S' || gradeValue === 'U' ? gradeValue : parseFloat(gradeValue),
        isUngraded: gradeValue === 'S' || gradeValue === 'U'
    };

    courses.push(course);
    updateDisplay();
    clearInputs();
}

function removeCourse(id) {
    courses = courses.filter(course => course.id !== id);
    updateDisplay();
}

function updateDisplay() {
    const coursesList = document.getElementById('coursesList');
    
    if (courses.length === 0) {
        coursesList.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">No courses added yet</p>';
    } else {
        coursesList.innerHTML = courses.map(course => {
            let gradeDisplay, pointsDisplay;
            if (course.isUngraded) {
                gradeDisplay = course.grade;
                pointsDisplay = 'N/A';
            } else {
                gradeDisplay = course.grade.toFixed(1);
                pointsDisplay = (course.credits * course.grade).toFixed(2);
            }
            
            return `
                <div class="course-item">
                    <div class="course-info">
                        <div class="course-name">${course.name}</div>
                        <div class="course-details">
                            Credits: ${course.credits} | Grade: ${gradeDisplay} | Points: ${pointsDisplay}
                        </div>
                    </div>
                    <button class="btn-remove" onclick="removeCourse(${course.id})">Remove</button>
                </div>
            `;
        }).join('');
    }

    calculateCurrentGPA();
}

function calculateCurrentGPA() {
    if (courses.length === 0) {
        document.getElementById('currentGPA').textContent = '0.00';
        document.getElementById('totalCredits').textContent = '0';
        return;
    }

    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    
    const gradedCourses = courses.filter(course => !course.isUngraded);
    const gradedCredits = gradedCourses.reduce((sum, course) => sum + course.credits, 0);
    const totalPoints = gradedCourses.reduce((sum, course) => sum + (course.credits * course.grade), 0);
    
    const gpa = gradedCredits > 0 ? totalPoints / gradedCredits : 0;

    document.getElementById('currentGPA').textContent = gpa.toFixed(2);
    document.getElementById('totalCredits').textContent = totalCredits.toFixed(1);
}

function calculateCGPA() {
    const prevGPA = parseFloat(document.getElementById('prevGPA').value);
    const prevCredits = parseFloat(document.getElementById('prevCredits').value);

    if (isNaN(prevGPA) || isNaN(prevCredits) || prevGPA < 0 || prevGPA > 4 || prevCredits < 0) {
        alert('Please enter valid previous CGPA (0-4) and credits');
        return;
    }

    const gradedCourses = courses.filter(course => !course.isUngraded);
    const currentGradedCredits = gradedCourses.reduce((sum, course) => sum + course.credits, 0);
    const currentPoints = gradedCourses.reduce((sum, course) => sum + (course.credits * course.grade), 0);
    
    const totalGradedCredits = prevCredits + currentGradedCredits;
    const totalPoints = (prevGPA * prevCredits) + currentPoints;
    const cgpa = totalGradedCredits > 0 ? totalPoints / totalGradedCredits : 0;
    
    const allCurrentCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const totalAllCredits = prevCredits + allCurrentCredits;

    document.getElementById('cgpaDisplay').textContent = cgpa.toFixed(2);
    document.getElementById('cgpaCredits').textContent = totalAllCredits.toFixed(1);
    document.getElementById('cgpaResult').style.display = 'block';
}

function clearInputs() {
    document.getElementById('courseName').value = '';
    document.getElementById('credits').value = '';
    document.getElementById('grade').value = '';
}

function clearAll() {
    if (courses.length === 0 && !document.getElementById('prevGPA').value && !document.getElementById('prevCredits').value) {
        return;
    }

    if (confirm('Are you sure you want to clear all data?')) {
        courses = [];
        updateDisplay();
        document.getElementById('prevGPA').value = '';
        document.getElementById('prevCredits').value = '';
        document.getElementById('cgpaResult').style.display = 'none';
    }
}

updateDisplay();
