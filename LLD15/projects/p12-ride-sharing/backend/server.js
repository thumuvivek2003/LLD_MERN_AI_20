
import express from "express"

export function startServer() {
    const app = express()
    const PORT = 5001

    app.get("/", (req, res) => {
        res.send("p12-ride-sharing backend running")
    })

    app.listen(PORT, () => {
        console.log("p12-ride-sharing running on port", PORT)
    })
}
startServer()
