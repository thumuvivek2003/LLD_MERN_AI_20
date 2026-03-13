
import express from "express"

export function startServer() {
    const app = express()
    const PORT = 5001

    app.get("/", (req, res) => {
        res.send("p4-file-storage-system backend running")
    })

    app.listen(PORT, () => {
        console.log("p4-file-storage-system running on port", PORT)
    })
}
startServer()
