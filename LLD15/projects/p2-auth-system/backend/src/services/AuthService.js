import { userDTO } from "../dto/UserDTO.js";
import UserRepository from "../repositories/UserRepository.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

class AuthService {
    async signup({ name, email, password }) {
        const existingUser = await UserRepository.findByEmail(email);

        if (existingUser) {
            throw new Error("Email already exists");
        }

        const hashedPassword = await hashPassword(password);

        const user = await UserRepository.createUser({
            name,
            email,
            password: hashedPassword
        });

        const token = generateToken({
            id: user._id,
            role: user.role
        });

        return { user: userDTO(user), token };
    }

    async login({ email, password }) {
        const user = await UserRepository.findByEmail(email);

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        const token = generateToken({
            id: user._id,
            role: user.role
        });

        return { user: userDTO(user), token };
    }
}

export default new AuthService();