import { NextResponse } from 'next/server';

/**
 * POST /api/auth/logout
 * Faz logout de um usuário
 * 
 * Nota: Com JWT, o logout é feito no cliente deletando o token.
 * Este endpoint serve apenas para confirmar o logout.
 */
export async function POST() {
  return NextResponse.json(
    { message: 'Logout realizado com sucesso' },
    { status: 200 }
  );
}
