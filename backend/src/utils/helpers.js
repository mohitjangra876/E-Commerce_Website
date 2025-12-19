export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

export const calculateOrderTotals = (items, products) => {
  let subtotal = 0;
  
  items.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (product) {
      subtotal += product.price * item.quantity;
    }
  });

  const shippingFee = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shippingFee + tax;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    shippingFee: parseFloat(shippingFee.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
};

export const formatResponse = (success, message, data = null) => {
  const response = { success, message };
  if (data) response.data = data;
  return response;
};
