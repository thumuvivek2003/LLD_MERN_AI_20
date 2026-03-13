
import express from "express"

export function startServer() {
    const app = express()
    const PORT = 5001

    app.get("/", (req, res) => {
        res.send("p7-chat-system backend running")
    })

    app.listen(PORT, () => {
        console.log("p7-chat-system running on port", PORT)
    })
}
startServer()
