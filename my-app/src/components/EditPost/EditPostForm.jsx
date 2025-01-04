import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"; // Adjust the path to your Button component
import { toaster } from "../ui/toaster";
import { supabase } from "../../App"

const EditPostForm = ({ postId, currentContent, currentImageUrl, onClose }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      content: currentContent || "",
      imageUrl: currentImageUrl || "",
    },
  });
  const [error, setError] = useState(null);
  console.log("Supabase client:", supabase);

  const onSubmit = async (data) => {
    setError(null);

    try {
      const { content, imageUrl } = data;
      const { data: updatedPost, error } = await supabase
        .from("posts")
        .update({ content, image_url: imageUrl || null })
        .eq("id", postId)
        .select();

      if (error) throw error;

      console.log("Post updated successfully:", updatedPost);
      toaster.create({
        description: "Post updated successfully!",
        type: "success",
        duration: 5000, // 5 seconds to show the success message
      });
      onClose && onClose(); // Close the drawer after success
    } catch (err) {
      console.error("Error updating post:", err);
      toaster.create({
        title: "Error Updating Post",
        description: err.message,
        type: "error",
        duration: 5000, // 5 seconds to show the error message
      });
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          {...register("content", { required: "Content is required" })}
          disabled={isSubmitting}
        />
        {errors.content && <p style={{ color: "red" }}>{errors.content.message}</p>}
      </div>
      <div>
        <label htmlFor="imageUrl">Image URL</label>
        <input
          type="url"
          id="imageUrl"
          {...register("imageUrl", {
            // required: "Image URL is required",
            pattern: {
              value: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
              message: "Please enter a valid image URL (e.g., jpg, png)",
            },
          })}
          disabled={isSubmitting}
        />
        {errors.imageUrl && <p style={{ color: "red" }}>{errors.imageUrl.message}</p>}
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};

export default EditPostForm;
