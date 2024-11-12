import mongoose, { Schema } from "mongoose";

export interface IUserModal extends Document {
    name?: IUser["name"];
    email?: IUser["email"];
    password?: IUser["password"];
    avatar?: IUser["avatar"];
    sessions: IUser["sessions"];
}

const UserSchema: Schema = new Schema<IUserModal>(
    {
        name: { type: String },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            index: true,
            sparse: true,
        },
        password: { type: String },
        avatar: { type: String, default: null },
        sessions: { type: Array, default: {} } as unknown as ISessions,
    },
    { versionKey: false, timestamps: true },
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;

export const userProjectionFields: IUserProjectionFields = [
    "name",
    "email",
    "password",
    "avatar",
    "sessions",
    "createdAt",
    "updatedAt",
];
export type IUserProjectionFields = [
    "name",
    "email",
    "password",
    "avatar",
    "sessions",
    "createdAt",
    "updatedAt",
];

export interface ISessions {
    id: string;
    expiresAt: Date;
    token: string;
    refreshToken: string | null;
    lastActivity?: Date;
}
export interface IUser {
    _id: string;
    name?: string;
    email?: string;
    password?: string;
    avatar?: string;
    sessions: ISessions[];
}
