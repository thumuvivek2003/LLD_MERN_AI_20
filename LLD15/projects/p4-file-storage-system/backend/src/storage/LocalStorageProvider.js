import fs from "fs";
import path from "path";
import StorageProvider from "./StorageProvider.js";

class LocalStorageProvider extends StorageProvider {

    // upload(file) {
    //     console.log(file);
    //     const uploadPath = path.join("uploads",'temp.html');
    //     console.log("Upload path:", uploadPath);
    //     return uploadPath;
    // }
    upload(file) {

        const uploadDir = path.join(process.cwd(), "uploads");

        // create uploads folder if not exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        const filePath = path.join(uploadDir, "dummy12.txt");

        fs.writeFileSync(filePath, "Node upload test successful");

        console.log("File written at:", filePath);

        return filePath;
    }
    delete(filePath) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

}

export default new LocalStorageProvider();