import { d as defineEventHandler, g as getRouterParam, c as createError } from '../../../nitro/nitro.mjs';
import { p as prisma } from '../../../_/prisma.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';
import '@prisma/adapter-libsql';
import '@libsql/client';

const _id__get = defineEventHandler(async (event) => {
  try {
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
    return complaint;
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

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
