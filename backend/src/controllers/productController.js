import pool from '../config/database.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, bestseller, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, c.name as category_name,
             (SELECT json_agg(json_build_object('id', pi.id, 'image_url', pi.image_url, 'is_primary', pi.is_primary))
              FROM product_images pi WHERE pi.product_id = p.id) as images,
             (SELECT json_agg(json_build_object('id', ps.id, 'size', ps.size, 'stock_quantity', ps.stock_quantity))
              FROM product_sizes ps WHERE ps.product_id = p.id) as sizes
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `;
    
    const params = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND c.name = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (bestseller === 'true') {
      query += ` AND p.is_bestseller = true`;
    }

    if (search) {
      query += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_active = true';
    const countParams = [];
    let countParamIndex = 1;

    if (category) {
      countQuery += ` AND c.name = $${countParamIndex}`;
      countParams.push(category);
      countParamIndex++;
    }

    if (bestseller === 'true') {
      countQuery += ` AND p.is_bestseller = true`;
    }

    if (search) {
      countQuery += ` AND (p.name ILIKE $${countParamIndex} OR p.description ILIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT p.*, c.name as category_name,
              (SELECT json_agg(json_build_object('id', pi.id, 'image_url', pi.image_url, 'is_primary', pi.is_primary))
               FROM product_images pi WHERE pi.product_id = p.id) as images,
              (SELECT json_agg(json_build_object('id', ps.id, 'size', ps.size, 'stock_quantity', ps.stock_quantity))
               FROM product_sizes ps WHERE ps.product_id = p.id) as sizes,
              (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE product_id = p.id) as average_rating,
              (SELECT COUNT(*) FROM reviews WHERE product_id = p.id) as review_count
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1 AND p.is_active = true`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// @desc    Create product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, compareAtPrice, categoryId, stockQuantity, sku, isBestseller, images, sizes } = req.body;

    // Insert product
    const result = await pool.query(
      `INSERT INTO products (name, description, price, compare_at_price, category_id, stock_quantity, sku, is_bestseller)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, description, price, compareAtPrice || null, categoryId || null, stockQuantity || 0, sku || null, isBestseller || false]
    );

    const product = result.rows[0];

    // Insert images if provided
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const imageUrl = typeof images[i] === 'string' ? images[i] : images[i].imageUrl;
        const isPrimary = typeof images[i] === 'object' ? images[i].isPrimary : (i === 0);
        await pool.query(
          'INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES ($1, $2, $3, $4)',
          [product.id, imageUrl, isPrimary, i]
        );
      }
    }

    // Insert sizes if provided
    if (sizes && sizes.length > 0) {
      for (const size of sizes) {
        await pool.query(
          'INSERT INTO product_sizes (product_id, size, stock_quantity) VALUES ($1, $2, $3)',
          [product.id, size.size, size.stock_quantity || 0]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, compareAtPrice, categoryId, stockQuantity, isBestseller, images } = req.body;

    const result = await pool.query(
      `UPDATE products 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           compare_at_price = COALESCE($4, compare_at_price),
           category_id = COALESCE($5, category_id),
           stock_quantity = COALESCE($6, stock_quantity),
           is_bestseller = COALESCE($7, is_bestseller),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [name, description, price, compareAtPrice, categoryId, stockQuantity, isBestseller, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update images if provided
    if (images && images.length > 0) {
      // Delete existing images
      await pool.query('DELETE FROM product_images WHERE product_id = $1', [id]);
      
      // Insert new images
      for (let i = 0; i < images.length; i++) {
        const imageUrl = typeof images[i] === 'string' ? images[i] : images[i].imageUrl;
        const isPrimary = typeof images[i] === 'object' ? images[i].isPrimary : (i === 0);
        await pool.query(
          'INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES ($1, $2, $3, $4)',
          [id, imageUrl, isPrimary, i]
        );
      }
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE products SET is_active = false WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};
