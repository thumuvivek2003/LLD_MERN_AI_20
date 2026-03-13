
import express from "express"

export function startServer() {
    const app = express()
    const PORT = 5001

    app.get("/", (req, res) => {
        res.send("p6-notification-system backend running")
    })

    app.listen(PORT, () => {
        console.log("p6-notification-system running on port", PORT)
    })
}
startServer()
