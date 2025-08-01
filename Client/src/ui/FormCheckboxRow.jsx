import React from "react";

export default function FormCheckboxRow({
  id,
  label,
  options = [],
  register,
  rules = {},
  errors = {},
  required = false,
}) {
  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <label className="font-medium text-sm text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt._id} className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              value={opt._id}
              {...register(id, rules)}
              className="accent-primarry text-gray-50"
            />
            <span>{opt.name}</span>
          </label>
        ))}
      </div>

      {errors?.[id] && (
        <p className="text-red-500 text-sm">{errors[id]?.message}</p>
      )}
    </div>
  );
}
