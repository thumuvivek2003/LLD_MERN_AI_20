import os

base_dir = "src"

structure = {
    "controllers": ["noteController.js"],
    "services": ["noteService.js"],
    "repositories": ["noteRepository.js"],
    "models": ["noteModel.js"],
    "routes": ["noteRoutes.js"],
    "validators": ["noteValidator.js"],
    "middlewares": ["errorMiddleware.js"],
    "config": ["db.js"]
}

for folder, files in structure.items():
    folder_path = os.path.join(base_dir, folder)

    # create folder if not exists
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
        print(f"Created folder: {folder_path}")
    else:
        print(f"Folder exists: {folder_path}")

    # create files
    for file in files:
        file_path = os.path.join(folder_path, file)

        if not os.path.exists(file_path):
            with open(file_path, "w") as f:
                pass
            print(f"Created file: {file_path}")
        else:
            print(f"File exists: {file_path}")