import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import Joi from "joi";
import { ICreateUserPayload } from ".";
import { Logger } from "winston";
import { JwtPayload } from "jsonwebtoken";
import { RequestType } from "types";
import { AuthService } from "./service";
import { JWTHelper } from "./auth.jwt.service";
import { v4 as uuidV4 } from "uuid";
import moment from "moment";
import { Config } from "../../config/config";
import { userSessionUpdate } from "./utils/session.update.user.util";

export class AuthController {
    constructor(
        private authService: AuthService,
        private jwtHelper: JWTHelper,
        private logger: Logger,
    ) {}

    async register(req: RequestType, res: Response, next: NextFunction) {
        // Validate user input
        const schema = Joi.object<ICreateUserPayload>({
            name: Joi.string().min(3).max(50).required().trim(),
            email: Joi.string().email().required().trim().lowercase().max(50),
            password: Joi.string().min(8).max(50).required(),
        });
        const { error, value } = schema.validate(req.body);
        if (error) return next(new createHttpError.Conflict(error.message));

        try {
            // Log the registration attempt
            this.logger.debug("Registering a new user", {
                name: value.name,
                email: value.email,
                password: "********",
            });

            // Create a new user
            const user = await this.authService.create(value);
            if (!user) {
                return next(
                    new createHttpError.BadRequest(
                        "Something went wrong during registration!",
                    ),
                );
            }

            // Create JWT tokens
            const payload: JwtPayload = { id: String(user._id) };
            const accessToken = this.jwtHelper.signAccessTokenV1(payload);
            const refreshToken = this.jwtHelper.signRefreshTokenV1(payload);

            // Update user session
            const updateSession = userSessionUpdate({
                data: {
                    id: uuidV4(),
                    expiresAt: moment()
                        .add(Config.JWT_ACCESS_TOKEN_EXPIRY_TIME, "minutes")
                        .toDate(),
                    refreshToken: refreshToken as string,
                    userLastActivity: new Date(),
                },
                user,
            });

            if (!updateSession) {
                return next(
                    new createHttpError.InternalServerError(
                        "Failed to update session!",
                    ),
                );
            }

            // Update user in the database with the new session
            const updateUser = await this.authService.updateById(user._id, {
                sessions: updateSession,
            });
            if (!updateUser) {
                return next(
                    new createHttpError.InternalServerError(
                        "Failed to update user!",
                    ),
                );
            }

            // Set cookies for access and refresh tokens
            res.cookie("accessToken", accessToken, {
                sameSite: "strict",
                maxAge: 60 * 60 * 1000, // 1 hour in ms
                httpOnly: true,
            });
            res.cookie("refreshToken", refreshToken, {
                sameSite: "strict",
                maxAge: 60 * 60 * 1000, // 1 hour in ms
                httpOnly: true,
            });

            // Return success response
            return res.status(201).json({
                id: user._id,
            });
        } catch (error) {
            return next(error);
        }
    }
}
