export interface ICreateUserPayload {
    name: string;
    email: string;
    password: string;
}
export interface IUserSessionUpdatePayload {
    data: ISessionUpdatePayload;
    user: IUser;
}
