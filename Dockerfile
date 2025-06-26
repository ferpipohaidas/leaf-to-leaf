# Usar la imagen oficial de Node.js como base
FROM node:18-alpine AS base

# Instalar dependencias solo cuando sea necesario
FROM base AS deps
# Verificar https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine para entender por qué se necesita libc6-compat
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalar dependencias basadas en el gestor de paquetes preferido
COPY package.json package-lock.json* ./
RUN npm ci

# Copiar esquema de Prisma y generar cliente
COPY prisma ./prisma
RUN npx prisma generate

# Reconstruir el código fuente solo cuando sea necesario
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js recopila datos de telemetría completamente anónimos sobre el uso general.
# Obtén más información aquí: https://nextjs.org/telemetry
# Descomenta la siguiente línea para deshabilitar la telemetría durante la compilación.
ENV NEXT_TELEMETRY_DISABLED=1

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN npm run build

# Imagen de producción, copiar todos los archivos y ejecutar next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Descomenta la siguiente línea para deshabilitar la telemetría durante el tiempo de ejecución.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Configurar automáticamente la salida de archivos estáticos para ser aprovechados por CDN si está disponible
# https://nextjs.org/docs/advanced-features/static-html-export#copy-custom-files
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar automáticamente archivos de salida estáticos/standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar script de entrada y hacerlo ejecutable
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["./docker-entrypoint.sh"]