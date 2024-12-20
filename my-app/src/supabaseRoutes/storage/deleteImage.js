import { supabase } from '../../App';

export const deleteImage = async (filePath) => {
  const bucketName = 'images'; // Replace with your bucket name

  try {
    const { error } = await supabase.storage.from(bucketName).remove([filePath]);

    if (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }

    console.log('File deleted successfully:', filePath);
    return true;
  } catch (error) {
    console.error('Error deleting image:', error.message);
    return false;
  }
};
