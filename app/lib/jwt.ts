import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh'

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables')
}

export interface JWTPayload {
  userId: string
  email: string
  role: 'user' | 'admin'
  iat?: number
  exp?: number
}

export interface RefreshTokenPayload {
  userId: string
  tokenVersion: number
  iat?: number
  exp?: number
}

// Generate access token (24 hours for development)
export function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h',
  })
}

// Generate refresh token (7 days)
export function generateRefreshToken(payload: Omit<RefreshTokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  })
}

// Verify access token
export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

// Verify refresh token
export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload
  } catch (error) {
    return null
  }
}

// Extract token from request headers or cookies
export function extractTokenFromRequest(request: NextRequest): string | null {
  // First try to get from cookies (preferred method)
  const cookieToken = request.cookies.get('accessToken')?.value
  if (cookieToken) {
    return cookieToken
  }
  
  // Fallback to Authorization header for backward compatibility
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  return null
}

// Get current user from request
export function getCurrentUserFromRequest(request: NextRequest): JWTPayload | null {
  const token = extractTokenFromRequest(request)
  if (!token) return null
  
  return verifyAccessToken(token)
}

// Middleware helper to verify authentication
export function requireAuth(request: NextRequest): JWTPayload | null {
  const user = getCurrentUserFromRequest(request)
  if (!user) {
    return null
  }
  return user
}

// Middleware helper to verify admin role
export function requireAdmin(request: NextRequest): JWTPayload | null {
  const user = requireAuth(request)
  if (!user || user.role !== 'admin') {
    return null
  }
  return user
}

// Generate token pair (access + refresh)
export function generateTokenPair(user: { userId: string; email: string; role: 'user' | 'admin' }, tokenVersion: number = 0) {
  const accessToken = generateAccessToken({
    userId: user.userId,
    email: user.email,
    role: user.role,
  })

  const refreshToken = generateRefreshToken({
    userId: user.userId,
    tokenVersion,
  })

  return {
    accessToken,
    refreshToken,
  }
}
