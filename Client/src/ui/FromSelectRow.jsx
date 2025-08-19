import React from "react";
import { useTranslation } from "react-i18next";

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
  const { i18n } = useTranslation();
  const lang = i18n.language;
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
        className="bg-gray-200 p-2 md:w-82 rounded-sm border-none focus:ring focus:ring-primarry focus:ring-offset-1 border-0 outline-0 disabled:opacity-50"
      >
        {options.map((opt) => (
          <option key={opt._id} value={opt._id}>
            {lang === "en" ? opt.name : opt.arName}
          </option>
        ))}
      </select>
      {errors?.[id] && (
        <p className="text-red-500 text-sm">{errors[id]?.message}</p>
      )}
    </div>
  );
}
