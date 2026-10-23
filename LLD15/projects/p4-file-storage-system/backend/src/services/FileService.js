import fileRepository from "../repositories/FileRepository.js";
import storageProvider from "../storage/LocalStorageProvider.js";
import permissionService from "./PermissionService.js";

class FileService {

  async upload(file, userId, visibility) {
    console.log('Incomeing File',file);

    const storagePath = storageProvider.upload(file);

    const metadata = {
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      storagePath,
      ownerId: userId,
      visibility
    };

    return await fileRepository.save(metadata);
  }

  async getUserFiles(userId) {
    return await fileRepository.findByOwner(userId);
  }

  async deleteFile(fileId, userId) {

    const file = await fileRepository.findById(fileId);

    if (!permissionService.canDelete(file, userId)) {
      throw new Error("Unauthorized");
    }

    storageProvider.delete(file.storagePath);

    return await fileRepository.delete(fileId);
  }

  async getFile(fileId, userId) {

    const file = await fileRepository.findById(fileId);

    if (!permissionService.canAccess(file, userId)) {
      throw new Error("Unauthorized");
    }

    return file;
  }

}

export default new FileService();