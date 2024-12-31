import { supabase } from "../App";

export const createNotification = async (userId, notification_type, message, notificationBy) => {
    try {
      if (!userId || !notification_type) {
        console.error("Invalid notification data:", { userId, notification_type, message, notificationBy });
        return { success: false, error: "Invalid data" };
      }
  
      const { error } = await supabase.from("notifications").insert({
        user_id: userId,
        notification_by: notificationBy, // Save the UUID of the user performing the action
        notification_type,
        message,
      });
  
      if (error) {
        console.error("Error creating notification:", error);
        return { success: false, error };
      }
  
      return { success: true, message: "Notification created successfully" };
    } catch (error) {
      console.error("Error creating notification:", error);
      return { success: false, error };
    }
  };
  