class StorageProvider {

  upload(file) {
    throw new Error("upload() not implemented");
  }

  delete(path) {
    throw new Error("delete() not implemented");
  }

  download(path) {
    throw new Error("download() not implemented");
  }

}

export default StorageProvider;