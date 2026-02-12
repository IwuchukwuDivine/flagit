import { d as defineEventHandler, c as createError } from '../../nitro/nitro.mjs';
import { p as prisma } from '../../_/prisma.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';

const index_get = defineEventHandler(async () => {
  try {
    const complaints = await prisma.complaint.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
    return complaints;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error"
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
