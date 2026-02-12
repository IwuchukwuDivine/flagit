import { d as defineEventHandler, a as readMultipartFormData, c as createError } from '../../nitro/nitro.mjs';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const upload_post = defineEventHandler(async (event) => {
  var _a;
  try {
    const form = await readMultipartFormData(event);
    if (!form || form.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "No file uploaded"
      });
    }
    const fileData = form.find((item) => item.name === "file" || item.filename);
    if (!fileData || !fileData.filename || !fileData.data) {
      throw createError({
        statusCode: 400,
        statusMessage: "No file uploaded"
      });
    }
    const fileExtension = (_a = fileData.filename.split(".").pop()) == null ? void 0 : _a.toLowerCase();
    if (!fileExtension || !ALLOWED_EXTENSIONS.includes(fileExtension)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(", ")}`
      });
    }
    if (fileData.type && !ALLOWED_TYPES.includes(fileData.type)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(", ")}`
      });
    }
    if (fileData.data.length > MAX_FILE_SIZE) {
      throw createError({
        statusCode: 400,
        statusMessage: "File size exceeds 5MB limit"
      });
    }
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    const uniqueFilename = `${randomUUID()}.${fileExtension}`;
    const filePath = join(uploadsDir, uniqueFilename);
    await writeFile(filePath, fileData.data);
    return {
      url: `/uploads/${uniqueFilename}`
    };
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error("Error uploading file:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
      data: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export { upload_post as default };
//# sourceMappingURL=upload.post.mjs.map
