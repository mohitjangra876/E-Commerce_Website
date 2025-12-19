import { createContext, useState, useEffect } from "react";
import { products as staticProducts } from "../assets/assets";
import { productAPI, cartAPI, categoryAPI } from "../services/api";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = '$';
  const delivery_fee = 10;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState(staticProducts);
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [useStaticProducts, setUseStaticProducts] = useState(true);

  // Transform backend product data to match frontend format
  const transformProduct = (product) => {
    return {
      _id: product.id?.toString() || product._id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price || product.price),
      image: product.images?.map(img => img.image_url) || product.image || [],
      category: product.category_name || product.category,
      subCategory: product.sub_category || product.subCategory || 'General',
      sizes: product.sizes?.map(s => s.size) || product.sizes || [],
      date: product.created_at ? new Date(product.created_at).getTime() : Date.now(),
      bestseller: product.is_bestseller || product.bestseller || false,
      stockQuantity: product.stock_quantity || product.stockQuantity
    };
  };

  // Load products from backend
  const loadProducts = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await productAPI.getAll(filters);
      if (response.data.success && response.data.data.length > 0) {
        // Filter backend products to only those with real images
        const productsWithRealImages = response.data.data.filter(product => 
          product.images && product.images.length > 0 && 
          product.images.some(img => 
            img.image_url && 
            !img.image_url.includes('placeholder') && 
            !img.image_url.includes('via.placeholder') &&
            (img.image_url.startsWith('http') || img.image_url.startsWith('data:'))
          )
        );
        
        if (productsWithRealImages.length > 0) {
          // Transform backend products with real images
          const transformedProducts = productsWithRealImages.map(transformProduct);
          // Combine backend products with static products
          const combinedProducts = [...transformedProducts, ...staticProducts];
          console.log('Using backend products with real images + static products');
          setProducts(combinedProducts);
          setUseStaticProducts(false);
        } else {
          // Use only static products if no backend products have real images
          console.log('No backend products with real images, using static products');
          setUseStaticProducts(true);
          setProducts(staticProducts);
        }
      } else {
        // If no products from backend, keep static products
        console.log('No products from backend, using static products');
        setUseStaticProducts(true);
        setProducts(staticProducts);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // Keep using static products as fallback
      console.log('Backend error, using static products as fallback');
      setUseStaticProducts(true);
      setProducts(staticProducts);
    } finally {
      setLoading(false);
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Load cart
  const loadCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await cartAPI.get();
      if (response.data.success) {
        setCartItems(response.data.data);
        setCartCount(response.data.data.reduce((sum, item) => sum + item.quantity, 0));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  // Add to cart
  const addToCart = async (productId, size, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add items to cart');
        return false;
      }

      // Check if this is a static product (string ID) or backend product (numeric ID)
      const isStaticProduct = isNaN(productId);
      
      if (isStaticProduct) {
        toast.info('Using demo products. Please upload real product images to backend to enable cart functionality.');
        return false;
      }

      // Convert productId to number for backend
      const numericProductId = parseInt(productId);

      const response = await cartAPI.add({ productId: numericProductId, size, quantity });
      if (response.data.success) {
        toast.success('Item added to cart');
        await loadCart();
        return true;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      toast.error(message);
      console.error('Add to cart error:', error);
      return false;
    }
  };

  // Update cart item
  const updateCart = async (cartItemId, quantity) => {
    try {
      const response = await cartAPI.update(cartItemId, { quantity });
      if (response.data.success) {
        await loadCart();
        return true;
      }
    } catch (error) {
      toast.error('Failed to update cart');
      return false;
    }
  };

  // Remove from cart
  const removeFromCart = async (cartItemId) => {
    try {
      const response = await cartAPI.remove(cartItemId);
      if (response.data.success) {
        toast.success('Item removed from cart');
        await loadCart();
        return true;
      }
    } catch (error) {
      toast.error('Failed to remove item');
      return false;
    }
  };

  // Load initial data
  useEffect(() => {
    loadProducts();
    loadCategories();
    loadCart();
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    categories,
    cartItems,
    cartCount,
    loading,
    loadProducts,
    loadCart,
    addToCart,
    updateCart,
    removeFromCart,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;