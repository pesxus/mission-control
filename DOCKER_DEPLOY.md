# Mission Control - Docker Deployment

Deploy automatizado do Mission Control usando Docker e GitHub Actions.

## 🚀 Setup Rápido

### 1. Pré-requisitos na VPS

```bash
# Instalar Docker e Docker Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Criar diretório do projeto
sudo mkdir -p /opt/mission-control
sudo chown $USER:$USER /opt/mission-control

# Clonar repositório
cd /opt/mission-control
git clone https://github.com/pesxus/mission-control.git .
```

### 2. Configurar Variáveis de Ambiente

```bash
# Criar arquivo .env
cd /opt/mission-control
cat > .env << EOF
NEXT_PUBLIC_CONVEX_URL=https://sua-url.convex.cloud
EOF
```

### 3. Configurar Secrets no GitHub

Ir em: https://github.com/pesxus/mission-control/settings/secrets/actions

Adicionar:
- `VPS_HOST` - IP da sua VPS (ex: 192.168.1.100)
- `VPS_USER` - Usuário SSH (ex: root ou ubuntu)
- `VPS_SSH_KEY` - Chave SSH privada (conteúdo do arquivo ~/.ssh/id_rsa)

#### Como criar chave SSH (se não tiver):

```bash
# Na sua máquina local
ssh-keygen -t rsa -b 4096 -C "github-actions"

# Copiar chave pública para VPS
ssh-copy-id -i ~/.ssh/id_rsa.pub usuario@seu-ip-vps

# Ver conteúdo da chave privada (para adicionar no GitHub)
cat ~/.ssh/id_rsa
```

### 4. Deploy Automático

Agora toda vez que você fizer `git push` no branch `main`:

1. ✅ GitHub Actions builda a imagem Docker
2. ✅ Faz push para GitHub Container Registry (ghcr.io)
3. ✅ SSH na VPS e atualiza o container automaticamente

## 🔧 Comandos Úteis

### Verificar status dos containers
```bash
docker-compose ps
```

### Ver logs
```bash
docker-compose logs -f mission-control
```

### Restart manual
```bash
docker-compose restart
```

### Parar tudo
```bash
docker-compose down
```

### Atualizar manualmente
```bash
git pull origin main
docker-compose pull
docker-compose up -d
```

## 🏗️ Arquitetura

```
┌─────────────────┐
│   GitHub Push   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Actions  │
│  Build & Push   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ghcr.io (Docker │
│   Registry)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   VPS Deploy    │
│  via SSH        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Docker Container│
│ Mission Control │
│   (Port 3200)   │
└─────────────────┘
```

## 🔍 Troubleshooting

### Container não inicia
```bash
docker-compose logs mission-control
```

### Verificar se porta está aberta
```bash
curl http://localhost:3200
```

### Verificar redes Docker
```bash
docker network ls
docker network inspect mission-control-network
```

### Problemas de permissão
```bash
sudo chown -R $USER:$USER /opt/mission-control
```

## 📊 Monitoramento

### Health Check
O container tem health check automático a cada 30 segundos.

### Verificar health status
```bash
docker inspect --format='{{.State.Health.Status}}' mission-control
```

### Watchtower (Updates Automáticos)
O container `watchtower` está configurado para verificar atualizações a cada 5 minutos.

Para ver logs do Watchtower:
```bash
docker-compose logs -f watchtower
```

## 🔒 Segurança

### Firewall (UFW)
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3200/tcp  # Mission Control (ou use reverse proxy)
sudo ufw enable
```

### Reverse Proxy com Nginx (Recomendado)
Para usar com domínio e HTTPS:

```nginx
server {
    listen 80;
    server_name mission.seudominio.com;

    location / {
        proxy_pass http://localhost:3200;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🚀 Performance

### Otimizações incluídas:
- ✅ Multi-stage Docker build (imagem menor)
- ✅ Standalone output (build otimizado)
- ✅ Health checks automáticos
- ✅ Watchtower para updates automáticos
- ✅ Docker cache via GitHub Actions

### Tamanho da imagem:
~150MB (comprimida)

## 📝 Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `NEXT_PUBLIC_CONVEX_URL` | URL do backend Convex | Sim |

## 🎯 Próximos Passos

1. ✅ Setup inicial (esta seção)
2. ⬜ Configurar domínio (DNS)
3. ⬜ Configurar HTTPS (Let's Encrypt)
4. ⬜ Configurar backup automático
5. ⬜ Monitoramento (opcional: Grafana, Prometheus)

## 💡 Dicas

- Use `docker-compose logs -f --tail=100` para ver últimas 100 linhas
- Use `docker stats` para ver uso de recursos em tempo real
- Use `docker system prune -a` para limpar tudo (cuidado!)

---

**Tudo pronto para deploy! 🚀**
