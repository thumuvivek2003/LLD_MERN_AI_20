import UserService from "../services/UserService.js";

class UserController {

    async getProfile(req, res) {
        try {
            const user = await UserService.getProfile(req.user);
            res.json(user);
        } catch (err) {
            res.status(500)
                .json({
                    message: err.message
                });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.json(users);
        } catch (err) {
            res.status(500)
                .json({
                    message: err.message
                });
        }
    }

    async updateUser(req, res) {
        try {

            const {
                id
            } = req.params;

            const updatedUser = await UserService.updateUser(
                id,
                req.body
            );

            res.json({
                success: true,
                data: updatedUser
            });

        } catch (error) {

            res.status(400)
                .json({
                    success: false,
                    message: error.message
                });

        }
    }


    async deleteUser(req, res) {

        try {

            const {
                id
            } = req.params;

            await UserService.deleteUser(id);

            res.json({
                success: true,
                message: "User deleted"
            });

        } catch (error) {

            res.status(400)
                .json({
                    success: false,
                    message: error.message
                });

        }

    }

    async createUser(req, res) {
        try {
            const user = await UserService.createUser(req.body);
            res.status(201).json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }


}

export default new UserController;