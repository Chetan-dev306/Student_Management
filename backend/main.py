from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Create FastAPI application
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Connect Python to Supabase
supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)


# -------------------------
# READ ALL STUDENTS
# -------------------------
@app.get("/students")
def get_students():

    response = (
        supabase
        .table("students")
        .select("*")
        .execute()
    )

    return {
        "message": "Students fetched successfully",
        "data": response.data
    }


# -------------------------
# CREATE STUDENT
# -------------------------
@app.post("/students")
def create_student(name: str, course: str, marks: int):

    student = {
        "name": name,
        "course": course,
        "marks": marks
    }

    response = (
        supabase
        .table("students")
        .insert(student)
        .execute()
    )

    return {
        "message": "Student created successfully",
        "data": response.data
    }


# -------------------------
# READ ONE STUDENT
# -------------------------
@app.get("/students/{student_id}")
def get_student(student_id: int):

    response = (
        supabase
        .table("students")
        .select("*")
        .eq("id", student_id)
        .execute()
    )

    return {
        "message": "Student fetched successfully",
        "data": response.data
    }

# -------------------------
# UPDATE STUDENT
# -------------------------
@app.put("/students/{student_id}")
def update_student(student_id: int, marks: int):

    updated_data = {
        "marks": marks
    }

    response = (
        supabase
        .table("students")
        .update(updated_data)
        .eq("id", student_id)
        .execute()
    )

    return {
        "message": "Student updated successfully",
        "data": response.data
    }
# -------------------------
# DELETE STUDENT
# -------------------------
@app.delete("/students/{student_id}")
def delete_student(student_id: int):

    response = (
        supabase
        .table("students")
        .delete()
        .eq("id", student_id)
        .execute()
    )

    return {
        "message": "Student deleted successfully",
        "data": response.data
    }