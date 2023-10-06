import * as jwt from "jsonwebtoken";
import {
    loginTeacher,
    getTeacher,
} from "./teacher";

export const login = async (username: string, password: string) => {
    const teacher = await loginTeacher({
        username,
        password,
    });
    const token = jwt.sign({ username }, process.env.JWT_SECRET as string, {
        expiresIn: "1h",
    });
    return {
        token,
        teacher,
    };
}

export const refresh = async (token: string) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decoded) {
        throw new Error("Invalid token");
    }
    if (typeof decoded === "string") {
        throw new Error("Invalid token");
    }
    const teacher = await getTeacher(decoded.username);
    const newToken = jwt.sign({ username: teacher?.username }, process.env.JWT_SECRET as string, {
        expiresIn: "1h",
    });
    return {
        token: newToken,
        teacher,
    };
}