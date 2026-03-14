
import { connectDB } from "../../../shared/database/mongo.js"
import app from './src/app.js';

export function startServer() {
    const PORT = 5001
    connectDB("p1-notes-system")

    app.get("/", (req, res) => {
        res.send("p1-notes-system backend running")
    })

    app.listen(PORT, () => {
        console.log("p1-notes-system running on port", PORT)
    })
}
startServer()
