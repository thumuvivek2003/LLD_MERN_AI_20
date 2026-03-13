
import express from "express"

export function startServer() {
    const app = express()
    const PORT = 5001

    app.get("/", (req, res) => {
        res.send("p3-url-shortener backend running")
    })

    app.listen(PORT, () => {
        console.log("p3-url-shortener running on port", PORT)
    })
}
startServer()
