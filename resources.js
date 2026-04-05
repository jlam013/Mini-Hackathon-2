/* ===============================
   Read URL Parameters
================================ */
const params = new URLSearchParams(window.location.search);
const courseParam = params.get("course");
const type = params.get("type");

/* ===============================
   DOM Elements
================================ */
const title = document.getElementById("resourceTitle");
const list = document.querySelector(".resource-list");
const breadcrumb = document.getElementById("breadcrumb");
const createBtn = document.getElementById("createPostBtn");

/* ===============================
   Helpers
================================ */
const typeNames = {
    notes: "Notes",
    exams: "Previous Exams & Assignments",
    practice: "Practice Questions"
};

const normalizedCourse = courseParam
    ? courseParam.toUpperCase().replace(/\s+/g, "")
    : "";

const displayCourse = normalizedCourse.replace(/([A-Z]+)(\d+)/, "$1 $2");

/* ===============================
   Page Title
================================ */
if (courseParam && type) {
    title.innerText = `${normalizedCourse} — ${typeNames[type]}`;
}

/* ===============================
   Breadcrumb
================================ */
if (courseParam && type) {
    breadcrumb.innerHTML = `
        <a href="index.html">Home</a> →
        <a href="course.html?course=${normalizedCourse}">
            ${displayCourse}
        </a> →
        <span>${typeNames[type]}</span>
    `;
}

/* ===============================
   Create Post Button
================================ */
if (createBtn && courseParam && type) {
    createBtn.href = `create-post.html?course=${normalizedCourse}&type=${type}`;
}

/* ===============================
   Load Posts (localStorage)
================================ */
const posts = JSON.parse(localStorage.getItem("posts")) || [];

/* ===============================
   Filter Posts by Course + Type
================================ */
const filtered = posts.filter(p =>
    p.course.toUpperCase().replace(/\s+/g, "") === normalizedCourse &&
    p.type === type
);

/* ===============================
   Render Posts
================================ */
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

            <div class="post-actions">
                <button onclick="editPost(${p.id})">Edit</button>
                <button onclick="deletePost(${p.id})">Delete</button>
            </div>
        `;

        list.appendChild(item);
    });
}

/* ===============================
   Delete Post
================================ */
function deletePost(id) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts = posts.filter(p => p.id !== id);

    localStorage.setItem("posts", JSON.stringify(posts));
    location.reload();
}

/* ===============================
   Edit Post
================================ */
function editPost(id) {
    window.location.href = `create-post.html?edit=${id}`;
}
