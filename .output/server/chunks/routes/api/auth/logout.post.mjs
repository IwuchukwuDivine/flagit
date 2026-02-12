import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import { c as clearUserSession } from '../../../_/auth.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'bcrypt';

const logout_post = defineEventHandler(async (event) => {
  await clearUserSession(event);
  return {
    success: true
  };
});

export { logout_post as default };
//# sourceMappingURL=logout.post.mjs.map
