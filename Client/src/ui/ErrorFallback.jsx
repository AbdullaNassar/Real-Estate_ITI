import { useTranslation } from "react-i18next";

function ErrorFallback({ error, resetErrorBoundary }) {
  const { t } = useTranslation();
  return (
    <>
      <main className="h-screen bg-gray-50 flex items-center justify-center p-12">
        <div className="bg-white border border-gray-100 rounded-md p-12 max-w-4xl w-full text-center">
          <h1 className="mb-4 text-stone-900 text-2xl font-bold">
            {t("errors.Something went wrong")} 🧐
          </h1>
          <p className="mb-8 text-gray-500 font-mono">{error.message}</p>
          <button
            className="bg-primarry px-2 py-4 rounded-md hover:cursor-pointer hover:bg-primarry-hover "
            size="large"
            onClick={resetErrorBoundary}
          >
            {t("errors.Try again")}
          </button>
        </div>
      </main>
    </>
  );
}

export default ErrorFallback;
