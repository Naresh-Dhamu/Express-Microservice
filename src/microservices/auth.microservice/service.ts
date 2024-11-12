import createHttpError from "http-errors";
import User, { IUser } from "./model/user.model";
import bcrypt from "bcryptjs";
export class AuthService {
    constructor() {}
    async create({
        name,
        email,
        password,
    }: {
        name: string;
        email: string;
        password: string;
    }) {
        const user = await User.findOne({ email });
        if (user) {
            throw createHttpError(400, "User Email already exists!");
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        try {
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            const response = await newUser.save();
            return response;
        } catch (err) {
            throw createHttpError(
                500,
                "Failed to store the user in the database",
            );
        }
    }
    async updateById(id: string, payload: Partial<IUser>) {
        try {
            return await User.findOneAndUpdate({ _id: id }, payload);
        } catch (error) {
            const err = createHttpError(500, "Failed to update user by id");
            throw err;
        }
    }
}
