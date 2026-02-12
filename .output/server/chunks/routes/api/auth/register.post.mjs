import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { h as hashPassword, s as setUserSession } from '../../../_/auth.mjs';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'bcrypt';

const prisma = new PrismaClient();
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});
const register_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const data = registerSchema.parse(body);
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });
    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: "Email already registered"
      });
    }
    const hashedPassword = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });
    await setUserSession(event, {
      id: user.id,
      name: user.name,
      email: user.email
    });
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: "Validation error"
      });
    }
    console.error("Registration error:", error);
    throw error;
  }
});

export { register_post as default };
//# sourceMappingURL=register.post.mjs.map
