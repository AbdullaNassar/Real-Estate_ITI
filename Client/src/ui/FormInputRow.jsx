import React from "react";

export default function FormInputRow({
  register,
  label,
  id,
  placeholder,
  type = "text",
  errors,
  rules = {},
  disabled = false,
  required = false,
}) {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={id}>
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        {...register(id, rules)}
        type={type}
        className="bg-gray-200 p-2 md:w-82 rounded-sm border-none focus:ring focus:ring-primarry focus:ring-offset-1 border-0 outline-0"
        placeholder={placeholder}
      />
      {errors?.[id] && (
        <h3 className="text-red-500">{errors?.[id]?.message}</h3>
      )}
    </div>
  );
}
