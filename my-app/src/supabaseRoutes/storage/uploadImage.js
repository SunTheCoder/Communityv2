import { supabase } from "../../App"; // Import your initialized Supabase client

/**
 * Uploads an image to Supabase storage
 * @param {File} file - The file to be uploaded
 * @param {string} bucket - The name of the Supabase storage bucket
 * @param {string} folder - The folder within the bucket to store the file
 * @returns {string|null} - Returns the uploaded file path or null on failure
 */
export const uploadImage = async (file, bucket, folder = "") => {
  try {
    // Construct file path with folder and file name
    const filePath = `${folder}/${file.name}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600", // Optional: Cache control for images
        upsert: false,       // Avoid overwriting existing files
      });

    if (error) {
      console.error("Error uploading image:", error.message);
      throw new Error(error.message);
    }

    console.log("Image uploaded successfully:", data.path);
    return data.path; // Returns the file path
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
};