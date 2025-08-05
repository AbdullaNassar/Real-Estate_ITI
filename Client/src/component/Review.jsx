import { useFormik } from "formik";
import React from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../services/axiosInstance";


export default function Review({ onClose, bookingId }) {
  const handleReview = async (values) => {
    console.log("hanldeReviwe = > vaule :", values);
    try {
      await axiosInstance.post(`/ratings/${bookingId}`, values);
      toast.success("Review submitted successfully");
      onClose();
    } catch (err) {
      console.log("review => handleReview error msg", err);
      toast.error("Failed to submit");
    }
  };

  const formik = useFormik({
    initialValues: {
      rating: 2,
      comment: "",
    },
    onSubmit: handleReview,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:px-6 lg:px-8 bg-white/30 backdrop-blur-xs">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md  relative">
        {" "}
        <h2 className="text-xl font-semibold mb-4 text-center">
          Leave a Review
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Rating */}
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
              placeholder="leave your comment"
            ></textarea>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-3 mt-6 ">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-400 hover:bg-red-500 text-black px-4 py-2 rounded-md"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
