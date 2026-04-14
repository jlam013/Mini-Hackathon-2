const params = new URLSearchParams(window.location.search);
const course = params.get("course");

const title = document.getElementById("courseTitle");
const breadcrumb = document.getElementById("breadcrumb");
const cards = document.querySelectorAll(".course-card");

if (course) {
    const normalizedCourse = course.toUpperCase().replace(/\s+/g, "");

    title.innerText = `${normalizedCourse} — Course Resources`;

    breadcrumb.innerHTML = `
        <a href="index.html">Home</a> →
        <span>${normalizedCourse}</span>
    `;

    cards.forEach(card => {
        const type = card.dataset.type;
        card.href = `resources.html?course=${normalizedCourse}&type=${type}`;
    });
}
