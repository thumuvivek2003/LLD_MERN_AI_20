import os

# Create public folder in parent directory (../public)
public_folder = os.path.join("..", "public")

# Folder structure inside src/
structure = {
    "components": [
        "Navbar.jsx",
        "Sidebar.jsx",
        "StudentCard.jsx",
        "CourseCard.jsx"
    ],
    "pages": [
        "Login.jsx",
        "Dashboard.jsx",
        "Students.jsx",
        "Courses.jsx",
        "Marks.jsx",
        "Attendance.jsx"
    ],
    "services": [
        "api.js",
        "student.service.js",
        "course.service.js",
        "marks.service.js",
        "attendance.service.js"
    ],
    "styles": [
        "app.css"
    ],
    "hooks": [
        "useFetch.js"
    ]
}

# Main files in src/
root_files = ["main.jsx", "App.jsx"]

def create_public_folder():
    if not os.path.exists(public_folder):
        os.makedirs(public_folder)
        print(f"📁 Created folder: {public_folder}")
    else:
        print(f"⚠ Already exists: {public_folder}")

def create_files():
    # Create main files
    for file in root_files:
        if not os.path.exists(file):
            open(file, "w").close()
            print(f"✅ Created file: {file}")
        else:
            print(f"⚠ Already exists: {file}")

    # Create folders and files
    for folder, files in structure.items():
        if not os.path.exists(folder):
            os.makedirs(folder)
            print(f"📁 Created folder: {folder}")

        for file in files:
            file_path = os.path.join(folder, file)
            if not os.path.exists(file_path):
                open(file_path, "w").close()
                print(f"✅ Created file: {file_path}")
            else:
                print(f"⚠ Already exists: {file_path}")

if __name__ == "__main__":
    create_public_folder()
    create_files()
    print("\n🎉 Frontend project structure initialized successfully!")
