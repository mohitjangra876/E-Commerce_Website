import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin@123', 10);
    const adminResult = await client.query(
      `INSERT INTO users (name, email, password, role, is_verified)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password
       RETURNING id`,
      ['Admin', 'admin123@test.com', adminPassword, 'admin', true]
    );

    if (adminResult.rows.length > 0) {
      console.log('✅ Admin user created/updated');
      console.log('   Email: admin123@test.com');
      console.log('   Password: admin@123');
    }

    // Create test customer
    const customerPassword = await bcrypt.hash('customer123', 10);
    const customerResult = await client.query(
      `INSERT INTO users (name, email, password, role, is_verified)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      ['John Doe', 'customer@test.com', customerPassword, 'customer', true]
    );

    if (customerResult.rows.length > 0) {
      console.log('✅ Test customer created');
      console.log('   Email: customer@test.com');
      console.log('   Password: customer123');
    }

    // Create categories
    const categories = [
      { name: 'Men', description: 'Men\'s clothing and accessories' },
      { name: 'Women', description: 'Women\'s clothing and accessories' },
      { name: 'Kids', description: 'Kids\' clothing and accessories' },
      { name: 'Electronics', description: 'Electronic gadgets and devices' },
      { name: 'Home & Living', description: 'Home decor and living essentials' }
    ];

    const categoryIds = {};
    for (const category of categories) {
      const result = await client.query(
        `INSERT INTO categories (name, description)
         VALUES ($1, $2)
         ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
         RETURNING id, name`,
        [category.name, category.description]
      );
      categoryIds[category.name] = result.rows[0].id;
    }
    console.log('✅ Categories created');

    // Create sample products
    const products = [
      {
        name: 'Classic White T-Shirt',
        description: 'Premium cotton t-shirt with a classic fit. Perfect for everyday wear.',
        price: 29.99,
        categoryId: categoryIds['Men'],
        stockQuantity: 150,
        isBestseller: true,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
      },
      {
        name: 'Denim Jeans',
        description: 'Comfortable stretch denim jeans with a modern slim fit.',
        price: 79.99,
        categoryId: categoryIds['Men'],
        stockQuantity: 100,
        isBestseller: true,
        sizes: ['28', '30', '32', '34', '36', '38']
      },
      {
        name: 'Summer Dress',
        description: 'Lightweight floral summer dress perfect for warm weather.',
        price: 59.99,
        categoryId: categoryIds['Women'],
        stockQuantity: 80,
        isBestseller: false,
        sizes: ['XS', 'S', 'M', 'L', 'XL']
      },
      {
        name: 'Leather Jacket',
        description: 'Genuine leather jacket with premium finish and comfortable lining.',
        price: 199.99,
        categoryId: categoryIds['Men'],
        stockQuantity: 50,
        isBestseller: true,
        sizes: ['S', 'M', 'L', 'XL']
      },
      {
        name: 'Sneakers',
        description: 'Comfortable athletic sneakers suitable for running and daily wear.',
        price: 89.99,
        categoryId: categoryIds['Men'],
        stockQuantity: 120,
        isBestseller: true,
        sizes: ['7', '8', '9', '10', '11', '12']
      },
      {
        name: 'Wireless Headphones',
        description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.',
        price: 149.99,
        categoryId: categoryIds['Electronics'],
        stockQuantity: 75,
        isBestseller: true,
        sizes: ['One Size']
      },
      {
        name: 'Kids Backpack',
        description: 'Durable and colorful backpack perfect for school.',
        price: 39.99,
        categoryId: categoryIds['Kids'],
        stockQuantity: 90,
        isBestseller: false,
        sizes: ['Small', 'Medium']
      },
      {
        name: 'Yoga Mat',
        description: 'Non-slip exercise yoga mat with carrying strap.',
        price: 34.99,
        categoryId: categoryIds['Home & Living'],
        stockQuantity: 100,
        isBestseller: false,
        sizes: ['One Size']
      },
      {
        name: 'Smart Watch',
        description: 'Fitness tracking smartwatch with heart rate monitor and GPS.',
        price: 249.99,
        categoryId: categoryIds['Electronics'],
        stockQuantity: 60,
        isBestseller: true,
        sizes: ['38mm', '42mm', '44mm']
      },
      {
        name: 'Winter Coat',
        description: 'Warm insulated winter coat with hood and multiple pockets.',
        price: 159.99,
        categoryId: categoryIds['Women'],
        stockQuantity: 70,
        isBestseller: false,
        sizes: ['XS', 'S', 'M', 'L', 'XL']
      }
    ];

    for (const product of products) {
      const productResult = await client.query(
        `INSERT INTO products (name, description, price, category_id, stock_quantity, is_bestseller, sku)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          product.name,
          product.description,
          product.price,
          product.categoryId,
          product.stockQuantity,
          product.isBestseller,
          `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        ]
      );

      const productId = productResult.rows[0].id;

      // Add product image (placeholder)
      await client.query(
        `INSERT INTO product_images (product_id, image_url, is_primary, display_order)
         VALUES ($1, $2, $3, $4)`,
        [productId, 'https://via.placeholder.com/500', true, 0]
      );

      // Add product sizes
      for (let i = 0; i < product.sizes.length; i++) {
        await client.query(
          `INSERT INTO product_sizes (product_id, size, stock_quantity)
           VALUES ($1, $2, $3)`,
          [productId, product.sizes[i], Math.floor(product.stockQuantity / product.sizes.length)]
        );
      }
    }

    console.log('✅ Sample products created');

    await client.query('COMMIT');
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📝 You can now login with:');
    console.log('   Admin: admin@ecommerce.com / admin123');
    console.log('   Customer: customer@test.com / customer123');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    process.exit(0);
  }
};

seedData();
