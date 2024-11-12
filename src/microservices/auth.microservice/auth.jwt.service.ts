import { JwtPayload, sign } from "jsonwebtoken";
import { AuthService } from "./service";
import { Config } from "../../config/config";
import createHttpError from "http-errors";

export class JWTHelper {
    constructor(private authService: AuthService) {}

    signAccessTokenV1 = (payload: JwtPayload): string => {
        // Ensure the private key is set and formatted correctly
        if (!Config.JWT_PRIVATE_KEY) {
            throw new createHttpError.InternalServerError(
                "JWT_PRIVATE_KEY is not set.",
            );
        }

        let privateKey: string | Buffer;
        try {
            // Format the private key to handle multiline structure if needed
            const privateKeyEnv = `${Config.JWT_PRIVATE_KEY}`;
            privateKey = privateKeyEnv.replace(/\\n/g, "\n");
        } catch (error) {
            const err = new createHttpError.InternalServerError(
                "Error while reading private key!",
            );
            throw err;
        }

        const accessToken = sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: Config.JWT_ACCESS_TOKEN_EXPIRY || "1h",
            issuer: Config.JWT_ISSUER || "unknown.issuer",
        });
        return accessToken;
    };

    signRefreshTokenV1 = (payload: JwtPayload): string => {
        // Ensure the refresh token secret is set
        if (!Config.JWT_REFRESH_SECRET) {
            throw new createHttpError.InternalServerError(
                "JWT_REFRESH_SECRET is not set.",
            );
        }

        const refreshToken = sign(
            payload,
            Config.JWT_REFRESH_SECRET as string,
            {
                algorithm: "HS256",
                expiresIn: Config.JWT_REFRESH_TOKEN_EXPIRY || "1y",
                issuer: Config.JWT_ISSUER || "unknown.issuer",
            },
        );
        return refreshToken;
    };
}
