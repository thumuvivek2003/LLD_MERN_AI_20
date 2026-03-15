import { connectDB } from "../../../shared/database/mongo.js"
import app from './src/app.js';

export function startServer() {
    const PORT = 5001
    connectDB("p3-url-shortener")

    app.get("/", (req, res) => {
        res.send("p3-url-shortener backend running")
    })

    app.listen(PORT, () => {
        console.log("p3-url-shortener running on port", PORT)
    })
}
startServer()

