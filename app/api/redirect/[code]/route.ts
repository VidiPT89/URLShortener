import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

/**
 * GET /api/redirect/[code]
 * Redireciona para a URL original e incrementa o contador de cliques
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    if (!code) {
      return NextResponse.json(
        { error: 'Código não fornecido' },
        { status: 400 }
      );
    }

    // Busca a URL encurtada
    const shortenedUrl = await prisma.shortenedUrl.findUnique({
      where: { code },
    });

    if (!shortenedUrl) {
      return NextResponse.json(
        { error: 'URL não encontrada' },
        { status: 404 }
      );
    }

    // Incrementa o contador de cliques
    await prisma.shortenedUrl.update({
      where: { id: shortenedUrl.id },
      data: { clicks: { increment: 1 } },
    });

    // Redireciona para a URL original
    return NextResponse.redirect(shortenedUrl.originalUrl, {
      status: 301,
    });
  } catch (error) {
    console.error('Erro ao processar redirecionamento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
