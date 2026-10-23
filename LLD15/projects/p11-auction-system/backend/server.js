
import express from "express"

export function startServer() {
    const app = express()
    const PORT = 5001

    app.get("/", (req, res) => {
        res.send("p11-auction-system backend running")
    })

    app.listen(PORT, () => {
        console.log("p11-auction-system running on port", PORT)
    })
}
startServer()
