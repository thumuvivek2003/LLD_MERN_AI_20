import {
    createUserRepo,
    findUserByEmail,
    updatePasswordRepo,
} from "./repository.js";
import jwt from "jsonwebtoken";

export const createUserService = async (data) => {
    const existing = await findUserByEmail(data.email);
    if (existing) throw { status: 400, message: "User already exists" };

    return createUserRepo(data);
};

export const loginService = async ({ email, password }) => {
    const user = await findUserByEmail(email);
    if (!user || user.password !== password)
        throw { status: 401, message: "Invalid credentials" };
    const token = jwt.sign(
        {
            userId: user._id,
            roleId: user.roleId, // if exists
        },
        "SECRET",
        { expiresIn: "1d" }
    );

    return { token, user };
};

export const resetPasswordService = async (userId, newPassword) => {
    return updatePasswordRepo(userId, newPassword);
};