# 🛍️ Full-Stack E-Commerce Website

A modern, feature-rich e-commerce platform built with React, Node.js, Express, and PostgreSQL.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.1.0-blue.svg)

## ✨ Features

### Customer Features
- 🛒 **Product Browsing** - Browse products with categories and search
- 🔍 **Advanced Search** - Search and filter products
- 🛍️ **Shopping Cart** - Add, remove, and manage cart items
- 💳 **Checkout Process** - Seamless order placement
- 👤 **User Authentication** - Register, login, and manage profile
- 📦 **Order History** - Track all your orders
- 📍 **Address Management** - Save multiple delivery addresses

### Admin Features
- 📊 **Admin Dashboard** - Overview of store statistics
- ➕ **Product Management** - Add, edit, delete products
- 🖼️ **Image Upload** - Multiple images with cropping/adjustment
- 📑 **Category Management** - Organize products
- 📦 **Order Management** - View and manage customer orders
- 👥 **User Management** - View registered users

### Technical Features
- 🔐 **JWT Authentication** - Secure token-based auth
- 🛡️ **Security Headers** - Helmet.js protection
- ⚡ **Rate Limiting** - Prevent abuse
- 🎨 **Responsive Design** - Mobile-first approach
- 🚀 **Optimized Performance** - Fast loading times
- 📱 **Progressive Web App** - App-like experience

## 🏗️ Tech Stack

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite 6
- **Styling:** TailwindCSS 4
- **Routing:** React Router 7
- **HTTP Client:** Axios
- **State Management:** Context API
- **Notifications:** React Toastify

### Backend
- **Runtime:** Node.js 20
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT + bcrypt
- **Security:** Helmet, CORS, Rate Limiting
- **Validation:** Express Validator

## 📁 Project Structure

```
E-Commerce_Website/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions
│   │   └── database/       # DB migrations & seeds
│   ├── server.js           # Entry point
│   └── package.json
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Context providers
│   │   ├── services/      # API services
│   │   └── assets/        # Static assets
│   ├── index.html
│   └── package.json
│
├── DEPLOYMENT_GUIDE.md    # Detailed deployment instructions
├── DEPLOYMENT_SCRIPTS.md  # Quick deployment scripts
└── docker-compose.yml     # Docker configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ecommerce-website.git
   cd ecommerce-website
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Run migrations
   npm run migrate
   
   # Seed database (optional)
   npm run seed
   
   # Start server
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with backend URL
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Admin Panel: http://localhost:5173/admin

### Default Admin Credentials
```
Email: admin123@test.com
Password: admin@123
```
⚠️ **Change these immediately in production!**

## 🗄️ Database Setup

### Local PostgreSQL

1. **Create database:**
   ```sql
   CREATE DATABASE ecommerce;
   ```

2. **Update backend/.env:**
   ```env
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=ecommerce
   ```

3. **Run migrations:**
   ```bash
   cd backend
   npm run migrate
   npm run seed
   ```

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=ecommerce

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5173

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📦 Available Scripts

### Backend
```bash
npm start         # Start production server
npm run dev       # Start with nodemon (auto-reload)
npm run migrate   # Run database migrations
npm run seed      # Seed sample data
```

### Frontend
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## 🚢 Deployment

We provide multiple deployment options. See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

### Quick Deploy (Recommended)

**Backend + Database:** [Railway](https://railway.app)
```bash
cd backend
railway login
railway init
railway up
```

**Frontend:** [Vercel](https://vercel.com)
```bash
cd frontend
vercel
```

See [DEPLOYMENT_SCRIPTS.md](DEPLOYMENT_SCRIPTS.md) for more options.

## 🐳 Docker Deployment

```bash
# Copy and configure environment
cp .env.docker .env
# Edit .env with your values

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔒 Security

- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt
- ✅ Rate limiting on all routes
- ✅ Helmet.js security headers
- ✅ CORS protection
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ Input validation

## 📱 API Documentation

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/profile     - Get user profile
PUT    /api/auth/profile     - Update profile
```

### Products
```
GET    /api/products         - Get all products
GET    /api/products/:id     - Get single product
POST   /api/products         - Create product (Admin)
PUT    /api/products/:id     - Update product (Admin)
DELETE /api/products/:id     - Delete product (Admin)
```

### Cart
```
GET    /api/cart            - Get user cart
POST   /api/cart            - Add to cart
PUT    /api/cart/:id        - Update cart item
DELETE /api/cart/:id        - Remove from cart
DELETE /api/cart            - Clear cart
```

### Orders
```
GET    /api/orders          - Get user orders
GET    /api/orders/:id      - Get single order
POST   /api/orders          - Create order
GET    /api/orders/admin/all - Get all orders (Admin)
PUT    /api/orders/:id/status - Update order status (Admin)
```

## 🧪 Testing

```bash
# Backend tests (if implemented)
cd backend
npm test

# Frontend tests (if implemented)
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - [@yourhandle](https://github.com/yourhandle)

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js community
- TailwindCSS for the styling framework
- All contributors and testers

## 📞 Support

For issues and questions:
- 📧 Email: your.email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/ecommerce-website/issues)
- 📖 Docs: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 🗺️ Roadmap

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile apps (React Native)
- [ ] Real-time order tracking
- [ ] Inventory management
- [ ] Discount codes/coupons

## 📊 Project Status

🟢 Active Development - Version 1.0.0

---

**Happy Coding! 🚀**

If you find this project helpful, please give it a ⭐️!
