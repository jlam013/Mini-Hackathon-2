const params = new URLSearchParams(window.location.search);
const course = params.get("course");

if (course) {
    document.getElementById("courseTitle").innerText =
        course + " — Course Resources";
}
