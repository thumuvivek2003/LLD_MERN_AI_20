export const AuthMapper = {
  toAuthDto: (user, token) => ({
    token,
    user: user.toSafeJSON ? user.toSafeJSON() : user,
  }),
};
