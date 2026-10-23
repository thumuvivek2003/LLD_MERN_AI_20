import os

# Folder structure relative to current directory (src/)
structure = {
    "config": ["db.js"],
    "models": [
        "student.model.js",
        "course.model.js",
        "marks.model.js",
        "attendance.model.js"
    ],
    "controllers": [
        "student.controller.js",
        "course.controller.js",
        "marks.controller.js",
        "attendance.controller.js"
    ],
    "services": [
        "student.service.js",
        "course.service.js",
        "marks.service.js",
        "attendance.service.js"
    ],
    "routes": [
        "student.routes.js",
        "course.routes.js",
        "marks.routes.js",
        "attendance.routes.js"
    ],
    "middlewares": ["error.middleware.js"]
}

# Main files
root_files = ["server.js", "app.js"]

def create_files():
    # Create main files
    for file in root_files:
        if not os.path.exists(file):
            open(file, "w").close()
            print(f"✅ Created file: {file}")
        else:
            print(f"⚠ Already exists: {file}")

    # Create folders & files
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
    create_files()
    print("\n🎉 Project structure initialized successfully!")
