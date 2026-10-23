import os

structure = {
    "config": [
        "db.js",
        "env.js"
    ],
    "models": [
        "user.model.js",
        "book.model.js",
        "transaction.model.js",
        "reservation.model.js"
    ],
    "repositories": [
        "user.repo.js",
        "book.repo.js",
        "transaction.repo.js",
        "reservation.repo.js"
    ],
    "services": [
        "auth.service.js",
        "user.service.js",
        "book.service.js",
        "transaction.service.js",
        "reservation.service.js"
    ],
    "controllers": [
        "auth.controller.js",
        "user.controller.js",
        "book.controller.js",
        "transaction.controller.js",
        "reservation.controller.js"
    ],
    "routes": [
        "auth.routes.js",
        "users.routes.js",
        "books.routes.js",
        "transactions.routes.js",
        "reservations.routes.js"
    ],
    "middlewares": [
        "auth.middleware.js",
        "role.middleware.js",
        "error.middleware.js"
    ],
    "utils": [
        "validators.js",
        "responses.js",
        "time.utils.js"
    ],
    "jobs": [
        "reservationExpiry.job.js"
    ],
    "": [
        "app.js",
        "server.js"
    ]
}

def create_structure(base="."):
    for folder, files in structure.items():
        folder_path = os.path.join(base, folder)

        # Create directory if not root-level files
        if folder:
            os.makedirs(folder_path, exist_ok=True)

        for file in files:
            file_path = os.path.join(folder_path, file)

            if not os.path.exists(file_path):
                with open(file_path, "w") as f:
                    f.write(f"// Auto-generated file: {file}\n")

                print(f"✅ Created: {file_path}")
            else:
                print(f"⚠️ Already exists: {file_path}")

if __name__ == "__main__":
    print("🚀 Initializing project structure...\n")
    create_structure()
    print("\n🎉 All files and folders created successfully!")
