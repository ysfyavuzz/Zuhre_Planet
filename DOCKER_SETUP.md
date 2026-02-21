# Docker Setup Guide for Zuhre Planet

## Local Development

### Prerequisites
- Docker & Docker Desktop installed
- `.env` file with required variables

### Run with hot reload
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

This uses the `develop.watch` feature to rebuild on code changes to `src/` and `api/` directories.

### Run production build locally
```bash
docker compose up
```

### Environment Variables
Copy `.env.example` to `.env` and update:
```env
DB_USER=nexus_admin
DB_PASSWORD=your_secure_password
DB_NAME=zuhre_prod
JWT_SECRET=your_jwt_secret
```

### Database Migrations
```bash
docker compose exec api npm run db:migrate
docker compose exec api npm run db:seed
```

### View logs
```bash
docker compose logs -f api
docker compose logs -f db
docker compose logs -f nginx
```

### Stop services
```bash
docker compose down
```

## GitHub Actions CI/CD

### What the workflow does:
1. **Build Job**: 
   - Installs dependencies
   - Lints code (ESLint)
   - Runs tests (Vitest)
   - Builds application
   - Builds Docker image (no push)

2. **Push Registry Job** (only on `main` branch):
   - Logs into Docker Hub
   - Builds and pushes image with tags: `latest` and `git-sha`
   - Uses build cache for faster builds

3. **Deploy Job** (placeholder):
   - Configure for your hosting provider

### Required Secrets in GitHub
Add these secrets to your repository settings (Settings > Secrets and variables > Actions):
```
DOCKER_USERNAME    - Your Docker Hub username
DOCKER_PASSWORD    - Your Docker Hub access token
```

### Docker Hub Setup
1. Create account at https://hub.docker.com
2. Create repository: `your-username/zuhre-planet`
3. Generate access token: Account Settings > Security > Access Tokens
4. Add to GitHub Secrets as above

## Production Deployment

### Option 1: Docker Swarm
```bash
# On production server
docker swarm init
docker stack deploy -c docker-compose.yml zuhre
```

### Option 2: Kubernetes
```bash
kubectl create namespace zuhre
kubectl apply -f k8s-manifest.yaml -n zuhre
```

### Option 3: Traditional VPS
```bash
# On VPS
git clone <your-repo>
cd Zuhre_Planet
docker compose -f docker-compose.yml up -d
```

## Troubleshooting

### Container fails to start
```bash
docker compose logs api
```

### Database connection issues
- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running: `docker compose ps`

### Port already in use
```bash
# Change ports in docker-compose.yml or use:
docker compose up -d --remove-orphans
```

### Clear everything and rebuild
```bash
docker compose down -v
docker system prune -a
docker compose up --build
```

## Performance Tips

- Use Docker BuildKit for faster builds: `DOCKER_BUILDKIT=1 docker build .`
- Cache npm layers: modify Dockerfile to install deps before COPY .
- Use `.dockerignore` to exclude unnecessary files (already added)
- In GitHub Actions, the workflow uses layer caching via `buildx`
