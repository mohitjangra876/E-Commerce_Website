import pool from '../config/database.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { items, shippingAddressId, paymentMethod, notes } = req.body;

    // Calculate totals
    let subtotal = 0;
    for (const item of items) {
      const productResult = await client.query(
        'SELECT price FROM products WHERE id = $1',
        [item.productId]
      );
      if (productResult.rows.length === 0) {
        throw new Error(`Product ${item.productId} not found`);
      }
      subtotal += productResult.rows[0].price * item.quantity;
    }

    const shippingFee = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shippingFee + tax;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, order_number, payment_method, subtotal, shipping_fee, tax, total, shipping_address_id, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [req.user.id, orderNumber, paymentMethod, subtotal, shippingFee, tax, total, shippingAddressId, notes || null]
    );

    const order = orderResult.rows[0];

    // Create order items
    for (const item of items) {
      const productResult = await client.query(
        `SELECT name, price, 
                (SELECT image_url FROM product_images WHERE product_id = $1 AND is_primary = true LIMIT 1) as image
         FROM products WHERE id = $1`,
        [item.productId]
      );

      const product = productResult.rows[0];
      const itemSubtotal = product.price * item.quantity;

      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_image, size, quantity, price, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [order.id, item.productId, product.name, product.image, item.size || null, item.quantity, product.price, itemSubtotal]
      );

      // Update product stock
      await client.query(
        'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
        [item.quantity, item.productId]
      );
    }

    // Clear user's cart
    await client.query('DELETE FROM cart WHERE user_id = $1', [req.user.id]);

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*,
              (SELECT json_agg(json_build_object(
                'id', oi.id,
                'product_id', oi.product_id,
                'product_name', oi.product_name,
                'product_image', oi.product_image,
                'size', oi.size,
                'quantity', oi.quantity,
                'price', oi.price,
                'subtotal', oi.subtotal
              ))
              FROM order_items oi WHERE oi.order_id = o.id) as items
       FROM orders o
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT o.*,
              (SELECT json_agg(json_build_object(
                'id', oi.id,
                'product_id', oi.product_id,
                'product_name', oi.product_name,
                'product_image', oi.product_image,
                'size', oi.size,
                'quantity', oi.quantity,
                'price', oi.price,
                'subtotal', oi.subtotal
              ))
              FROM order_items oi WHERE oi.order_id = o.id) as items,
              (SELECT json_build_object(
                'first_name', a.first_name,
                'last_name', a.last_name,
                'street', a.street,
                'city', a.city,
                'state', a.state,
                'zip_code', a.zip_code,
                'country', a.country,
                'phone', a.phone
              )
              FROM addresses a WHERE a.id = o.shipping_address_id) as shipping_address
       FROM orders o
       WHERE o.id = $1 AND o.user_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT o.*,
             u.name as customer_name,
             u.email as customer_email,
             (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND o.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ` ORDER BY o.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM orders WHERE 1=1';
    const countParams = [];
    if (status) {
      countQuery += ' AND status = $1';
      countParams.push(status);
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
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const result = await pool.query(
      `UPDATE orders 
       SET status = COALESCE($1, status),
           tracking_number = COALESCE($2, tracking_number),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, trackingNumber, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};
