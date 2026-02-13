import { z } from "zod";
import prisma from "~/server/utils/prisma";
import { CATEGORY_VALUES } from "~/utils/constants/categories";

const updateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  category: z.enum(CATEGORY_VALUES, { message: "Invalid category" }),
  location: z.string().min(1, "Location is required"),
  imageUrl: z.string().optional().nullable(),
});

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);

  const id = getRouterParam(event, "id");
  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, statusMessage: "Invalid ID" });
  }

  const complaint = await prisma.complaint.findUnique({
    where: { id: Number(id) },
  });

  if (!complaint) {
    throw createError({
      statusCode: 404,
      statusMessage: "Complaint not found",
    });
  }

  if (complaint.userId !== user.id) {
    throw createError({
      statusCode: 403,
      statusMessage: "You can only edit your own complaints",
    });
  }

  try {
    const body = await readBody(event);
    const validated = updateSchema.parse(body);

    const updated = await prisma.complaint.update({
      where: { id: Number(id) },
      data: {
        title: validated.title,
        body: validated.body,
        category: validated.category,
        location: validated.location,
        imageUrl: validated.imageUrl ?? complaint.imageUrl,
      },
    });

    return updated;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation failed",
        data: error.issues,
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
