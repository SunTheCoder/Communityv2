import { supabase } from "./App";

export const fetchResourceById = async (resourceId) => {
    console.log("Fetching resource with ID:", resourceId);
    try {
      const { data, error } = await supabase
        .from("resources") // Replace with your table name
        .select("*") // Replace "*" with specific columns if needed
        .eq("id", resourceId)
        .single(); // Ensures only one record is fetched
  
      if (error) {
        throw error;
      }
  
      return data;
    } catch (error) {
      console.error("Error fetching resource by ID:", error.message);
      return null;
    }
  };

  export const addLikeToCommFeed = async (postId) => {
    try {
      // Fetch the current likes_count
      const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('likes_count')
        .eq('id', postId)
        .single();
  
      if (fetchError) {
        throw fetchError;
      }
  
      // Increment the likes_count
      const { data, error } = await supabase
        .from('posts')
        .update({ likes_count: post.likes_count + 1 })
        .eq('id', postId)
        .select();
  
      if (error) {
        throw error;
      }
  
      return { success: true, message: 'Like count updated successfully', data };
    } catch (error) {
      console.error('Error updating like count:', error);
      return { success: false, message: 'Error updating like count', error };
    }
  };
  