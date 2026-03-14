import os

# Folder → files structure
structure = {
    "config": ["db.js"],
    "models": ["User.js"],
    "repositories": ["UserRepository.js"],
    "services": ["AuthService.js"],
    "controllers": ["AuthController.js"],
    "middleware": ["authMiddleware.js", "roleMiddleware.js"],
    "routes": ["authRoutes.js", "userRoutes.js"],
    "utils": ["jwt.js", "hash.js"]
}

# Create folders and files
for folder, files in structure.items():
    os.makedirs(folder, exist_ok=True)

    for file in files:
        path = os.path.join(folder, file)

        if not os.path.exists(path):
            with open(path, "w") as f:
                f.write("")  # create empty file
            print(f"Created: {path}")
        else:
            print(f"Skipped (exists): {path}")

# Create server.js in root of src
server_file = "server.js"

if not os.path.exists(server_file):
    with open(server_file, "w") as f:
        f.write("")
    print("Created: server.js")
else:
    print("Skipped (exists): server.js")