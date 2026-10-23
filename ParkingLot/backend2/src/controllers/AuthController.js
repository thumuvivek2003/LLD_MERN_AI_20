export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  register = async (req, res, next) => {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json({ id: user._id, email: user.email, role: user.role });
    } catch (e) { next(e); }
  };

  login = async (req, res, next) => {
    try {
      const result = await this.authService.login(req.body);
      res.json(result);
    } catch (e) { next(e); }
  };
}
