#!/bin/bash

# Mission Control - Quick Setup Script
# Execute este script na sua VPS

set -e

echo "🚀 Mission Control - Setup Script"
echo "=================================="

# Verificar se é root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Por favor, execute como root ou use sudo"
  exit 1
fi

# Perguntar URL do Convex
echo ""
echo "📝 Configuração do Backend Convex"
echo "--------------------------------"
read -p "Digite a URL do seu backend Convex (ex: https://terrific-meadowlark-70.convex.cloud): " CONVEX_URL

if [ -z "$CONVEX_URL" ]; then
    echo "❌ URL do Convex é obrigatória!"
    exit 1
fi

echo "✅ URL configurada: $CONVEX_URL"
echo ""

# Instalar Docker se não estiver instalado
if ! command -v docker &> /dev/null; then
    echo "📦 Instalando Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo "✅ Docker instalado!"
else
    echo "✅ Docker já está instalado"
fi

# Instalar Docker Compose se não estiver instalado
if ! command -v docker-compose &> /dev/null; then
    echo "📦 Instalando Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose instalado!"
else
    echo "✅ Docker Compose já está instalado"
fi

# Criar diretório do projeto
PROJECT_DIR="/opt/mission-control"
if [ ! -d "$PROJECT_DIR" ]; then
    echo "📁 Criando diretório do projeto..."
    mkdir -p $PROJECT_DIR
    echo "✅ Diretório criado em $PROJECT_DIR"
else
    echo "✅ Diretório já existe em $PROJECT_DIR"
fi

# Clonar repositório se não existir
if [ ! -d "$PROJECT_DIR/.git" ]; then
    echo "📥 Clonando repositório..."
    cd $PROJECT_DIR
    git clone https://github.com/pesxus/mission-control.git .
    echo "✅ Repositório clonado!"
else
    echo "✅ Repositório já existe"
    cd $PROJECT_DIR
    git pull origin main
    echo "✅ Repositório atualizado"
fi

# Criar arquivo .env
echo "⚙️  Criando arquivo .env..."
cat > .env << EOF
# Convex Backend URL
NEXT_PUBLIC_CONVEX_URL=$CONVEX_URL
EOF
echo "✅ Arquivo .env criado com sua URL!"

# Build e start dos containers
echo "🐳 Iniciando containers..."
docker-compose up -d --build

echo ""
echo "🎉 Setup concluído!"
echo "=================="
echo ""
echo "📊 Status dos containers:"
docker-compose ps
echo ""
echo "🌐 Acesse: http://$(curl -s ifconfig.me):3200"
echo "   Ou: http://localhost:3200"
echo ""
echo "📝 Variável configurada:"
echo "   NEXT_PUBLIC_CONVEX_URL=$CONVEX_URL"
echo ""
echo "🔄 Para atualizar no futuro:"
echo "   cd /opt/mission-control"
echo "   git pull origin main"
echo "   docker-compose pull"
echo "   docker-compose up -d"
echo ""
echo "📖 Logs:"
echo "   docker-compose logs -f mission-control"
echo ""
echo "📖 Documentação completa: DOCKER_DEPLOY.md"
