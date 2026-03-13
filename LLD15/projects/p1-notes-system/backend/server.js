
import express from "express"

export function startServer() {
    const app = express()
    const PORT = 5001

    app.get("/", (req, res) => {
        res.send("p1-notes-system backend running")
    })

    app.listen(PORT, () => {
        console.log("p1-notes-system running on port", PORT)
    })
}
startServer()
