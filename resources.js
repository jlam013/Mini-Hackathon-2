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
        fileBadge.textContent = post.fileName 
            ? `📄 ${post.fileName}` 
            : "📄 Resource";

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

        const commentButton = document.createElement("button");
        commentButton.className = "btn-secondary small-btn";
        commentButton.textContent = "Comment";
        commentButton.addEventListener("click", () => commentPost(post.id));

        const likeButton = document.createElement("button");
        likeButton.className = "btn-secondary small-btn";
        likeButton.textContent = "Like";
        likeButton.addEventListener("click", () => likePost(post.id));

        const likeText = document.createElement("span");
        likeText.className = "like-count";
        likeText.textContent = `👍 ${post.likes || 0}`;
  
        actions.appendChild(editButton);
        actions.appendChild(deleteButton);
        actions.appendChild(commentButton);
        actions.appendChild(likeButton);
        actions.appendChild(likeText);
        
        textBlock.appendChild(heading);
        textBlock.appendChild(description);
        topRow.appendChild(textBlock);
        topRow.appendChild(fileBadge);

        item.appendChild(topRow);
        item.appendChild(meta);
        item.appendChild(actions);
        if (post.fileData) {
            const fileLink = document.createElement("a");
            fileLink.href = post.fileData;
            fileLink.download = post.fileName;
            fileLink.textContent = `📎 ${post.fileName || "Download File"}`;
            fileLink.className = "file-download-link";

            item.appendChild(fileLink);
        }
/* comment section */
const commentSection = document.createElement("div");
commentSection.className = "comment-section";

const comments = post.comments || [];

if (comments.length > 0) {
    comments.forEach(c => {
        const commentDiv = document.createElement("div");
        commentDiv.className = "comment";

        const text = document.createElement("p");
        text.className = "comment-text";
        text.textContent = c.text;

        const time = document.createElement("span");
        time.className = "comment-time";
        time.textContent = formatDate(c.time);

        const likeBtn = document.createElement("button");
        likeBtn.className = "btn-secondary small-btn";
        likeBtn.textContent = `👍 ${c.likes || 0}`;
        likeBtn.addEventListener("click", () => likeComment(post.id, c.id));

        const editBtn = document.createElement("button");
        editBtn.className = "btn-secondary small-btn";
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => editComment(post.id, c.id));

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn-danger small-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteComment(post.id, c.id));

        const replyBtn = document.createElement("button");
        replyBtn.className = "btn-secondary small-btn";
        replyBtn.textContent = "Reply";
        replyBtn.addEventListener("click", () => replyToComment(post.id, c.id));

        commentDiv.appendChild(text);
        commentDiv.appendChild(time);
        commentDiv.appendChild(editBtn);
        commentDiv.appendChild(deleteBtn);
        commentDiv.appendChild(replyBtn);
        commentDiv.appendChild(likeBtn);

/*replies section*/
        const replies = c.replies || [];
        replies.forEach(r => {
            const replyDiv = document.createElement("div");
            replyDiv.className = "comment reply";

            const replyText = document.createElement("p");
            replyText.className = "comment-text";
            replyText.textContent = r.text;

            const replyTime = document.createElement("span");
            replyTime.className = "comment-time";
            replyTime.textContent = formatDate(r.time);

            const replyDeleteBtn = document.createElement("button");
            replyDeleteBtn.className = "btn-danger small-btn";
            replyDeleteBtn.textContent = "Delete";
            replyDeleteBtn.addEventListener("click", () => deleteReply(post.id, c.id, r.id));

            const replyLikeBtn = document.createElement("button");
            replyLikeBtn.className = `btn-secondary small-btn ${r.likedByUser ? "liked" : ""}`;
            replyLikeBtn.textContent = `👍 ${r.likes || 0}`;
            replyLikeBtn.addEventListener("click", () => likeReply(post.id, c.id, r.id));

            const replyToReplyBtn = document.createElement("button");
            replyToReplyBtn.className = 'btn-secondary small-btn';
            replyToReplyBtn.textContent = "Reply";
            replyToReplyBtn.addEventListener("click", () => replyToReply(post.id, c.id));

            const replyEdit = document.createElement("button");
            replyEdit.className = 'btn-secondary small-btn';
            replyEdit.textContent = "Edit";
            replyEdit.addEventListener("click", () => editReply(post.id, c.id, r.id));

            replyDiv.appendChild(replyText);
            replyDiv.appendChild(replyTime);
            replyDiv.appendChild(replyEdit);
            replyDiv.appendChild(replyDeleteBtn);
            replyDiv.appendChild(replyToReplyBtn);
            replyDiv.appendChild(replyLikeBtn);
            commentDiv.appendChild(replyDiv); 
        });

        commentSection.appendChild(commentDiv); 
    });
} else {
    const empty = document.createElement("p");
    empty.className = "no-comments";
    empty.textContent = "No comments yet.";
    commentSection.appendChild(empty);
}

item.appendChild(commentSection);
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

/* ===============================
   Comment Post
================================ */
function commentPost(id) {
    const text = prompt("Enter your comment:");

    if (!text || text.trim() === "") {
        return;
    }

    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    const post = posts.find(p => p.id === id);
    if (!post) return;

    if (!post.comments) {
        post.comments = [];
    }

    post.comments.push({
        id: Date.now() + Math.random(),
        text,
        time: new Date().toISOString(),
        likes: 0
    });

    localStorage.setItem("posts", JSON.stringify(posts));
        renderPosts();
}

/* ===============================
   Comment functions
================================ */
function likePost(id) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    const post = posts.find(p => p.id === id);
    if (!post) return;

    if (post.likedByUser) {
        post.likes = Math.max(0, (post.likes || 0) - 1);
        post.likedByUser = false;
    } else {
        post.likes = (post.likes || 0) + 1;
        post.likedByUser = true;
    }

    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
}

function likeComment(postId, commentId) {
    let posts = getPosts();

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) return;

    if (comment.likedByUser) {
        comment.likes = Math.max(0, (comment.likes || 0) - 1);
        comment.likedByUser = false;
    } else {
        comment.likes = (comment.likes || 0) + 1;
        comment.likedByUser = true;
    }

    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
}

function deleteComment(postId, commentId) {
    let posts = getPosts();

    if (!confirm("Are you sure you want to delete this post?")) {
        return;
    }

    const post = posts.find(p => p.id === postId);

    post.comments = post.comments.filter(c => c.id !== commentId);

    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
}

function editComment(postId, commentId) {
    const newText = prompt("Edit your comment:");
    if (!newText || newText.trim() === "") return;

    let posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) return;

    comment.text = newText.trim();
    comment.updatedAt = new Date().toISOString();

    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
}

/* ===============================
   Reply Comment functions
   Including replytoreply
================================ */

function replyToComment(postId, commentId) {
    const text = prompt("Enter your reply:");

    if (!text || text.trim() === "") return;

    let posts = getPosts();

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) return;

    if (!comment.replies) comment.replies = [];

    comment.replies.push({       
        id: Date.now() + Math.random(),
        text,
        time: new Date().toISOString()
    });

    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
}

function deleteReply(postId, commentId, replyId) {
    if (!confirm("Are you sure you want to delete this reply?")) return;

    let posts = getPosts();

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) return;

    comment.replies = comment.replies.filter(r => r.id !== replyId);

    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
}

function likeReply(postId, commentId, replyId) {
    let posts = getPosts();

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) return;

    const reply = comment.replies.find(r => r.id === replyId);
    if (!reply) return;

    if (reply.likedByUser) {
        reply.likes = Math.max(0, (reply.likes || 0) - 1);
        reply.likedByUser = false;
    } else {
        reply.likes = (reply.likes || 0) + 1;
        reply.likedByUser = true;
    }

    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
}

function replyToReply(postId, commentId) {
    const text = prompt("Enter your reply:");
    if (!text || text.trim() === "") return;

    let posts = getPosts();

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) return;

    if (!comment.replies) comment.replies = [];

    comment.replies.push({       
        id: Date.now() + Math.random(),
        text,
        time: new Date().toISOString()
    });

    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
}

function editReply(postId, commentId, replyId) {
   const newText = prompt("Edit your reply:");
    if (!newText || newText.trim() === "") return;

    let posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) return;

    const reply = comment.replies.find(r => r.id === replyId);
    if (!reply) return;

    reply.text = newText.trim();
    reply.updatedAt = new Date().toISOString();

    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
}
