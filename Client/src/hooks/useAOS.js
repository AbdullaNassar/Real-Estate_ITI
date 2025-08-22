import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export const useAOS = (options = { duration: 1000 }) => {
  useEffect(() => {
    AOS.init(options);
  }, [options]);
};
