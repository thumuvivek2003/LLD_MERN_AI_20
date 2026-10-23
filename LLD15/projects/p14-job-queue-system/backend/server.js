
import express from "express"

export function startServer() {
    const app = express()
    const PORT = 5001

    app.get("/", (req, res) => {
        res.send("p14-job-queue-system backend running")
    })

    app.listen(PORT, () => {
        console.log("p14-job-queue-system running on port", PORT)
    })
}
startServer()
