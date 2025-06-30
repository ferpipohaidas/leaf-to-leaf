import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Session } from 'next-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const plant = await prisma.plant.findFirst({
      where: {
        id,
        userId: session.user.id, // Solo plantas del usuario autenticado
      },
    });

    if (!plant) {
      return NextResponse.json({ error: 'Planta no encontrada' }, { status: 404 });
    }

    return NextResponse.json(plant);
  } catch (error) {
    console.error('Error fetching plant:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    // Verificar que la planta existe y pertenece al usuario
    const plant = await prisma.plant.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!plant) {
      return NextResponse.json({ error: 'Planta no encontrada' }, { status: 404 });
    }

    // Eliminar la planta
    await prisma.plant.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: 'Planta eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting plant:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 