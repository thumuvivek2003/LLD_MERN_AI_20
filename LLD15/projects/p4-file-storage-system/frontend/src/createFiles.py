import os

structure = {
    "app": [
        "App.jsx",
        "routes.jsx"
    ],

    "pages/Dashboard": [
        "DashboardPage.jsx"
    ],

    "pages/Upload": [
        "UploadPage.jsx"
    ],

    "pages/Files": [
        "FilesPage.jsx"
    ],

    "pages/Login": [
        "LoginPage.jsx"
    ],

    "components/FileUpload": [
        "FileUploadForm.jsx",
        "UploadButton.jsx"
    ],

    "components/FileList": [
        "FileList.jsx",
        "FileItem.jsx"
    ],

    "components/FileActions": [
        "DownloadButton.jsx",
        "DeleteButton.jsx",
        "VisibilitySelector.jsx"
    ],

    "components/common": [
        "Button.jsx",
        "Loader.jsx",
        "Modal.jsx"
    ],

    "services": [
        "fileService.js"
    ],

    "api": [
        "apiClient.js"
    ],

    "hooks": [
        "useFiles.js",
        "useUpload.js"
    ],

    "context": [
        "AuthContext.jsx"
    ],

    "utils": [
        "fileHelpers.js",
        "formatters.js"
    ],

    "styles": [
        "global.css"
    ],

    "constants": [
        "apiEndpoints.js"
    ]
}

for folder, files in structure.items():
    os.makedirs(folder, exist_ok=True)

    for file in files:
        path = os.path.join(folder, file)

        if not os.path.exists(path):
            with open(path, "w") as f:
                f.write(f"// {file}\n")
                f.write("// Auto-generated file\n")

print("✅ Frontend structure created successfully!")