import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
function Animation({ children, classes }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1, // Percentage of element's visibility required to trigger the animation
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const animationVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <motion.div
      className={classes}
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={animationVariants}
      transition={{ duration: 0.6 }} // Adjust the duration as per your preference
    >
      {children}
    </motion.div>
  );
}
export default Animation;
