import prisma from "../db";

type Student = {
    name: string;
    email: string;
    address: string;
    nim: string;
    nisn: string;
    phone: string;
};

export const createStudent = async (student: Student) => {
    const newStudent = await prisma.student.create({
        data: {
            name: student.name,
            email: student.email,
            address: student.address,
            nim: student.nim,
            nisn: student.nisn,
            phone: student.phone,
        },
    });
    return newStudent;
}

export const getStudent = async (nim: string) => {
    const student = await prisma.student.findUnique({
        where: {
            nim,
        },
    });
    return student;
}

export const getAllStudents = async () => {
    const students = await prisma.student.findMany();
    return students;
}

export const updateStudent = async (nim: string, student: Student) => {
    const updatedStudent = await prisma.student.update({
        where: {
            nim,
        },
        data: {
            name: student.name,
            email: student.email,
            address: student.address,
            nisn: student.nisn,
            phone: student.phone,
        },
    });
    return updatedStudent;
}

export const deleteStudent = async (nim: string) => {
    const deletedStudent = await prisma.student.delete({
        where: {
            nim,
        },
    });
    return deletedStudent;
}

export const validateStudentInput = (student: Student) => {
    // phone number have to be numbers, nim have to be numbers, nisn have to be numbers
    // nim have to have 20 characters, nisn have to have 10 characters
    // email have to be email
    // name have to be string
    let errors: any = {};
    if (!student.name.trim()) {
        errors.name = "Name must not be empty";
    }
    if (!student.email.trim()) {
        errors.email = "Email must not be empty";
    } else {
        const regEx =
            // eslint-disable-next-line no-control-regex
            /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (!student.email.match(regEx)) {
            errors.email = "Email must be a valid email address";
        }
    }
    if (!student.address.trim()) {
        errors.address = "Address must not be empty";
    }
    if (!student.nim.trim()) {
        errors.nim = "NIM must not be empty";
    } else {
        const regEx = /^[0-9]{20}$/;
        if (!student.nim.match(regEx)) {
            errors.nim = "NIM must be a valid NIM address";
        }
    }
    if (!student.nisn.trim()) {
        errors.nisn = "NISN must not be empty";
    } else {
        const regEx = /^[0-9]{10}$/;
        if (!student.nisn.match(regEx)) {
            errors.nisn = "NISN must be a valid NISN address";
        }
    }
    if (!student.phone.trim()) {
        errors.phone = "Phone must not be empty";
    } else {
        const regEx = /^[0-9]{10,12}$/;
        if (!student.phone.match(regEx)) {
            errors.phone = "Phone must be a valid phone number";
        }
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1,
    };
};