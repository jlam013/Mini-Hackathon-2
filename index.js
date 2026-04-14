const MRUcourses = ["comp1633", "comp1701", "comp2655", "comp2631", "comp2659",
                        "comp2633"];

function normalize(course) {
  return course.toLowerCase().replace(/\s+/g, "");
}

function searchCourse() {
    const input = document.getElementById("courseInput").value.trim();
    const error = document.getElementById("errorMessage");
    const normalized_input = normalize(input);
    
    if (normalized_input === "") {
        error.textContent = "please enter a course.";
        return;
    }

    if (MRUcourses.includes(normalized_input)) {
        //go to their course dashboard and dont display error
        error.textContent = "";
        const course = normalized_input.replace(/\s+/g, "");
        window.location.href = `course.html?course=${course}`;

    }
    else {
        //display error
        error.textContent = "This is not a course at MRU.";
    }
}