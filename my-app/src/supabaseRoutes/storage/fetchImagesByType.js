import { supabase } from '../../App';

export const fetchImagesByType = async (folder = 'uploads') => {
  const bucketName = 'images'; // Replace with your bucket name

  try {
    const { data, error } = await supabase.storage.from(bucketName).list(folder);

    if (error) {
      throw new Error(`Failed to fetch images: ${error.message}`);
    }

    return data; // Array of file objects
  } catch (error) {
    console.error('Error fetching images:', error.message);
    return [];
  }
};
