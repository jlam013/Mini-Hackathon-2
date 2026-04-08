/* ===============================
   Read URL Parameters
================================ */
const params = new URLSearchParams(window.location.search);
const presetCourse = params.get("course");
const presetType = params.get("type");
const editId = params.get("edit");

/* ===============================
   Pre-fill Form (Create or Edit)
================================ */
const posts = JSON.parse(localStorage.getItem("posts")) || [];

if (editId) {
    const post = posts.find(p => p.id == editId);
    if (post) {
        document.getElementById("postTitle").value = post.title;
        document.getElementById("postCourse").value = post.course;
        document.getElementById("postType").value = post.type;
        document.getElementById("postDesc").value = post.desc;
    }
} else {
    if (presetCourse) {
        document.getElementById("postCourse").value = presetCourse;
    }
    if (presetType) {
        document.getElementById("postType").value = presetType;
    }
}

/* ===============================
   Save Post (Create or Edit)
================================ */
function savePost() {
    const title = document.getElementById("postTitle").value.trim();
    const courseInput = document.getElementById("postCourse").value.trim();
    const type = document.getElementById("postType").value;
    const desc = document.getElementById("postDesc").value.trim();

    const fileInput = document.getElementById("postFile");
    const selectedFile = fileInput ? fileInput.files[0] : null;

    if (!title || !courseInput || !desc) {
        alert("Please fill in all fields");
        return;
    }

    const normalizedCourse = courseInput
        .toUpperCase()
        .replace(/\s+/g, "");

    function finishSave(fileData = null, fileName = "", fileType = "") {    
        
        if (editId) {
            const index = posts.findIndex(p => p.id == editId);
            
            posts[index] = {
                ...posts[index],
                title,
                course: normalizedCourse,
                type,
                desc,
                fileData: fileData ?? posts[index].fileData, 
                fileName: fileName || posts[index].fileName, 
                fileType: fileType || posts[index].fileType 
            };
        } 
        
        else {
            posts.push({
                id: Date.now(),
                title,
                course: normalizedCourse,
                type,
                desc,
                fileName: selectedFile ? selectedFile.name : ""
            });
        }
    
        localStorage.setItem("posts", JSON.stringify(posts));

        window.location.href =
            `resources.html?course=${normalizedCourse}&type=${type}`;
    }
    if (selectedFile) {
        const reader = new FileReader();

        reader.onload = function (event) { 
            const fileData = event.target.result;
            finishSave(fileData, selectedFile.name, selectedFile.type);
        };

        reader.readAsDataURL(selectedFile); 
    }
    else {
        finishSave();
    }    
    

}
