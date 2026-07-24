import { userApi } from '../api/user.api.js';
import { initials } from '../utils/formatter.js';

function decorate(u) {
  if (!u) return u;
  return {
    ...u,
    initials: initials(u.name),
    color: u.avatarColor || '#6366f1',
  };
}

export const UserService = {
  async list() {
    const users = await userApi.getUsers();
    return (users || []).map(decorate);
  },
  async get(id) {
    return decorate(await userApi.getUser(id));
  },
};

export default UserService;
