import pool from '../config/database.js';

// @desc    Get user addresses
// @route   GET /api/addresses
// @access  Private
export const getAddresses = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
      [req.user.id]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching addresses',
      error: error.message
    });
  }
};

// @desc    Create address
// @route   POST /api/addresses
// @access  Private
export const createAddress = async (req, res) => {
  try {
    const { firstName, lastName, street, city, state, zipCode, country, phone, isDefault } = req.body;

    // If this is set as default, unset others
    if (isDefault) {
      await pool.query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1',
        [req.user.id]
      );
    }

    const result = await pool.query(
      `INSERT INTO addresses (user_id, first_name, last_name, street, city, state, zip_code, country, phone, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [req.user.id, firstName, lastName, street, city, state, zipCode, country, phone, isDefault || false]
    );

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating address',
      error: error.message
    });
  }
};

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, street, city, state, zipCode, country, phone, isDefault } = req.body;

    // If this is set as default, unset others
    if (isDefault) {
      await pool.query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1 AND id != $2',
        [req.user.id, id]
      );
    }

    const result = await pool.query(
      `UPDATE addresses 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           street = COALESCE($3, street),
           city = COALESCE($4, city),
           state = COALESCE($5, state),
           zip_code = COALESCE($6, zip_code),
           country = COALESCE($7, country),
           phone = COALESCE($8, phone),
           is_default = COALESCE($9, is_default),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 AND user_id = $11
       RETURNING *`,
      [firstName, lastName, street, city, state, zipCode, country, phone, isDefault, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating address',
      error: error.message
    });
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting address',
      error: error.message
    });
  }
};
