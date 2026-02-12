import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

var _a;
const prismaClientSingleton = () => {
  const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
  const url = dbUrl.startsWith("file:") ? dbUrl : `file:${dbUrl}`;
  console.log("[Prisma] Creating client with URL:", url, "from env:", process.env.DATABASE_URL);
  const libsql = createClient({ url });
  const adapter = new PrismaLibSql(libsql);
  return new PrismaClient({ adapter });
};
const prisma = (_a = globalThis.prismaGlobal) != null ? _a : prismaClientSingleton();

export { prisma as p };
//# sourceMappingURL=prisma.mjs.map
