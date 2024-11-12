import { Request } from "express";
declare interface RequestType extends Request {
    userIPAddress?: string; // Optional IP address
    user: IUserType; // User information, not optional
    headers: IRequestHeaders; // Custom headers
    cookies: IRequestTypeCookie["cookies"]; // Cookies
    userInfo?: IUserInfoType; // Optional user info
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    files?: any;
    auth?: {
        id: string;
        iat: number;
    };
}
