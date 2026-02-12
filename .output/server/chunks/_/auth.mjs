import { s as setCookie, a as deleteCookie, c as createError, b as getCookie } from '../nitro/nitro.mjs';
import bcrypt from 'bcrypt';

const SESSION_COOKIE_NAME = "speak-up-session";
function encodeSession(user) {
  return Buffer.from(JSON.stringify(user)).toString("base64");
}
function decodeSession(encoded) {
  try {
    const json = Buffer.from(encoded, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
async function setUserSession(event, user) {
  const encoded = encodeSession(user);
  setCookie(event, SESSION_COOKIE_NAME, encoded, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    // 7 days
    path: "/"
  });
}
async function getUserSession(event) {
  const encoded = getCookie(event, SESSION_COOKIE_NAME);
  if (!encoded) return null;
  return decodeSession(encoded);
}
async function clearUserSession(event) {
  deleteCookie(event, SESSION_COOKIE_NAME, {
    path: "/"
  });
}
async function requireAuth(event) {
  const user = await getUserSession(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Authentication required"
    });
  }
  return user;
}

export { clearUserSession as c, hashPassword as h, requireAuth as r, setUserSession as s, verifyPassword as v };
//# sourceMappingURL=auth.mjs.map
