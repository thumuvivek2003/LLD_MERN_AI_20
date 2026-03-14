import os

# Folder structure
folders = [
    "components",
    "pages",
    "forms",
    "services",
    "hooks",
    "utils",
    "styles"
]

# Files to create
files = {
    "components/Navbar.jsx": "",
    "components/NotesList.jsx": "",
    "components/NoteCard.jsx": "",
    "components/Loader.jsx": "",

    "pages/NotesPage.jsx": "",
    "pages/EditNotePage.jsx": "",

    "forms/CreateNoteForm.jsx": "",
    "forms/EditNoteForm.jsx": "",

    "services/noteService.js": "",

    "hooks/useNotes.js": "",

    "utils/formatDate.js": "",

    "styles/main.css": ""
}

# Create folders
for folder in folders:
    os.makedirs(folder, exist_ok=True)
    print(f"Folder checked/created: {folder}")

# Create files
for file_path, content in files.items():
    if not os.path.exists(file_path):
        with open(file_path, "w") as f:
            f.write(content)
        print(f"File created: {file_path}")
    else:
        print(f"File already exists: {file_path}")

print("\nProject structure setup complete 🚀")
