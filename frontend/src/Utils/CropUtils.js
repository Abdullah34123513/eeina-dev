// utils/cropUtils.js
export const createImage = (url) =>
      new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
      });

export async function getCroppedImg(
      imageSrc,
      pixelCrop,
      rotation = 0
) {
      const image = await createImage(imageSrc);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Calculate canvas size based on crop area
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      // Translate to center of image
      ctx.translate(pixelCrop.width / 2, pixelCrop.height / 2);

      // Apply rotation if needed
      if (rotation) {
            ctx.rotate((rotation * Math.PI) / 180);
      }

      // Draw image
      ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            -pixelCrop.width / 2,
            -pixelCrop.height / 2,
            pixelCrop.width,
            pixelCrop.height
      );

      // Optimize image quality
      const quality = 0.85; // Adjust for quality vs file size tradeoff
      const mimeType = 'image/jpeg'; // Use JPEG for better compression

      return new Promise((resolve) => {
            canvas.toBlob(
                  (blob) => {
                        resolve({
                              blob,
                              url: URL.createObjectURL(blob)
                        });
                  },
                  mimeType,
                  quality
            );
      });
}