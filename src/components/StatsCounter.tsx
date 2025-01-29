import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

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
  const [displayValues, setDisplayValues] = useState(stats.map(() => 0));

  useEffect(() => {
    setIsVisible(true);
    if (isVisible) {
      stats.forEach((stat, index) => {
        const interval = setInterval(() => {
          setDisplayValues(prev => {
            const newValues = [...prev];
            const increment = Math.ceil(stat.value / 50);
            newValues[index] = Math.min(prev[index] + increment, stat.value);
            return newValues;
          });
        }, 30);

        setTimeout(() => clearInterval(interval), 2000);
      });
    }
  }, [isVisible]);

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
          <div className="text-4xl font-bold text-primary">
            {displayValues[index].toLocaleString()}
            {stat.suffix}
          </div>
          <div className="text-secondary mt-2">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};