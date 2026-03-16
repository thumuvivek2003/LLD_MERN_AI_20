import os

structure = {
    "controllers": [
        "boardController.js",
        "listController.js",
        "cardController.js",
    ],
    "services": [
        "boardService.js",
        "listService.js",
        "cardService.js",
    ],
    "repositories": [
        "boardRepository.js",
        "listRepository.js",
        "cardRepository.js",
    ],
    "models": [
        "User.js",
        "Board.js",
        "List.js",
        "Card.js",
    ],
    "routes": [
        "boardRoutes.js",
        "listRoutes.js",
        "cardRoutes.js",
    ],
    "middleware": [
        "authMiddleware.js",
    ],
    "utils": []
}

base_path = os.getcwd()

for folder, files in structure.items():
    folder_path = os.path.join(base_path, folder)
    os.makedirs(folder_path, exist_ok=True)

    for file in files:
        file_path = os.path.join(folder_path, file)

        if not os.path.exists(file_path):
            with open(file_path, "w") as f:
                f.write(f"// {file}\n")

print("✅ Backend folder structure created successfully!")