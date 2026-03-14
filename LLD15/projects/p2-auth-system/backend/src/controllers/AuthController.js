import BlacklistedToken from "../models/BlacklistedToken.js";
import jwt from "jsonwebtoken";
import AuthService from "../services/AuthService.js";

class AuthController {
    async signup(req, res) {
        try {
            const { name, email, password } = req.body;

            const result = await AuthService.signup({
                name,
                email,
                password
            });

            res.status(201).json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const result = await AuthService.login({
                email,
                password
            });

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    async logout(req, res) {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.decode(token);
        await BlacklistedToken.create({
            token,
            expiresAt: new Date(decoded.exp * 1000)
        });
        res.json({
            message: "Logged out"
        });
    }
}

export default new AuthController();