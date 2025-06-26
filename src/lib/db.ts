import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      createdAt: true,
    },
  })
}

export async function createUser(username: string, password: string) {
  // Verificar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({
    where: { username },
  })

  if (existingUser) {
    throw new Error('User already exists')
  }

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, 12)

  // Crear el usuario
  return await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      createdAt: true,
    },
  })
} 