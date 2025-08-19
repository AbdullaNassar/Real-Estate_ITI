import { RiStarSFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Animation from "../../ui/animated/Animation";
import { formatNumber, formatPrice } from "../../utils/helper";
import { useTranslation } from "react-i18next";
import { governments } from "../../utils/constants";

export default function ListItem({ list }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  return (
    // <Animation>
    <div className="space-y-4 flex-col lg:flex-row flex justify-between items-center pb-4 border-b   border-gray-300">
      <div className="space-y-1">
        <h3 className="text-gray-500">
          {language === "en" ? list.categoryId?.name : list.categoryId?.arName}-{" "}
          {language === "en"
            ? governments[list.governorate].name
            : governments[list.governorate].arName}
          , {t("common.egypt")}
        </h3>
        <h3 className="font-semibold">
          {language === "en" ? list.title : list.arTitle}
        </h3>
        <h3 className="text-gray-500">
          {formatNumber(list.maxGustes, language)} {t("lists.guests")}·{" "}
          {list.roomNumbers ? formatNumber(list.roomNumbers, language) : "no"}
          {t("lists.bedroom")} · {formatNumber(1, language)} {t("lists.bath")}
        </h3>
        <h3 className="flex gap-4 mt-4">
          <span className="flex items-center gap-1">
            {list.averageRating ? list.averageRating : 3.6}{" "}
            <span className="text-primarry">
              <RiStarSFill />
            </span>
          </span>
          <span className="p-1 rounded-sm bg-gray-200">
            {formatPrice(list.pricePerNight, language)}/{t("lists.night")}
          </span>
          <button
            onClick={() => navigate(`/listDetails/${list._id}`)}
            className="bg-primarry text-sm lg:text-md text-stone-100 p-1 hover:bg-primarry-hover rounded-sm hover:cursor-pointer transition-all"
          >
            {t("common.showDetails")}
          </button>
        </h3>
      </div>
      <div>
        <img
          src={list.photos[0]}
          className="w-54 h-38 rounded-md"
          alt="list pic"
        />
      </div>
    </div>
    // </Animation>
  );
}
