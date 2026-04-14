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
const fileInput = document.getElementById("postFile");
/* ===============================
   Helpers
================================ */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

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
async function savePost() {
    const title = cleanSingleLine(titleInput.value);
    const courseInput = cleanSingleLine(courseInputField.value);
    const type = typeInput.value;
    const desc = cleanMultiline(descInput.value);

    if (!title || !courseInput || !desc) {
        showMessage("Please fill in all fields. Whitespace-only values are not allowed.");
        return;
    }

    showMessage("");

    const normalizedCourse = normalizeCourse(courseInput);
    const timestamp = new Date().toISOString();

    const file = fileInput.files[0];
    let fileData = null;
    let fileName = null;

    if (file) {
        try {
            fileData = await fileToBase64(file);
            fileName = file.name;
        } catch (error) {
            showMessage("There was a problem reading the file.");
            console.error(error);
            return;
        }
    }

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
            fileName: fileName || posts[index].fileName,
            fileData: fileData || posts[index].fileData,
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
            fileName,
            fileData,
            createdAt: timestamp,
            updatedAt: timestamp
        });
    }

    localStorage.setItem("posts", JSON.stringify(posts));
    window.location.href = `resources.html?course=${normalizedCourse}&type=${type}`;
}

