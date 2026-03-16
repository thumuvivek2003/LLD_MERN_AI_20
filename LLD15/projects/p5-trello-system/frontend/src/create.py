import os

structure = {
    "app": [
        "App.jsx",
        "routes.jsx"
    ],

    "pages": [
        "DashboardPage.jsx",
        "BoardPage.jsx"
    ],

    "features/board/components": [
        "BoardHeader.jsx",
        "BoardMembers.jsx"
    ],

    "features/board/hooks": [
        "useBoard.js"
    ],

    "features/board/services": [
        "boardService.js"
    ],

    "features/list/components": [
        "List.jsx",
        "AddList.jsx"
    ],

    "features/list/hooks": [
        "useLists.js"
    ],

    "features/list/services": [
        "listService.js"
    ],

    "features/card/components": [
        "Card.jsx",
        "CardModal.jsx",
        "AddCard.jsx"
    ],

    "features/card/hooks": [
        "useCards.js"
    ],

    "features/card/services": [
        "cardService.js"
    ],

    "components/UI": [
        "Button.jsx",
        "Modal.jsx",
        "Input.jsx",
        "Avatar.jsx"
    ],

    "context": [
        "AuthContext.jsx"
    ],

    "hooks": [
        "useAuth.js"
    ],

    "services": [
        "apiClient.js"
    ],

    "utils": [
        "helpers.js"
    ],

    "styles": [
        "global.css"
    ],

    "assets": []
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

print("✅ Frontend folder structure created successfully!")