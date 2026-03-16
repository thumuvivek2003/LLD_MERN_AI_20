import mongoose from "mongoose"
export async function connectDB(dbName) {
    const URI = `mongodb://127.0.0.1:27017/${dbName}`
    try {
        await mongoose.connect(URI)
        console.log(`MongoDB connected → ${dbName}`)
    } catch (error) {
        console.error("MongoDB connection error:")
        process.exit(1)
    }

}
