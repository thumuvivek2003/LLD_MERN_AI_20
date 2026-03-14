
import { connectDB } from "../../../shared/database/mongo.js"
import app from './src/app.js';

export function startServer() {
    const PORT = 5001
    connectDB("p2-auth-system")

    app.get("/", (req, res) => {
        res.send("p2-auth-system backend running")
    })

    app.listen(PORT, () => {
        console.log("p2-auth-system running on port", PORT)
    })
}
startServer()
