import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Session } from 'next-auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const plants = await prisma.plant.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(plants);
  } catch (error) {
    console.error('Error fetching plants:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { name, genetics, phase, germinationDate, vegetationDate, floweringDate } = body;

    if (!name) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
    }

    if (!phase) {
      return NextResponse.json({ error: 'La fase es requerida' }, { status: 400 });
    }

    // Validaciones específicas por fase
    if (phase === 'germinacion' && !germinationDate) {
      return NextResponse.json({ error: 'La fecha de germinación es requerida para la fase de germinación' }, { status: 400 });
    }

    if (phase === 'vegetacion' && !vegetationDate) {
      return NextResponse.json({ error: 'La fecha de vegetación es requerida para la fase de vegetación' }, { status: 400 });
    }

    if (phase === 'floracion' && !floweringDate) {
      return NextResponse.json({ error: 'La fecha de floración es requerida para la fase de floración' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plantData: any = {
      name,
      phase,
      userId: session.user.id,
    };

    if (genetics) plantData.genetics = genetics;
    if (germinationDate) plantData.germinationDate = new Date(germinationDate);
    if (vegetationDate) plantData.vegetationDate = new Date(vegetationDate);
    if (floweringDate) plantData.floweringDate = new Date(floweringDate);

    const plant = await prisma.plant.create({
      data: plantData,
    });

    return NextResponse.json(plant, { status: 201 });
  } catch (error) {
    console.error('Error creating plant:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 