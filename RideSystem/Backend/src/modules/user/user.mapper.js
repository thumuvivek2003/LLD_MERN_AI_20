export const UserMapper = {
  toDto: (user) => (user?.toSafeJSON ? user.toSafeJSON() : user),
  toList: (users = []) => users.map((u) => (u.toSafeJSON ? u.toSafeJSON() : u)),
};
