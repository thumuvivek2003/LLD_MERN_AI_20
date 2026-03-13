
import express from "express"

export function startServer() {
    const app = express()
    const PORT = 5001

    app.get("/", (req, res) => {
        res.send("p15-multi-tenant-saas backend running")
    })

    app.listen(PORT, () => {
        console.log("p15-multi-tenant-saas running on port", PORT)
    })
}
startServer()
