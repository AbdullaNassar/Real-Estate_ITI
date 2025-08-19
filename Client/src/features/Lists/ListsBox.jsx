import { useTranslation } from "react-i18next";
import Animation from "../../ui/animated/Animation";
import ShinyText from "../../ui/animated/ShinyText";
import ListItemCard from "./ListItemCard";
import { governments } from "../../utils/constants";

export default function ListsBox({ govern, heading }) {
  const lists = govern?.listings?.slice(0, 4);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  return (
    <Animation>
      <div className="">
        <div className="my-4  bg-gray-100  sm:w-full">
          <h2 className="text-center lg:text-start text-2xl font-semibold mb-4">
            {heading[lang]}
            {lang === "en" ? govern._id : governments[govern._id].arName}
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
