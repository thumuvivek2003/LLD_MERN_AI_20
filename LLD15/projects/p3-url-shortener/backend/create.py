import os

# Base directory
base_dir = "src"

# Folder structure and files
structure = {
    "controllers": ["URLController.js"],
    "services": ["URLService.js", "AnalyticsService.js"],
    "repositories": ["URLRepository.js"],
    "models": ["URLModel.js"],
    "utils": ["ShortCodeGenerator.js", "URLValidator.js"],
    "middleware": ["validateRequest.js"],
    "routes": ["urlRoutes.js"]
}

# Create base folder
os.makedirs(base_dir, exist_ok=True)

for folder, files in structure.items():
    folder_path = os.path.join(base_dir, folder)
    
    # Create folder
    os.makedirs(folder_path, exist_ok=True)

    # Create files
    for file in files:
        file_path = os.path.join(folder_path, file)

        if not os.path.exists(file_path):
            with open(file_path, "w") as f:
                f.write(f"// {file}\n")
                f.write("// Auto-generated file\n")

print("Project structure created successfully 🚀")
