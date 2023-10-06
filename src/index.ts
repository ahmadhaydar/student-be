import fastify from "fastify";
import { createTeacher, getTeacher } from "./controller/teacher";
import { login } from "./controller/auth";
import { verify } from "./middleware/auth";
import { getAllStudents, createStudent, validateStudentInput } from "./controller/student";

const server = fastify();

server.get("/ping", async (request, reply) => {
  return "pong\n";
});

server.post(
  "/teacher/register",
  {
    schema: {
      body: {
        type: "object",
        properties: {
          username: { type: "string" },
          password: { type: "string" },
        },
        required: ["username", "password"],
      },
      response: {
        200: {
          type: "object",
          properties: {
            jwt: { type: "string" },
            teacher: {
              type: "object",
              properties: {
                username: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
  async (request, reply) => {
    const { username, password } = request.body as any;
    const teacher = await createTeacher({ username, password });
    const { token } = await login(username, password);
    return reply.code(200).send({ jwt: token, teacher });
  }
);

server.post(
  "/teacher/login",
  {
    schema: {
      body: {
        type: "object",
        properties: {
          username: { type: "string" },
          password: { type: "string" },
        },
        required: ["username", "password"],
      },
      response: {
        200: {
          type: "object",
          properties: {
            jwt: { type: "string" },
          },
        },
      },
    },
  },
  async (request, reply) => {
    const { username, password } = request.body as any;
    try {
      const { token } = await login(username, password);
      return reply.code(200).send({ jwt: token });
    } catch (error: any) {
      return reply.code(401).send({ message: error.message });
    }
  }
);

server.get(
  "/teacher/me",
  {
    schema: {
      headers: {
        type: "object",
        properties: {
          authorization: { type: "string" },
        },
        required: ["authorization"],
      },
      response: {
        200: {
          type: "object",
          properties: {
            teacher: {
              type: "object",
              properties: {
                username: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
  async (request, reply) => {
    const token = request.headers.authorization?.replace("Bearer ", "");
    try {
      const decoded = await verify(token as string);
      const teacher = await getTeacher(decoded.username);
      return reply.code(200).send({ teacher: { username: teacher?.username } });
    } catch (error: any) {
      return reply.code(401).send({ message: error.message });
    }
  }
);

// /student get, post, put, delete, but verify as middleware
server.get(
  "/students",
  {
    schema: {
      headers: {
        type: "object",
        properties: {
          authorization: { type: "string" },
        },
        required: ["authorization"],
      },
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              email: { type: "string" },
              address: { type: "string" },
              nim: { type: "string" },
              nisn: { type: "string" },
              phone: { type: "string" },
            },
          },
        },
      },
    },
  },
  async (request, reply) => {
    const token = request.headers.authorization?.replace("Bearer ", "");
    try {
      const decoded = await verify(token as string);
      const students = await getAllStudents();
      return reply.code(200).send({ students });
    } catch (error: any) {
      return reply.code(401).send({ message: error.message });
    }
  }
);

server.post(
  "/student",
  {
    schema: {
      headers: {
        type: "object",
        properties: {
          authorization: { type: "string" },
        },
        required: ["authorization"],
      },
      body: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          address: { type: "string" },
          nim: { type: "string" },
          nisn: { type: "string" },
          phone: { type: "string" },
        },
        required: ["name", "email", "address", "nim", "nisn", "phone"],
      },
      response: {
        200: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            address: { type: "string" },
            nim: { type: "string" },
            nisn: { type: "string" },
            phone: { type: "string" },
          },
        },
      },
    },
  },
  async (request, reply) => {
    const token = request.headers.authorization?.replace("Bearer ", "");
    try {
      const decoded = await verify(token as string);
      const validation = validateStudentInput(request.body as any);
      if (validation.valid === false) {
        return reply.code(401).send({ 
            message: "Invalid input",
            errors: validation.errors,
        });
      }
      const student = await createStudent(request.body as any);
      return reply.code(200).send(student);
    } catch (error: any) {
      return reply.code(401).send({ message: error.message });
    }
  }
);

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
