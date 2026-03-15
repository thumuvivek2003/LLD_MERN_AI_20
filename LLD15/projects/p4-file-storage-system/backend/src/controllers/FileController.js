import fileService from "../services/FileService.js";

class FileController {

  async uploadFile(req, res) {

    try {

      const file = req.file;

      const visibility = req.body.visibility || "private";

      const userId = req.user.id || 'vivek';

      const result = await fileService.upload(file, userId, visibility);

      res.status(201).json(result);

    } catch (error) {

      res.status(500).json({ error: error.message });

    }

  }

  async getFiles(req, res) {

    const userId = req.user.id;

    const files = await fileService.getUserFiles(userId);

    res.json(files);

  }

  async deleteFile(req, res) {

    try {

      const userId = req.user.id;

      await fileService.deleteFile(req.params.id, userId);

      res.json({ message: "File deleted" });

    } catch (error) {

      res.status(403).json({ error: error.message });

    }

  }

  async downloadFile(req, res) {

    const userId = req.user.id;

    const file = await fileService.getFile(req.params.id, userId);

    res.download(file.storagePath);

  }

}

export default new FileController();