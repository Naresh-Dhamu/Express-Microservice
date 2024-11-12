import { config } from "dotenv";
import path from "path";

config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || "dev"}`),
});
const {
    PORT,
    NODE_ENV,
    DB_CONNECTION,
    TEST_ENV,
    JWT_PRIVATE_KEY,
    JWT_ACCESS_TOKEN_EXPIRY,
    JWT_ISSUER,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_TOKEN_EXPIRY,
    JWT_ACCESS_TOKEN_EXPIRY_TIME,
} = process.env;
export const Config = {
    PORT,
    NODE_ENV,
    DB_CONNECTION,
    TEST_ENV,
    JWT_PRIVATE_KEY,
    JWT_ACCESS_TOKEN_EXPIRY,
    JWT_ISSUER,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_TOKEN_EXPIRY,
    JWT_ACCESS_TOKEN_EXPIRY_TIME,
};
