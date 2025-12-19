# 🎉 E-Commerce Application - Quick Start Guide

## ✅ Setup Complete!

Both frontend and backend servers are now running successfully.

---

## 🌐 Application URLs

### Frontend (React + Vite)
- **URL**: http://localhost:5173/E-commerce
- **Status**: ✅ Running

### Backend (Express + PostgreSQL)
- **URL**: http://localhost:5000
- **API Base**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health
- **Status**: ✅ Running

---

## 🔐 Test Accounts

### Admin Account
- **Email**: `admin@ecommerce.com`
- **Password**: `admin123`
- **Access**: Full admin access to all features

### Customer Account
- **Email**: `customer@test.com`
- **Password**: `customer123`
- **Access**: Regular customer access

---

## 📡 API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)
- `PUT /api/auth/change-password` - Change password (Protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Cart
- `GET /api/cart` - Get user cart (Protected)
- `POST /api/cart` - Add to cart (Protected)
- `PUT /api/cart/:id` - Update cart item (Protected)
- `DELETE /api/cart/:id` - Remove from cart (Protected)

### Orders
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders` - Get user orders (Protected)
- `GET /api/orders/:id` - Get single order (Protected)
- `GET /api/orders/admin/all` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Addresses
- `GET /api/addresses` - Get user addresses (Protected)
- `POST /api/addresses` - Create address (Protected)
- `PUT /api/addresses/:id` - Update address (Protected)
- `DELETE /api/addresses/:id` - Delete address (Protected)

---

## 🗄️ Database Information

### Connection Details
- **Host**: localhost
- **Port**: 5432
- **Database**: ecom
- **User**: postgres

### Sample Data
The database has been seeded with:
- ✅ 2 users (1 admin, 1 customer)
- ✅ 5 categories (Men, Women, Kids, Electronics, Home & Living)
- ✅ 10 sample products with multiple sizes
- ✅ Product images (placeholder URLs)

---

## 🔧 Development Commands

### Backend
```bash
cd backend
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run migrate  # Run database migrations
npm run seed     # Seed database with sample data
```

### Frontend
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🛡️ Security Features

- ✅ JWT authentication
- ✅ Password hashing (bcryptjs)
- ✅ Rate limiting on API routes
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Input validation
- ✅ SQL injection prevention

---

## 📦 Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: CSS

---

## 🎯 Next Steps

1. **Connect Frontend to Backend**:
   - Update frontend API calls to use `http://localhost:5000/api`
   - Implement authentication context
   - Add token management

2. **Test API with Postman/Thunder Client**:
   - Import API endpoints
   - Test authentication flow
   - Test CRUD operations

3. **Customize**:
   - Add your own products
   - Configure payment gateway
   - Add email notifications
   - Customize frontend design

---

## 🐛 Troubleshooting

### Backend won't start
- Check if PostgreSQL is running
- Verify database credentials in `.env`
- Ensure port 5000 is not in use

### Frontend won't start
- Check if port 5173 is available
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Database connection issues
- Verify PostgreSQL service is running
- Check database name `ecom` exists
- Verify user credentials

---

## 📝 Important Notes

1. **JWT Secret**: Change `JWT_SECRET` in `.env` for production
2. **CORS**: Update `FRONTEND_URL` in backend `.env` if frontend URL changes
3. **Database**: Regular backups recommended for production
4. **Environment Variables**: Never commit `.env` file to version control

---

## 🎊 You're All Set!

Your full-stack e-commerce application is ready to use. Start building your online store!

For questions or issues, refer to:
- Backend README: `backend/README.md`
- Frontend README: `frontend/README.md`
