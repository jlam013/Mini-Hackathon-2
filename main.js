const courseInput = document.getElementById("courseInput");
const errorMessage = document.getElementById("errorMessage");

function normalizeCourseInput(value) {
    return value.toUpperCase().replace(/\s+/g, " ").trim();
}

function searchCourse() {
    const cleanedInput = normalizeCourseInput(courseInput.value);

    if (!cleanedInput) {
        errorMessage.textContent = "Please enter a course code first.";
        return;
    }

    errorMessage.textContent = "";
    const course = cleanedInput.replace(/\s+/g, "");
    window.location.href = `course.html?course=${encodeURIComponent(course)}`;
}

courseInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        searchCourse();
    }
});
