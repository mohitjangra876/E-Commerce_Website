# 📂 Complete Project Directory Structure

## Overview

```
E-Commerce_Website/
│
├── 📄 Documentation Files
│   ├── README.md                    # Main project documentation
│   ├── PROJECT_README.md            # Detailed project overview
│   ├── DEPLOYMENT_GUIDE.md          # Complete deployment instructions
│   ├── DEPLOYMENT_SCRIPTS.md        # Quick deployment scripts
│   ├── DEPLOYMENT_CHECKLIST.md      # Pre and post deployment checklist
│   ├── FEATURES.md                  # Feature documentation
│   ├── QUICK_START.md               # Quick start guide
│   └── PRODUCTION_GUIDE.md          # Production best practices
│
├── 🐳 Docker Files
│   ├── docker-compose.yml           # Docker compose configuration
│   └── .env.docker                  # Docker environment template
│
├── 🔧 Configuration Files
│   └── .gitignore                   # Git ignore rules
│
├── 📦 Backend/ (Node.js API)
│   ├── 📄 Configuration
│   │   ├── package.json             # Dependencies and scripts
│   │   ├── .env                     # Environment variables (DO NOT COMMIT)
│   │   ├── .env.example             # Environment template
│   │   ├── .gitignore               # Backend git ignore
│   │   ├── .nvmrc                   # Node version specification
│   │   ├── vercel.json              # Vercel deployment config
│   │   ├── Procfile                 # Heroku deployment config
│   │   ├── Dockerfile               # Docker image configuration
│   │   └── README.md                # Backend documentation
│   │
│   ├── 🚀 Entry Point
│   │   └── server.js                # Express server initialization
│   │
│   └── 📁 src/
│       │
│       ├── 🔌 config/
│       │   └── database.js          # PostgreSQL connection pool
│       │
│       ├── 🎮 controllers/
│       │   ├── authController.js    # Authentication logic (register, login, profile)
│       │   ├── productController.js # Product CRUD operations
│       │   ├── cartController.js    # Cart management (add, update, delete)
│       │   ├── orderController.js   # Order processing and history
│       │   ├── categoryController.js # Category management
│       │   └── addressController.js # User address management
│       │
│       ├── 🛡️ middleware/
│       │   ├── auth.js              # JWT authentication middleware
│       │   ├── error.js             # Global error handling
│       │   ├── validation.js        # Input validation middleware
│       │   └── rateLimiter.js       # API rate limiting
│       │
│       ├── 🛣️ routes/
│       │   ├── authRoutes.js        # /api/auth/* endpoints
│       │   ├── productRoutes.js     # /api/products/* endpoints
│       │   ├── cartRoutes.js        # /api/cart/* endpoints
│       │   ├── orderRoutes.js       # /api/orders/* endpoints
│       │   ├── categoryRoutes.js    # /api/categories/* endpoints
│       │   └── addressRoutes.js     # /api/addresses/* endpoints
│       │
│       ├── 🛠️ utils/
│       │   ├── jwt.js               # JWT token generation/verification
│       │   └── helpers.js           # Helper functions
│       │
│       └── 🗄️ database/
│           ├── migrate.js           # Database schema creation
│           └── seed.js              # Sample data population
│
└── 🎨 Frontend/ (React App)
    ├── 📄 Configuration
    │   ├── package.json             # Dependencies and scripts
    │   ├── .env                     # Environment variables (DO NOT COMMIT)
    │   ├── .env.example             # Environment template
    │   ├── .gitignore               # Frontend git ignore
    │   ├── .nvmrc                   # Node version specification
    │   ├── index.html               # HTML entry point
    │   ├── vite.config.js           # Vite build configuration
    │   ├── eslint.config.js         # ESLint rules
    │   ├── netlify.toml             # Netlify deployment config
    │   ├── nginx.conf               # Nginx configuration for Docker
    │   ├── Dockerfile               # Docker image configuration
    │   └── README.md                # Frontend documentation
    │
    ├── 📁 public/                   # Static assets (served as-is)
    │   ├── favicon.ico
    │   └── robots.txt
    │
    └── 📁 src/
        │
        ├── 🚀 Entry Point
        │   ├── main.jsx             # React app initialization
        │   ├── App.jsx              # Main app component with routing
        │   ├── App.css              # Global app styles
        │   └── index.css            # Global CSS and Tailwind imports
        │
        ├── 🖼️ assets/
        │   ├── assets.js            # Asset exports
        │   ├── Logo/                # Logo images
        │   └── [other images]       # Product images, icons, etc.
        │
        ├── 🧩 components/
        │   │
        │   ├── 🏠 Public Components
        │   │   ├── Navbar.jsx       # Top navigation with cart/profile
        │   │   ├── Footer.jsx       # Site footer
        │   │   ├── Hero.jsx         # Homepage hero section
        │   │   ├── LatestCollection.jsx  # Latest products display
        │   │   ├── BestSeller.jsx   # Best selling products
        │   │   ├── ProductItem.jsx  # Product card component
        │   │   ├── RelatedProducts.jsx # Related products section
        │   │   ├── SearchBar.jsx    # Product search component
        │   │   ├── Title.jsx        # Section title component
        │   │   ├── OurPolicy.jsx    # Store policies display
        │   │   ├── NewsLetterBox.jsx # Newsletter subscription
        │   │   └── ProtectedRoute.jsx # Route protection wrapper
        │   │
        │   └── 🔐 admin/
        │       ├── AdminLayout.jsx  # Admin panel layout wrapper
        │       ├── AdminSidebar.jsx # Admin navigation sidebar
        │       └── ImageCropModal.jsx # Image cropping interface
        │
        ├── 🌐 context/
        │   ├── ShopContext.jsx      # Global shop state (products, cart, categories)
        │   └── AuthContext.jsx      # Authentication state (user, login, logout)
        │
        ├── 📄 pages/
        │   │
        │   ├── 🛍️ Customer Pages
        │   │   ├── Home.jsx         # Homepage
        │   │   ├── Collection.jsx   # All products with filters
        │   │   ├── Product.jsx      # Product detail page
        │   │   ├── Cart.jsx         # Shopping cart
        │   │   ├── PlaceOrder.jsx   # Checkout page
        │   │   ├── Orders.jsx       # Order history
        │   │   ├── Login.jsx        # Login/Register page
        │   │   ├── About.jsx        # About us page
        │   │   └── Contact.jsx      # Contact page
        │   │
        │   └── 🔐 admin/
        │       ├── AdminDashboard.jsx  # Admin overview/stats
        │       ├── AdminProducts.jsx   # Product management (CRUD)
        │       └── AdminOrders.jsx     # Order management
        │
        └── 🔌 services/
            └── api.js               # Axios HTTP client + API methods
```

## 📊 File Count Summary

### Backend
- **Total Files:** ~25
- **Configuration:** 9 files
- **Source Code:** 16 files
  - Controllers: 6 files
  - Routes: 6 files
  - Middleware: 4 files
  - Config: 1 file
  - Utils: 2 files
  - Database: 2 files

### Frontend
- **Total Files:** ~35
- **Configuration:** 10 files
- **Components:** 18 files
  - Public: 14 files
  - Admin: 3 files
- **Pages:** 11 files
  - Customer: 8 files
  - Admin: 3 files
- **Context:** 2 files
- **Services:** 1 file
- **Entry:** 4 files

### Documentation
- **Total Files:** 8 files

## 🎯 Key File Descriptions

### Backend Critical Files

| File | Purpose | Size | Complexity |
|------|---------|------|------------|
| `server.js` | Express server entry point | ~100 lines | Low |
| `database.js` | PostgreSQL connection | ~30 lines | Low |
| `migrate.js` | Create database schema | ~200 lines | Medium |
| `seed.js` | Populate sample data | ~150 lines | Medium |
| `authController.js` | User authentication | ~150 lines | Medium |
| `productController.js` | Product management | ~200 lines | High |
| `cartController.js` | Cart operations | ~150 lines | Medium |
| `orderController.js` | Order processing | ~180 lines | High |
| `auth.js` | JWT middleware | ~50 lines | Low |

### Frontend Critical Files

| File | Purpose | Size | Complexity |
|------|---------|------|------------|
| `App.jsx` | Main app + routing | ~100 lines | Medium |
| `ShopContext.jsx` | Global state management | ~250 lines | High |
| `AuthContext.jsx` | Auth state management | ~100 lines | Medium |
| `api.js` | API service layer | ~200 lines | Medium |
| `Navbar.jsx` | Navigation component | ~150 lines | Medium |
| `Collection.jsx` | Product listing + filters | ~200 lines | High |
| `Product.jsx` | Product detail view | ~150 lines | Medium |
| `Cart.jsx` | Shopping cart | ~180 lines | Medium |
| `PlaceOrder.jsx` | Checkout process | ~200 lines | High |
| `AdminProducts.jsx` | Product CRUD interface | ~300 lines | High |

## 🗂️ Database Schema

### Tables Created by migrate.js

```sql
users
├── id (PRIMARY KEY)
├── name
├── email (UNIQUE)
├── password (hashed)
├── role (user/admin)
└── created_at

categories
├── id (PRIMARY KEY)
├── name
├── description
└── created_at

products
├── id (PRIMARY KEY)
├── name
├── description
├── price
├── category_id (FOREIGN KEY → categories)
├── bestseller (boolean)
├── created_at
└── updated_at

product_images
├── id (PRIMARY KEY)
├── product_id (FOREIGN KEY → products)
├── image_url
├── is_primary (boolean)
└── display_order

product_sizes
├── id (PRIMARY KEY)
├── product_id (FOREIGN KEY → products)
└── size

cart_items
├── id (PRIMARY KEY)
├── user_id (FOREIGN KEY → users)
├── product_id (FOREIGN KEY → products)
├── quantity
├── size
└── created_at

addresses
├── id (PRIMARY KEY)
├── user_id (FOREIGN KEY → users)
├── first_name
├── last_name
├── email
├── street
├── city
├── state
├── zipcode
├── country
├── phone
└── is_default (boolean)

orders
├── id (PRIMARY KEY)
├── user_id (FOREIGN KEY → users)
├── address_id (FOREIGN KEY → addresses)
├── total_amount
├── status (pending/processing/shipped/delivered/cancelled)
├── payment_method
├── created_at
└── updated_at

order_items
├── id (PRIMARY KEY)
├── order_id (FOREIGN KEY → orders)
├── product_id (FOREIGN KEY → products)
├── quantity
├── size
├── price
└── created_at
```

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                       │
│                  (React App - Port 5173/80)                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS Requests
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    BACKEND API SERVER                        │
│                (Express.js - Port 5000)                      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Middleware  │→ │ Controllers  │→ │    Utils     │      │
│  │  - Auth      │  │ - Business   │  │ - Helpers    │      │
│  │  - Validate  │  │   Logic      │  │ - JWT        │      │
│  │  - RateLimit │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ SQL Queries
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  POSTGRESQL DATABASE                         │
│                     (Port 5432)                              │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  users   │  │ products │  │  orders  │  │   cart   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow

### Customer Flow
```
User visits website
    ↓
Loads React App (Frontend)
    ↓
App fetches products from API
    ↓
User browses and adds to cart
    ↓
User proceeds to checkout
    ↓
Order created in database
    ↓
Confirmation shown to user
```

### Admin Flow
```
Admin logs in
    ↓
JWT token stored in localStorage
    ↓
Admin navigates to product management
    ↓
Admin uploads product images
    ↓
Images cropped and converted to base64
    ↓
Product data sent to backend API
    ↓
Product saved to database
    ↓
Success confirmation shown
```

## 📦 Key Dependencies

### Backend Dependencies
```json
{
  "express": "Web framework",
  "pg": "PostgreSQL client",
  "bcryptjs": "Password hashing",
  "jsonwebtoken": "JWT authentication",
  "cors": "Cross-origin requests",
  "helmet": "Security headers",
  "express-rate-limit": "Rate limiting",
  "express-validator": "Input validation",
  "dotenv": "Environment variables"
}
```

### Frontend Dependencies
```json
{
  "react": "UI library",
  "react-dom": "React DOM renderer",
  "react-router-dom": "Routing",
  "axios": "HTTP client",
  "tailwindcss": "CSS framework",
  "react-toastify": "Notifications",
  "vite": "Build tool"
}
```

## 🚀 Getting Started Quick Reference

1. **Clone**: `git clone [repo-url]`
2. **Backend**: 
   - `cd backend && npm install`
   - Configure `.env`
   - `npm run migrate && npm run seed`
   - `npm start`
3. **Frontend**: 
   - `cd frontend && npm install`
   - Configure `.env`
   - `npm run dev`
4. **Access**: `http://localhost:5173`

---

**For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**
