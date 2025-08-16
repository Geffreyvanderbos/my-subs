# Docker Deployment for My-YT

This guide explains how to deploy My-YT using Docker for your homelab setup.

## Quick Start

### 1. Build and Run
```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### 2. Access the Application
Open your browser and navigate to: `http://localhost:8080`

## Production Deployment

For production use, use the optimized compose file:

```bash
# Build and start with production settings
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Docker Commands

### Building
```bash
# Build the image
docker build -t my-yt .

# Build with no cache (if you encounter issues)
docker build --no-cache -t my-yt .
```

### Running
```bash
# Run container directly
docker run -d -p 8080:80 --name my-yt my-yt

# Run with custom port
docker run -d -p 3000:80 --name my-yt my-yt
```

### Management
```bash
# View running containers
docker ps

# View logs
docker logs my-yt

# Stop container
docker stop my-yt

# Remove container
docker rm my-yt

# Remove image
docker rmi my-yt
```

## Configuration

### Port Mapping
- Container port: 80 (internal)
- Host port: 8080 (external)
- Change the host port in `docker-compose.yml` if needed

### Environment Variables
- `NODE_ENV=production` - Sets production mode

### Resource Limits (Production)
- Memory: 128M-256M
- CPU: 0.25-0.5 cores

## Performance Features

- **Multi-stage build** - Minimal final image size
- **Nginx Alpine** - Lightweight web server
- **Gzip compression** - Reduced bandwidth usage
- **Asset caching** - Static files cached for 1 year
- **SPA routing** - Proper handling of client-side routes

## Security Features

- **Security headers** - XSS protection, content type validation
- **Read-only filesystem** - Container security
- **No new privileges** - Prevents privilege escalation
- **Resource limits** - Prevents resource exhaustion

## Health Checks

The container includes a health check endpoint at `/health` that returns "healthy" when the service is running properly.

## Troubleshooting

### Build Issues
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Port Conflicts
If port 8080 is already in use, change it in `docker-compose.yml`:
```yaml
ports:
  - "8081:80"  # Use port 8081 instead
```

### Permission Issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Run with sudo if needed
sudo docker-compose up -d
```

## Monitoring

### View Resource Usage
```bash
# Container stats
docker stats my-yt

# System resources
docker system df
```

### Logs
```bash
# Follow logs in real-time
docker-compose logs -f

# View last 100 lines
docker-compose logs --tail=100
```

## Backup and Updates

### Backup
```bash
# Export container
docker export my-yt > my-yt-backup.tar

# Save image
docker save my-yt > my-yt-image.tar
```

### Updates
```bash
# Pull latest code and rebuild
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Network Configuration

The container uses a bridge network for isolation. If you need to connect to other services:

```yaml
# Add to docker-compose.yml
networks:
  - my-yt-network
  - external-network

networks:
  external-network:
    external: true
```

## Reverse Proxy Setup

For production use behind a reverse proxy (nginx, Traefik, etc.):

```nginx
location / {
    proxy_pass http://localhost:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Support

If you encounter issues:
1. Check the logs: `docker-compose logs -f`
2. Verify the container is running: `docker ps`
3. Check resource usage: `docker stats my-yt`
4. Ensure ports are not conflicting
