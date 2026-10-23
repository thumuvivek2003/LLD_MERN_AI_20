
import express from "express"

export function startServer() {
    const app = express()
    const PORT = 5001

    app.get("/", (req, res) => {
        res.send("p8-rate-limiter backend running")
    })

    app.listen(PORT, () => {
        console.log("p8-rate-limiter running on port", PORT)
    })
}
startServer()
