import os

structure = {
    "routes": [
        "fileRoutes.js"
    ],
    "controllers": [
        "FileController.js"
    ],
    "services": [
        "FileService.js",
        "PermissionService.js"
    ],
    "repositories": [
        "FileRepository.js"
    ],
    "models": [
        "FileModel.js"
    ],
    "storage": [
        "StorageProvider.js",
        "LocalStorageProvider.js"
    ],
    "middlewares": [
        "authMiddleware.js",
        "uploadMiddleware.js"
    ],
    "utils": [
        "fileHelpers.js"
    ]
}

for folder, files in structure.items():
    os.makedirs(folder, exist_ok=True)

    for file in files:
        path = os.path.join(folder, file)

        if not os.path.exists(path):
            with open(path, "w") as f:
                f.write("// " + file + "\n")
                f.write("// Auto generated file\n")

print("✅ Project structure created successfully!")