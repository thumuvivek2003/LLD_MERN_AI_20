import os

base_dir = "src"

structure = {
    "api": ["urlApi.js"],
    "pages": ["HomePage.jsx", "AnalyticsPage.jsx"],
    "components": ["URLForm.jsx", "ShortURLResult.jsx", "AnalyticsCard.jsx"],
    "hooks": ["useShortenURL.js"],
    "services": ["urlService.js"],
    "utils": ["copyToClipboard.js"],
    "constants": ["apiRoutes.js"],
    "": ["App.jsx", "main.jsx"]   # root files inside src
}

os.makedirs(base_dir, exist_ok=True)

for folder, files in structure.items():

    folder_path = os.path.join(base_dir, folder) if folder else base_dir
    os.makedirs(folder_path, exist_ok=True)

    for file in files:
        file_path = os.path.join(folder_path, file)

        if not os.path.exists(file_path):
            with open(file_path, "w") as f:
                f.write(f"// {file}\n")
                f.write("// Auto-generated file\n")

print("Frontend src structure created successfully 🚀")
