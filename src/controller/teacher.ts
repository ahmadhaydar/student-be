import prisma from "../db";
import bcrypt from "bcrypt";

const saltRounds = 10;

type Teacher = {
    username: string;
    password: string;
};

export const createTeacher = async (teacher: Teacher) => {
    const hashedPassword = await bcrypt.hash(teacher.password, saltRounds);
    const newTeacher = await prisma.teacher.create({
        data: {
            username: teacher.username,
            password: hashedPassword,
        },
    });
    return newTeacher;
}

export const getTeacher = async (username: string) => {
    const teacher = await prisma.teacher.findUnique({
        where: {
            username,
        },
    });
    return teacher;
}

export const loginTeacher = async (teacher: Teacher) => {
    const foundTeacher = await getTeacher(teacher.username);
    if (!foundTeacher) {
        throw new Error("Teacher not found");
    }
    const match = await bcrypt.compare(teacher.password, foundTeacher.password);
    if (!match) {
        throw new Error("Wrong password");
    }
    return foundTeacher;
}