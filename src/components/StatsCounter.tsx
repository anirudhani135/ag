import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Stat {
  label: string;
  value: number;
  suffix?: string;
}

const stats: Stat[] = [
  { label: 'Active Users', value: 10000, suffix: '+' },
  { label: 'AI Agents', value: 500, suffix: '+' },
  { label: 'Tasks Automated', value: 1000000, suffix: '+' }
];

export const StatsCounter = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: index * 0.2 }}
          className="text-center"
        >
          <motion.div
            initial={{ number: 0 }}
            animate={isVisible ? { number: stat.value } : {}}
            transition={{ duration: 2, delay: index * 0.2 }}
            className="text-4xl font-bold text-primary"
          >
            {Math.floor(stat.value)}
            {stat.suffix}
          </motion.div>
          <div className="text-secondary mt-2">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};