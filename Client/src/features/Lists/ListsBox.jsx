import Animation from "../../ui/animated/Animation";
import ShinyText from "../../ui/animated/ShinyText";
import ListItemCard from "./ListItemCard";

export default function ListsBox({ govern, heading }) {
  const lists = govern?.listings?.slice(0, 4);
  return (
    <Animation>
      <div className="">
        <div className="my-4  bg-gray-100  sm:w-full">
          <h2 className="text-2xl font-semibold mb-4">
            {heading}
            {govern._id}
          </h2>
          <div
            className="grid sm:grid-cols-2 md:grid-cols-4 gap-2"
            style={{ gridAutoRows: "1fr" }}
          >
            {lists?.map((list) => {
              return <ListItemCard list={list} />;
            })}
          </div>
        </div>
      </div>
    </Animation>
  );
}
