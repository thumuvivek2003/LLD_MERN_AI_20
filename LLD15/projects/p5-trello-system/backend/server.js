import { connectDB } from "../../../shared/database/mongo.js"
import app from './src/app.js';

export function startServer() {
    const PORT = 5001
    connectDB("p5-trello-system")

    app.get("/", (req, res) => {
        res.send("p5-trello-system backend running")
    })

    app.listen(PORT, () => {
        console.log("p5-trello-system running on port", PORT)
    })
}
startServer()



