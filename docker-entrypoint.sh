#!/bin/sh

# Esperar a que la base de datos esté lista
echo "Esperando a que la base de datos esté lista..."

# Ejecutar migraciones si existen
echo "Ejecutando migraciones..."
npx prisma migrate deploy || echo "Migraciones no ejecutadas o no necesarias"

# Iniciar la aplicación Next.js
echo "Iniciando la aplicación..."
node server.js