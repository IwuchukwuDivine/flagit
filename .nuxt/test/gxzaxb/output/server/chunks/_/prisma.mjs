import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

var _a;
const prismaClientSingleton = () => {
  const libsql = createClient({
    url: process.env.DATABASE_URL || "file:./dev.db"
  });
  const adapter = new PrismaLibSql(libsql);
  return new PrismaClient({ adapter });
};
const prisma = (_a = globalThis.prismaGlobal) != null ? _a : prismaClientSingleton();

export { prisma as p };
//# sourceMappingURL=prisma.mjs.map
