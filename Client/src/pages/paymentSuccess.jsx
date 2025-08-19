import { useEffect } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const { t } = useTranslation();
  useEffect(() => {
    toast.success(t("payment.Payment successful! Your booking is confirmed."));
  }, []);
  const navigate = useNavigate();

  return (
    <div className="text-center mt-20 space-y-4">
      <h1 className="text-3xl font-bold text-green-600">
        {t("payment.Thank you!")}
      </h1>
      <p className="mt-4 text-xl">
        {t("payment.Your payment was successful.")}
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 hover:cursor-pointer bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-300"
      >
        {t("payment.Go to Home")}
      </button>
    </div>
  );
}
