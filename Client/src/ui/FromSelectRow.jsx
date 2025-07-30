import React from "react";

export default function FormSelectRow({
  register,
  label,
  id,
  placeholder = "Select an option",
  errors = {},
  rules = {},
  options = [],
  disabled = false,
  required = false,
}) {
  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <label htmlFor={id}>
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <select
        id={id}
        {...register(id, rules)}
        disabled={disabled}
        className="bg-gray-200 p-2 md:w-82 rounded-sm border-none focus:ring focus:ring-primary focus:ring-offset-1 border-0 outline-0 disabled:opacity-50"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {errors?.[id] && (
        <p className="text-red-500 text-sm">{errors[id]?.message}</p>
      )}
    </div>
  );
}
