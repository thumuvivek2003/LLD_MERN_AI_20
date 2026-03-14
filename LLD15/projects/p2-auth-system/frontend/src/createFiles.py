import os

structure = {
    "api": [
        "axiosClient.js"
    ],
    "services": [
        "authService.js",
        "userService.js"
    ],
    "context": [
        "AuthContext.js"
    ],
    "hooks": [
        "useAuth.js"
    ],
    "components": [
        "LoginForm.jsx",
        "SignupForm.jsx",
        "ProtectedRoute.jsx",
        "UserTable.jsx"
    ],
    "pages": [
        "LoginPage.jsx",
        "SignupPage.jsx",
        "Dashboard.jsx",
        "AdminDashboard.jsx"
    ],
    "routes": [
        "AppRoutes.jsx"
    ],
    "utils": [
        "tokenStorage.js"
    ]
}

# create folders and files
for folder, files in structure.items():
    os.makedirs(folder, exist_ok=True)

    for file in files:
        path = os.path.join(folder, file)

        if not os.path.exists(path):
            with open(path, "w") as f:
                f.write("")
            print(f"Created: {path}")
        else:
            print(f"Skipped (exists): {path}")

# root files
root_files = ["App.jsx", "main.jsx"]

for file in root_files:
    if not os.path.exists(file):
        with open(file, "w") as f:
            f.write("")
        print(f"Created: {file}")
    else:
        print(f"Skipped (exists): {file}")