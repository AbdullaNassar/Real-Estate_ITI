import { useFormik } from "formik";
import React from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../services/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateReview } from "../features/review/useUpdateReview";
import { useMutation } from "@tanstack/react-query";

export default function Review({ onClose, bookingId, listingId, reviewToEdit }) {
  const queryClient = useQueryClient();

  const isEditing = Boolean(reviewToEdit?._id);

  const { mutate: updateReview, isPending: isUpdating } = useUpdateReview(listingId);

  const { mutate: createReview, isPending: isCreating } = useMutation({
    mutationFn: async (values) => {
      const { data } = await axiosInstance.post(`/ratings/${bookingId}`, values);
      return data;
    },
    onSuccess: () => {
      toast.success("Review submitted successfully");
      queryClient.invalidateQueries({ queryKey: ["reviews", listingId] });
      onClose();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Error while submitting review");
    },
  });

  const formik = useFormik({
    initialValues: {
      rating: reviewToEdit?.rating || 0, 
      comment: reviewToEdit?.comment || "",
    },
    onSubmit: (values) => {
      if (isEditing) {
        updateReview(
          {
            reviewId: reviewToEdit._id,
            updatedData: { rating: values.rating, comment: values.comment },
          },
          { onSuccess: () => onClose() }
        );
      } else {
        createReview(values);
      }
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:px-6 lg:px-8 bg-black/30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {isEditing ? "Update Review" : "Leave a Review"}
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-1">Rating:</label>
            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <input
                  key={star}
                  type="radio"
                  name="rating"
                  value={star}
                  checked={formik.values.rating === star}
                  onChange={() => formik.setFieldValue("rating", star)}
                  className="mask mask-star-2 bg-orange-400"
                  aria-label={`${star} star`}
                />
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block font-medium mb-1">
              Comment:
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={4}
              value={formik.values.comment}
              onChange={formik.handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Leave your comment"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-400 hover:bg-red-500 text-black px-4 py-2 rounded-md"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              {isEditing
                ? isUpdating
                  ? "Updating..."
                  : "Update Review"
                : isCreating
                ? "Submitting..."
                : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
