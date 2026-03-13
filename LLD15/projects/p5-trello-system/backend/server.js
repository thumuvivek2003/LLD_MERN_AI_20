
import express from "express"

export function startServer() {
    const app = express()
    const PORT = 5001

    app.get("/", (req, res) => {
        res.send("p5-trello-system backend running")
    })

    app.listen(PORT, () => {
        console.log("p5-trello-system running on port", PORT)
    })
}
startServer()
