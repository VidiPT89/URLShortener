import { NextRequest } from 'next/server';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export interface DecodedToken {
  userId: string;
  email: string;
}

/**
 * Gera um token JWT
 */
export function generateToken(userId: string, email: string): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET não definido');
  }

  return jwt.sign({ userId, email }, secret, {
    expiresIn: '30d',
  });
}

/**
 * Verifica e decodifica um token JWT
 */
export function verifyToken(token: string): DecodedToken | null {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET não definido');
  }

  try {
    const decoded = jwt.verify(token, secret) as DecodedToken;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Extrai o token do header Authorization
 */
export function getTokenFromHeader(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

/**
 * Obtém informações do usuário autenticado do header
 */
export async function getAuthHeader(
  request: NextRequest
): Promise<DecodedToken | null> {
  const token = getTokenFromHeader(request);

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

/**
 * Faz hash de uma senha
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compara uma senha com seu hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
