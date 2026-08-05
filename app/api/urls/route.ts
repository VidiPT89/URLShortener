import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { generateShortCode, isValidUrl } from '@/app/lib/utils';
import { getAuthHeader } from '@/app/lib/auth';

/**
 * POST /api/urls
 * Cria uma nova URL encurtada
 */
export async function POST(request: NextRequest) {
  try {
    const { originalUrl } = await request.json();

    if (!originalUrl) {
      return NextResponse.json(
        { error: 'URL original é obrigatória' },
        { status: 400 }
      );
    }

    if (!isValidUrl(originalUrl)) {
      return NextResponse.json(
        { error: 'URL inválida' },
        { status: 400 }
      );
    }

    // Tenta obter userId do token (autenticação opcional)
    let userId: string | null = null;
    try {
      const auth = await getAuthHeader(request);
      userId = auth?.userId || null;
    } catch {
      // Continua sem userId se não autenticado
    }

    // Gera código único
    let code = generateShortCode();
    let attempts = 0;
    const maxAttempts = 10;

    // Se o código já existir, tenta gerar outro
    while (attempts < maxAttempts) {
      const existing = await prisma.shortenedUrl.findUnique({
        where: { code },
      });

      if (!existing) break;

      code = generateShortCode();
      attempts++;
    }

    if (attempts === maxAttempts) {
      return NextResponse.json(
        { error: 'Erro ao gerar código único' },
        { status: 500 }
      );
    }

    // Cria a URL encurtada
    const shortenedUrl = await prisma.shortenedUrl.create({
      data: {
        code,
        originalUrl,
        userId: userId || undefined,
      },
    });

    return NextResponse.json(
      {
        id: shortenedUrl.id,
        code: shortenedUrl.code,
        originalUrl: shortenedUrl.originalUrl,
        shortUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/${shortenedUrl.code}`,
        createdAt: shortenedUrl.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar URL encurtada:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/urls
 * Lista URLs encurtadas do usuário autenticado
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthHeader(request);

    if (!auth) {
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      );
    }

    const urls = await prisma.shortenedUrl.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        code: true,
        originalUrl: true,
        clicks: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ urls }, { status: 200 });
  } catch (error) {
    console.error('Erro ao listar URLs:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
