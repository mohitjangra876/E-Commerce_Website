import React, { useState, useRef } from 'react';

const ImageCropModal = ({ image, onCrop, onSkip, onClose }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleCrop = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    if (!img) return;

    // Set canvas size to square (500x500)
    const size = 500;
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Save context state
    ctx.save();

    // For rotation, we need to center
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    // Apply scale
    const scaledSize = size * scale;

    // Calculate dimensions
    const imgAspect = img.width / img.height;
    let drawWidth, drawHeight;
    let offsetX, offsetY;

    if (imgAspect > 1) {
      // Landscape - fit to height, crop sides
      drawHeight = scaledSize;
      drawWidth = scaledSize * imgAspect;
      offsetX = -drawWidth / 2;
      offsetY = -scaledSize / 2; // Top align
    } else {
      // Portrait or square - fit to width, crop from bottom
      drawWidth = scaledSize;
      drawHeight = scaledSize / imgAspect;
      offsetX = -scaledSize / 2;
      offsetY = -scaledSize / 2; // Top align (crops from bottom)
    }

    // Draw image aligned to top
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    // Restore context
    ctx.restore();

    // Get cropped image as base64
    const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
    onCrop(croppedImage);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Crop & Adjust Image</h2>
        
        <div className="mb-4">
          <div className="border rounded overflow-hidden bg-gray-100 flex items-center justify-center" style={{ height: '400px' }}>
            <img
              ref={imageRef}
              src={image}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transition: 'transform 0.2s'
              }}
              onLoad={() => {
                // Trigger initial render
                if (canvasRef.current) {
                  canvasRef.current.style.display = 'none';
                }
              }}
            />
          </div>
        </div>

        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Zoom: {scale.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Rotation: {rotation}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="15"
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setRotation((rotation - 90 + 360) % 360)}
              className="px-3 py-1 bg-gray-200 rounded text-sm"
            >
              ↶ Rotate Left
            </button>
            <button
              onClick={() => setRotation((rotation + 90) % 360)}
              className="px-3 py-1 bg-gray-200 rounded text-sm"
            >
              ↷ Rotate Right
            </button>
            <button
              onClick={() => {
                setScale(1);
                setRotation(0);
              }}
              className="px-3 py-1 bg-gray-200 rounded text-sm"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Hidden canvas for cropping */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSkip}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Use Original
          </button>
          <button
            onClick={handleCrop}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Crop & Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
