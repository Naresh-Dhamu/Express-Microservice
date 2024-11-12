import createHttpError from "http-errors";
import { IUserSessionUpdatePayload } from "..";

export const userSessionUpdate = (payload: IUserSessionUpdatePayload) => {
    try {
        const { id, expiresAt, refreshToken, userLastActivity } = payload.data;
        const { user } = payload;

        if (user) {
            user.session = {
                id,
                expiresAt,
                refreshToken,
                lastActivity: userLastActivity || new Date(),
            };

            return user.session;
        }
    } catch (error) {
        throw new createHttpError.InternalServerError(error);
    }
};
