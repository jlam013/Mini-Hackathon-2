const params = new URLSearchParams(window.location.search);
const course = params.get("course");
const type = params.get("type");

const title = document.getElementById("resourceTitle");
const list = document.querySelector(".resource-list");

const typeNames = {
    notes: "Notes",
    exams: "Previous Exams & Assignments",
    practice: "Practice Questions"
};

if (course && type) {
    title.innerText = `${course} — ${typeNames[type]}`;
}

/* Load posts from localStorage */
const posts = JSON.parse(localStorage.getItem("posts")) || [];

/* Filter by course + type */
const normalizedCourse = course.toUpperCase().replace(/\s+/g, "");

const filtered = posts.filter(p =>
    p.course.toUpperCase().replace(/\s+/g, "") === normalizedCourse &&
    p.type === type
);


/* Render */
list.innerHTML = "";

if (filtered.length === 0) {
    list.innerHTML = "<p>No resources yet. Be the first to post!</p>";
} else {
    filtered.forEach(p => {
        const item = document.createElement("div");
        item.className = "resource-item";

        item.innerHTML = `
            <h3>${p.title}</h3>
            <p>${p.desc}</p>
            <span>📄 ${p.file}</span>
        `;

        list.appendChild(item);
    });
}
