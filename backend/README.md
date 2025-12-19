# E-Commerce Backend API

Complete production-ready backend for E-Commerce application built with Node.js, Express, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Registration, login, profile management, password change
- **Product Management**: CRUD operations with images, sizes, and categories
- **Shopping Cart**: Add, update, remove items from cart
- **Order Management**: Create orders, track status, order history
- **Address Management**: Multiple shipping addresses per user
- **Category Management**: Product categorization
- **Security**: Helmet, CORS, rate limiting, password hashing
- **Database**: PostgreSQL with proper indexing and relationships

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

## 🔧 Installation

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**
   - Update the `.env` file with your database credentials
   - Change `JWT_SECRET` to a secure random string

3. **Create database**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE ecom;
   
   # Exit psql
   \q
   ```

4. **Run database migrations**
   ```bash
   npm run migrate
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/profile` | Get user profile | Private |
| PUT | `/profile` | Update profile | Private |
| PUT | `/change-password` | Change password | Private |

### Products (`/api/products`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all products | Public |
| GET | `/:id` | Get single product | Public |
| POST | `/` | Create product | Admin |
| PUT | `/:id` | Update product | Admin |
| DELETE | `/:id` | Delete product | Admin |

### Cart (`/api/cart`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get user cart | Private |
| POST | `/` | Add item to cart | Private |
| PUT | `/:id` | Update cart item | Private |
| DELETE | `/:id` | Remove item from cart | Private |
| DELETE | `/` | Clear cart | Private |

### Orders (`/api/orders`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Create order | Private |
| GET | `/` | Get user orders | Private |
| GET | `/:id` | Get single order | Private |
| GET | `/admin/all` | Get all orders | Admin |
| PUT | `/:id/status` | Update order status | Admin |

### Categories (`/api/categories`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all categories | Public |
| POST | `/` | Create category | Admin |
| PUT | `/:id` | Update category | Admin |
| DELETE | `/:id` | Delete category | Admin |

### Addresses (`/api/addresses`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get user addresses | Private |
| POST | `/` | Create address | Private |
| PUT | `/:id` | Update address | Private |
| DELETE | `/:id` | Delete address | Private |

## 🗄️ Database Schema

### Tables

1. **users** - User accounts
2. **categories** - Product categories
3. **products** - Product information
4. **product_images** - Product images
5. **product_sizes** - Available sizes per product
6. **addresses** - User shipping addresses
7. **orders** - Order information
8. **order_items** - Items in each order
9. **cart** - Shopping cart items
10. **reviews** - Product reviews
11. **wishlist** - User wishlists
12. **newsletter_subscribers** - Newsletter subscriptions

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

### User Roles

- **customer**: Regular user (default)
- **admin**: Admin user with full access

## 📝 Request Examples

### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Product (Admin)

```bash
POST /api/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "T-Shirt",
  "description": "Cotton t-shirt",
  "price": 29.99,
  "categoryId": "uuid-here",
  "stockQuantity": 100,
  "isBestseller": true,
  "images": ["https://example.com/image1.jpg"],
  "sizes": [
    { "size": "S", "stock_quantity": 25 },
    { "size": "M", "stock_quantity": 50 },
    { "size": "L", "stock_quantity": 25 }
  ]
}
```

### Create Order

```bash
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "uuid-here",
      "size": "M",
      "quantity": 2
    }
  ],
  "shippingAddressId": "uuid-here",
  "paymentMethod": "credit_card",
  "notes": "Please deliver before 5 PM"
}
```

## 🛡️ Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevents brute force attacks
- **Helmet**: Secure HTTP headers
- **CORS**: Configured for specific origins
- **Input Validation**: express-validator for request validation
- **SQL Injection Prevention**: Parameterized queries

## 🚀 Production Deployment

1. Set `NODE_ENV=production` in environment variables
2. Use a strong `JWT_SECRET`
3. Configure proper database credentials
4. Set up SSL/TLS for database connection
5. Use a process manager like PM2
6. Set up proper logging
7. Configure reverse proxy (nginx)
8. Enable database backups
9. Set up monitoring and alerts

## 📦 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── productController.js # Product operations
│   │   ├── cartController.js    # Cart management
│   │   ├── orderController.js   # Order processing
│   │   ├── categoryController.js
│   │   └── addressController.js
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── error.js             # Error handling
│   │   ├── validation.js        # Input validation
│   │   └── rateLimiter.js       # Rate limiting
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── addressRoutes.js
│   ├── utils/
│   │   ├── jwt.js               # JWT utilities
│   │   └── helpers.js           # Helper functions
│   └── database/
│       └── migrate.js           # Database migrations
├── server.js                    # Application entry point
├── package.json
├── .env
└── .gitignore
```

## 🧪 Testing

Test the API using tools like:
- Postman
- Insomnia
- cURL
- Thunder Client (VS Code extension)

## 📄 License

ISC

## 👥 Support

For issues and questions, please create an issue in the repository.
