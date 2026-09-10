import gradio as gr
import requests

API_URL = "http://127.0.0.1:8000"


# -------------------------
# CREATE STUDENT
# -------------------------
def create_student(name, course, marks):

    if not name or not course or marks is None:
        return "Please fill all fields."

    response = requests.post(
        f"{API_URL}/students",
        params={
            "name": name,
            "course": course,
            "marks": int(marks)
        }
    )

    if response.status_code == 200:
        return "✅ Student created successfully!"

    return f"❌ Error: {response.text}"


# -------------------------
# GET ALL STUDENTS
# -------------------------
def get_students():

    response = requests.get(
        f"{API_URL}/students"
    )

    if response.status_code == 200:

        students = response.json()["data"]

        rows = []

        for student in students:
            rows.append([
                student["id"],
                student["name"],
                student["course"],
                student["marks"]
            ])

        return rows

    return []


# -------------------------
# GET ONE STUDENT
# -------------------------
def get_student(student_id):

    if student_id is None:
        return "Please enter a student ID."

    response = requests.get(
        f"{API_URL}/students/{int(student_id)}"
    )

    if response.status_code == 200:

        students = response.json()["data"]

        if len(students) == 0:
            return "❌ Student not found."

        student = students[0]

        return (
            f"ID: {student['id']}\n"
            f"Name: {student['name']}\n"
            f"Course: {student['course']}\n"
            f"Marks: {student['marks']}"
        )

    return f"❌ Error: {response.text}"


# -------------------------
# UPDATE STUDENT
# -------------------------
def update_student(student_id, marks):

    if student_id is None or marks is None:
        return "Please enter Student ID and Marks."

    response = requests.put(
        f"{API_URL}/students/{int(student_id)}",
        params={
            "marks": int(marks)
        }
    )

    if response.status_code == 200:

        updated_data = response.json()["data"]

        if len(updated_data) == 0:
            return "❌ Student not found."

        return "✅ Student marks updated successfully!"

    return f"❌ Error: {response.text}"


# -------------------------
# DELETE STUDENT
# -------------------------
def delete_student(student_id):

    if student_id is None:
        return "Please enter a Student ID."

    response = requests.delete(
        f"{API_URL}/students/{int(student_id)}"
    )

    if response.status_code == 200:

        deleted_data = response.json()["data"]

        if len(deleted_data) == 0:
            return "❌ Student not found."

        return "✅ Student deleted successfully!"

    return f"❌ Error: {response.text}"


# -------------------------
# GRADIO UI
# -------------------------
with gr.Blocks() as app:

    gr.Markdown("# 🎓 Student Management System")

    gr.Markdown(
        "Manage students using FastAPI + Supabase"
    )


    # -------------------------
    # ADD STUDENT
    # -------------------------

    gr.Markdown("## Add Student")

    name = gr.Textbox(
        label="Student Name",
        placeholder="Enter student name"
    )

    course = gr.Textbox(
        label="Course",
        placeholder="Enter course"
    )

    marks = gr.Number(
        label="Marks",
        precision=0
    )

    add_button = gr.Button("Add Student")

    status = gr.Textbox(
        label="Status"
    )

    add_button.click(
        fn=create_student,
        inputs=[name, course, marks],
        outputs=status
    )


    # -------------------------
    # ALL STUDENTS
    # -------------------------

    gr.Markdown("## All Students")

    students_table = gr.Dataframe(
        headers=["ID", "Name", "Course", "Marks"],
        label="Students",
        interactive=False
    )

    refresh_button = gr.Button("Refresh Students")

    refresh_button.click(
        fn=get_students,
        inputs=[],
        outputs=students_table
    )


    # -------------------------
    # FIND STUDENT
    # -------------------------

    gr.Markdown("## Find Student")

    student_id = gr.Number(
        label="Student ID",
        precision=0
    )

    find_button = gr.Button("Find Student")

    student_details = gr.Textbox(
        label="Student Details",
        lines=5
    )

    find_button.click(
        fn=get_student,
        inputs=student_id,
        outputs=student_details
    )


    # -------------------------
    # UPDATE STUDENT
    # -------------------------

    gr.Markdown("## Update Student")

    update_student_id = gr.Number(
        label="Student ID",
        precision=0
    )

    update_marks = gr.Number(
        label="New Marks",
        precision=0
    )

    update_button = gr.Button("Update Student")

    update_status = gr.Textbox(
        label="Update Status"
    )

    update_button.click(
        fn=update_student,
        inputs=[update_student_id, update_marks],
        outputs=update_status
    )


    # -------------------------
    # DELETE STUDENT
    # -------------------------

    gr.Markdown("## Delete Student")

    delete_student_id = gr.Number(
        label="Student ID",
        precision=0
    )

    delete_button = gr.Button("Delete Student")

    delete_status = gr.Textbox(
        label="Delete Status"
    )

    delete_button.click(
        fn=delete_student,
        inputs=delete_student_id,
        outputs=delete_status
    )


# -------------------------
# LAUNCH APP
# -------------------------

app.launch()