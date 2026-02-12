import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { v as verifyPassword, s as setUserSession } from '../../../_/auth.mjs';
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
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});
const login_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const data = loginSchema.parse(body);
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });
    if (!user) {
      throw createError({
        statusCode: 401,
        message: "Invalid email or password"
      });
    }
    const isValid = await verifyPassword(data.password, user.password);
    if (!isValid) {
      throw createError({
        statusCode: 401,
        message: "Invalid email or password"
      });
    }
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
    throw error;
  }
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
