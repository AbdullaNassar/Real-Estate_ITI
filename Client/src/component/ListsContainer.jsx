import React from "react";
import ListsBox from "./ListsBox";
import { useListsByGovern } from "../features/Lists/useListsByGovern";
import Spinner from "../ui/Spinner";
const listHeading = [
  "Popular homes in ",
  "Stay in ",
  "Homes in ",
  "Places to stay in ",
  "Check out homes in ",
];
export default function ListsContainer() {
  const { data: lists, error, isLoading } = useListsByGovern();
  if (isLoading) return <Spinner />;
  if (error) return <h2>{error.message} Error....</h2>;
  return (
    <div className="mt-8 flex flex-col gap-4">
      {lists?.data?.map((govern, idx) => {
        return (
          <ListsBox
            govern={govern}
            heading={listHeading[idx % listHeading.length]}
          />
        );
      })}
      {/* <ListsBox />
      <ListsBox />
      <ListsBox /> */}
    </div>
  );
}
