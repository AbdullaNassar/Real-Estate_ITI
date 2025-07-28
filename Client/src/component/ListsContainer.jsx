import React from "react";
import ListsBox from "./ListsBox";

export default function ListsContainer() {
  return (
    <div className="mt-8 flex flex-col gap-4">
      <ListsBox />
      <ListsBox />
      <ListsBox />
      <ListsBox />
    </div>
  );
}
