# Leaf to Leaf

Tu experiencia natural premium - Una aplicación web para gestionar plantas y experimentos botánicos.

## 🚀 Características

- **Autenticación completa** con NextAuth.js
- **Base de datos PostgreSQL** con Prisma ORM
- **Interfaz moderna** con Tailwind CSS
- **Docker** para desarrollo y producción
- **CI/CD** con GitHub Actions
- **Despliegue automático** a VPS

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Base de datos**: PostgreSQL
- **ORM**: Prisma
- **Autenticación**: NextAuth.js
- **Estilos**: Tailwind CSS
- **Contenedores**: Docker & Docker Compose
- **CI/CD**: GitHub Actions

## 📋 Requisitos Previos

- Node.js 18+
- Docker y Docker Compose
- PostgreSQL (para desarrollo local)
- VPS con Ubuntu (para producción)

## 🏃‍♂️ Desarrollo Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/leaf-to-leaf.git
cd leaf-to-leaf
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secreto-super-seguro-aqui-cambialo-en-produccion

# Database
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/leaf_to_leaf"
```

### 4. Configurar la base de datos

```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# (Opcional) Abrir Prisma Studio
npx prisma studio
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🐳 Desarrollo con Docker

### Usar Docker Compose

```bash
# Construir y ejecutar
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

## 🚀 Despliegue en Producción

### 1. Configurar el VPS

Ejecuta el script de configuración en tu VPS:

```bash
# En tu VPS
curl -fsSL https://raw.githubusercontent.com/tu-usuario/leaf-to-leaf/main/scripts/setup-vps.sh | bash
```

### 2. Configurar GitHub Secrets

Ve a tu repositorio en GitHub → Settings → Secrets and variables → Actions y agrega:

- `VPS_HOST`: IP de tu VPS
- `VPS_USERNAME`: usuario del VPS
- `VPS_SSH_KEY`: clave SSH privada
- `VPS_PORT`: puerto SSH (por defecto 22)

### 3. Configurar variables de entorno en el VPS

Edita `/opt/leaf-to-leaf/.env`:

```bash
# NextAuth Configuration
NEXTAUTH_URL=https://tu-dominio.com
NEXTAUTH_SECRET=tu-secreto-super-seguro-de-al-menos-32-caracteres

# Database Configuration
DATABASE_URL=postgresql://postgres:password@postgres:5432/leaf_to_leaf
```

### 4. Despliegue automático

Cada vez que hagas push a la rama `main`, GitHub Actions:

1. Ejecutará las pruebas
2. Construirá la aplicación
3. Desplegará automáticamente al VPS

### 5. Despliegue manual

```bash
# En tu VPS
cd /opt/leaf-to-leaf
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🔧 Variables de Entorno

### Desarrollo Local (.env.local)

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secreto-super-seguro-aqui-cambialo-en-produccion
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/leaf_to_leaf"
```

### Producción (.env en VPS)

```bash
NEXTAUTH_URL=https://tu-dominio.com
NEXTAUTH_SECRET=tu-secreto-super-seguro-de-al-menos-32-caracteres
DATABASE_URL=postgresql://postgres:password@postgres:5432/leaf_to_leaf
```

## 📁 Estructura del Proyecto

```
leaf-to-leaf/
├── src/
│   ├── app/                 # App Router de Next.js
│   │   ├── api/            # API Routes
│   │   ├── login/          # Página de login
│   │   ├── register/       # Página de registro
│   │   └── ...
│   ├── components/         # Componentes React
│   ├── hooks/             # Hooks personalizados
│   ├── lib/               # Utilidades y configuración
│   └── types/             # Tipos TypeScript
├── prisma/                # Esquema y migraciones de BD
├── scripts/               # Scripts de configuración
├── .github/workflows/     # GitHub Actions
├── Dockerfile             # Configuración de Docker
├── docker-compose.yml     # Orquestación de contenedores
└── ...
```

## 🔐 Autenticación

La aplicación usa NextAuth.js con:

- **Provider**: Credentials (usuario/contraseña)
- **Base de datos**: PostgreSQL con Prisma
- **Sesiones**: JWT
- **Hash de contraseñas**: bcryptjs

### Rutas protegidas

Envuelve cualquier página con el componente `ProtectedRoute`:

```tsx
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function MiPaginaProtegida() {
  return (
    <ProtectedRoute>
      <div>Contenido protegido</div>
    </ProtectedRoute>
  )
}
```

## 🧪 Comandos Útiles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Servidor de producción
npm run lint         # Linting

# Base de datos
npx prisma generate  # Generar cliente Prisma
npx prisma migrate dev # Ejecutar migraciones
npx prisma studio    # Interfaz visual de BD
npx prisma db push   # Sincronizar esquema

# Docker
docker-compose up -d # Ejecutar en segundo plano
docker-compose logs -f # Ver logs
docker-compose down  # Detener servicios
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la [documentación](https://nextjs.org/docs)
2. Busca en los [issues](https://github.com/tu-usuario/leaf-to-leaf/issues)
3. Crea un nuevo issue si no encuentras la solución
