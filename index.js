function searchCourse() {
    const input = document.getElementById("courseInput").value.trim();
    const error = document.getELementById("errorMessage");
    //list of valid courses
    const MRUcourses = ["COMP 1633", "COMP 1701", "COMP 2655", "COMP 2631", "COMP 2659",
                        "COMP 2633"];
    
    if (input === "") {
        error.textContent = "please enter a course.";
        return;
    }

    if (MRUcourses.includes(input)) {
        //go to their course dashboard and dont display error
        error.textContent = "";
        const course = input.replace(/\s+/g, "");
        window.location.href = `"course.html?course=${course}`;

    }
    else {
        //display error
        error.textcontent = "This is not a course at MRU.";
    }
}
