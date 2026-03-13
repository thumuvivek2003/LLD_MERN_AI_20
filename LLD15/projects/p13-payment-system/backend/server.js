
import express from "express"

export function startServer() {
    const app = express()
    const PORT = 5001

    app.get("/", (req, res) => {
        res.send("p13-payment-system backend running")
    })

    app.listen(PORT, () => {
        console.log("p13-payment-system running on port", PORT)
    })
}
startServer()
