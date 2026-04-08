const params = new URLSearchParams(window.location.search);
const course = params.get("course");

const title = document.getElementById("courseTitle");
const breadcrumb = document.getElementById("breadcrumb");
const cards = document.querySelectorAll(".course-card");

if (course) {
    const normalizedCourse = course.toUpperCase().replace(/\s+/g, "");

    if (title) {
        title.innerText = `${normalizedCourse} — Course Resources`;
    }

    if (breadcrumb) {
        breadcrumb.innerHTML =
            `<a href="index.html">Home</a> → ` +
            `<span>${normalizedCourse}</span>`;
    }

    cards.forEach(card => {
        const type = card.dataset.type;

        if (type) {
            const link = `resources.html?course=${normalizedCourse}&type=${type}`;
            card.href = link;
        }
    });
}