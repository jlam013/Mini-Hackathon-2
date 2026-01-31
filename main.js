function searchCourse() {
    const input = document.getElementById("courseInput").value.trim();

    if (input !== "") {
        const course = input.replace(/\s+/g, "");
        window.location.href = `course.html?course=${course}`;
    }
}
