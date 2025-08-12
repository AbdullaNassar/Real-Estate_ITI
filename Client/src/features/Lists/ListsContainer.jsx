import React from "react";
import ListsBox from "./ListsBox";
import { useListsByGovern } from "./useListsByGovern";
import Spinner from "../../ui/Spinner";
import { data } from "react-router-dom";
const listHeading = [
  "Popular homes in ",
  "Stay in ",
  "Homes in ",
  "Places to stay in ",
  "Check out homes in ",
];
export default function ListsContainer() {
  let { data: lists, error, isLoading } = useListsByGovern();
  if (isLoading) return <Spinner />;
  if (error) return <h2>{error.message} Error....</h2>;

  let data = lists.data.slice(0, 4);
  return (
    <div className="mt-8 flex flex-col gap-4">
      {data?.map((govern, idx) => {
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
