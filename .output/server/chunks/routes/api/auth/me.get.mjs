import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../_/auth.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'bcrypt';

const me_get = defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  return {
    user
  };
});

export { me_get as default };
//# sourceMappingURL=me.get.mjs.map
