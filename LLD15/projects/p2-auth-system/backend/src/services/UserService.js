import UserRepository from "../repositories/UserRepository.js";
import { hashPassword } from "../utils/hash.js";

class UserService {

    async getProfile(user) {
        return user;
    }

    async getAllUsers() {
        return await UserRepository.findAll();
    }

    async createUser(data) {

        if (!data.password) {
            throw new Error("Password required");
        }

        const hashedPassword = await hashPassword(data.password);
        const user = await UserRepository.createUser({
            ...data,
            password: hashedPassword
        });
        return user;
    }

    async updateUser(id, data) {
        if (data.password) {
            data.password = await hashPassword(data.password);
        }

        return await UserRepository.updateUser(id, data);
    }

    async deleteUser(id) {
        return await UserRepository.deleteById(id);
    }


}

export default new UserService;