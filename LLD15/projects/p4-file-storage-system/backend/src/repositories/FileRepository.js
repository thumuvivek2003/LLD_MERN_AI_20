import File from "../models/FileModel.js";

class FileRepository {
  
  async save(metadata) {
    return await File.create(metadata);
  }

  async findById(fileId) {
    return await File.findById(fileId);
  }

  async findByOwner(ownerId) {
    return await File.find({ ownerId });
  }

  async delete(fileId) {
    return await File.findByIdAndDelete(fileId);
  }
}

export default new FileRepository();