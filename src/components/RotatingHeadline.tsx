import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const headlines = [
  "Transform Your Business with AI Agents",
  "Automate Tasks Seamlessly",
  "Analyze Data Intelligently",
  "Enhance Customer Support 24/7"
];

export const RotatingHeadline = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % headlines.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-20 relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.h1
          key={current}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold absolute w-full text-center"
        >
          {headlines[current]}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
};