// =====================================================
// API CONFIGURATION
// =====================================================
const API_URL = "https://student-management-5sgq.onrender.com";


// =====================================================
// GLOBAL DATA
// =====================================================

let students = [];


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    loadStudents();

});


// =====================================================
// LOAD STUDENTS
// =====================================================

async function loadStudents() {

    try {

        const response = await fetch(
            `${API_URL}/students`
        );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch students"
            );

        }


        const result = await response.json();


        students = result.data || [];


        displayStudents(students);

        updateStatistics(students);


    } catch (error) {

        console.error(error);

        showToast(
            "❌ Unable to connect to backend"
        );

    }

}


// =====================================================
// DISPLAY STUDENTS
// =====================================================

function displayStudents(studentList) {

    const dashboardTable =
        document.getElementById(
            "studentTableBody"
        );


    const allStudentsTable =
        document.getElementById(
            "allStudentTableBody"
        );


    dashboardTable.innerHTML = "";

    allStudentsTable.innerHTML = "";


    if (studentList.length === 0) {

        const emptyHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <div class="empty-state-icon">
                            🎓
                        </div>

                        <p>
                            No students found
                        </p>
                    </div>
                </td>
            </tr>
        `;


        dashboardTable.innerHTML =
            emptyHTML;


        allStudentsTable.innerHTML =
            emptyHTML;


        return;

    }


    // Show latest students on dashboard

    const recentStudents =
        [...studentList]
        .slice()
        .reverse()
        .slice(0, 5);


    recentStudents.forEach(student => {

        dashboardTable.innerHTML +=
            createStudentRow(student);

    });


    // Show all students

    studentList.forEach(student => {

        allStudentsTable.innerHTML +=
            createStudentRow(student);

    });

}


// =====================================================
// CREATE TABLE ROW
// =====================================================

function createStudentRow(student) {

    const performance =
        getPerformance(student.marks);


    return `

        <tr>

            <td>
                <span class="student-id">
                    #${student.id}
                </span>
            </td>


            <td>

                <span class="student-name">
                    ${escapeHTML(student.name)}
                </span>

            </td>


            <td>

                <span class="course-badge">
                    ${escapeHTML(student.course)}
                </span>

            </td>


            <td>

                <span class="marks">
                    ${student.marks}
                </span>

            </td>


            <td>

                <span class="performance ${performance.className}">
                    ${performance.label}
                </span>

            </td>


            <td>

                <div class="actions">

                    <button
                        class="action-btn edit-btn"
                        onclick="openEditModal(${student.id}, ${student.marks})"
                    >
                        ✏️ Edit
                    </button>


                    <button
                        class="action-btn delete-btn"
                        onclick="deleteStudent(${student.id})"
                    >
                        🗑️ Delete
                    </button>

                </div>

            </td>

        </tr>

    `;

}


// =====================================================
// PERFORMANCE
// =====================================================

function getPerformance(marks) {

    if (marks >= 90) {

        return {
            label: "Excellent",
            className: "excellent"
        };

    }


    if (marks >= 75) {

        return {
            label: "Good",
            className: "good"
        };

    }


    if (marks >= 50) {

        return {
            label: "Average",
            className: "average"
        };

    }


    return {
        label: "Needs Improvement",
        className: "needs-improvement"
    };

}


// =====================================================
// UPDATE STATISTICS
// =====================================================

function updateStatistics(studentList) {

    const total =
        studentList.length;


    document.getElementById(
        "totalStudents"
    ).textContent = total;


    if (total === 0) {

        document.getElementById(
            "averageMarks"
        ).textContent = "0";


        document.getElementById(
            "highestMarks"
        ).textContent = "0";


    } else {

        const marks =
            studentList.map(
                student =>
                    Number(student.marks)
            );


        const average =
            marks.reduce(
                (sum, mark) =>
                    sum + mark,
                0
            ) / marks.length;


        const highest =
            Math.max(...marks);


        document.getElementById(
            "averageMarks"
        ).textContent =
            average.toFixed(1);


        document.getElementById(
            "highestMarks"
        ).textContent =
            highest;

    }


    const courses =
        new Set(
            studentList.map(
                student =>
                    student.course.toLowerCase()
            )
        );


    document.getElementById(
        "totalCourses"
    ).textContent =
        courses.size;

}


// =====================================================
// ADD STUDENT
// =====================================================

document.getElementById(
    "addStudentForm"
).addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "studentName"
            ).value.trim();


        const course =
            document.getElementById(
                "studentCourse"
            ).value.trim();


        const marks =
            document.getElementById(
                "studentMarks"
            ).value;


        if (!name || !course || marks === "") {

            showToast(
                "⚠️ Please fill all fields"
            );

            return;

        }


        try {

            const response =
                await fetch(
                    `${API_URL}/students?name=${encodeURIComponent(name)}&course=${encodeURIComponent(course)}&marks=${marks}`,
                    {
                        method: "POST"
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.detail ||
                    "Failed to add student"
                );

            }


            showToast(
                "✅ Student added successfully"
            );


            document.getElementById(
                "addStudentForm"
            ).reset();


            closeAddModal();


            await loadStudents();


        } catch (error) {

            console.error(error);

            showToast(
                "❌ " + error.message
            );

        }

    }
);


// =====================================================
// OPEN ADD MODAL
// =====================================================

function openAddModal() {

    document
        .getElementById("addModal")
        .classList.add("show");

}


// =====================================================
// CLOSE ADD MODAL
// =====================================================

function closeAddModal() {

    document
        .getElementById("addModal")
        .classList.remove("show");

}


// =====================================================
// OPEN EDIT MODAL
// =====================================================

function openEditModal(id, marks) {

    document.getElementById(
        "editStudentId"
    ).value = id;


    document.getElementById(
        "editStudentIdDisplay"
    ).value = id;


    document.getElementById(
        "editStudentMarks"
    ).value = marks;


    document
        .getElementById("editModal")
        .classList.add("show");

}


// =====================================================
// CLOSE EDIT MODAL
// =====================================================

function closeEditModal() {

    document
        .getElementById("editModal")
        .classList.remove("show");

}


// =====================================================
// UPDATE STUDENT
// =====================================================

document.getElementById(
    "editStudentForm"
).addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const id =
            document.getElementById(
                "editStudentId"
            ).value;


        const marks =
            document.getElementById(
                "editStudentMarks"
            ).value;


        try {

            const response =
                await fetch(
                    `${API_URL}/students/${id}?marks=${marks}`,
                    {
                        method: "PUT"
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.detail ||
                    "Failed to update student"
                );

            }


            showToast(
                "✅ Student updated successfully"
            );


            closeEditModal();


            await loadStudents();


        } catch (error) {

            console.error(error);

            showToast(
                "❌ " + error.message
            );

        }

    }
);


// =====================================================
// DELETE STUDENT
// =====================================================

async function deleteStudent(id) {

    const student =
        students.find(
            student =>
                student.id === id
        );


    const studentName =
        student
            ? student.name
            : "this student";


    const confirmed =
        confirm(
            `Are you sure you want to delete ${studentName}?`
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/students/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.detail ||
                "Failed to delete student"
            );

        }


        showToast(
            "✅ Student deleted successfully"
        );


        await loadStudents();


    } catch (error) {

        console.error(error);

        showToast(
            "❌ " + error.message
        );

    }

}


// =====================================================
// SEARCH STUDENTS
// =====================================================

function searchStudents() {

    const search =
        document.getElementById(
            "searchInput"
        ).value
        .toLowerCase()
        .trim();


    const filtered =
        students.filter(student => {

            return (

                student.name
                    .toLowerCase()
                    .includes(search)

                ||

                student.course
                    .toLowerCase()
                    .includes(search)

                ||

                String(student.id)
                    .includes(search)

            );

        });


    const table =
        document.getElementById(
            "allStudentTableBody"
        );


    table.innerHTML = "";


    if (filtered.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="6">

                    <div class="empty-state">

                        <div class="empty-state-icon">
                            🔍
                        </div>

                        <p>
                            No matching students
                        </p>

                    </div>

                </td>

            </tr>

        `;

        return;

    }


    filtered.forEach(student => {

        table.innerHTML +=
            createStudentRow(student);

    });

}


// =====================================================
// NAVIGATION
// =====================================================

function showSection(sectionName) {

    document
        .querySelectorAll(".section")
        .forEach(section => {

            section.classList.remove(
                "active-section"
            );

        });


    document
        .getElementById(sectionName)
        .classList.add(
            "active-section"
        );


    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove("active");

        });


    if (sectionName === "dashboard") {

        document
            .querySelector(
                '.nav-item[onclick*="dashboard"]'
            )
            .classList.add("active");


        document.getElementById(
            "page-title"
        ).textContent =
            "Dashboard";

    }


    if (sectionName === "students") {

        document
            .querySelector(
                '.nav-item[onclick*="students"]'
            )
            .classList.add("active");


        document.getElementById(
            "page-title"
        ).textContent =
            "Students";

    }

}


// =====================================================
// TOAST MESSAGE
// =====================================================

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    toastMessage.textContent =
        message;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


// =====================================================
// HTML SECURITY
// =====================================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// =====================================================

window.addEventListener(
    "click",
    function(event) {

        const addModal =
            document.getElementById(
                "addModal"
            );


        const editModal =
            document.getElementById(
                "editModal"
            );


        if (event.target === addModal) {

            closeAddModal();

        }


        if (event.target === editModal) {

            closeEditModal();

        }

    }
);