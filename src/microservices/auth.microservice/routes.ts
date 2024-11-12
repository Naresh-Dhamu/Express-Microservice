import { Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import logger from "../../config/logger";
import { rateLimiter } from "./rate.limiter";
import { RequestType } from "types";
import { AuthService } from "./service";
import { JWTHelper } from "./auth.jwt.service";
const router: Router = Router();
const authService = new AuthService();
const jWTHelper = new JWTHelper(authService);
const authController = new AuthController(authService, jWTHelper, logger);
router.post("/register", rateLimiter, (req: Request, res: Response, next) => {
    // Type assertion for the request object to use your custom RequestType
    authController.register(req as RequestType, res, next);
});

export default router;
