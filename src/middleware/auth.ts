import * as jwt from "jsonwebtoken";

export const verify = (token: string) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decoded) {
        throw new Error("Invalid token");
    }
    if (typeof decoded === "string") {
        throw new Error("Invalid token");
    }
    return decoded;
}