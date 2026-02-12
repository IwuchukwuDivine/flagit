import type { H3Event } from 'h3'
import bcrypt from 'bcrypt'
import { setCookie, getCookie, deleteCookie } from 'h3'

export interface SessionUser {
  id: number
  name: string
  email: string
}

const SESSION_COOKIE_NAME = 'speak-up-session'

// Simple encode/decode for session data (in production, use proper encryption/signing)
function encodeSession(user: SessionUser): string {
  return Buffer.from(JSON.stringify(user)).toString('base64')
}

function decodeSession(encoded: string): SessionUser | null {
  try {
    const json = Buffer.from(encoded, 'base64').toString('utf-8')
    return JSON.parse(json)
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function setUserSession(event: H3Event, user: SessionUser) {
  const encoded = encodeSession(user)
  setCookie(event, SESSION_COOKIE_NAME, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function getUserSession(event: H3Event): Promise<SessionUser | null> {
  const encoded = getCookie(event, SESSION_COOKIE_NAME)
  if (!encoded) return null
  return decodeSession(encoded)
}

export async function clearUserSession(event: H3Event) {
  deleteCookie(event, SESSION_COOKIE_NAME, {
    path: '/',
  })
}

export async function requireAuth(event: H3Event): Promise<SessionUser> {
  const user = await getUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required',
    })
  }
  return user
}
