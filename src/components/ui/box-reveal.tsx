
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

interface BoxRevealProps {
  children: JSX.Element;
  width?: "fit-content" | "100%";
  boxColor?: string;
  duration?: number;
}

export const BoxReveal = ({
  children,
  width = "fit-content",
  boxColor = "#5046e6",
  duration,
}: BoxRevealProps) => {
  const mainControls = useAnimation();
  const slideControls = useAnimation();

  const ref = useRef(null);
  const isInView = (ref: React.RefObject<HTMLElement>) => {
    if (!ref.current) return false;
    
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          slideControls.start("visible");
          mainControls.start("visible");
        }
      });
    };
    
    // Using the actual framer-motion API
    const observer = new IntersectionObserver(callback, { threshold: 0.1 });
    observer.observe(ref.current);
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  };

  useEffect(() => {
    const cleanup = isInView(ref);
    return cleanup;
  }, [mainControls, slideControls]);

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: duration ? duration : 0.5, delay: 0.25 }}
      >
        {children}
      </motion.div>

      <motion.div
        variants={{
          hidden: { left: 0 },
          visible: { left: "100%" },
        }}
        initial="hidden"
        animate={slideControls}
        transition={{ duration: duration ? duration : 0.5, ease: "easeIn" }}
        style={{
          position: "absolute",
          top: 4,
          bottom: 4,
          left: 0,
          right: 0,
          zIndex: 20,
          background: boxColor,
        }}
      />
    </div>
  );
};
