import os

structure = {
    "": [
        "main.jsx",
        "App.jsx",
        "index.html"
    ],

    "layouts": [
        "MainLayout.jsx",
        "AdminLayout.jsx"
    ],

    "components": [
        "Navbar.jsx",
        "Sidebar.jsx",
        "BookCard.jsx",
        "UserCard.jsx",
        "ReservationCard.jsx",
        "TransactionCard.jsx",
        "Loader.jsx"
    ],

    "pages/auth": [
        "Login.jsx",
        "Register.jsx"
    ],

    "pages/member": [
        "SearchBooks.jsx",
        "ViewBookStatus.jsx",
        "ReserveBook.jsx",
        "CancelReservation.jsx",
        "BorrowHistory.jsx"
    ],

    "pages/librarian": [
        "IssueBook.jsx",
        "ReturnBook.jsx",
        "TrackBorrowHistory.jsx",
        "UpdateBookInfo.jsx"
    ],

    "pages/admin": [
        "AddBook.jsx",
        "UpdateBook.jsx",
        "DeleteBook.jsx",
        "ManageUsers.jsx",
        "Dashboard.jsx",
        "Reports.jsx"
    ],

    "pages/common": [
        "Home.jsx",
        "NotFound.jsx"
    ],

    "services": [
        "api.js",
        "auth.service.js",
        "book.service.js",
        "user.service.js",
        "reservation.service.js",
        "transaction.service.js"
    ],

    "context": [
        "AuthContext.jsx",
        "RoleContext.jsx"
    ],

    "hooks": [
        "useAuth.js",
        "useRole.js",
        "useFetch.js",
        "useForm.js"
    ],

    "utils": [
        "validators.js",
        "format.js"
    ],

    "styles": [
        "global.css",
        "layout.css",
        "components.css"
    ],

    "router": [
        "MemberRoutes.jsx",
        "LibrarianRoutes.jsx",
        "AdminRoutes.jsx"
    ]
}

def create_structure(base="."):
    for folder, files in structure.items():
        folder_path = os.path.join(base, folder)

        # Create folder if not root-level
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
    print("🚀 Initializing frontend structure...\n")
    create_structure()
    print("\n🎉 Frontend structure created successfully!")
