import React from "react";

export default function Error({ message = "" }) {
  return (
    <h1 className="text-center mt-8 text-3xl">
      ❌ Something Wrong happened... {message}
    </h1>
  );
}
