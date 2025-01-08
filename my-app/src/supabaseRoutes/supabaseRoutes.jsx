import { supabase } from "../App";
import { createNotification } from "../HelperFunctions/createNotification";


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



  export const addLikeToCommFeed = async (postId, likerId) => {
    try {
      // Fetch the current likes_count and post owner
      const { data: post, error: fetchError } = await supabase
        .from("posts")
        .select("likes_count, user_id") // Fetch likes_count and post owner
        .eq("id", postId)
        .single();
  
      if (fetchError) {
        throw fetchError;
      }
  
      // Fetch the username of the liker
      const { data: likerProfile, error: likerError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", likerId)
        .single();
  
      if (likerError) {
        throw likerError;
      }
  
      const likerUsername = likerProfile?.username || "Someone";
  
      // Increment the likes_count
      const { data, error } = await supabase
        .from("posts")
        .update({ likes_count: post.likes_count + 1 })
        .eq("id", postId)
        .select();
  
      if (error) {
        throw error;
      }
  
      // Create a notification for the post owner
      const notificationMessage = `${likerUsername} liked your post!`;
      const notificationResponse = await createNotification(
        post.user_id, // Notify the post owner
        "post_like",
        notificationMessage,
        likerId // UUID of the user who liked the post
      );
  
      if (!notificationResponse.success) {
        console.error("Failed to create notification:", notificationResponse.error);
      }
  
      return { success: true, message: "Like count updated successfully", data };
    } catch (error) {
      console.error("Error updating like count:", error);
      return { success: false, message: "Error updating like count", error };
    }
  };
  
  


  export const addLikeToResourceFeed = async (postId) => {
    try {
      // Fetch the current likes_count
      const { data: post, error: fetchError } = await supabase
        .from('resource_posts')
        .select('likes_count')
        .eq('id', postId)
        .single();
  
      if (fetchError) {
        throw fetchError;
      }
  
      // Increment the likes_count
      const { data, error } = await supabase
        .from('resource_posts')
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


  export const addReactionToCommFeed = async (postId, reactorId, reactionType) => {
    try {
      // Step 1: Insert reaction into posts_reactions
      const { error: insertReactionError } = await supabase
        .from("posts_reactions")
        .insert({
          post_id: postId,
          user_id: reactorId,
          reactions: reactionType,
        });
  
      if (insertReactionError) {
        // If the reaction is already present, log and exit
        if (insertReactionError.code === "23505") {
          console.warn("Duplicate reaction detected. Skipping posts table update.");
          return { success: false, message: "Duplicate reaction. Reaction not added." };
        }
        throw insertReactionError; // For other errors, throw the error
      }
  
      // Step 2: Update the reactions in the posts table
      const { data: post, error: fetchError } = await supabase
        .from("posts")
        .select("reactions")
        .eq("id", postId)
        .single();
  
      if (fetchError) {
        throw fetchError;
      }
  
      // Update the reactions JSONB object
      const currentReactions = post.reactions || {};
      const updatedReactions = {
        ...currentReactions,
        [reactionType]: (currentReactions[reactionType] || 0) + 1,
      };
  
      // Step 3: Update the posts table with the new reactions count
      const { error: updateError } = await supabase
        .from("posts")
        .update({ reactions: updatedReactions })
        .eq("id", postId);
  
      if (updateError) {
        throw updateError;
      }
  
      return { success: true, message: "Reaction added successfully!" };
    } catch (error) {
      console.error("Error adding reaction:", error);
      return { success: false, message: "Error adding reaction.", error };
    }
  };
  
  