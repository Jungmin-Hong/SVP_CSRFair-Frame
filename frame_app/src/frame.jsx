import React, { useState, useRef } from 'react';

const App = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const canvasRef = useRef(null);

  const mmToPixels = (mm, dpi = 300) => (mm / 25.4) * dpi;

  const canvasWidth = mmToPixels(54);
  const canvasHeight = mmToPixels(86);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setImageSrc(e.target.result);
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageSrc) return;

    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const scaleX = canvas.width / image.width;
        const scaleY = canvas.height / image.height;
        const scale = Math.max(scaleX, scaleY);

        const x = (canvas.width / 2) - (image.width / 2) * scale;
        const y = (canvas.height / 2) - (image.height / 2) * scale;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, x, y, image.width * scale, image.height * scale);

        const frame = new Image();
        frame.src = '/frame.png';
        frame.onload = () => {
          ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
          const imageData = canvas
            .toDataURL('image/png')
            .replace('image/png', 'image/octet-stream');
          const link = document.createElement('a');
          link.download = 'framed-image.png';
          link.href = imageData;
          link.click();
        };
      }
    };
  };

  return (
    <div className="p-4">
      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        className="block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:border-0 file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
      />
      <button
        onClick={downloadImage}
        disabled={!imageSrc}
        className={`mt-4 px-4 py-2 bg-blue-500 text-white font-bold text-lg rounded
                    hover:bg-blue-700 focus:outline-none focus:ring-2
                    focus:ring-blue-500 focus:ring-opacity-50
                    ${!imageSrc ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        Download Image
      </button>
      <div style={{ display: 'none' }}>
        <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
      </div>
    </div>
  );
};

export default App;
