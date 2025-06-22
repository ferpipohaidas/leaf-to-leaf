#!/bin/bash

# Script de despliegue SSH para leaf-to-leaf
# Uso: ./deploy.sh [usuario@servidor] [puerto]

set -e

# Configuración por defecto
SSH_USER_HOST=${1:-"usuario@tu-servidor.com"}
SSH_PORT=${2:-22}
PROJECT_DIR="leaf-to-leaf"
DOCKER_IMAGE="tu-usuario/leaf-to-leaf:latest"

echo "🚀 Iniciando despliegue a $SSH_USER_HOST:$SSH_PORT"

# Verificar que docker-compose.yml existe localmente
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml no encontrado"
    exit 1
fi

echo "📦 Construyendo imagen Docker localmente..."
docker build -t $DOCKER_IMAGE .

echo "📤 Subiendo imagen a Docker Hub..."
docker push $DOCKER_IMAGE

echo "📋 Copiando archivos de configuración al servidor..."
scp -P $SSH_PORT docker-compose.yml $SSH_USER_HOST:~/$PROJECT_DIR/

echo "🔧 Desplegando en el servidor..."
ssh -p $SSH_PORT $SSH_USER_HOST << EOF
    cd ~/$PROJECT_DIR
    
    echo "⬇️ Descargando imagen actualizada..."
    docker pull $DOCKER_IMAGE
    
    echo "🛑 Deteniendo contenedores existentes..."
    docker-compose down || true
    
    echo "🚀 Iniciando nuevos contenedores..."
    docker-compose up -d
    
    echo "🧹 Limpiando imágenes no utilizadas..."
    docker image prune -f
    
    echo "✅ Despliegue completado!"
    docker-compose ps
EOF

echo "🎉 ¡Despliegue exitoso!" 