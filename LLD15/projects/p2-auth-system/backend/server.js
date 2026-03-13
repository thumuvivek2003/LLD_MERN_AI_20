
import express from "express"

export function startServer() {
    const app = express()
    const PORT = 5001

    app.get("/", (req, res) => {
        res.send("p2-auth-system backend running")
    })

    app.listen(PORT, () => {
        console.log("p2-auth-system running on port", PORT)
    })
}
startServer()
