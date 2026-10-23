import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    fileName: String,
    fileType: String,
    fileSize: Number,
    storagePath: String,
    ownerId: String,
    visibility: {
      type: String,
      enum: ["private", "public", "shared"],
      default: "private"
    }
  },
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);