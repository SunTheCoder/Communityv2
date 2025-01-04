import { supabase } from "../../App"; // Import your initialized Supabase client

/**
 * Uploads an image to Supabase storage or uses an existing one if it already exists.
 * @param {File} file - The file to be uploaded
 * @param {string} bucket - The name of the Supabase storage bucket
 * @param {string} folder - The folder within the bucket to store the file
 * @returns {string|null} - Returns the uploaded or existing file path
 */
export const uploadImage = async (file, bucket, folder = "") => {
  try {
    // Sanitize the filename: replace spaces and special characters
    const sanitizedFileName = file.name.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");

    // Construct file path
    const filePath = folder ? `${folder}/${sanitizedFileName}` : sanitizedFileName;

    // Check if the file already exists
    const { data: existingFile, error: checkError } = await supabase.storage
      .from(bucket)
      .list(folder, { search: sanitizedFileName });

    if (checkError) {
      console.error("Error checking for existing file:", checkError.message);
      throw new Error(checkError.message);
    }

    if (existingFile.length > 0) {
      console.log("File already exists, using existing resource:", filePath);
      return filePath; // Use the existing file path
    }

    // Upload the file if it doesn't exist
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600", // Optional: Cache control for images
        upsert: false, // Avoid overwriting existing files
      });

    if (error) {
      console.error("Error uploading image:", error.message);
      throw new Error(error.message);
    }

    console.log("Image uploaded successfully:", data.path);
    return data.path; // Return the uploaded file path
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};
