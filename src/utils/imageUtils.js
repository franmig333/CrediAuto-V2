/**
 * Compresses and resizes an image file to a Base64 string.
 * Rules: Max width 800px, JPEG quality 0.7.
 * 
 * @param {File} file - The image file to compress.
 * @returns {Promise<string>} - A promise that resolves to the Base64 string.
 */
export const compressImage = (file) => {
    return new Promise((resolve, reject) => {
        // 1. Security & Type Validation
        if (!file.type.match(/image.*/)) {
            reject(new Error("El archivo seleccionado no es una imagen."));
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                // 2. Canvas Creation & Resizing
                const elem = document.createElement('canvas');

                // Max dimensions
                const MAX_WIDTH = 800;
                let width = img.width;
                let height = img.height;

                // Scaling logic
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }

                elem.width = width;
                elem.height = height;

                const ctx = elem.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // 3. Compression to JPEG (0.7)
                const dataUrl = elem.toDataURL('image/jpeg', 0.7);

                // 4. Size Validation (Post-compression)
                // Base64 length * 0.75 is approx byte size
                const approximateSizeInBytes = (dataUrl.length * 3) / 4;
                if (approximateSizeInBytes > 500 * 1024) { // 500KB limit
                    reject(new Error("La imagen es demasiado compleja incluso después de comprimir. Intenta con una más simple."));
                    return;
                }

                resolve(dataUrl);
            };

            img.onerror = (err) => reject(new Error("Error al cargar la imagen."));
        };

        reader.onerror = (err) => reject(new Error("Error al leer el archivo."));
    });
};
