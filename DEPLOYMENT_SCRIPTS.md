# Quick Deployment Scripts

## Deploy Backend to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Navigate to backend
cd backend

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up

# Set environment variables (replace with your values)
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your_super_secret_key_here_minimum_32_characters
railway variables set JWT_EXPIRE=7d
railway variables set FRONTEND_URL=https://your-frontend-url.vercel.app

# Railway will automatically provide PostgreSQL connection variables
# Check your Railway dashboard for database connection details

# Get your backend URL
railway domain
```

## Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Create .env file with backend URL
echo "VITE_API_URL=https://your-backend-url.railway.app/api" > .env

# Build locally to test
npm run build

# Deploy to Vercel
vercel

# Follow prompts:
# - Set project name
# - Select production

# Add environment variable in Vercel dashboard:
# VITE_API_URL = https://your-backend-url.railway.app/api
```

## Deploy to Render (Free Alternative)

### Backend on Render

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** ecommerce-backend
   - **Root Directory:** backend
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Add environment variables:
   ```
   NODE_ENV=production
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=7d
   FRONTEND_URL=https://your-frontend.netlify.app
   ```
6. Create PostgreSQL database:
   - Click "New +" → "PostgreSQL"
   - Copy connection details to environment variables

### Frontend on Netlify

1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub repository
4. Configure:
   - **Base directory:** frontend
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
5. Add environment variable:
   - `VITE_API_URL=https://your-backend.onrender.com/api`
6. Deploy!

## Deploy to DigitalOcean (Full Control)

```bash
# SSH into your droplet
ssh root@your_droplet_ip

# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# Install PostgreSQL
apt-get install postgresql postgresql-contrib -y

# Install Nginx
apt-get install nginx -y

# Install PM2
npm install -g pm2

# Clone your repository
cd /var/www
git clone https://github.com/yourusername/your-repo.git ecommerce
cd ecommerce

# Setup database
sudo -u postgres psql
CREATE DATABASE ecommerce_production;
CREATE USER ecom_user WITH PASSWORD 'strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE ecommerce_production TO ecom_user;
\q

# Setup backend
cd backend
npm install
nano .env
# Add your environment variables
npm run migrate
npm run seed

# Start backend with PM2
pm2 start server.js --name ecommerce-api
pm2 save
pm2 startup

# Build frontend
cd ../frontend
npm install
npm run build

# Copy frontend build to nginx
cp -r dist/* /var/www/html/

# Configure Nginx
nano /etc/nginx/sites-available/ecommerce
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Install SSL with Let's Encrypt
apt-get install certbot python3-certbot-nginx -y
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Setup firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

## Deploy with Docker

```bash
# Build backend image
cd backend
docker build -t ecommerce-backend .

# Run backend container
docker run -d \
  --name ecommerce-api \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e POSTGRES_HOST=your_db_host \
  -e POSTGRES_USER=your_db_user \
  -e POSTGRES_PASSWORD=your_db_password \
  -e POSTGRES_DB=ecommerce \
  -e JWT_SECRET=your_secret \
  ecommerce-backend

# Or use docker-compose (see docker-compose.yml)
docker-compose up -d
```

## Update Deployment

### Railway
```bash
cd backend
git add .
git commit -m "Update"
railway up
```

### Vercel
```bash
cd frontend
git add .
git commit -m "Update"
vercel --prod
```

### DigitalOcean
```bash
ssh root@your_droplet_ip
cd /var/www/ecommerce
git pull
cd backend
npm install
pm2 restart ecommerce-api
cd ../frontend
npm install
npm run build
cp -r dist/* /var/www/html/
```

## Rollback Deployment

### Railway
```bash
railway rollback
```

### Vercel
Go to Vercel dashboard → Deployments → Click previous deployment → Promote to Production

### DigitalOcean
```bash
ssh root@your_droplet_ip
cd /var/www/ecommerce
git checkout previous_commit_hash
# Then rebuild and restart services
```
