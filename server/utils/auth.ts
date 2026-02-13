import type { H3Event } from 'h3'
import bcrypt from 'bcrypt'
import { createHmac } from 'crypto'
import { setCookie, getCookie, deleteCookie } from 'h3'

export interface SessionUser {
  id: number
  name: string
  email: string
}

const SESSION_COOKIE_NAME = 'flagit-session'

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET environment variable is required in production')
  }
  return secret || 'dev-fallback-secret-not-for-production'
}

function sign(payload: string): string {
  const hmac = createHmac('sha256', getSessionSecret())
  return hmac.update(payload).digest('hex')
}

function encodeSession(user: SessionUser): string {
  const payload = Buffer.from(JSON.stringify(user)).toString('base64')
  const signature = sign(payload)
  return `${payload}.${signature}`
}

function decodeSession(encoded: string): SessionUser | null {
  try {
    const [payload, signature] = encoded.split('.')
    if (!payload || !signature) return null

    // Verify signature
    const expected = sign(payload)
    if (signature !== expected) return null

    const json = Buffer.from(payload, 'base64').toString('utf-8')
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
