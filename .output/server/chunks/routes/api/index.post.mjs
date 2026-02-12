import { d as defineEventHandler, r as readBody, c as createError } from '../../nitro/nitro.mjs';
import { r as requireAuth } from '../../_/auth.mjs';
import { z } from 'zod';
import { p as prisma } from '../../_/prisma.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'bcrypt';
import '@prisma/client';

const complaintSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  category: z.enum(["roads", "water", "electricity", "sanitation"], {
    errorMap: () => ({ message: "Invalid category" })
  }),
  location: z.string().min(1, "Location is required"),
  imageUrl: z.string().optional()
});
const index_post = defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event);
    const body = await readBody(event);
    const validated = complaintSchema.parse(body);
    const complaint = await prisma.complaint.create({
      data: {
        ...validated,
        authorName: user.name,
        userId: user.id,
        status: "pending"
      }
    });
    return complaint;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation failed",
        data: error.errors
      });
    }
    console.error("Error creating complaint:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
      data: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
