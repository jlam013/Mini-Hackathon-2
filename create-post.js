/* ===============================
   Read URL Parameters
================================ */
const params = new URLSearchParams(window.location.search);
const presetCourse = params.get("course");
const presetType = params.get("type");
const editId = params.get("edit");

/* ===============================
   DOM Elements
================================ */
const titleInput = document.getElementById("postTitle");
const courseInputField = document.getElementById("postCourse");
const typeInput = document.getElementById("postType");
const descInput = document.getElementById("postDesc");
const formMessage = document.getElementById("postFormMessage");
const formTitle = document.getElementById("formTitle");
const formBreadcrumbLabel = document.getElementById("formBreadcrumbLabel");
const submitPostBtn = document.getElementById("submitPostBtn");

/* ===============================
   Helpers
================================ */
function cleanSingleLine(value) {
    return value.replace(/\s+/g, " ").trim();
}

function cleanMultiline(value) {
    return value
        .split("\n")
        .map(line => line.replace(/\s+/g, " ").trim())
        .filter(line => line.length > 0)
        .join("\n");
}

function normalizeCourse(value) {
    return cleanSingleLine(value).toUpperCase().replace(/\s+/g, "");
}

function showMessage(message) {
    formMessage.textContent = message;
}

/* ===============================
   Load Posts
================================ */
const posts = JSON.parse(localStorage.getItem("posts")) || [];

/* ===============================
   Pre-fill Form (Create or Edit)
================================ */
if (editId) {
    const post = posts.find(p => String(p.id) === String(editId));

    if (post) {
        titleInput.value = post.title || "";
        courseInputField.value = post.course || "";
        typeInput.value = post.type || "notes";
        descInput.value = post.desc || "";

        formTitle.textContent = "Edit Post";
        formBreadcrumbLabel.textContent = "Edit Post";
        submitPostBtn.textContent = "Save Changes";
    }
} else {
    if (presetCourse) {
        courseInputField.value = presetCourse;
    }

    if (presetType) {
        typeInput.value = presetType;
    }
}

/* ===============================
   Save Post (Create or Edit)
================================ */
function savePost() {
    const title = cleanSingleLine(titleInput.value);
    const courseInput = cleanSingleLine(courseInputField.value);
    const type = typeInput.value;
    const desc = cleanMultiline(descInput.value);

    const fileInput = document.getElementById("postFile");
    const selectedFile = fileInput ? fileInput.files[0] : null;

    if (!title || !courseInput || !desc) {
        showMessage("Please fill in all fields. Whitespace-only values are not allowed.");
        return;
    }

    showMessage("");

    const normalizedCourse = normalizeCourse(courseInput);
    const timestamp = new Date().toISOString();

    if (editId) {
        const index = posts.findIndex(p => String(p.id) === String(editId));

        if (index === -1) {
            showMessage("That post could not be found.");
            return;
        }

        posts[index] = {
            ...posts[index],
            title,
            course: normalizedCourse,
            type,
            desc,
            updatedAt: timestamp,
            createdAt: posts[index].createdAt || timestamp
        };
    } else {
        posts.push({
            id: Date.now(),
            title,
            course: normalizedCourse,
            type,
            desc,
            file: "PDF",
            createdAt: timestamp,
            updatedAt: timestamp
        });
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

    localStorage.setItem("posts", JSON.stringify(posts));
    window.location.href = `resources.html?course=${normalizedCourse}&type=${type}`;
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
