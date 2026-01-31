function savePost() {
    const title = document.getElementById("postTitle").value.trim();
    const course = document.getElementById("postCourse").value.trim();
    const type = document.getElementById("postType").value;
    const desc = document.getElementById("postDesc").value.trim();

    if (!title || !course || !desc) {
        alert("Please fill in all fields");
        return;
    }

    const newPost = {
        title,
        course: course.toUpperCase(),
        type,
        desc,
        file: "PDF" // placeholder
    };

    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.push(newPost);
    localStorage.setItem("posts", JSON.stringify(posts));

    alert("Post created!");

    // Redirect to resource page
    window.location.href =
        `resources.html?course=${newPost.course}&type=${type}`;
}
