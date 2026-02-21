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
fi

# Criar arquivo .env se não existir
if [ ! -f "$PROJECT_DIR/.env" ]; then
    echo "⚙️  Criando arquivo .env..."
    cd $PROJECT_DIR
    cat > .env << 'EOF'
# Convex Backend URL
NEXT_PUBLIC_CONVEX_URL=https://sua-url.convex.cloud
EOF
    echo "✅ Arquivo .env criado!"
    echo "⚠️  IMPORTANTE: Edite o arquivo .env com sua URL do Convex"
else
    echo "✅ Arquivo .env já existe"
fi

# Build e start dos containers
echo "🐳 Iniciando containers..."
cd $PROJECT_DIR
docker-compose up -d --build

echo ""
echo "🎉 Setup concluído!"
echo "=================="
echo ""
echo "📊 Status dos containers:"
docker-compose ps
echo ""
echo "🌐 Acesse: http://localhost:3000"
echo ""
echo "📝 Próximos passos:"
echo "1. Edite o arquivo .env com sua URL do Convex"
echo "2. Configure os secrets no GitHub (VPS_HOST, VPS_USER, VPS_SSH_KEY)"
echo "3. Reinicie os containers: docker-compose restart"
echo ""
echo "📖 Documentação completa: DOCKER_DEPLOY.md"
