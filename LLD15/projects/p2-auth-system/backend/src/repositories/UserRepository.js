import User from "../models/User.js";

class UserRepository {
    async createUser(userData) {
        return await User.create(userData);
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async findById(id) {
        return await User.findById(id).select("-password");
    }

    async findAll() {
        return await User.find().select("-password");
    }

    async deleteById(id) {
        return await User.findByIdAndDelete(id);
    }
    async updateUser(id, updateData) {
        return await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
    }
}

export default new UserRepository();