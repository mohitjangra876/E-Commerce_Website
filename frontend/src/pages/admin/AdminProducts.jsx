import React, { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../../services/api';
import { toast } from 'react-toastify';
import ImageCropModal from '../../components/admin/ImageCropModal';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageUrls, setImageUrls] = useState(['']);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentCropIndex, setCurrentCropIndex] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    stockQuantity: '',
    isBestseller: false,
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productAPI.getAll();
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Filter out empty image URLs
      const validImageUrls = imageUrls.filter(url => url.trim() !== '');
      
      if (validImageUrls.length === 0) {
        toast.error('Please add at least one image URL');
        return;
      }

      const productData = {
        ...formData,
        images: validImageUrls.map((url, index) => ({
          imageUrl: url,
          isPrimary: index === primaryImageIndex
        }))
      };

      if (editingProduct) {
        await productAPI.update(editingProduct.id, productData);
        toast.success('Product updated successfully');
      } else {
        await productAPI.create(productData);
        toast.success('Product created successfully');
      }
      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      stockQuantity: '',
      isBestseller: false,
    });
    setImageUrls(['']);
    setPrimaryImageIndex(0);
  };

  const addImageUrlField = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrlField = (index) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls.length > 0 ? newUrls : ['']);
    if (primaryImageIndex >= newUrls.length) {
      setPrimaryImageIndex(Math.max(0, newUrls.length - 1));
    }
  };

  const updateImageUrl = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    // Read file and show crop modal
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempImage(reader.result);
      setCurrentCropIndex(index);
      setCropModalOpen(true);
    };
    reader.onerror = () => {
      toast.error('Failed to read image');
    };
    reader.readAsDataURL(file);
  };

  const handleCropImage = (croppedImage) => {
    const newUrls = [...imageUrls];
    newUrls[currentCropIndex] = croppedImage;
    setImageUrls(newUrls);
    setCropModalOpen(false);
    setTempImage(null);
    setCurrentCropIndex(null);
    toast.success('Image uploaded successfully');
  };

  const handleSkipCrop = () => {
    const newUrls = [...imageUrls];
    newUrls[currentCropIndex] = tempImage;
    setImageUrls(newUrls);
    setCropModalOpen(false);
    setTempImage(null);
    setCurrentCropIndex(null);
    toast.success('Image uploaded successfully');
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.category_id,
      stockQuantity: product.stock_quantity,
      isBestseller: product.is_bestseller,
    });
    
    // Load existing images
    if (product.images && product.images.length > 0) {
      const urls = product.images.map(img => img.image_url);
      setImageUrls(urls);
      const primaryIndex = product.images.findIndex(img => img.is_primary);
      setPrimaryImageIndex(primaryIndex >= 0 ? primaryIndex : 0);
    } else {
      setImageUrls(['']);
      setPrimaryImageIndex(0);
    }
    
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id);
        toast.success('Product deleted successfully');
        loadProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingProduct(null);
            resetForm();
          }}
          className="bg-black text-white px-6 py-2 rounded"
        >
          Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border rounded"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border rounded"
              rows="3"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full px-4 py-2 border rounded"
              step="0.01"
              required
            />
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Stock Quantity"
              value={formData.stockQuantity}
              onChange={(e) =>
                setFormData({ ...formData, stockQuantity: e.target.value })
              }
              className="w-full px-4 py-2 border rounded"
              required
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isBestseller}
                onChange={(e) =>
                  setFormData({ ...formData, isBestseller: e.target.checked })
                }
                className="mr-2"
              />
              Bestseller
            </label>

            {/* Image URLs Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="font-medium">Product Images</label>
                <button
                  type="button"
                  onClick={addImageUrlField}
                  className="bg-blue-500 text-white px-4 py-1 rounded text-sm"
                >
                  + Add Image
                </button>
              </div>
              
              {imageUrls.map((url, index) => (
                <div key={index} className="border p-4 rounded space-y-3">
                  <div className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      {/* File Upload Option */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Upload Image File</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(index, e.target.files[0])}
                          className="w-full px-3 py-2 border rounded text-sm"
                        />
                      </div>
                      
                      {/* URL Input Option */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Or Enter Image URL</label>
                        <input
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          value={url}
                          onChange={(e) => updateImageUrl(index, e.target.value)}
                          className="w-full px-4 py-2 border rounded"
                        />
                      </div>
                      
                      {/* Image Preview */}
                      {url && (
                        <div className="mt-2">
                          <img 
                            src={url} 
                            alt={`Preview ${index + 1}`}
                            className="h-32 w-32 object-cover rounded border"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setTempImage(url);
                              setCurrentCropIndex(index);
                              setCropModalOpen(true);
                            }}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                          >
                            ✂️ Crop/Adjust Image
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 pt-6">
                      <label className="flex items-center text-sm whitespace-nowrap">
                        <input
                          type="radio"
                          name="primaryImage"
                          checked={primaryImageIndex === index}
                          onChange={() => setPrimaryImageIndex(index)}
                          className="mr-1"
                        />
                        Primary
                      </label>
                      {imageUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageUrlField(index)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-500">
                Upload image files or enter URLs. Select one as primary (shown on product listings).
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded"
              >
                {editingProduct ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                className="bg-gray-300 px-6 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${product.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.stock_quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.category_name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Image Crop Modal */}
      {cropModalOpen && (
        <ImageCropModal
          image={tempImage}
          onCrop={handleCropImage}
          onSkip={handleSkipCrop}
          onClose={() => {
            setCropModalOpen(false);
            setTempImage(null);
            setCurrentCropIndex(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminProducts;
