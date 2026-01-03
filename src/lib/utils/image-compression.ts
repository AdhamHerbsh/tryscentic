import imageCompression from "browser-image-compression";

/**
 * Compresses an image file and converts it to WebP if possible.
 * @param file The original image file
 * @returns Compressed file
 */
export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1, // Target size < 1MB
    maxWidthOrHeight: 1920, // Max dimension
    useWebWorker: true,
    initialQuality: 0.8,
    fileType: "image/webp", // Convert to WebP for best compression
  };

  try {
    const compressedFile = await imageCompression(file, options);
    // Ensure the filename reflects the WebP extension if it was converted
    if (
      options.fileType === "image/webp" &&
      !compressedFile.name.endsWith(".webp")
    ) {
      const baseName =
        file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
      return new File([compressedFile], `${baseName}.webp`, {
        type: "image/webp",
      });
    }
    return compressedFile;
  } catch (error) {
    console.error("Image compression failed:", error);
    return file; // Return original file if compression fails
  }
}
