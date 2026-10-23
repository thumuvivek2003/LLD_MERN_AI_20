import { connectDB } from "../../../shared/database/mongo.js"
import app from './src/app.js';

export function startServer() {
    const PORT = 5001
    connectDB("p4-file-storage-system")

    app.get("/", (req, res) => {
        res.send("p4-file-storage-system backend running")
    })

    app.listen(PORT, () => {
        console.log("p4-file-storage-system running on port", PORT)
    })
}
startServer()
