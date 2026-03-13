
import express from "express"

export function startServer() {
    const app = express()
    const PORT = 5001

    app.get("/", (req, res) => {
        res.send("p9-parking-lot backend running")
    })

    app.listen(PORT, () => {
        console.log("p9-parking-lot running on port", PORT)
    })
}
startServer()
