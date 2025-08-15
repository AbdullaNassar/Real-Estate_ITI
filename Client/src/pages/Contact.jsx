import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import emailjs from "emailjs-com";

export default function Contact() {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      message: Yup.string().required("Message is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      const templateParams = {
        from_name: values.name,
        from_email: values.email,
        message: values.message,
      };

      emailjs
        .send(serviceID, templateID, templateParams, publicKey)
        .then(() => {
          toast.success("Email sent successfully!");
          resetForm();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to send email");
        });
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="max-w-md w-full mx-auto mt-14 mb-8 p-6 bg-gray-50 rounded-2xl shadow-2xl hover:shadow-2xl transition-shadow duration-300"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Contact Us
      </h2>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2 text-sm">
          Enter Your Name
        </label>
        <input
          name="name"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 px-3 py-2 rounded-md outline-none text-sm"
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2 text-sm">
          Enter Your Email
        </label>
        <input
          name="email"
          type="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 px-3 py-2 rounded-md outline-none text-sm"
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
        )}
      </div>

      {/* Message */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2 text-sm">
          Message
        </label>
        <textarea
          name="message"
          rows="4"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.message}
          className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 px-3 py-2 rounded-md outline-none resize-none text-sm"
        />
        {formik.touched.message && formik.errors.message && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-primarry text-white py-2 rounded-md font-semibold hover:bg-primarry-hover hover:cursor-pointer transition text-sm"
      >
        Send Message
      </button>
    </form>
  );
}
