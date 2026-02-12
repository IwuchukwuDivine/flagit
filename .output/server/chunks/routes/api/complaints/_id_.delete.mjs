import { d as defineEventHandler, g as getRouterParam, c as createError } from '../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../_/auth.mjs';
import { p as prisma } from '../../../_/prisma.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event);
    const id = getRouterParam(event, "id");
    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid ID"
      });
    }
    const complaint = await prisma.complaint.findUnique({
      where: {
        id: Number(id)
      }
    });
    if (!complaint) {
      throw createError({
        statusCode: 404,
        statusMessage: "Complaint not found"
      });
    }
    if (complaint.userId !== user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: "You can only delete your own complaints"
      });
    }
    await prisma.complaint.delete({
      where: {
        id: Number(id)
      }
    });
    return {
      success: true,
      message: "Complaint deleted successfully"
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error"
    });
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
