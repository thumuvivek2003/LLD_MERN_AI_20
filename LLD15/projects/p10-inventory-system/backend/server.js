
import express from "express"

export function startServer() {
    const app = express()
    const PORT = 5001

    app.get("/", (req, res) => {
        res.send("p10-inventory-system backend running")
    })

    app.listen(PORT, () => {
        console.log("p10-inventory-system running on port", PORT)
    })
}
startServer()
