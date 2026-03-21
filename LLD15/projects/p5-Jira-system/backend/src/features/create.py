import os

# All your features
features = [
    "user",
    "board",
    "boardMember",
    "role",
    "permission",
    "rolePermission",
    "column",
    "card",
    "cardMember",
    "comment",
    "label",
    "cardLabel"
]

# Files to create inside each feature
files = [
    "model.js",
    "controller.js",
    "repository.js",
    "service.js",
    "route.js"
]

def create_structure():
    base_path = os.getcwd()  # current folder (src/features)

    for feature in features:
        feature_path = os.path.join(base_path, feature)

        # Create feature folder
        os.makedirs(feature_path, exist_ok=True)

        # Create files inside feature folder
        for file in files:
            file_path = os.path.join(feature_path, file)

            # Create empty file if not exists
            if not os.path.exists(file_path):
                open(file_path, 'w').close()

    print("✅ All feature folders and files created successfully!")

if __name__ == "__main__":
    create_structure()