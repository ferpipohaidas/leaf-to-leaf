#!/bin/sh

# Esperar a que la base de datos esté lista
echo "Esperando a que la base de datos esté lista..."
npx prisma db push --accept-data-loss

# Generar el cliente de Prisma
echo "Generando cliente de Prisma..."
npx prisma generate

# Ejecutar migraciones si existen
echo "Ejecutando migraciones..."
npx prisma migrate deploy

# Iniciar la aplicación
echo "Iniciando la aplicación..."
exec node server.js