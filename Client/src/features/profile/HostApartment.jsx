import { useHostLists } from "../Lists/useHostLists";
import Spinner from "../../ui/Spinner";
import Error from "../../ui/Error";
import ListOwnerItem from "./ListOwnerItem";
import { useTranslation } from "react-i18next";

export default function HostApartment() {
  const { data: hostLists, error, isLoading } = useHostLists();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  // handle error, loading states
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  // handle empty state
  if (!hostLists.results) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-gray-50 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {t("profile.You don't have any lists yet")}
        </h2>
        <button className="bg-primarry hover:bg-primarry-hover text-stone-100 font-medium py-3 px-6 rounded-lg hover:cursor-pointer shadow transition-all duration-200">
          {t("profile.Add your first Property now!")}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2 divide-y-2">
      {hostLists.lists.map((list) => {
        return <ListOwnerItem list={list} />;
      })}
    </div>
  );
}
