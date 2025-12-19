# E-Commerce Website - Complete Deployment Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Directory Structure](#directory-structure)
4. [Environment Setup](#environment-setup)
5. [Database Setup](#database-setup)
6. [Backend Deployment](#backend-deployment)
7. [Frontend Deployment](#frontend-deployment)
8. [Deployment Options](#deployment-options)
9. [Security Checklist](#security-checklist)
10. [Post-Deployment](#post-deployment)
11. [Troubleshooting](#troubleshooting)

---

## 📦 Project Overview

**Tech Stack:**
- **Frontend:** React 19 + Vite + TailwindCSS 4
- **Backend:** Node.js + Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Image Handling:** Base64 encoding or Cloudinary (optional)

**Ports:**
- Backend: 5000
- Frontend: 5173 (dev) / Static hosting (production)

---

## ✅ Prerequisites

Before deploying, ensure you have:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
3. **Git** - For version control
4. **Domain Name** (optional but recommended)
5. **SSL Certificate** (Let's Encrypt is free)

**Accounts you'll need:**
- **Hosting Service** (choose one):
  - [Railway.app](https://railway.app) (Recommended - Easy, includes PostgreSQL)
  - [Render.com](https://render.com) (Free tier available)
  - [Vercel](https://vercel.com) (Best for frontend)
  - [DigitalOcean](https://www.digitalocean.com) (More control)
  - [AWS](https://aws.amazon.com) (Enterprise level)
  - [Heroku](https://www.heroku.com) (Classic option)

- **Database Hosting** (if separate from backend):
  - [Neon](https://neon.tech) (Free PostgreSQL)
  - [Supabase](https://supabase.com) (Free PostgreSQL + features)
  - [ElephantSQL](https://www.elephantsql.com) (Free PostgreSQL)

---

## 📁 Directory Structure

```
E-Commerce_Website/
│
├── backend/                          # Backend API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # PostgreSQL connection
│   │   ├── controllers/
│   │   │   ├── authController.js    # Login, Register, Profile
│   │   │   ├── productController.js # CRUD for products
│   │   │   ├── cartController.js    # Cart management
│   │   │   ├── orderController.js   # Order processing
│   │   │   ├── categoryController.js # Category management
│   │   │   └── addressController.js # User addresses
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT authentication
│   │   │   ├── error.js             # Error handling
│   │   │   ├── validation.js        # Input validation
│   │   │   └── rateLimiter.js       # Rate limiting
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   └── addressRoutes.js
│   │   ├── utils/
│   │   │   ├── jwt.js               # JWT utilities
│   │   │   └── helpers.js           # Helper functions
│   │   └── database/
│   │       ├── migrate.js           # Create database tables
│   │       └── seed.js              # Populate sample data
│   ├── server.js                    # Express server entry point
│   ├── package.json
│   ├── .env                         # Environment variables (DO NOT COMMIT)
│   └── .env.example                 # Template for .env
│
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── assets/                  # Images, icons
│   │   ├── components/              # React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductItem.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── admin/               # Admin components
│   │   │       ├── AdminLayout.jsx
│   │   │       ├── AdminSidebar.jsx
│   │   │       └── ImageCropModal.jsx
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Collection.jsx
│   │   │   ├── Product.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── PlaceOrder.jsx
│   │   │   ├── Orders.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminProducts.jsx
│   │   │       └── AdminOrders.jsx
│   │   ├── context/
│   │   │   ├── ShopContext.jsx      # Global state
│   │   │   └── AuthContext.jsx      # Authentication state
│   │   ├── services/
│   │   │   └── api.js               # API calls to backend
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # React entry point
│   ├── public/                      # Static assets
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js               # Vite configuration
│   ├── .env                         # Environment variables (DO NOT COMMIT)
│   └── .env.example                 # Template for .env
│
├── DEPLOYMENT_GUIDE.md              # This file
├── README.md                        # Project documentation
└── .gitignore                       # Git ignore rules
```

---

## 🔐 Environment Setup

### Backend Environment Variables (.env)

Create `backend/.env` file:

```env
# Database Configuration
POSTGRES_HOST=your-database-host.com
POSTGRES_PORT=5432
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=ecommerce_production

# Server Configuration
PORT=5000
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long_random_string
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=https://your-frontend-domain.com

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**⚠️ IMPORTANT:**
- Never commit `.env` files to Git
- Use strong random strings for JWT_SECRET (min 32 characters)
- Update FRONTEND_URL with your actual frontend domain

### Frontend Environment Variables (.env)

Create `frontend/.env` file:

```env
VITE_API_URL=https://your-backend-api.com/api
```

---

## 🗄️ Database Setup

### Option 1: Railway (Recommended - Easiest)

1. **Sign up at [Railway.app](https://railway.app)**
2. **Create New Project** → "Provision PostgreSQL"
3. **Get Connection Details:**
   - Click on PostgreSQL service
   - Go to "Variables" tab
   - Copy: `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
4. **Update your backend `.env`** with these credentials

### Option 2: Neon (Free PostgreSQL)

1. **Sign up at [Neon.tech](https://neon.tech)**
2. **Create a new project**
3. **Copy connection string:**
   ```
   postgresql://user:password@host/database?sslmode=require
   ```
4. **Update backend database.js** to use connection string:
   ```javascript
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: { rejectUnauthorized: false }
   });
   ```

### Option 3: Self-Hosted PostgreSQL

1. **Install PostgreSQL** on your server
2. **Create database:**
   ```sql
   CREATE DATABASE ecommerce_production;
   CREATE USER ecom_user WITH PASSWORD 'strong_password';
   GRANT ALL PRIVILEGES ON DATABASE ecommerce_production TO ecom_user;
   ```
3. **Configure firewall** to allow connections on port 5432
4. **Update `postgresql.conf`** and `pg_hba.conf` for remote access

### Run Database Migrations

After setting up the database, run migrations:

```bash
cd backend
npm install
npm run migrate  # Creates all tables
npm run seed     # Populates sample data (optional)
```

**This creates:**
- Admin user: `admin123@test.com` / `admin@123`
- Sample categories and products (if using seed)

---

## 🚀 Backend Deployment

### Option 1: Railway (Recommended)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Initialize project:**
   ```bash
   cd backend
   railway init
   ```

4. **Add environment variables:**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set JWT_SECRET=your_secret_key
   railway variables set FRONTEND_URL=https://your-frontend.com
   # Add all other variables from .env
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

6. **Get your backend URL:**
   ```bash
   railway domain
   ```

### Option 2: Render

1. **Go to [Render.com](https://render.com)**
2. **New** → **Web Service**
3. **Connect your GitHub repo**
4. **Configure:**
   - **Name:** ecommerce-backend
   - **Root Directory:** backend
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. **Add Environment Variables** (from .env)
6. **Create Web Service**
7. **Note your backend URL:** `https://your-app.onrender.com`

### Option 3: DigitalOcean Droplet

1. **Create Ubuntu Droplet** ($6/month)
2. **SSH into server:**
   ```bash
   ssh root@your_droplet_ip
   ```

3. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   apt-get install -y nodejs
   ```

4. **Install PostgreSQL:**
   ```bash
   apt-get install postgresql postgresql-contrib
   ```

5. **Clone your repo:**
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo/backend
   npm install
   ```

6. **Setup .env file:**
   ```bash
   nano .env
   # Paste your environment variables
   ```

7. **Install PM2 (Process Manager):**
   ```bash
   npm install -g pm2
   pm2 start server.js --name ecommerce-backend
   pm2 save
   pm2 startup
   ```

8. **Setup Nginx reverse proxy:**
   ```bash
   apt-get install nginx
   nano /etc/nginx/sites-available/ecommerce
   ```

   Add:
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

9. **Setup SSL with Let's Encrypt:**
   ```bash
   apt-get install certbot python3-certbot-nginx
   certbot --nginx -d api.yourdomain.com
   ```

### Option 4: Vercel (Serverless)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Create `vercel.json` in backend:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/server.js"
       }
     ]
   }
   ```

3. **Deploy:**
   ```bash
   cd backend
   vercel
   ```

4. **Add environment variables** in Vercel dashboard

---

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended for React)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Update frontend/.env:**
   ```env
   VITE_API_URL=https://your-backend-url.com/api
   ```

3. **Deploy:**
   ```bash
   cd frontend
   npm run build  # Test build locally first
   vercel
   ```

4. **Add environment variables** in Vercel dashboard
5. **Get your frontend URL:** `https://your-app.vercel.app`

### Option 2: Netlify

1. **Go to [Netlify.com](https://netlify.com)**
2. **New site from Git**
3. **Connect GitHub repo**
4. **Configure:**
   - **Base directory:** frontend
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
5. **Add environment variables:**
   - `VITE_API_URL=https://your-backend-url.com/api`
6. **Deploy site**

### Option 3: GitHub Pages

1. **Update `package.json` in frontend:**
   ```json
   "scripts": {
     "deploy": "vite build && gh-pages -d dist"
   }
   ```

2. **Install gh-pages:**
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

3. **Update `vite.config.js`:**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/'  // Important for GitHub Pages
   })
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages** in repo settings

### Option 4: DigitalOcean (with backend)

1. **Build frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Copy build to server:**
   ```bash
   scp -r dist/* root@your_droplet_ip:/var/www/html/
   ```

3. **Update Nginx config:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:5000;
       }
   }
   ```

---

## 🌐 Deployment Options Summary

### Quick Comparison

| Platform | Backend | Frontend | Database | Cost | Ease | Best For |
|----------|---------|----------|----------|------|------|----------|
| **Railway** | ✅ | ❌ | ✅ | $5/mo | ⭐⭐⭐⭐⭐ | Quick deploy |
| **Render** | ✅ | ✅ | ✅ | Free tier | ⭐⭐⭐⭐ | Free start |
| **Vercel** | ✅ | ✅ | ❌ | Free tier | ⭐⭐⭐⭐⭐ | Frontend-first |
| **Netlify** | ❌ | ✅ | ❌ | Free tier | ⭐⭐⭐⭐⭐ | Frontend only |
| **DigitalOcean** | ✅ | ✅ | ✅ | $6/mo | ⭐⭐⭐ | Full control |
| **Heroku** | ✅ | ✅ | ✅ | $7/mo | ⭐⭐⭐⭐ | Classic |

### Recommended Combination

**For beginners:**
- Backend + Database: **Railway** ($5/month)
- Frontend: **Vercel** (Free)

**For free tier:**
- Backend: **Render** (Free)
- Frontend: **Netlify** (Free)
- Database: **Neon** (Free)

**For production:**
- Backend + Database: **DigitalOcean Droplet** ($12/month)
- Frontend: **Vercel** or Cloudflare Pages (Free/Paid)

---

## 🔒 Security Checklist

Before deploying to production:

### Environment Variables
- [ ] Change `JWT_SECRET` to a strong random string (min 32 chars)
- [ ] Use strong database passwords
- [ ] Never commit `.env` files to Git
- [ ] Set `NODE_ENV=production`

### CORS Configuration
- [ ] Update `FRONTEND_URL` in backend `.env`
- [ ] Restrict CORS to your actual frontend domain
- [ ] Remove wildcard (`*`) CORS if present

### Database Security
- [ ] Use SSL for database connections
- [ ] Create separate database user with limited privileges
- [ ] Enable firewall rules to restrict database access
- [ ] Regular database backups

### API Security
- [ ] Rate limiting is enabled (already configured)
- [ ] Input validation on all routes (already configured)
- [ ] Helmet.js security headers (already configured)
- [ ] HTTPS/SSL certificate installed
- [ ] Remove console.logs in production

### Authentication
- [ ] JWT tokens expire (default: 7 days)
- [ ] Passwords are hashed with bcrypt (already configured)
- [ ] Implement refresh tokens (optional)
- [ ] Add account lockout after failed attempts (optional)

### Code Security
- [ ] Remove debug code
- [ ] Update all npm packages: `npm audit fix`
- [ ] Review dependencies for vulnerabilities
- [ ] Set proper file permissions on server

---

## 📊 Post-Deployment

### 1. Test Your Deployment

**Backend health check:**
```bash
curl https://your-backend-url.com/api/health
```

**Frontend access:**
- Open `https://your-frontend-url.com`
- Test login/register
- Test adding products to cart
- Test admin panel

### 2. Monitor Your Application

**Setup monitoring:**
- [UptimeRobot](https://uptimerobot.com) - Free uptime monitoring
- [Sentry](https://sentry.io) - Error tracking
- [LogRocket](https://logrocket.com) - Session replay

**Database monitoring:**
- Regular backups (daily recommended)
- Monitor disk space
- Track slow queries

### 3. Setup Custom Domain

**For Vercel/Netlify:**
1. Go to domain settings
2. Add custom domain
3. Update DNS records with your domain provider:
   - Add CNAME record pointing to Vercel/Netlify

**For DigitalOcean:**
1. Point A record to droplet IP
2. Update Nginx config with your domain
3. Generate SSL certificate

### 4. Admin Access

**Default admin credentials:**
- Email: `admin123@test.com`
- Password: `admin@123`

**⚠️ IMMEDIATELY:**
1. Login to admin panel
2. Change admin email and password
3. Delete seed data if not needed

### 5. Performance Optimization

**Frontend:**
- Enable Gzip compression
- Use CDN for static assets
- Lazy load images
- Code splitting (Vite does this automatically)

**Backend:**
- Enable database connection pooling (already configured)
- Add caching (Redis recommended)
- Optimize database queries with indexes

---

## 🐛 Troubleshooting

### Common Issues

#### "Cannot connect to database"
**Solution:**
- Check database credentials in `.env`
- Verify database is running
- Check firewall rules allow connections
- Add `?sslmode=require` to connection string if needed

#### "CORS error" in browser
**Solution:**
- Update `FRONTEND_URL` in backend `.env`
- Make sure frontend is making requests to correct backend URL
- Check CORS middleware in `server.js`

#### "JWT token invalid"
**Solution:**
- Make sure `JWT_SECRET` is the same on all backend instances
- Check token expiration time
- Clear browser localStorage and login again

#### Build fails on Vercel/Netlify
**Solution:**
- Check Node.js version matches local (use `.nvmrc` file)
- Verify all dependencies are in `package.json`
- Check build logs for specific errors
- Make sure `VITE_API_URL` environment variable is set

#### 502 Bad Gateway (Nginx)
**Solution:**
- Check if backend process is running: `pm2 status`
- Verify backend port matches Nginx proxy_pass
- Check backend logs: `pm2 logs`

#### Images not loading
**Solution:**
- If using base64, check size limits (2MB recommended)
- If using URLs, verify CORS allows image loading
- Consider using Cloudinary for production

---

## 📝 Deployment Checklist

Use this checklist when deploying:

### Pre-Deployment
- [ ] Code is committed to Git
- [ ] All tests pass locally
- [ ] `.env` files configured correctly
- [ ] Database migrations tested
- [ ] Frontend build tested locally: `npm run build`
- [ ] Backend starts without errors: `npm start`

### Database
- [ ] Production database created
- [ ] Migrations run successfully
- [ ] Seed data added (optional)
- [ ] Backup system configured

### Backend Deployment
- [ ] Backend deployed to hosting
- [ ] Environment variables configured
- [ ] Database connection successful
- [ ] API endpoints responding
- [ ] Health check returns OK

### Frontend Deployment
- [ ] Environment variable `VITE_API_URL` set
- [ ] Frontend deployed to hosting
- [ ] Can access website
- [ ] Can login/register
- [ ] API calls working

### Security
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Strong JWT_SECRET set
- [ ] Database uses SSL
- [ ] Admin password changed

### Post-Deployment
- [ ] All features tested in production
- [ ] Admin panel accessible
- [ ] Error monitoring setup
- [ ] Uptime monitoring setup
- [ ] Domain configured (if applicable)
- [ ] Backup system tested

---

## 🎯 Quick Start Deployment (Railway + Vercel)

**Fastest way to deploy (5-10 minutes):**

1. **Deploy Database & Backend (Railway):**
   ```bash
   cd backend
   npm install -g @railway/cli
   railway login
   railway init
   railway up
   ```
   Add environment variables in Railway dashboard.

2. **Deploy Frontend (Vercel):**
   ```bash
   cd frontend
   npm install -g vercel
   # Update .env with Railway backend URL
   vercel
   ```
   Add `VITE_API_URL` in Vercel dashboard.

3. **Update Backend CORS:**
   In Railway, add environment variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```

4. **Done!** Visit your Vercel URL.

---

## 📞 Support & Resources

- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Express.js Guide:** https://expressjs.com/
- **React Docs:** https://react.dev/
- **Vite Docs:** https://vitejs.dev/
- **Railway Docs:** https://docs.railway.app/
- **Vercel Docs:** https://vercel.com/docs

---

## 🔄 Updating Your Deployment

When you make changes:

1. **Backend changes:**
   ```bash
   cd backend
   git add .
   git commit -m "Update backend"
   git push
   # Railway/Render will auto-deploy
   ```

2. **Frontend changes:**
   ```bash
   cd frontend
   git add .
   git commit -m "Update frontend"
   git push
   # Vercel/Netlify will auto-deploy
   ```

3. **Database changes:**
   - Create new migration file
   - Run migration on production database
   - Test thoroughly in staging first

---

**Good luck with your deployment! 🚀**

For issues, check troubleshooting section or create a GitHub issue.
