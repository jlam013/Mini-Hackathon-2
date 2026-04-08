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
const keywordSearch = document.getElementById("keywordSearch");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const resultSummary = document.getElementById("resultSummary");

/* ===============================
   Helpers
================================ */
const typeNames = {
    notes: "Notes",
    exams: "Previous Exams & Assignments",
    practice: "Practice Questions"
};

function normalizeCourse(value = "") {
    return value.toUpperCase().replace(/\s+/g, "").trim();
}

function normalizeSearchText(value = "") {
    return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function formatDate(dateValue) {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Unknown time";
    }

    return date.toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });
}

function buildSearchTarget(post) {
    return normalizeSearchText(`${post.title || ""} ${post.desc || ""}`);
}

/* ===============================
   Page Setup
================================ */
const normalizedCourse = normalizeCourse(courseParam || "");

if (courseParam && type) {
    title.innerText = `${normalizedCourse} — ${typeNames[type]}`;
    breadcrumb.innerHTML = `
        <a href="index.html">Home</a> →
        <a href="course.html?course=${normalizedCourse}">${normalizedCourse}</a> →
        <span>${typeNames[type]}</span>
    `;
    createBtn.href = `create-post.html?course=${normalizedCourse}&type=${type}`;
}

/* ===============================
   Load + Filter Posts
================================ */
function getPosts() {
    return JSON.parse(localStorage.getItem("posts")) || [];
}

function getBasePosts() {
    return getPosts()
        .filter(post => normalizeCourse(post.course) === normalizedCourse && post.type === type)
        .sort((a, b) => new Date(b.createdAt || b.id).getTime() - new Date(a.createdAt || a.id).getTime());
}

function getVisiblePosts() {
    const keyword = normalizeSearchText(keywordSearch.value);
    const basePosts = getBasePosts();

    if (!keyword) {
        return basePosts;
    }

    return basePosts.filter(post => buildSearchTarget(post).includes(keyword));
}

/* ===============================
   Render Posts
================================ */
function renderPosts() {
    const allPosts = getBasePosts();
    const visiblePosts = getVisiblePosts();
    const keyword = normalizeSearchText(keywordSearch.value);

    list.innerHTML = "";

    if (keyword) {
        resultSummary.textContent = `${visiblePosts.length} result(s) found for “${keywordSearch.value.trim()}”.`;
    } else {
        resultSummary.textContent = `${allPosts.length} resource(s) available.`;
    }

    if (visiblePosts.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";
        emptyState.innerHTML = keyword
            ? `<h3>No matching resources</h3><p>Try a different keyword or clear the search.</p>`
            : `<h3>No resources yet</h3><p>Be the first to create a post for this section.</p>`;
        list.appendChild(emptyState);
        return;
    }

    visiblePosts.forEach(post => {
        const item = document.createElement("article");
        item.className = "resource-item";

        const topRow = document.createElement("div");
        topRow.className = "resource-item-top";

        const textBlock = document.createElement("div");
        textBlock.className = "resource-text";

        const heading = document.createElement("h3");
        heading.textContent = post.title;

        const description = document.createElement("p");
        description.className = "resource-description";
        description.textContent = post.desc;

        const fileBadge = document.createElement("span");
        fileBadge.className = "file-badge";
        fileBadge.textContent = `📄 ${post.file || "Resource"}`;

        const meta = document.createElement("p");
        meta.className = "resource-meta";

        const createdText = `Posted ${formatDate(post.createdAt || post.id)}`;
        const wasEdited = post.updatedAt && post.createdAt && post.updatedAt !== post.createdAt;
        meta.textContent = wasEdited
            ? `${createdText} • Updated ${formatDate(post.updatedAt)}`
            : createdText;

        const actions = document.createElement("div");
        actions.className = "post-actions";

        const editButton = document.createElement("button");
        editButton.className = "btn-secondary small-btn";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => editPost(post.id));

        const deleteButton = document.createElement("button");
        deleteButton.className = "btn-danger small-btn";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deletePost(post.id));

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        textBlock.appendChild(heading);
        textBlock.appendChild(description);
        topRow.appendChild(textBlock);
        topRow.appendChild(fileBadge);

        item.appendChild(topRow);
        item.appendChild(meta);
        item.appendChild(actions);
        list.appendChild(item);
    });
}

/* ===============================
   Delete Post
================================ */
function deletePost(id) {
    if (!confirm("Are you sure you want to delete this post?")) {
        return;
    }

    const posts = getPosts().filter(post => post.id !== id);
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
}

/* ===============================
   Edit Post
================================ */
function editPost(id) {
    window.location.href = `create-post.html?edit=${id}`;
}

/* ===============================
   Events
================================ */
keywordSearch.addEventListener("input", renderPosts);
clearSearchBtn.addEventListener("click", () => {
    keywordSearch.value = "";
    renderPosts();
    keywordSearch.focus();
});

renderPosts();
