import { createNotification } from "../HelperFunctions/createNotification";
import { supabase } from "../App";


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

      // Check if the user already reacted with the same type on this post
    const { data: existingReaction, error: existingReactionError } = await supabase
    .from("posts_reactions")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", reactorId)
    .eq("reactions", reactionType)
    .single();

  if (existingReactionError && existingReactionError.code !== "PGRST116") { // Ignore "row not found" error
    throw existingReactionError;
  }

  if (existingReaction) {
    return { success: false, message: "User has already reacted with this type" };
  }
      // Fetch the current reactions and post owner
      const { data: post, error: fetchError } = await supabase
        .from("posts")
        .select("reactions, user_id")
        .eq("id", postId)
        .single();
  
      if (fetchError) {
        throw fetchError;
      }
  
      // Initialize or update the reactions object
      const currentReactions = post.reactions || {};
      const updatedReactions = {
        ...currentReactions,
        [reactionType]: (currentReactions[reactionType] || 0) + 1,
      };
  
      // Update the reactions column in the posts table
      const { error: updateError } = await supabase
        .from("posts")
        .update({ reactions: updatedReactions })
        .eq("id", postId);
  
      if (updateError) {
        throw updateError;
      }
  
      // Insert a new reaction into the posts_reactions table
      const { error: insertReactionError } = await supabase
        .from("posts_reactions")
        .insert({
          post_id: postId,
          user_id: reactorId,
          reactions: reactionType,
        });
  
      if (insertReactionError) {
        throw insertReactionError;
      }
  
      // Fetch the username of the reactor
      const { data: reactorProfile, error: reactorError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", reactorId)
        .single();
  
      if (reactorError) {
        throw reactorError;
      }
  
      const reactorUsername = reactorProfile?.username || "Someone";
  
      // Create a notification for the post owner
      const notificationMessage = `${reactorUsername} reacted to your post with ${reactionType}!`;
      const notificationResponse = await createNotification(
        post.user_id, // Notify the post owner
        "post_reaction",
        notificationMessage,
        reactorId // UUID of the user who reacted
      );
  
      if (!notificationResponse.success) {
        console.error("Failed to create notification:", notificationResponse.error);
      }
  
      return { success: true, message: "Reaction added successfully" };
    } catch (error) {
      console.error("Error adding reaction:", error);
      return { success: false, message: "Error adding reaction", error };
    }
  };
  