class PermissionService {

  canAccess(file, userId) {

    if (file.visibility === "public") return true;

    if (file.ownerId === userId) return true;

    return false;
  }

  canDelete(file, userId) {
    return file.ownerId === userId;
  }

}

export default new PermissionService();