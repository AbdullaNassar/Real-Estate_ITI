// features/bookings/useCheckoutSession.js
import { useMutation } from "@tanstack/react-query";
import { getCheckoutSession } from "../../services/apiBooking";

export function useCheckoutSessionMutation() {
  const {
    mutate: fetchCheckoutSession,
    data: session,
    isPending,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: getCheckoutSession,
  });

  return { fetchCheckoutSession, session, isPending, error, isSuccess };
}
