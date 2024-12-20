import { supabase } from "../../App";

/**
 * Generates a public URL for an uploaded file
 * @param {string} filePath - The file path in the Supabase storage bucket
 * @param {string} bucket - The name of the Supabase storage bucket
 * @returns {string|null} - The public URL or null on failure
 */
export const getPublicUrl = (filePath, bucket) => {
  const { data, error } = supabase.storage.from(bucket).getPublicUrl(filePath);

  if (error) {
    console.error("Error generating public URL:", error.message);
    return null;
  }

  return data.publicUrl;
};
